# Masterprompt — YouTube-Wochen-Briefing in Claude Code aufsetzen

> Kopier den folgenden Block in Claude Code (im Repo `Personal_Brand-MW`). Claude
> richtet dir das System ein, debuggt es, führt dich interaktiv durch die Keys und
> stellt das wöchentliche Scheduling scharf — du musst den Python-Code nicht selbst
> anfassen.

---

## Prompt (ab hier kopieren)

Du hilfst mir, das **YouTube-Wochen-Briefing** im Ordner `youtube-briefing/`
produktiv zu nehmen. Der Code existiert bereits (`briefing.py`, `channels.yaml`,
`requirements.txt`, `.env.example`, GitHub-Actions-Workflow). Deine Aufgabe ist
Inbetriebnahme, Test und Scharfstellen — nicht Neubau. Arbeite die Schritte der
Reihe nach ab und frag mich, wo du Eingaben brauchst.

**Kontext, den du kennen musst:**
- Es ist eine 4-Schritt-Pipeline: YouTube Data API holt neue Videos → Filter
  (Zeitfenster ~7 Tage + Dedupe via `seen.json`) → Claude liest pro Video das
  Transkript gegen mein Profil (`docs/01_Mein_Profil.md`) → E-Mail per SMTP.
- Es läuft **wöchentlich freitags**, nicht täglich.
- Ehrlicher Rahmen: Der Scheduler ist der Wächter, Claude ist Schritt 3. Fehlt ein
  Transkript, ist der Fallback auf Titel/Beschreibung gewollt — nicht „reparieren".

**Schritt 1 — Umgebung.**
- Lege bei Bedarf ein venv an, installiere `youtube-briefing/requirements.txt`.
- Prüfe, dass `python briefing.py --help` läuft.

**Schritt 2 — Keys (interaktiv).**
- Erstelle `youtube-briefing/.env` aus `.env.example`.
- Frag mich nacheinander nach `YOUTUBE_API_KEY`, `ANTHROPIC_API_KEY` und den
  SMTP-Werten. Erklär mir bei jedem kurz, wo ich ihn herbekomme (Google Cloud
  Console / console.anthropic.com / Gmail-App-Passwort). Trag sie in `.env` ein.
  Schreib niemals einen Key in eine Datei, die committet wird — `.env` ist ignoriert.

**Schritt 3 — Kanäle.**
- Öffne `channels.yaml`. Nick Saraev und Liam Ottley sind per Handle hinterlegt.
- Verifiziere die Kanäle (Handle → Channel-ID auflösen) und trag wenn möglich die
  stabilen `channel_id` (`UC…`) ein. Frag mich, ob ich weitere Kanäle will.

**Schritt 4 — Dry-Run & Debug.**
- Lauf `python briefing.py --dry-run`. Lies die Ausgabe.
- Falls Fehler: behebe Konfig/Umgebung (fehlende Keys, falsche Channel-ID, fehlende
  Pakete). Ändere die Pipeline-Logik nur, wenn ein echter Bug vorliegt — und sag mir
  vorher, was und warum.
- Zeig mir das gerenderte Briefing und hol mein OK zur Aufmachung.

**Schritt 5 — Echter Lauf.**
- Wenn ich grünes Licht gebe: `python briefing.py` (echte Mail). Bestätige mit mir,
  dass die Mail angekommen ist.

**Schritt 6 — Scheduling scharfstellen.**
- Empfehlung: GitHub Actions (kein eigener Server). Führ mich durch das Anlegen der
  Repository-Secrets (gleiche Namen wie in `.env`) und das manuelle Auslösen des
  Workflows „YouTube-Wochen-Briefing" zum Test.
- Falls ich lieber einen Pi/VPS nutze: gib mir die fertige `crontab`-Zeile für
  Freitag und erklär die `seen.json`-Persistenz.

**Arbeitsweise:**
- Kleine, überprüfbare Schritte. Nach jedem Schritt kurz: was lief, was ist offen.
- Keine Secrets in Commits, Logs oder PR-Beschreibungen.
- Halte dich an den bestehenden Stil; erfinde keine zusätzlichen Abhängigkeiten.

---

## Was du danach hast

- Ein getestetes, lauffähiges Wochen-Briefing.
- Scheduling aktiv (GitHub Actions **oder** Cron).
- `seen.json`-Dedupe, damit kein Video doppelt kommt.
