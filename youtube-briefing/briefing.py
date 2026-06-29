#!/usr/bin/env python3
"""
YouTube-Wochen-Briefing (Stufe 3, voll-automatisch)
===================================================

Vier-Schritt-Pipeline, die ein Scheduler (GitHub Actions / Cron) woechentlich
ausloest:

    [1] SAMMELN   -> YouTube Data API: neue Videos der konfigurierten Kanaele
    [2] FILTERN   -> Zeitfenster (~7 Tage) + Dedupe gegen seen.json
    [3] AUFBEREITEN -> Transkript ziehen, Claude liest es gegen Marcs Profil
    [4] ZUSTELLEN -> kompaktes E-Mail-Briefing (HTML + Text) per SMTP

Der ehrliche Kern: Es gibt kein "Claude ueberwacht YouTube". Der Scheduler ist
der Waechter, Claude ist Schritt 3 (das Aufbereiten). Fehlt ein Transkript,
faellt das Skript ehrlich markiert auf Titel + Beschreibung zurueck.

Aufruf:
    python briefing.py            # voller Lauf inkl. Mail
    python briefing.py --dry-run  # Briefing nur auf stdout, kein SMTP, kein seen-Update
    python briefing.py --no-dedupe  # ignoriert seen.json (z. B. zum Testen)
"""

from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import smtplib
import sys
from dataclasses import dataclass, field
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path
from typing import Any, Literal

import yaml
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Pfade & Konstanten
# ---------------------------------------------------------------------------

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
CHANNELS_FILE = HERE / "channels.yaml"
SEEN_FILE = HERE / "seen.json"

# Relevanz-Massstab kommt aus der Wissensbasis im Repo (nicht dupliziert).
PROFILE_FILES = [
    REPO_ROOT / "docs" / "01_Mein_Profil.md",
    REPO_ROOT / "docs" / "02_Ziele_und_Strategie.md",
]

DEFAULT_MODEL = "claude-opus-4-8"
DEFAULT_LOOKBACK_HOURS = 168  # 7 Tage, passend zum Freitags-Rhythmus
TRANSCRIPT_CHAR_BUDGET = 14000  # Transkript-Kappung, damit die Token-Kosten beschraenkt bleiben

# Modelle, die adaptive thinking unterstuetzen (Haiku z. B. nicht ueber effort).
_THINKING_PREFIXES = ("claude-opus", "claude-sonnet-4-6", "claude-fable")


# ---------------------------------------------------------------------------
# Datentypen
# ---------------------------------------------------------------------------


@dataclass
class Video:
    video_id: str
    title: str
    channel: str
    published_at: dt.datetime
    description: str = ""
    url: str = ""
    transcript: str = ""
    transcript_available: bool = False
    # Von Claude befuellt:
    topic: str = ""
    whats_new: str = ""
    relevance: str = ""
    timestamp: str = "—"
    verdict: str = "ÜBERSPRINGEN"
    score: int = 0
    error: str = ""


@dataclass
class Config:
    lookback_hours: int = DEFAULT_LOOKBACK_HOURS
    max_videos_per_channel: int = 15
    channels: list[dict[str, str]] = field(default_factory=list)
    title_stopwords: list[str] = field(default_factory=list)
    model: str = DEFAULT_MODEL


# ---------------------------------------------------------------------------
# Hilfen
# ---------------------------------------------------------------------------


def log(msg: str) -> None:
    print(f"[briefing] {msg}", file=sys.stderr, flush=True)


def fail(msg: str, code: int = 1) -> "NoReturn":  # type: ignore[name-defined]
    log(f"FEHLER: {msg}")
    sys.exit(code)


