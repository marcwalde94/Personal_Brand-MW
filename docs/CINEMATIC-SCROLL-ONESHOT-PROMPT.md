# One-Shot-Prompts → Cinematic Scroll (iterativ)

So benutzt du diese Datei:

- **Führe immer nur EINEN Iterations-Block aus**, nicht alle auf einmal. Empfohlene
  Reihenfolge: 1 → 2 → 3 → 4 → (5 → 6, wenn Higgsfield-Credits da sind).
- Öffne eine Claude-Sitzung **im Repo der Website**, kopiere den gewünschten Block
  (zwischen `--- ITERATION N START ---` und `--- ITERATION N ENDE ---`) und füge ihn ein.
- Nach jeder Iteration: `npm run build` + `npx tsc --noEmit` grün, am Handy + Desktop
  ansehen, und **ehrlich prüfen: stützt der Effekt die Substanz oder lenkt er ab?** Im
  Zweifel dezenter machen oder entfernen. Lesbarkeit hat immer Vorrang.

## Regeln, die in JEDEM Block gelten (der Prompt wiederholt sie)
- Vor Next-spezifischem Code die Guides in `node_modules/next/dist/docs/` lesen (AGENTS.md).
- `output: export` bleibt erhalten — nur Client-Komponenten, **kein Backend**.
- **Nur `transform`/`opacity` animieren** (kein Layout-Thrash), `will-change` gezielt,
  Scroll über `motion` `useScroll`/`useTransform`/`useSpring` bzw. `requestAnimationFrame`.
- **`prefers-reduced-motion` → statischer Fallback** (bestehende Sektion). Mobil ggf.
  vereinfachter Effekt. Markentreue über Tokens aus `src/app/globals.css`
  (`--accent #6366f1`, `--accent2 #8b5cf6`, `--emerald #34d399`, `--bg #090d18`, `.glass`,
  `.card`, `.chip`, `.eyebrow`; Fonts Space Grotesk/Inter).
- Keine neuen ESLint-/TS-Fehler.

---

--- ITERATION 1 START ---
Baue Iteration 1 „Flug durch deine Wirkung": ein cinematisches Sticky-Scroll-Kapitel auf der
Startseite, das das heutige KPI-Band zum Erlebnis macht. Beachte die gemeinsamen Regeln
(transform/opacity-only, reduced-motion-Fallback, output: export bleibt, Marken-Tokens).

INHALT/REUSE: Zahlen & Counter-Muster aus src/components/kpi-band.tsx; Einsparungen pro
Projekt aus src/data/projects.ts (Felder kpis/result: 134k, 44k, 35k, 31k, 50–75k …);
Timeline-Daten aus src/app/about/page.tsx (Shopfloor → Industriemeister → Entwickler →
Projektleiter → Digital Talent 1/7 → Bachelor 2026). Vorhandene src/components/parallax.tsx
und reveal.tsx nutzen.

UMSETZUNG:
1) Neue Client-Komponente src/components/cinematic-impact.tsx. Sticky-Stage: äußere <section>
   mit großer Scroll-Höhe (z. B. min-h-[300vh]), innen sticky top-0 h-[100svh] Bühne.
2) Akt A — Einsparungen-Flug + Scroll-ROI-Counter: die Einzel-Einsparungen fliegen mit Tiefe
   (perspective + translateZ/scale/opacity/blur, aus useScroll-Fortschritt) heran und fügen
   sich sichtbar zur großen „> 200.000 € / Jahr" zusammen. Der große Wert zählt
   SCROLLGETRIEBEN hoch (useTransform des Scroll-Progress → Zahl), nicht zeitbasiert.
3) Akt B — Laufbahn-Flug: nahtloser Übergang in einen Tiefen-/Seiten-Flug durch die Timeline-
   Stationen (je Station eine Karte, die heranfliegt und wieder wegzieht).
4) Einbindung in src/app/page.tsx: ersetzt/erweitert den aktuellen KPI-Band-Abschnitt.
   Bei prefers-reduced-motion → das bestehende statische <KpiBand /> + eine schlichte
   Timeline-Liste rendern (kein Flug).
ABNAHME: build + tsc grün, Scroll flüssig, „>200.000 €" baut sich sichtbar aus den Einzel-
posten auf, Zahlen jederzeit lesbar, reduced-motion-Fallback greift, mobil geprüft.
Fasse am Ende zusammen, was gebaut wurde und wo man Texte/Zahlen anpasst.
--- ITERATION 1 ENDE ---

---

--- ITERATION 2 START ---
Baue Iteration 2 „Prozess-Story", angedockt an die „So arbeiten wir / Prozess"-Sektion der
Startseite. Gemeinsame Regeln beachten. Reuse: src/components/process.tsx als inhaltliche
Basis (die vier Schritte).

UMSETZUNG (neue Client-Komponente src/components/cinematic-process.tsx):
1) Vorher→Nachher-Morph: links/oben „manuelles Chaos" (verstreute Excel-Zellen, Papier-
   Icons, wirre Knoten/Linien als SVG), das beim Scrollen sichtbar in eine saubere,
   ausgerichtete, automatisierte Pipeline zusammenfließt (SVG-Positionen/Opacity via
   useScroll interpolieren). Kurze Labels „vorher"/„nachher".
2) SVG-Prozesslinie: ein Pfad, der die vier Schritte verbindet und sich beim Scrollen selbst
   zeichnet (pathLength 0→1 via useScroll). An jedem Knoten erscheint der jeweilige Schritt.
3) Einbindung in src/app/page.tsx nahe/als Ersatz des Process-Abschnitts. reduced-motion →
   die bestehende statische <Process />-Darstellung.
