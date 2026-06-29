# Optimierungen & Lernnotizen 🧠

> Für Marc. Erklärt **was** geändert wurde, vor allem aber **warum** — damit du das
> System verstehst und selbst weiterdrehen kannst. Bullet-lastig, konkret.

---

## Teil 1 — Was ich gerade geändert habe (die 3 Fixes)

### Fix 1 · `max_tokens` 2048 → 4096 + `stop_reason`-Check
- **Problem:** Opus „denkt" adaptiv (adaptive thinking). Diese Denk-Tokens zählen
  mit ins `max_tokens`-Budget. Bei 2048 konnte das eigentliche JSON **abgeschnitten**
  werden → Parsing scheitert → Video erscheint als „nicht lesbar".
- **Lösung:** Budget auf 4096 erhöht **und** nach dem Call `resp.stop_reason` geprüft.
  Jetzt gibt es klare Fehlermeldungen statt stiller Fehlschläge:
  - `stop_reason == "refusal"` → „Claude hat die Einschätzung abgelehnt (Sicherheitsfilter)."
  - `stop_reason == "max_tokens"` → „Antwort abgeschnitten (max_tokens zu klein)."
- **Lerneffekt:** Bei LLM-APIs **immer `stop_reason` prüfen**, bevor du die Antwort
  weiterverarbeitest. `end_turn` = sauber fertig. Alles andere = vorsichtig sein.
  „Es kam *irgendeine* Antwort" heißt nicht „die Antwort ist vollständig".

### Fix 2 · Strukturierte Ausgabe über `messages.parse()` + Pydantic
- **Vorher:** Ich habe Claude per `output_config` rohes JSON-Schema gegeben und den
  Text selbst mit `json.loads` geparst — mit einem Notfall-Fallback.
- **Jetzt:** Ein **Pydantic-Modell** `VideoSummary` definiert die Felder *typisiert*
  (`verdict: Literal["SCHAUEN","ÜBERSPRINGEN"]`, `score: 1..10`). `client.messages.parse(
  output_format=VideoSummary, …)` lässt das **SDK** das Schema bauen und die Antwort
  **validieren**. Ich greife das fertig geprüfte Objekt über `block.parsed_output` ab.
- **Warum besser:** Das Modell *kann* kein ungültiges `verdict` oder einen Score 99
  mehr liefern — das Schema erzwingt die Form. Weniger eigener Parsing-Code, weniger
  Fehlerquellen. (Ich habe die exakte SDK-Signatur vorher **verifiziert**, nicht geraten.)
- **Sicherheitsnetz:** Falls eine sehr alte SDK-Version `parse()` nicht kennt, fällt
  der Code automatisch auf den alten `create()`-Weg zurück. Robust über Versionen.
- **Lerneffekt:** „Structured Outputs" = du gibst dem Modell ein **Schema** und
  bekommst garantiert valides JSON in genau der Form. Das ist Gold für Pipelines:
  du musst die Modell-Antwort nicht mehr „erraten" oder mit Regex aufräumen.

### Fix 3 · SMTP Port 465 (SSL) unterstützen
- **Problem:** Der Code machte immer `STARTTLS` (Port 587). Wer Port **465** nutzt
  (implizites SSL, z. B. manche Provider), lief auf einen Verbindungsfehler.
- **Lösung:** Bei Port 465 → `smtplib.SMTP_SSL`, sonst `SMTP` + `starttls()`.
- **Lerneffekt:** 587 = „erst Klartext, dann auf TLS *hochstufen*" (STARTTLS).
  465 = „von der ersten Sekunde verschlüsselt" (implizites SSL). Zwei verschiedene
  Mechanismen — die Bibliothek hat dafür zwei Klassen. Für Gmail bleibt 587 richtig.

---

## Teil 2 — Warum die App so gebaut ist (Architektur-Lernpunkte)

- **Pipeline statt „Magie".** Es gibt kein „Claude überwacht YouTube". Vier klar
  getrennte Schritte (Sammeln → Filtern → Aufbereiten → Zustellen). Der **Scheduler**
  ist der Wächter, Claude nur Schritt 3. → Jeder Schritt einzeln testbar/debugbar.
- **Fehler-Isolation.** Ein kaputter Kanal oder ein Video ohne Transkript wirft den
  ganzen Lauf **nicht** um — Fehler werden pro Element gefangen und im Briefing ehrlich
  markiert. → Robustheit schlägt Perfektion bei automatischen Jobs.