def load_config() -> Config:
    if not CHANNELS_FILE.exists():
        fail(f"channels.yaml fehlt ({CHANNELS_FILE}). Siehe README.")
    raw = yaml.safe_load(CHANNELS_FILE.read_text(encoding="utf-8")) or {}
    channels = raw.get("channels") or []
    if not channels:
        fail("channels.yaml enthaelt keine Kanaele. Siehe README (Channel-IDs eintragen).")
    return Config(
        lookback_hours=int(raw.get("lookback_hours", DEFAULT_LOOKBACK_HOURS)),
        max_videos_per_channel=int(raw.get("max_videos_per_channel", 15)),
        channels=channels,
        title_stopwords=[s.lower() for s in (raw.get("title_stopwords") or [])],
        model=os.environ.get("CLAUDE_MODEL", str(raw.get("model", DEFAULT_MODEL))),
    )


def load_profile() -> str:
    parts: list[str] = []
    for path in PROFILE_FILES:
        if path.exists():
            parts.append(path.read_text(encoding="utf-8"))
        else:
            log(f"Hinweis: Profil-Datei nicht gefunden: {path}")
    if not parts:
        fail(
            "Keine Profil-Datei gefunden (docs/01_Mein_Profil.md). "
            "Der Relevanz-Massstab fehlt damit — Abbruch."
        )
    return "\n\n---\n\n".join(parts)


def load_seen() -> set[str]:
    if SEEN_FILE.exists():
        try:
            data = json.loads(SEEN_FILE.read_text(encoding="utf-8"))
            return set(data.get("seen", []))
        except (json.JSONDecodeError, OSError) as exc:
            log(f"seen.json nicht lesbar ({exc}) — starte mit leerem Verlauf.")
    return set()


def save_seen(seen: set[str]) -> None:
    # Verlauf begrenzen, damit die Datei nicht unbegrenzt waechst.
    trimmed = sorted(seen)[-2000:]
    SEEN_FILE.write_text(
        json.dumps({"seen": trimmed}, ensure_ascii=False, indent=0),
        encoding="utf-8",
    )


# ---------------------------------------------------------------------------
# [1] SAMMELN — YouTube Data API
# ---------------------------------------------------------------------------


def build_youtube_client():
    from googleapiclient.discovery import build  # lazy import

    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        fail("YOUTUBE_API_KEY nicht gesetzt (.env). Siehe README.")
    return build("youtube", "v3", developerKey=api_key, cache_discovery=False)


def resolve_uploads_playlist(youtube, entry: dict[str, str]) -> tuple[str, str]:
    """Liefert (Kanalname, Uploads-Playlist-ID) fuer einen channels.yaml-Eintrag."""
    name = entry.get("name", "Unbekannter Kanal")
    channel_id = entry.get("channel_id")
    handle = entry.get("handle")

    if channel_id:
        resp = youtube.channels().list(part="contentDetails,snippet", id=channel_id).execute()
    elif handle:
        resp = (
            youtube.channels()
            .list(part="contentDetails,snippet", forHandle=handle.lstrip("@"))
            .execute()
        )
    else:
        raise ValueError(f"Kanal '{name}' braucht 'channel_id' oder 'handle' in channels.yaml.")

    items = resp.get("items") or []
    if not items:
        raise ValueError(f"Kanal '{name}' nicht gefunden (channel_id/handle pruefen).")
    item = items[0]
    name = item["snippet"]["title"] if not entry.get("name") else name
    uploads = item["contentDetails"]["relatedPlaylists"]["uploads"]
    return name, uploads


def fetch_recent_videos(youtube, cfg: Config) -> list[Video]:
    cutoff = dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=cfg.lookback_hours)
    videos: list[Video] = []

    for entry in cfg.channels:
        try:
            name, uploads = resolve_uploads_playlist(youtube, entry)
        except Exception as exc:  # noqa: BLE001 — ein kaputter Kanal darf den Lauf nicht killen
            log(f"Kanal uebersprungen ({entry}): {exc}")
            continue

        log(f"Hole Uploads: {name}")
        resp = (
            youtube.playlistItems()
            .list(part="snippet,contentDetails", playlistId=uploads, maxResults=50)
            .execute()
        )
        count = 0
        for it in resp.get("items", []):
            sn = it["snippet"]
            cd = it.get("contentDetails", {})
            published_raw = cd.get("videoPublishedAt") or sn.get("publishedAt")
            if not published_raw:
                continue
            published = dt.datetime.fromisoformat(published_raw.replace("Z", "+00:00"))
            if published < cutoff:
                continue  # Uploads-Playlist ist chronologisch — aelter = fertig
            vid = sn["resourceId"]["videoId"]
            videos.append(
                Video(
                    video_id=vid,
                    title=sn.get("title", "(ohne Titel)"),
                    channel=name,
                    published_at=published,
                    description=sn.get("description", ""),
                    url=f"https://www.youtube.com/watch?v={vid}",
                )
            )
            count += 1
            if count >= cfg.max_videos_per_channel:
                break
        log(f"  -> {count} Video(s) im Zeitfenster")

    return videos