ABNAHME wie üblich (build/tsc grün, flüssig, lesbar, Fallback, mobil).
--- ITERATION 2 ENDE ---

---

--- ITERATION 3 START ---
Baue Iteration 3 „Portfolio-Flug". Gemeinsame Regeln beachten. Reuse: src/data/projects.ts,
src/components/project-card.tsx, services.tsx, strength-grid.tsx, Motion-Muster aus
projects-explorer.tsx.

UMSETZUNG (neue Client-Komponente src/components/cinematic-portfolio.tsx):
1) Horizontaler Projekt-Flug: eine pinned/sticky Bühne (äußere Section hoch, innen sticky
   h-[100svh]); während man vertikal scrollt, ziehen die Projektkarten horizontal vorbei
   (useScroll-Progress → x-translate einer Karten-Reihe). Featured-Projekte zuerst.
2) Sticky Stacking-Cards: alternativ/zusätzlich ein Abschnitt, in dem Leistungs-/Stärke-
   Karten beim Scrollen stapeln & leicht skalieren (jede Karte sticky, nachfolgende schieben
   sich darüber). Dezent, nicht überdreht.
3) Einbindung in src/app/page.tsx (Projekte-Teaser) bzw. src/app/projects/page.tsx.
   reduced-motion → das bestehende Grid.
ABNAHME wie üblich; achte besonders darauf, dass Touch-/Trackpad-Scroll nicht „klebt".
--- ITERATION 3 ENDE ---

---

--- ITERATION 4 START ---
Baue Iteration 4 „Politur" — subtile, seitenweite Aufwertungen. Gemeinsame Regeln beachten.
Bewusst DEZENT halten; diese Iteration darf nie von den Inhalten ablenken.

UMSETZUNG:
1) Parallax-Tiefe im Hero: in src/components/hero.tsx die vorhandene src/components/
   parallax.tsx nutzen, um Hintergrund/Porträt/Floating-Badges mit leicht unterschiedlicher
   Geschwindigkeit zu bewegen (kleine Amplituden). Headline bleibt unbewegt & scharf.
2) Typografischer Reveal: neue Komponente src/components/reveal-text.tsx — große Statements
   enthüllen sich beim Eintritt zeilenweise (blur+clip-path/translateY via useInView oder
   useScroll). Punktuell an 1–2 Schlüssel-Headlines einsetzen (nicht überall).
3) Daten-Fluss-Netzwerk (bewusst dezent): ein kleiner Abschnitt, in dem Knoten
   SAP→Snowflake→Dashboard und verbindende Linien entlang des Scrolls nacheinander aufleuchten
   (SVG stroke-dashoffset / opacity via useScroll). Falls es zu technisch/verspielt wirkt,
   dezenter machen oder weglassen — Kohäsion vor Effekt.
ABNAHME wie üblich; danach kritisch bewerten, welche der drei Politur-Elemente wirklich bleiben.
--- ITERATION 4 ENDE ---

---

--- ITERATION 5 START ---
Baue Iteration 5 „Higgsfield Hero-Brand-Loop". Nur ausführen, wenn Higgsfield-MCP verbunden
ist und Credits vorhanden sind (~1–2 $). Lies zuerst docs/HIGGSFIELD-HERO-EIN-PROMPT.md und
docs/HIGGSFIELD-CINEMATIC-UPGRADE.md und folge deren Pipeline exakt:
generate_image (nano_banana_pro, 16:9, abstrakter Liquid-Metal/Glas-Prompt in Markenfarben,
Negative-Space links) → generate_video (seedance_2_0, 1080p, 16:9, 6s, start_image =
Keyframe-id, declined_preset_id wie dort) → ffmpeg-Frames nach public/cinematic/frames/ →
neue Client-Komponente src/components/cinematic-hero.tsx (Canvas-Frame-Scrub, FRAME_COUNT auf
echte Anzahl setzen) → in src/components/hero.tsx als unterste Schicht HINTER AuroraBackground
(Aurora bleibt Fallback). reduced-motion ODER fehlende Frames → nur Aurora. Headline/CTAs/
Porträt unverändert. Gib Credits-Verbrauch, Frame-Anzahl und Screenshots (dark+light) aus.
--- ITERATION 5 ENDE ---

---

--- ITERATION 6 START ---
Baue Iteration 6 „Cinematisches Porträt". Nur mit Higgsfield-Credits. Nutze
public/marc-walde.webp als start_image für generate_video (moderationsfreundlich formulieren:
„subtle cinematic camera orbit and parallax around a professional male portrait, shallow depth
of field, elegant, corporate, brand colors, no distortion"), kurze Dauer, seamless. Frames wie
in Iteration 5 schneiden, als dezente cinematische Sektion auf src/app/about/page.tsx
einbauen. Fallback = das bestehende statische Bild. Bei Moderationsablehnung: Wording
entschärfen oder auf statisches Bild verzichten und melden.
--- ITERATION 6 ENDE ---

---

## Warum diese Reihenfolge (kurz)

- **1–4 zuerst, weil sie 0 € kosten, sofort laufen und Mittelstand-Substanz zeigen** (Geld,
  Prozess, Portfolio). Sie sind der eigentliche „Wow"-Kern für deine Zielgruppe.
- **5–6 (Higgsfield) sind Glanz obendrauf** — erst zünden, wenn die Substanz-Iterationen sitzen.
- **Ehrliche Bremse:** Du hast alle Module gewählt. Bau sie einzeln, schau nach jeder
  Iteration drauf und behalte nur, was die Botschaft stärkt. Drei starke Effekte schlagen acht
  mittelmäßige — deine Marke ist Substanz, nicht Show.
