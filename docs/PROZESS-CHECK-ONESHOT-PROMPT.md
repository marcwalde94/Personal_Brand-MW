# One-Shot-Prompt → „Prozess-Check"-Funnel (PWA + KI + Website-Integration)

So benutzt du diese Datei:

1. Stelle sicher, dass du in der Claude-Sitzung **im Repo der Website** bist
   (`marcwalde-website` / dieses Next.js-Projekt).
2. Lege vorher zwei Secrets bereit (siehe Abschnitt UMGEBUNG): einen **OpenAI-API-Key** und
   eine **Formspree-Form-ID**. Ohne die läuft der Flow im Demo-Modus, aber nicht produktiv.
3. **Kopiere alles zwischen `===== PROMPT START =====` und `===== PROMPT ENDE =====`** und
   füge es in Claude (Claude Code / dieses Repo) ein.
4. Claude baut den kompletten Funnel in die Seite. Danach `npm run build` und lokal testen.

> 💡 **Warum PWA statt App-Store-App:** Derselbe QR-Code, sofort im Browser, installierbar
> per „Zum Home-Bildschirm", iPhone **und** Android, 0 € extra, kein App-Review, sofortige
> Updates. Eine native App (99 $/Jahr, Review-Risiko bei Formular-Apps, nur iPhone) bringt
> für einen Lead-Funnel nichts Zusätzliches — nur Kosten und Reibung.

---

===== PROMPT START =====

# MISSION

Baue in dieses bestehende Next.js-Projekt (statischer Export, App Router, Tailwind v4,
`motion`, next-themes) einen durchgängigen **„Prozess-Check"-Lead-Funnel**:

Ein Interessent scannt auf marcwalde.de einen **QR-Code** → landet am Handy in einer
**app-artigen, geführten PWA** unter `/check` → beschreibt in wenigen, super einfachen
Schritten den Prozess, der ihn am meisten Zeit/Geld kostet → eine **KI** macht daraus
(a) einen sauberen, strukturierten Brief, (b) eine grobe Jahres-Kostenspanne, (c) einen auf
ihn zugeschnittenen Pitch für eine SEO-/KI-optimierte Website → der Nutzer sieht ein
überzeugendes Ergebnis + CTA, und **Marc bekommt den fertigen Lead per E-Mail**.

# HARTE REGELN (nicht verhandelbar)

1. **Lies vor jeder Next-spezifischen Zeile** die passende Anleitung in
   `node_modules/next/dist/docs/` (siehe AGENTS.md — dieses Next.js weicht von Trainingsdaten ab).
2. **Der statische Export bleibt erhalten** (`output: export` in `next.config.ts` NICHT
   entfernen). Alle Seiten/PWA-Assets sind statisch.
3. **Der OpenAI-Key darf NIEMALS in den Browser.** Der KI-Aufruf läuft ausschließlich über
   eine **separate Serverless-Funktion**. Kein `OPENAI_API_KEY` im Client-Bundle, kein
   `NEXT_PUBLIC_`-Präfix für den Key. Nach dem Build verifizieren: `grep -r "sk-" out/` ist leer.
4. **Markentreue:** exakt die bestehenden Design-Tokens und Utility-Klassen nutzen
   (`src/app/globals.css`: `--bg`, `--accent #6366f1`, `--emerald #34d399`, `.btn`,
   `.btn-primary`, `.btn-ghost`, `.glass`, `.card`, `.chip`, `.eyebrow`, `wrap`-Container;
   Fonts Space Grotesk/Inter). Wiederverwenden: `src/components/reveal.tsx`,
   Motion-Muster aus `src/components/projects-explorer.tsx`, Formspree-Muster aus
   `src/components/contact-form.tsx`, Aufbau-Vorbild `src/components/ask-ai-block.tsx`.
5. **DSGVO:** Eingaben gehen an OpenAI und an Marc — vor dem Absenden Pflicht-Einwilligung
   (Checkbox) + kurzer Datenschutz-Hinweis. Verlinke `/datenschutz` und `/impressum`
   (Hinweis am Ende, falls noch nicht vorhanden — diese Seiten sind vor Go-Live Pflicht).
6. Keine erfundenen Präzisionszahlen. Geldwerte immer als **Spanne**, sachlicher Ton.

# ARCHITEKTUR (Überblick)

- **Statische Website** (unverändertes Hosting) → enthält `/check` (PWA) + QR-Brücke.
- **1 Serverless-Funktion** `analyze` → hält den OpenAI-Key, gibt nur strukturiertes JSON
  zurück. Default-Ziel: **Vercel Function** (`/api/analyze`). Liefere im Code zusätzlich
  Kommentare für die Netlify-/Cloudflare-Worker-Variante.
- **Formspree** → E-Mail-Zustellung des Leads (clientseitig, wie im bestehenden Formular).

```
QR  →  /check (PWA, statisch)  →  fetch(ANALYZE_URL)  →  OpenAI
                                       │
                                       └─►  Ergebnis-Screen  →  Formspree  →  Marcs Postfach
```

