# YouTube-Wochen-Briefing 📩

Ein voll-automatisches System (Stufe 3), das **jeden Freitag** die neuen Videos
deiner KI-/Automatisierungs-Kanäle einsammelt, von Claude gegen dein Profil
bewerten lässt und dir ein kompaktes E-Mail-Briefing schickt — damit du am
Wochenende gezielt konsumierst, statt jedem Video hinterherzulaufen.

## Wie es wirklich funktioniert (ehrlich)

Es gibt **kein „Claude überwacht YouTube"**. Du baust eine Pipeline aus vier
Schritten, die ein Scheduler wöchentlich auslöst:

```
[1] SAMMELN               [2] FILTERN        [3] AUFBEREITEN    [4] ZUSTELLEN
Kanäle + Themen-Suche  →  Fenster + Dedupe →  Claude liest    →  E-Mail (SMTP)
(YouTube Data API)        + Score-Filter      Transkript +
                                              dein Profil
```

**Zwei Quellen (Schritt 1):**
- **Kanäle** — feste Creator (Saraev, Ottley, Nate Herk) dauerhaft beobachten.
- **Themen-Suche** — durchsucht *ganz YouTube* nach deinen Themen (Claude, Claude
  Code, AI-Automation, …) und findet so auch relevante Videos neuer Kanäle. Weil die
  Creator unregelmäßig posten, füllt die Themen-Suche das Briefing zuverlässig.

**Der Clou (Schritt 3):** Claude bekommt das *Transkript* (nicht das Video) plus
`docs/01_Mein_Profil.md` als Relevanz-Maßstab, bewertet jedes Video mit **Score 1–10**
und schreibt: Worum geht's · Was ist neu · Relevanz für DICH (Konzern vs. Side-Hustle)
· Zeitstempel · Verdikt SCHAUEN/überspringen. Nur Videos ab `min_score` (Standard 6)
kommen ins Briefing — so bleibt aus der Themen-Suche kein Müll hängen.

**Zwei Realitäts-Hinweise:**

1. **Der Scheduler ist der Wächter, nicht Claude.** Bei der Cron-Variante muss der
   Rechner laufen (Laptop, der abends zuklappt = keine Mail). Deshalb ist
   **GitHub Actions empfohlen** — läuft auf GitHubs Servern, kein eigener Rechner nötig.
2. **Transkripte sind nicht garantiert.** Hat ein Video keine Untertitel, fällt das
   Skript ehrlich markiert auf Titel + Beschreibung zurück. Kein Bug, physische Grenze.

---

## Setup

### 1. Keys besorgen

| Key | Wo | In |
|---|---|---|
| `YOUTUBE_API_KEY` | [Google Cloud Console](https://console.cloud.google.com) → YouTube Data API v3 aktivieren → API-Schlüssel | `.env` / Secret |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys | `.env` / Secret |
| SMTP (Gmail) | [App-Passwort](https://myaccount.google.com/apppasswords) (2FA nötig) | `.env` / Secrets |

### 2. Kanäle & Themen eintragen

`channels.yaml` hat zwei Blöcke:
- **`channels:`** — Saraev, Ottley, Nate Herk (per Handle vorgetragen). Für maximale
  Stabilität die **Channel-ID** (`UC…`) eintragen — Anleitung steht in der Datei.
- **`searches:`** — die Themen-Suchbegriffe (deine 4 Fokusthemen sind vorbelegt).
  Frei anpassen. Jede Suche kostet 100 API-Einheiten (Tageslimit 10.000).

Weitere Stellschrauben in `channels.yaml`: `min_score` (Signal-Filter, Standard 6),
`backlog_days` (Best-of-Zeitraum), `top_n_backlog`, `max_scored` (Kostendeckel).

### 3. Lokal testen

```bash
cd youtube-briefing
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
cp .env.example .env          # dann .env ausfüllen
python briefing.py --dry-run  # weekly-Briefing, druckt auf stdout, keine Mail
```

Nützliche Flags:

- `--initial` — **einmaliger Best-of-Backlog** über `backlog_days` (6 Mon.), nur die
  Top `top_n_backlog` nach Relevanz + Beliebtheit. Das ist dein Einstiegs-Briefing,
  das du „abarbeitest". Danach nutzt du den normalen (weekly) Lauf.
- `--dry-run` — Briefing nur auf stdout, kein SMTP, `seen.json` bleibt unverändert.
- `--no-dedupe` — ignoriert `seen.json` (zeigt auch schon „gesehene" Videos).

Empfohlener Ablauf:
```bash
python briefing.py --initial --dry-run   # Best-of ansehen
python briefing.py --initial             # Best-of per Mail (SMTP nötig)
# ab dann wöchentlich:
python briefing.py                        # weekly
```

---

## Scheduling

### Variante A — GitHub Actions (empfohlen, kein eigener Server)

Der Workflow `.github/workflows/youtube-briefing.yml` läuft **freitags 06:00 UTC**
(≈ 07:00/08:00 DE) und ist manuell über den Actions-Tab auslösbar.

1. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   anlegen für: `YOUTUBE_API_KEY`, `ANTHROPIC_API_KEY`, `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO`.
   Optional als **Variable** (nicht Secret): `CLAUDE_MODEL`.
2. Actions-Tab → „YouTube-Wochen-Briefing" → **Run workflow** zum Sofort-Test.
3. `seen.json` wird nach jedem Lauf automatisch zurück committet (Doppel-Schutz) —
   dafür braucht der Workflow `contents: write` (ist gesetzt).

Uhrzeit ändern: `cron`-Zeile im Workflow anpassen (UTC! z. B. `0 5 * * 5`).

### Variante B — Cron auf Pi / VPS (eigener Server, muss laufen)

```bash
crontab -e
# Freitag 07:30 lokale Zeit:
30 7 * * 5  cd /pfad/zu/Personal_Brand-MW/youtube-briefing && /pfad/.venv/bin/python briefing.py >> briefing.log 2>&1
```

Hier hält `seen.json` lokal den Verlauf — der Rechner muss zur Cron-Zeit laufen.

---

## Konfiguration auf einen Blick

| Was | Wo |
|---|---|
| Kanäle **und** Themen-Suchen (`searches:`) | `channels.yaml` |
| Zeitfenster (`lookback_hours`), Backlog (`backlog_days`) | `channels.yaml` |
| Signal-Filter (`min_score`), Kostendeckel (`max_scored`), `top_n_backlog` | `channels.yaml` |
| API-Keys, SMTP, Modell | `.env` (lokal) / Secrets (Actions) |
| Modell wechseln | `CLAUDE_MODEL` (Default `claude-opus-4-8`; günstiger: `claude-sonnet-4-6`) |
| Versand-Zeitpunkt | `cron` im Workflow bzw. crontab |
| Relevanz-Maßstab | `../docs/01_Mein_Profil.md` + `../docs/02_Ziele_und_Strategie.md` |

`seen.json` (Verlauf gegen Doppel-Mails) wird vom Skript gepflegt — auch der
`--initial`-Lauf markiert seine Videos, damit der Freitags-Lauf sie nicht wiederholt.
