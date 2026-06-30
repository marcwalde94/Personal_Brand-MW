# One-Shot-Prompt → Interaktive Live-Demo („Try before you buy")

So benutzt du diese Datei:

1. Öffne eine Claude-Sitzung **im Repo der Website** (dieses Next.js-Projekt).
2. **Kopiere alles zwischen `===== PROMPT START =====` und `===== PROMPT ENDE =====`** und
   füge es in Claude ein.
3. Claude baut eine interaktive, gescriptete Demo-Oberfläche unter `/demo` in die Seite.
   Danach `npm run build` + lokal testen.

> 💡 **Idee dahinter:** Interessenten kaufen, was sie *erleben* durften. Diese Demo ist eine
> **frontend-only Simulation** (keine echten Daten, kein Backend) — sie bleibt statisch,
> kostet 0 € extra, hat keine DSGVO-/Sicherheitsfläche und zeigt trotzdem den Wow-Moment:
> „1× eingeben → 4 Dokumente automatisch".

---

===== PROMPT START =====

# MISSION

Baue in dieses bestehende Next.js-Projekt (statischer Export, App Router, Tailwind v4,
`motion`, next-themes) eine **interaktive Live-Demo** unter der Route `/demo`:

Ein simuliertes **Bus-Operations-Cockpit** der fiktiven Firma **„Muster-Reisen GmbH"**
(Vorbild: Marcs reales Schönfelder-Projekt, aber vollständig anonymisiert). Eine **geführte
Tour** führt den Besucher durch ein gescriptetes Szenario mit echten Klick-Momenten und
zeigt den Aha-Effekt: aus **1× Anfrage erfassen** entstehen automatisch **4 Dokumente**.
Ziel: der Interessent *erlebt*, was Marc baut, und landet danach im CTA zurück im Funnel.

# HARTE REGELN (nicht verhandelbar)

1. **Lies vor jeder Next-spezifischen Zeile** die passende Anleitung in
   `node_modules/next/dist/docs/` (AGENTS.md — dieses Next.js weicht von Trainingsdaten ab).
2. **Statischer Export bleibt** (`output: export` NICHT entfernen). `/demo` ist eine reine
   Client-Komponente, **kein Backend, keine Netzwerkaufrufe** — alle Daten sind im Code
   gescriptet. DevTools-Network muss beim Durchklicken leer bleiben.
3. **Keine echten Kundendaten.** Firma = „Muster-Reisen GmbH", alle Namen/Orte/Zahlen
   fiktiv. Nichts, was erkennbar auf den echten Kunden (Schönfelder) zeigt.
4. **Keine echten Aktionen:** Buttons simulieren (State ändern, animieren) — nichts wird
   gesendet, gespeichert oder gedruckt. Ein **Reset** stellt den Ausgangszustand wieder her.
5. **Markentreue:** exakt die bestehenden Design-Tokens & Utilities nutzen
   (`src/app/globals.css`: `--bg`, `--bg2`, `--card`, `--accent #6366f1`, `--accent2`,
   `--emerald #34d399`, `.glass`, `.card`, `.btn`, `.btn-primary`, `.btn-ghost`, `.chip`,
   `.eyebrow`; Fonts Space Grotesk/Inter). Wiederverwenden: `src/components/reveal.tsx`,
   Motion-Muster (`AnimatePresence`, `layout`, `useReducedMotion`) aus
   `src/components/projects-explorer.tsx`, Aufbau-Vorbild `src/components/ask-ai-block.tsx`.
   Inhaltliche Vorlage (anonymisieren!): Eintrag `omnibus-schoenfelder` in `src/data/projects.ts`.
6. `prefers-reduced-motion` respektieren. Sauberes TypeScript, keine neuen ESLint-Fehler.

# AUFBAU

## 1) Cockpit-Shell — `src/app/demo/page.tsx` (+ `src/components/demo/*`)
- Eigenes, fokussiertes Cockpit-Layout (nicht die Marketing-Nav): **Topbar** mit Logo
  „Muster-Reisen GmbH" + dauerhaftem Badge **„Interaktive Demo · Beispieldaten"** + Reset-
  Button. **Sidebar** mit Bereichen: *Posteingang/Anfragen · Aufträge · Dokumente · Fahrer ·
  Telefon-KI*. **Hauptbereich** zeigt den aktiven Bereich.
- Desktop/Tablet-first, responsive. Auf dem Handy nutzbar oder dezenter Hinweis
  „Am besten am größeren Bildschirm erlebbar". `min-h-[100svh]`, kein horizontales Scrollen.
- **Demo-State** zentral (z. B. `useReducer` + Context in `src/components/demo/state.tsx`):
  hält eingehende Anfrage, übernommenes Formular, erzeugte Dokumente, Tour-Schritt. Optional
  `localStorage`-Persistenz; Reset leert alles auf den Startzustand.