# BAUSTEINE

## 1) Route `/check` — die geführte PWA

- Datei: `src/app/check/page.tsx` (+ Wizard-Komponenten unter `src/components/check/`).
- **Mobile-first**, eine Frage pro Screen, große Tap-Targets (min. 48px), klarer
  Fortschrittsbalken, Zurück/Weiter, sanfte `motion`-Übergänge (`prefers-reduced-motion`
  respektieren), Auto-Save im `localStorage` (kein Datenverlust beim Zurück).
- Eigenes, fokussiertes Layout (ohne die globale Marketing-Nav/Footer-Ablenkung) — wirkt
  wie eine App. Standalone-tauglich (kein horizontales Scrollen, `100svh`).
- **Schritt-Flow (smart & minimal):**
  1. Begrüßung: „In 2 Minuten: Wo verliert deine Firma Zeit & Geld?" + Start-Button.
  2. Branche (Chips zur Schnellauswahl + Freitext).
  3. Welcher Prozess kostet am meisten Zeit/Geld? (Freitext, Platzhalter mit Beispiel).
  4. Wie läuft er heute? (Freitext; optionale Chips: „Excel", „Papier", „E-Mail", „SAP",
     „Telefon", „manuelle Übertragung").
  5. Volumen: Häufigkeit (pro Tag/Woche), Minuten pro Vorgang, beteiligte Personen
     (Slider/Stepper — daraus grobe Vorab-Schätzung, die die KI verfeinert).
  6. Firma + Name + E-Mail (für den Lead) + **DSGVO-Checkbox**.
  7. „Analysieren" → Loading → Ergebnis-Screen.
- Live-Mini-Feedback: schon vor dem KI-Call eine simple Hochrechnung anzeigen
  (`Minuten × Häufigkeit × Personen × Stundensatz-Annahme`) als Teaser — verstärkt das „Wow".

## 2) PWA-Setup

- `public/manifest.webmanifest`: `name`/`short_name` „Prozess-Check · Marc Walde",
  `display: "standalone"`, `theme_color: "#090d18"`, `background_color: "#090d18"`,
  `start_url: "/check/"`, Icons 192/512 (+ maskable). Icons als PNG in `public/` ablegen
  (aus dem vorhandenen MW-Verlauf-Logo ableiten, Stil wie `src/app/opengraph-image.tsx`).
- In `src/app/layout.tsx`: `<link rel="manifest">`, `apple-mobile-web-app-capable`,
  `apple-mobile-web-app-status-bar-style`, Apple-Touch-Icon.
- Schlanker Service-Worker `public/sw.js` (App-Shell/Offline-Fallback), registriert per
  kleinem Client-Snippet. Alles statisch → mit `output: export` kompatibel.

## 3) Serverless-Funktion `analyze` (KI-Gehirn)

- Default: **Vercel Function** unter `/api/analyze` (Node-Runtime). Nimmt `POST` mit den
  Antworten, ruft OpenAI mit aktuellem, kostengünstigem Modell, gibt JSON zurück:
  ```json
  {
    "brief": "strukturierter Klartext-Brief des Problems",
    "kosten_min": 0, "kosten_max": 0, "kosten_basis": "kurze Erklärung der Annahmen",
    "automatisierbar": "niedrig|mittel|hoch",
    "website_pitch": "2-3 Sätze, warum SEO-/KI-optimierte Website Kunden bringt",
    "braucht_website": true
  }
  ```
- **Sicherheit:** Key aus `process.env.OPENAI_API_KEY`. CORS auf die Site-Origin
  beschränken (`Access-Control-Allow-Origin` = Produktions-Domain). Rate-Limit simpel
  (z. B. pro IP/Minute). Eingabelänge begrenzen. Bei fehlendem Key sauberer 500 + Klartext.
- **System-Prompt der KI (Guardrails):** „Du bist ein nüchterner Digitalisierungs-Analyst.
  Schätze konservativ. Geldwerte immer als Spanne mit genannten Annahmen (Stundensatz-
  Annahme transparent machen). Erfinde keine Präzision. Antworte ausschließlich als JSON
  nach dem vorgegebenen Schema. Deutsch." Übergib die Nutzer-Antworten strukturiert.
- Liefere im Datei-Kommentar die **Netlify Functions**- und **Cloudflare Worker**-Variante
  (gleiche Logik, anderer Handler-Wrapper), damit Marc frei wählt.

## 4) Ergebnis-Screen (das „Wow")