- **Prompt-Caching.** Dein Profil steckt als System-Block mit `cache_control` im Call.
  Beim 1. Video wird es „in den Cache geschrieben", bei den folgenden Videos nur noch
  *gelesen* — ~10× billiger für den Profil-Anteil. → Stabiles wiederholtes Präfix
  zuerst, Variables (das Transkript) danach.
- **Dedupe nach Erfolg.** `seen.json` wird erst **nach** erfolgreichem Versand
  geschrieben. Bricht der Versand ab, gilt nichts als „gesehen" → nächster Lauf holt es
  nach. → Niemals einen Job als erledigt markieren, bevor er wirklich erledigt ist.
- **Ehrliche Grenzen.** Kein Transkript? → Fallback auf Titel/Beschreibung, **sichtbar
  markiert**. → Lieber ehrlich „unsicher" sagen als so tun, als wüsste man mehr.

---

## Teil 3 — Weiterführende Optimierungen (Ideen, noch nicht umgesetzt)

Bewusst *nicht* gemacht, damit die App schlank bleibt — aber gut zu wissen:

| Idee | Nutzen | Aufwand |
|---|---|---|
| **Modell pro Lauf wählen** (`CLAUDE_MODEL=claude-sonnet-4-6`) | ~40 % günstiger als Opus, für Zusammenfassungen oft ausreichend. Opus nur, wenn Relevanz-Feinurteil zählt. | 0 (nur Env-Var) |
| **Batch API** | Wenn mal viele Videos: alle Anfragen als ein Batch = 50 % Rabatt, dafür nicht in Echtzeit. Für ein Wochen-Briefing ideal. | mittel |
| **Transkript-Sprachen erweitern** | Aktuell `de, en`. Falls du Kanäle in anderen Sprachen abonnierst, Liste in `fetch_transcript` ergänzen. | klein |
| **„Top der Woche" nur bei echten Empfehlungen** | Aktuell zeigt es das höchstbewertete Video — auch wenn alle „überspringen" sind. Schöner: nur zeigen, wenn ≥1 SCHAUEN dabei ist. | klein |
| **Rate-Limit-Backoff** | Das SDK wiederholt 429/5xx schon automatisch (2 Versuche). Bei sehr vielen Kanälen ggf. erhöhen. | klein |
| **Score-Schwelle fürs Mail-Volumen** | Optional nur Videos ab Score ≥ N ins Briefing — weniger Rauschen. | klein |
| **Zweitkanal Telegram/Push** | Statt/zusätzlich zur Mail das Briefing an einen Telegram-Bot schicken. | mittel |

---

## Teil 4 — Kosten-Daumenregel (damit du ein Gefühl bekommst)

- Pro Video: 1 Claude-Call. Input = dein Profil (~1 000 Tokens, **gecacht**) +
  Transkript (gekappt bei ~14 000 Zeichen ≈ 4–5 000 Tokens). Output = kurzes JSON.
- Bei ~10 Videos/Woche mit Opus: grob ein **niedriger einstelliger Cent- bis
  unterer Euro-Bereich pro Woche**. Mit Sonnet nochmal deutlich darunter.
- Größter Hebel: **Modellwahl** (Sonnet statt Opus) und **Transkript-Kappung**
  (`TRANSCRIPT_CHAR_BUDGET`). Beides sind Stellschrauben im Code/Env.

---

## Teil 5 — Wie du selbst experimentierst (zum Tüfteln)

- `python briefing.py --dry-run` → zeigt das Briefing im Terminal, **ohne Mail**.
  Perfekt zum Ausprobieren von Prompt-/Profil-Änderungen.
- `python briefing.py --no-dedupe` → ignoriert `seen.json`, zeigt auch „alte" Videos
  — nützlich, wenn du an der Darstellung schraubst und Testdaten brauchst.
- **Profil ist dein wichtigster Hebel.** Je schärfer `docs/01_Mein_Profil.md` deine
  Interessen beschreibt, desto besser die Relevanz-Urteile. Wenn die Scores „daneben"
  liegen → nicht am Code drehen, sondern **das Profil präzisieren**.
- **System-Prompt** (`SYSTEM_INSTRUCTIONS` in `briefing.py`) bestimmt den Ton der
  Bewertung. Willst du strenger/lockerer bewertet? Dort eine Zeile ergänzen und
  `--dry-run` vergleichen. So lernst du, wie Prompt-Änderungen wirken.

> Kurz: **Profil + System-Prompt** sind deine zwei Stellschrauben für *Qualität*,
> **Modellwahl + Transkript-Kappung** für *Kosten*. Code-Logik musst du dafür nicht anfassen.