# ---------------------------------------------------------------------------
# [2] FILTERN
# ---------------------------------------------------------------------------


def filter_videos(videos: list[Video], seen: set[str], cfg: Config, use_dedupe: bool) -> list[Video]:
    out: list[Video] = []
    for v in videos:
        if use_dedupe and v.video_id in seen:
            continue
        if cfg.title_stopwords and any(w in v.title.lower() for w in cfg.title_stopwords):
            log(f"Stopword-Filter: '{v.title}'")
            continue
        out.append(v)
    # Neueste zuerst
    out.sort(key=lambda x: x.published_at, reverse=True)
    return out


# ---------------------------------------------------------------------------
# [3] AUFBEREITEN — Transkript + Claude
# ---------------------------------------------------------------------------


def _format_timestamp(seconds: float) -> str:
    m, s = divmod(int(seconds), 60)
    return f"{m:02d}:{s:02d}"


def fetch_transcript(video_id: str) -> str:
    """Transkript als chunked Text mit Zeitmarken (~30s-Fenster). Leer, wenn keins da."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        log("youtube-transcript-api nicht installiert — ueberspringe Transkripte.")
        return ""

    try:
        segments = YouTubeTranscriptApi.get_transcript(video_id, languages=["de", "en"])
    except Exception as exc:  # noqa: BLE001 — viele moegliche Fehler (kein Transkript, gesperrt, ...)
        log(f"  kein Transkript fuer {video_id}: {type(exc).__name__}")
        return ""

    lines: list[str] = []
    bucket: list[str] = []
    bucket_start = 0.0
    for seg in segments:
        if not bucket:
            bucket_start = seg.get("start", 0.0)
        bucket.append(seg.get("text", "").replace("\n", " ").strip())
        if seg.get("start", 0.0) - bucket_start >= 30:
            lines.append(f"[{_format_timestamp(bucket_start)}] {' '.join(bucket)}")
            bucket = []
    if bucket:
        lines.append(f"[{_format_timestamp(bucket_start)}] {' '.join(bucket)}")
    return "\n".join(lines)


# Strukturierte Ausgabe: Pydantic-Modell -> client.messages.parse() validiert selbst.
# Die int-Range 1..10 erzwingt Structured Output nicht (keine min/max), daher per
# Literal eingegrenzt; im Code zusaetzlich geclampt.
class VideoSummary(BaseModel):
    topic: str = Field(description="1 Satz: Worum geht es im Video?")
    whats_new: str = Field(description="1 Satz: Was ist neu/anders? '—' wenn nichts.")
    relevance: str = Field(
        description="1-2 Saetze: Relevanz konkret fuer Marc — Konzern (Digitalisierung/KI) "
        "vs. Side-Hustle (KMU-Software, Akquise) trennen."
    )
    timestamp: str = Field(description="Zeitmarke der relevantesten Stelle, z. B. '12:30'. '—' wenn unklar.")
    verdict: Literal["SCHAUEN", "ÜBERSPRINGEN"]
    score: Literal[1, 2, 3, 4, 5, 6, 7, 8, 9, 10] = Field(
        description="Relevanz fuer Marc: 1 (irrelevant) bis 10 (Pflicht)."
    )


# Roh-Schema nur noch als Fallback fuer sehr alte SDKs ohne messages.parse().
SUMMARY_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "topic": {"type": "string", "description": "1 Satz: Worum geht es im Video?"},
        "whats_new": {
            "type": "string",
            "description": "1 Satz: Was ist hier neu/anders als ueblich? '—' wenn nichts.",
        },
        "relevance": {
            "type": "string",
            "description": (
                "1-2 Saetze: Relevanz konkret fuer Marc. Trenne wo moeglich Konzern "
                "(Digitalisierung/KI/EG-11-Weg) vs. Side-Hustle (KMU-Software, Akquise)."
            ),
        },
        "timestamp": {
            "type": "string",
            "description": "Zeitmarke der relevantesten Stelle, z. B. '12:30'. '—' wenn unklar.",
        },
        "verdict": {"type": "string", "enum": ["SCHAUEN", "ÜBERSPRINGEN"]},
        "score": {
            "type": "integer",
            "enum": list(range(1, 11)),
            "description": "Relevanz fuer Marc von 1 (irrelevant) bis 10 (Pflicht).",
        },
    },
    "required": ["topic", "whats_new", "relevance", "timestamp", "verdict", "score"],
}

SYSTEM_INSTRUCTIONS = """Du bist Marcs persoenlicher YouTube-Kurator. Dein Job: jedes Video gegen sein \
Profil pruefen und in Sekunden lesbar machen, damit er NICHT jedes Video schauen muss.