- Zeigt: den lesbaren **Brief**, die **Jahres-Kostenspanne** groß in Emerald
  („Dieser Prozess bindet ca. X–Y € pro Jahr" + Annahmen klein darunter), den
  **Automatisierbarkeits-Indikator**, und den **Website-Pitch** (genau Marcs Verkaufsargument:
  „Ein perfekter erster Eindruck + SEO + KI-Auffindbarkeit = mehr Kunden").
- Abschluss-CTA: „Marc meldet sich mit einer konkreten Einschätzung" + Sekundär-CTA
  „Mehr über Marc" (→ `/`). Optional: Ergebnis als Text kopieren (Muster aus `ask-ai-block.tsx`).

## 5) Lead-Zustellung per E-Mail (Formspree)

- Beim Erreichen des Ergebnisses (oder per „Absenden") die strukturierten Daten
  (Firma, Kontakt, Antworten, KI-Brief, Kostenspanne) an Formspree posten — Muster und Env
  `NEXT_PUBLIC_FORMSPREE_ID` aus `src/components/contact-form.tsx` wiederverwenden.
  Betreff z. B. „Prozess-Check Lead — {Firma}". Erfolg/Fehler sauber behandeln.

## 6) QR-Brücke auf der Website

- Neue Komponente `src/components/process-check-cta.tsx` (Aufbau-Vorbild `AskAiBlock`):
  kurzer Nutzen-Text + **QR-Code** zur `/check`-URL + Direktlink-Button (Desktop).
- **QR zur Build-Zeit** als statisches SVG erzeugen (kleine, dependency-arme QR-Lib oder
  vorgeneriertes Asset in `public/`) — keine Laufzeit-Abhängigkeit, kein externer Dienst.
- Einbinden auf der Startseite (`src/app/page.tsx`, sinnvoll nahe dem Schluss-CTA) und auf
  der Kontaktseite (`src/app/contact/page.tsx`).

# UMGEBUNG (Secrets / Env)

- `OPENAI_API_KEY` — **nur serverseitig** (Vercel/Netlify/Cloudflare Projekt-Env), nie `NEXT_PUBLIC`.
- `NEXT_PUBLIC_FORMSPREE_ID` — Formspree-Form-ID (clientseitig ok, ist öffentlich).
- `NEXT_PUBLIC_ANALYZE_URL` — URL der Serverless-Funktion (z. B. `/api/analyze` bei Vercel,
  oder die Worker-/Netlify-URL). Default `/api/analyze`.
- Lege/ergänze `.env.local.example` mit diesen Variablen + Kommentaren an. `.env*` ist
  bereits in `.gitignore`.

# AKZEPTANZKRITERIEN (am Ende selbst prüfen)

1. `npm run build` läuft grün, `output: export` intakt, `out/` enthält `/check/`.
2. `grep -r "sk-" out/` ist leer (kein Key-Leak). Ohne `OPENAI_API_KEY` zeigt der Flow eine
   saubere Fehlermeldung statt Crash.
3. `/check` ist mobil bedienbar (DevTools-Mobile/echtes Handy), Wizard durchklickbar,
   `prefers-reduced-motion` respektiert, Auto-Save funktioniert.
4. KI-Ergebnis erscheint und ist plausibel (Spannen, Annahmen sichtbar). Test-Lead landet
   im Postfach (Formspree-Testmodus).
5. QR-Code auf Start-/Kontaktseite führt korrekt zu `/check`. Lighthouse: PWA installierbar,
   Manifest valide.
6. Keine ESLint-/TS-Fehler eingeführt (`npx tsc --noEmit` grün).

# AUSGABE

Setze die Änderungen direkt um (neue Dateien + minimale Anpassungen an `layout.tsx`,
`page.tsx`, `contact/page.tsx`). Fasse am Ende kurz zusammen: angelegte Dateien, nötige
Env-Variablen, Deploy-Hinweis (welcher Funktions-Host), und welche Schritte Marc noch
manuell tun muss (Keys setzen, Datenschutz/Impressum ergänzen).

===== PROMPT ENDE =====

---

## Kostenüberblick (ehrlich)

| Posten | Kosten |
|---|---|
| PWA-Hosting | **0 € extra** — läuft auf deinem bestehenden Static-Host |
| QR-Code | **0 €** — zur Build-Zeit erzeugt, kein Dienst |
| Serverless-Funktion (Vercel/Netlify/Cloudflare) | **0 €** im Gratis-Kontingent (für Lead-Volumen mehr als ausreichend) |
| OpenAI pro Lead | **~ Cent-Bereich** pro Analyse (günstiges Modell, kurze Antwort) |
| Formspree | kostenloser Tarif für kleines Volumen, sonst günstiger Monatsplan |
| **Native App-Store-App (bewusst NICHT gewählt)** | **99 $/Jahr** Apple Developer + Mac + Review-Risiko + nur iPhone |

## Voraussetzungen vor Go-Live (nicht vergessen)

- **Datenschutzerklärung + Impressum** müssen existieren, bevor der Funnel live geht — der
  Flow sendet personenbezogene Daten an OpenAI und an dich (DSGVO). Das war schon in der
  Repo-Analyse der größte offene Punkt; spätestens hier wird es zwingend.
- OpenAI-Key serverseitig hinterlegen, Formspree-ID setzen, `NEXT_PUBLIC_ANALYZE_URL` auf
  die echte Funktions-URL zeigen lassen.