## 2) Geführte Tour (Overlay/Coachmarks) — `src/components/demo/tour.tsx`
Gescriptetes Szenario, schrittweise, mit Spotlight/Highlight auf das jeweils relevante
Element, „Weiter"/„Überspringen", Fortschrittsanzeige:
- **Schritt 1 — Anfrage kommt rein:** Im Posteingang erscheint animiert eine Fake-E-Mail
  („Reiseanfrage: Vereinsausflug, 48 Personen, München → Gardasee, 12.–15.06., Hin/Rück …").
- **Schritt 2 — 1× erfassen:** Nutzer klickt **„Anfrage übernehmen"** → kurze
  „analysiert…"-Animation (simulierte KI-Extraktion) → das Auftragsformular **füllt sich
  selbst** mit den Eckdaten.
- **Schritt 3 — der Wow-Moment:** Ein Klick **„Dokumente erzeugen"** lässt sichtbar **4
  Dokument-Karten** hereinanimieren: *Angebot · Auftragsbestätigung · Fahrauftrag ·
  Rechnung* (je mit hübscher PDF-Vorschau-Optik, anklickbar = Vorschau-Modal). Begleittext:
  **„1× eingeben statt 4× — die manuelle Mehrfacherfassung entfällt."**
- **Schritt 4 — Ausblick:** kurzer Blick auf die *Fahrer*-Ansicht (Auftrag am Handy) und
  einen *Telefon-KI*-Teaser („Anruf erkannt → Anfrage automatisch angelegt").
- Tour überspringbar; danach **freies Anklicken** der bereits gezeigten Bereiche möglich.

## 3) Dokument-Vorschau — `src/components/demo/document-card.tsx`
Karten im Brand-Stil mit realistischem, aber fiktivem Inhalt (Briefkopf „Muster-Reisen
GmbH", Positionen, Summen). Klick öffnet ein Vorschau-Modal. Kein echtes PDF, kein Download
(oder ein klar als „Demo" markierter Schein-Download ohne echte Datei).

## 4) Abschluss-CTA (zurück in den Funnel) — am Ende der Tour / als Panel
„Genau so etwas baue ich für dein Unternehmen." → Primär-Button **„Projekt anfragen"**
(`/contact`), Sekundär **„Deinen Prozess beschreiben"** (`/check`, falls vorhanden, sonst
`/contact`) + „Mehr über Marc" (`/`).

## 5) Einstieg von der Website — `src/components/live-demo-cta.tsx`
Aufbau-Vorbild `ask-ai-block.tsx`: kurzer Nutzen-Text („Klick dich in 60 Sekunden durch ein
echtes Beispiel") + Button **„Live-Demo testen"** → `/demo`. Einbinden:
- auf der Startseite (`src/app/page.tsx`), sinnvoll nahe dem Projekte-Teaser / Schluss-CTA;
- auf der Projektseite beim Schönfelder-Eintrag (`src/components/projects-explorer.tsx` bzw.
  `project-card.tsx`): ein „Live testen"-Link nur für `omnibus-schoenfelder`.
- Eigene `metadata` + `alternates.canonical: "/demo"` für die Demo-Seite.

# AKZEPTANZKRITERIEN (am Ende selbst prüfen)
1. `npm run build` grün, `output: export` intakt, `out/demo/` existiert; `npx tsc --noEmit` grün.
2. `/demo` lädt **ohne Netzwerkaufrufe**: Tour startet, alle 4 Schritte durchklickbar, der
   4-Dokumente-Moment animiert sichtbar, Vorschau-Modal funktioniert, Reset stellt
   Startzustand her, `prefers-reduced-motion` respektiert.
3. Responsiv: Desktop/Tablet sauber; Handy nutzbar oder klarer Hinweis.
4. „Live-Demo testen" auf Start-/Projektseite führt nach `/demo`; CTA aus der Demo führt
   nach `/contact`.
5. Nur fiktive Inhalte sichtbar („Muster-Reisen GmbH"), nichts Kunden-Identifizierbares.
6. Keine neuen ESLint-/TS-Fehler.

# AUSGABE
Setze die Änderungen direkt um (neue Dateien + minimale Einbindung in `page.tsx` /
Projektseite). Fasse am Ende zusammen: angelegte Dateien, wie die Tour gesteuert wird, und
welche Stellen Marc inhaltlich leicht anpassen kann (Szenario-Texte, Dokumentinhalte).

===== PROMPT ENDE =====

---

## Strategie-Notiz (warum so)

- **Frontend-only ist hier ein Feature, kein Kompromiss:** Es gibt nichts zu hacken, nichts
  zu hosten, nichts an DSGVO zu beachten — und es fühlt sich trotzdem echt an. Die Demo soll
  *überzeugen*, nicht *funktionieren*.
- **Geführt > frei:** Der eine Klick-Moment „1× → 4 Dokumente" ist dein stärkstes,
  dokumentiertes Verkaufsargument. Die Tour garantiert, dass jeder Besucher ihn sieht —
  statt zu hoffen, dass er ihn selbst findet.
- **Fiktive Firma schützt dich:** „Muster-Reisen GmbH" nutzt die Glaubwürdigkeit des echten
  Projekts, ohne Kundeninhalte zu zeigen. Wenn Schönfelder einverstanden ist, kannst du
  später eine echte, benannte Case-Study + Testimonial ergänzen — das wäre der nächste,
  separate Schritt.
- **Nächster Ausbau (optional):** dieselbe Demo-Mechanik später für ein zweites Szenario
  (Handwerk/Praxis) wiederverwenden — der State-/Tour-Aufbau ist dafür schon generisch genug.
