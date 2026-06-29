# YouTube-Wochen-Briefing 📩

Ein voll-automatisches System (Stufe 3), das **jeden Freitag** die neuen Videos
deiner KI-/Automatisierungs-Kanäle einsammelt, von Claude gegen dein Profil
bewerten lässt und dir ein kompaktes E-Mail-Briefing schickt — damit du am
Wochenende gezielt konsumierst, statt jedem Video hinterherzulaufen.

## Wie es wirklich funktioniert (ehrlich)

Es gibt **kein „Claude überwacht YouTube"**. Du baust eine Pipeline aus vier
Schritten, die ein Scheduler wöchentlich auslöst:

```
[1] SAMMELN          [2] FILTERN         [3] AUFBEREITEN      [4] ZUSTELLEN
YouTube Data API  →  Zeitfenster (7T) →  Claude liest      →  E-Mail (SMTP)
(deine Kanäle)       + Dedupe            Transkript +
                                         dein Profil
```

**Der Clou (Schritt 3):** Claude bekommt das *Transkript* (nicht das Video) plus
`docs/01_Mein_Profil.md` als Relevanz-Maßstab und schreibt pro Video: Worum geht's ·
Was ist neu · Relevanz für DICH (Konzern vs. Side-Hustle) · Zeitstempel der
relevanten Stelle · Verdikt SCHAUEN/überspringen. Plus eine „Top der Woche"-Zeile.

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

### 2. Kanäle eintragen

In `channels.yaml` sind Nick Saraev und Liam Ottley per Handle vorgetragen. Handles
werden zur Laufzeit aufgelöst — für maximale Stabilität trag die **Channel-ID** ein
(`UC…`, 24 Zeichen). Anleitung steht in `channels.yaml`.

### 3. Lokal testen

```bash
cd youtube-briefing
python -m venv .venv && source .venv/bin/activate   # optional
pip install -r requirements.txt
cp .env.example .env          # dann .env ausfüllen
python briefing.py --dry-run  # druckt das Briefing, kein Mailversand
```

Nützliche Flags:

- `--dry-run` — Briefing nur auf stdout, kein SMTP, `seen.json` bleibt unverändert.
- `--no-dedupe` — ignoriert `seen.json` (zeigt auch schon „gesehene" Videos).

Wenn das passt, einmal ohne Flag laufen lassen → echte Mail im Postfach.

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
| Kanäle, Zeitfenster (`lookback_hours`), Stopwords | `channels.yaml` |
| API-Keys, SMTP, Modell | `.env` (lokal) / Secrets (Actions) |
| Modell wechseln | `CLAUDE_MODEL` (Default `claude-opus-4-8`; günstiger: `claude-sonnet-4-6`) |
| Versand-Zeitpunkt | `cron` im Workflow bzw. crontab |
| Relevanz-Maßstab | `../docs/01_Mein_Profil.md` + `../docs/02_Ziele_und_Strategie.md` |

`seen.json` (Verlauf gegen Doppel-Mails) wird vom Skript gepflegt.