Massstab ist ausschliesslich das folgende Profil. Bewerte Relevanz nuechtern und \
ehrlich — Wahrheit vor Begeisterung. Wenn ein Video fuer Marc nichts bringt, sag es \
klar (verdict ÜBERSPRINGEN, niedriger score). Bullet-tauglich, keine Weichzeichner, \
konkret auf Konzern- vs. Side-Hustle-Nutzen bezogen.

=== MARCS PROFIL (Relevanz-Massstab) ===
{profile}
=== ENDE PROFIL ==="""


def get_anthropic_client():
    try:
        import anthropic
    except ImportError:
        fail("anthropic-SDK nicht installiert (pip install -r requirements.txt).")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        fail("ANTHROPIC_API_KEY nicht gesetzt (.env).")
    return anthropic.Anthropic()


def _thinking_kwargs(model: str) -> dict[str, Any]:
    if model.startswith(_THINKING_PREFIXES):
        return {"thinking": {"type": "adaptive"}}
    return {}


def summarize_video(client, model: str, profile: str, v: Video) -> None:
    """Befuellt v mit Claudes strukturierter Einschaetzung (in-place)."""
    import anthropic

    if v.transcript:
        body = v.transcript[:TRANSCRIPT_CHAR_BUDGET]
        source_note = "TRANSKRIPT (mit Zeitmarken)"
        if len(v.transcript) > TRANSCRIPT_CHAR_BUDGET:
            body += "\n...[gekuerzt]"
    else:
        body = (v.description or "(keine Beschreibung)")[:TRANSCRIPT_CHAR_BUDGET]
        source_note = "KEIN TRANSKRIPT VERFUEGBAR — nur Titel + Beschreibung (Einschaetzung unsicher)"

    user_content = (
        f"Kanal: {v.channel}\n"
        f"Titel: {v.title}\n"
        f"Veroeffentlicht: {v.published_at:%d.%m.%Y}\n"
        f"Quelle: {source_note}\n\n"
        f"{body}"
    )

    system_blocks = [
        {
            "type": "text",
            "text": SYSTEM_INSTRUCTIONS.format(profile=profile),
            "cache_control": {"type": "ephemeral"},  # Profil-Block ueber alle Videos cachen
        }
    ]

    base_kwargs: dict[str, Any] = {
        "model": model,
        "max_tokens": 4096,  # Luft fuer adaptive thinking + JSON -> keine Truncation
        "system": system_blocks,
        "messages": [{"role": "user", "content": user_content}],
        **_thinking_kwargs(model),
    }

    try:
        data, stop_reason = _ask_claude(client, base_kwargs)
    except anthropic.APIError as exc:
        v.error = f"Claude-Fehler: {exc}"
        log(f"  {v.error}")
        return

    if stop_reason == "refusal":
        v.error = "Claude hat die Einschaetzung abgelehnt (Sicherheitsfilter)."
        return
    if data is None:
        v.error = (
            "Antwort abgeschnitten (max_tokens zu klein)."
            if stop_reason == "max_tokens"
            else "Antwort nicht lesbar."
        )
        return

    _apply_summary(v, data)


def _ask_claude(client, base_kwargs: dict[str, Any]) -> tuple[dict[str, Any] | None, str | None]:
    """Primaer: messages.parse() (SDK validiert gegen VideoSummary).
    Fallback: create() + rohes output_config + manuelles JSON-Parsen (alte SDKs).
    Liefert (geparste Felder | None, stop_reason)."""
    import anthropic

    try:
        resp = client.messages.parse(output_format=VideoSummary, **base_kwargs)
    except (AttributeError, TypeError):
        resp = None  # SDK ohne parse()/output_format
    except anthropic.APIStatusError as exc:
        log(f"  parse() API-Fehler ({exc.status_code}) — Fallback auf create().")
        resp = None

    if resp is not None:
        if resp.stop_reason == "refusal":
            return None, "refusal"
        for b in resp.content:
            parsed = getattr(b, "parsed_output", None)
            if parsed is not None:
                return parsed.model_dump(), resp.stop_reason
        return None, resp.stop_reason  # lief durch, aber kein valides Objekt (z. B. Truncation)

    # Fallbackweg
    kwargs = dict(base_kwargs)
    kwargs["output_config"] = {"format": {"type": "json_schema", "schema": SUMMARY_SCHEMA}}
    msg0 = dict(base_kwargs["messages"][0])
    msg0["content"] = msg0["content"] + (
        "\n\nAntworte AUSSCHLIESSLICH mit JSON (keys: topic, whats_new, relevance, "
        "timestamp, verdict, score)."
    )
    kwargs["messages"] = [msg0]
    resp = client.messages.create(**kwargs)
    if resp.stop_reason == "refusal":
        return None, "refusal"
    text = "".join(b.text for b in resp.content if getattr(b, "type", "") == "text").strip()
    return _parse_json(text), resp.stop_reason


def _apply_summary(v: Video, d: dict[str, Any]) -> None:
    v.topic = str(d.get("topic", "")).strip()
    v.whats_new = str(d.get("whats_new", "—")).strip() or "—"
    v.relevance = str(d.get("relevance", "")).strip()
    v.timestamp = str(d.get("timestamp", "—")).strip() or "—"
    v.verdict = "SCHAUEN" if str(d.get("verdict", "")).upper().startswith("SCHAU") else "ÜBERSPRINGEN"
    try:
        v.score = max(1, min(10, int(d.get("score", 0))))
    except (TypeError, ValueError):
        v.score = 0


def _parse_json(text: str) -> dict[str, Any] | None:
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Falls Modell doch Prosa drumherum schreibt: erstes {...} herausschneiden.
        start, end = text.find("{"), text.rfind("}")
        if 0 <= start < end:
            try:
                return json.loads(text[start : end + 1])
            except json.JSONDecodeError:
                return None
    return None


def enrich_videos(videos: list[Video], cfg: Config, profile: str) -> None:
    client = get_anthropic_client()
    for i, v in enumerate(videos, 1):
        log(f"[{i}/{len(videos)}] {v.channel}: {v.title[:60]}")
        v.transcript = fetch_transcript(v.video_id)
        v.transcript_available = bool(v.transcript)
        summarize_video(client, cfg.model, profile, v)


# ---------------------------------------------------------------------------
# [4] ZUSTELLEN — Rendering + SMTP
# ---------------------------------------------------------------------------


def _verdict_badge(v: Video) -> str:
    return "✅ SCHAUEN" if v.verdict == "SCHAUEN" else "⏭️ überspringen"


def render_text(videos: list[Video], when: dt.date) -> str:
    watch = [v for v in videos if v.verdict == "SCHAUEN"]
    top = max(videos, key=lambda x: x.score, default=None)

    lines = [
        f"YouTube-Wochen-Briefing — {when:%d.%m.%Y}",
        f"{len(videos)} neue Videos · {len(watch)} Empfehlung(en) zum Schauen",
        "",
    ]
    if top and top.score > 0:
        lines += [f"⭐ TOP DER WOCHE: {top.title} ({top.channel}) — Score {top.score}/10", ""]
    lines.append("=" * 60)

    for v in videos:
        lines += [
            "",
            f"{_verdict_badge(v)}  ·  Score {v.score}/10  ·  {v.channel}",
            f"{v.title}",
            f"{v.url}",
        ]
        if v.error:
            lines.append(f"  ⚠ {v.error}")
            continue
        if not v.transcript_available:
            lines.append("  ⚠ Kein Transkript — Einschaetzung nur aus Titel/Beschreibung.")
        lines += [
            f"  Worum: {v.topic}",
            f"  Neu: {v.whats_new}",
            f"  Relevant fuer dich: {v.relevance}",
            f"  Stelle: {v.timestamp}",
        ]
    lines += ["", "—", "Automatisch erzeugt. Claude ist Schritt 3 (Aufbereitung), nicht der Waechter."]
    return "\n".join(lines)


def render_html(videos: list[Video], when: dt.date) -> str:
    watch = [v for v in videos if v.verdict == "SCHAUEN"]
    top = max(videos, key=lambda x: x.score, default=None)
    e = html.escape

    cards = []
    for v in videos:
        watch_style = "border-left:4px solid #16a34a;" if v.verdict == "SCHAUEN" else "border-left:4px solid #9ca3af;"
        rows = []
        if v.error:
            rows.append(f'<p style="color:#b91c1c;margin:6px 0;">⚠ {e(v.error)}</p>')
        else:
            if not v.transcript_available:
                rows.append(
                    '<p style="color:#b45309;margin:6px 0;font-size:13px;">'
                    "⚠ Kein Transkript — Einschätzung nur aus Titel/Beschreibung.</p>"
                )
            rows.append(f'<p style="margin:6px 0;"><b>Worum:</b> {e(v.topic)}</p>')
            rows.append(f'<p style="margin:6px 0;"><b>Neu:</b> {e(v.whats_new)}</p>')
            rows.append(f'<p style="margin:6px 0;"><b>Relevant für dich:</b> {e(v.relevance)}</p>')
            rows.append(f'<p style="margin:6px 0;color:#6b7280;font-size:13px;">⏱ Stelle: {e(v.timestamp)}</p>')
        cards.append(
            f"""
            <div style="background:#fff;{watch_style}border-radius:8px;padding:16px 18px;margin:14px 0;
                        box-shadow:0 1px 3px rgba(0,0,0,.08);">
              <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:.04em;">
                {e(_verdict_badge(v))} &nbsp;·&nbsp; Score {v.score}/10 &nbsp;·&nbsp; {e(v.channel)}
              </div>
              <a href="{e(v.url)}" style="font-size:17px;font-weight:600;color:#111827;text-decoration:none;
                 display:block;margin:6px 0;">{e(v.title)}</a>
              {''.join(rows)}
            </div>"""
        )

    top_banner = ""
    if top and top.score > 0:
        top_banner = (
            f'<div style="background:#111827;color:#fff;border-radius:8px;padding:14px 18px;margin:14px 0;">'
            f'⭐ <b>Top der Woche:</b> <a href="{e(top.url)}" style="color:#fbbf24;text-decoration:none;">'
            f"{e(top.title)}</a> &nbsp;·&nbsp; {e(top.channel)} &nbsp;·&nbsp; Score {top.score}/10</div>"
        )

    return f"""<!DOCTYPE html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <div style="max-width:680px;margin:0 auto;padding:24px 16px;">
    <h1 style="font-size:22px;margin:0 0 4px;">YouTube-Wochen-Briefing</h1>
    <p style="color:#6b7280;margin:0 0 16px;">{when:%d.%m.%Y} &nbsp;·&nbsp; {len(videos)} neue Videos
       &nbsp;·&nbsp; {len(watch)} Empfehlung(en)</p>
    {top_banner}
    {''.join(cards)}
    <p style="color:#9ca3af;font-size:12px;margin-top:24px;">
      Automatisch erzeugt. Claude ist Schritt 3 (Aufbereitung), nicht der Wächter.</p>
  </div></body></html>"""


def render_empty_text(when: dt.date) -> str:
    return (
        f"YouTube-Wochen-Briefing — {when:%d.%m.%Y}\n\n"
        "Diese Woche keine neuen Videos in deinen Kanaelen. Geniess das Wochenende."
    )


def send_email(subject: str, text_body: str, html_body: str | None) -> None:
    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    sender = os.environ.get("SMTP_FROM", user or "")
    recipient = os.environ.get("SMTP_TO", user or "")

    missing = [k for k, val in {"SMTP_HOST": host, "SMTP_USER": user, "SMTP_PASS": password}.items() if not val]
    if missing:
        fail(f"SMTP unvollstaendig konfiguriert, fehlt: {', '.join(missing)} (.env). Siehe README.")
    if not recipient:
        fail("SMTP_TO (oder SMTP_USER) als Empfaenger noetig.")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    if html_body:
        msg.attach(MIMEText(html_body, "html", "utf-8"))

    log(f"Sende Mail an {recipient} ueber {host}:{port}")
    # Port 465 = implizites SSL (SMTP_SSL); sonst STARTTLS (z. B. 587).
    server_cls = smtplib.SMTP_SSL if port == 465 else smtplib.SMTP
    with server_cls(host, port, timeout=30) as server:
        if port != 465:
            server.starttls()
        server.login(user, password)
        server.send_message(msg)
    log("Mail gesendet.")


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main() -> int:
    parser = argparse.ArgumentParser(description="YouTube-Wochen-Briefing")
    parser.add_argument("--dry-run", action="store_true", help="Briefing nur auf stdout, kein SMTP/seen-Update")
    parser.add_argument("--no-dedupe", action="store_true", help="seen.json ignorieren")
    args = parser.parse_args()

    load_dotenv(HERE / ".env")
    cfg = load_config()
    profile = load_profile()
    seen = load_seen()
    today = dt.date.today()

    log(f"Modell: {cfg.model} · Zeitfenster: {cfg.lookback_hours}h · Kanaele: {len(cfg.channels)}")

    # [1] SAMMELN
    youtube = build_youtube_client()
    collected = fetch_recent_videos(youtube, cfg)

    # [2] FILTERN
    videos = filter_videos(collected, seen, cfg, use_dedupe=not args.no_dedupe)
    log(f"{len(videos)} neue Video(s) nach Filter.")

    if not videos:
        subject = f"YouTube-Wochen-Briefing {today:%d.%m.} — nichts Neues"
        text = render_empty_text(today)
        if args.dry_run:
            print(text)
        else:
            send_email(subject, text, None)
        return 0

    # [3] AUFBEREITEN
    enrich_videos(videos, cfg, profile)
    videos.sort(key=lambda x: (x.verdict != "SCHAUEN", -x.score, -x.published_at.timestamp()))

    # [4] ZUSTELLEN
    n_watch = sum(1 for v in videos if v.verdict == "SCHAUEN")
    subject = f"YouTube-Wochen-Briefing {today:%d.%m.} — {len(videos)} Videos, {n_watch} Empfehlung(en)"
    text = render_text(videos, today)
    html_body = render_html(videos, today)

    if args.dry_run:
        print(text)
        log("Dry-Run: keine Mail, seen.json unveraendert.")
        return 0

    send_email(subject, text, html_body)
    seen.update(v.video_id for v in videos)
    save_seen(seen)
    return 0


if __name__ == "__main__":
    sys.exit(main())
