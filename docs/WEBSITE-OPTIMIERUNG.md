# Website-Optimierung — Inhalt schärfen, Kunden gewinnen, ohne Higgsfield aufwerten

> Stand: 25.06.2026 · Basis: tiefe Analyse der gesamten Seite (Next.js 16, statischer
> Export). Dieses Dokument hat drei Teile:
> **A)** Bug-Audit & was heute behoben wurde ·
> **B)** Inhalt/Conversion schärfen (die strategischen Hebel) ·
> **C)** Neue mitreißende Funktionen, die **ohne** Higgsfield umsetzbar sind.
> Jede Maßnahme mit **Wirkung** und **Aufwand** (S/M/L) priorisiert.

---

## TEIL A — Bug-Audit & heute behobene Fehler

Bei der Analyse fielen drei **inhaltliche Altlasten** aus dem alten 5-Projekte-Stand
auf. Sie wurden direkt korrigiert (Code blieb sonst sauber: `tsc` grün, ESLint nur 2
gewollte Patterns — siehe unten):

| # | Fund | Datei | Fix |
|---|---|---|---|
| 1 | **Veraltete Meta-Description** der Projektseite: nannte „Fünf … WPF-Ablösung, Python-Prüfalgorithmus" — Projekte, die es nicht mehr gibt. Reiner SEO-/Glaubwürdigkeits-Fehler (Google zeigt diesen Text). | `src/app/projects/page.tsx` | Auf 10 aktuelle Projekte umgeschrieben (SmartMaintain, SmartLessons, Fabrikzwilling, MES/OPC UA …). |
| 2 | **OG-Bild zeigte „5+" E2E-Projekte** — beim Teilen auf LinkedIn/Slack erscheint die falsche Zahl, während die Seite selbst auf 10 hochzählt. | `src/app/opengraph-image.tsx` | „5+" → „10". |
| 3 | **Toter Code mit falscher Zahl:** `export const kpis` in `site.ts` (mit „5+") wurde nirgends importiert — die echten KPIs leben in `kpi-band.tsx`. Risiko, dass jemand die alte Quelle wieder anzapft. | `src/lib/site.ts` | Entfernt + Kommentar, wo die KPIs wirklich gepflegt werden. |

**Bekannt & bewusst belassen (kein Bug):**
- ESLint meldet 2× `react-hooks/set-state-in-effect` (in `theme-toggle.tsx` und
  `kpi-band.tsx`). Beides sind **gewollte** Muster (Hydration-sicheres `mounted`,
  reduced-motion-Sprung). Kein Laufzeitfehler. *Falls* `npm run lint` mal in einer
  CI hart blocken soll: gezielt mit `// eslint-disable-next-line` annotieren statt die
  idiomatischen Muster umzubauen.
- `Reveal` hat ein ungenutztes `as?`-Prop in den Typen — harmlos, kann bei Gelegenheit
  raus.

---

## TEIL B — Inhalt & Conversion schärfen (die echten Hebel)

### B0. ⭐ Die wichtigste Frage zuerst: *Was* verkaufst du hier eigentlich?

Das ist der **größte ungenutzte Hebel** — wichtiger als jede Animation. Die Seite ist
aktuell **mehrdeutig**:
- CTAs sagen „**Projekt anfragen**", „Was ich für **dich** baue", „Lass uns über **deinen**
  Prozess sprechen" → klingt nach **Freelancer/Dienstleister**.
- Gleichzeitig: Vollzeit bei Siemens Healthineers, Bachelor 2026, „Digital Talent".

Ein Besucher (CIO, Mittelständler) weiß nach 5 Sekunden **nicht**, ob er dich
**beauftragen**, **einstellen** oder nur **kennenlernen** kann. Jede Optimierung unten
wird 2–3× wirksamer, sobald **ein** Primärziel klar ist. Die vier realistischen Szenarien:

| Ziel | Konsequenz für die Seite |
|---|---|
| **a) Freelance-/Nebenprojekte** (wie Omnibus Schönfelder) | „Projekt anfragen" bleibt, aber **Leistungspakete + grobe Preis-/Ablauf-Orientierung** ergänzen. Mittelstand als Zielgruppe schärfen. |
| **b) Nächster Karriereschritt** (Senior-/Lead-Rolle) | CTA → „Lebenslauf / Profil als PDF", „Auf LinkedIn vernetzen". Weniger „dich", mehr „Was ich in einer Rolle bewirke". |
| **c) Autorität / Personal Brand** | Fokus auf Inhalte: Case Studies, evtl. ein kurzer Blog/„Insights". CTA → „Folgen/Vernetzen". |
| **d) Beratung/Consulting für Mittelstand** | Klares Angebot, ein konkretes Erstgespräch-CTA, Referenz-Story Omnibus prominenter. |

> **✅ ENTSCHIEDEN (25.06.2026): Primärziel = (a) Nebenprojekte für Mittelstand gewinnen**
> (Personal Brand als natürlicher Sekundäreffekt). Konsequenzen, die jetzt umgesetzt
> werden sollten:
> - **Headline/Sub** auf Mittelstands-Schmerz drehen: „Ich digitalisiere die Prozesse,
>   die deinen Mittelstand täglich Zeit & Geld kosten — und beweise den Effekt in Zahlen."
> - **„Leistungen"** als 3–4 buchbare Pakete formulieren (Prozess-Check · Automatisierung ·
>   Individual-Tool · KI-Workflow) mit grober Aufwand-/Ablauf-Orientierung statt nur Beschreibung.
> - **CTA** überall einheitlich: „Prozess kostenlos durchrechnen lassen" (führt zu C1).
> - **Omnibus Schönfelder** als *Referenz für genau diese Zielgruppe* prominenter (eigene
>   Mittelstands-Story, idealerweise mit Testimonial — siehe B1).
> - **Zielgruppen-Sprache:** weniger Konzern-Jargon (SAP BTP, 21 CFR) im Erstkontakt,
>   mehr „spart dir X Stunden". Die Konzern-Tiefe bleibt als Beweis in den Projektkarten.

### B1. Social Proof fehlt komplett → das #1-Conversion-Loch · *Wirkung hoch · Aufwand S–M*
Die Seite hat starke Zahlen, aber **keine einzige Stimme von außen**. B2B-Entscheider
kaufen über Vertrauen. Ergänze, in dieser Reihenfolge der Wirkung:
- **1 Kunden-Testimonial** (Omnibus Schönfelder! „Aus 4× Eingabe wurde 1× — …" mit Name/Funktion).
- **Logo-Zeile** „Erfahrung bei / Projekte für": Siemens Healthineers (+ Omnibus). Dezent, grau.
- **Auszeichnung als echtes Siegel:** „Digital Talent 2023/24 — 1 von 7" gibt es schon im
  Hero — als kleines Trust-Badge auch auf der Projektseite wiederholen.

### B2. Headline konkreter machen · *Wirkung mittel · Aufwand S*
„Prozesse, die wirklich funktionieren." ist gut, aber austauschbar. Teste eine Variante
mit **Ergebnis + Person**:
- *„Ich baue Industrie-Software, die nachweislich > 200.000 € im Jahr spart."*
- *„Vom Shopfloor bis vor die CIO-Ebene — und die Software dazwischen baue ich selbst."*
Die zweite nutzt deinen **einzigartigen** Hybrid (kaum jemand kann das behaupten).

### B3. „Über 200.000 €" beweisbar machen · *Wirkung mittel · Aufwand S*
Die Zahl ist dein stärkstes Asset — aber eine runde Behauptung lädt zum Zweifeln ein.
Du hast bereits die **Einzelposten** (134k + 44k + 35k + 31k + 50–75k …). Mach daraus
eine **aufklappbare Aufschlüsselung** („Wie sich die Summe zusammensetzt") direkt am
KPI-Band. Understatement + Belegbarkeit = maximale Glaubwürdigkeit.

### B4. Feinere Projekt-Filter · *Wirkung mittel · Aufwand S* (du hattest die Idee selbst)
Aktuell nur „Industrie / Kundenprojekt". Besser nach **Fähigkeit**, weil ein Besucher
nach *seinem* Problem sucht: **AMR & IoT · Plattform · Automatisierung · OT/IT-Integration
· Hardware & Safety**. Das `categoryLabel`-Feld trägt die Info quasi schon — nur eine
zweite Filter-Achse nötig.

### B5. „Frag eine KI"-Block schärfen · *Wirkung niedrig–mittel · Aufwand S*
Cleverer Block. Zwei Verbesserungen: (1) den vorausgefüllten Prompt auch in **Englisch**
anbieten (internationale Recruiter/LLMs), (2) `llms.txt` ist gut — ergänze dort die
**konkreten Kundennutzen-Sätze** aus B1, damit KI-Antworten „verkaufen".

### B6. SEO-Feinschliff · *Wirkung mittel (langfristig) · Aufwand S*
- `sitemap.xml`: `lastmod` ist hart auf 2026-06-24 — bei jedem Relaunch mitziehen (oder
  generieren). Detailseiten (B-Teil C) später ergänzen.
- JSON-LD: zusätzlich `@type: "Service"`-Schema für deine Leistungen → bessere Google-
  Darstellung für „Prozessautomatisierung Bayern" o. Ä.
- Pro Projekt perspektivisch eine eigene URL (Case Studies) = mehr indexierbare Seiten
  für Long-Tail-Suchen („AMR Predictive Maintenance Beispiel").

---

## TEIL C — Neue mitreißende Funktionen OHNE Higgsfield

> Diese bringen für *deine* Zielgruppe oft **mehr** als ein Video-Hero — weil sie
> *Kompetenz beweisen* statt sie nur zu behaupten. Alles mit deinem Stack machbar
> (React/Next/Tailwind/Motion), kein externer Service, keine laufenden Kosten.

### C1. ⭐ Interaktiver Impact-/ROI-Rechner — *Wirkung SEHR hoch · Aufwand M*
**Das ist dein „Wow", das zu dir passt.** Ein kleiner Rechner:
> „Wie viel kostet dein manueller Prozess?“ → Schieberegler: *Minuten pro Vorgang*,
> *Vorgänge pro Tag*, *Stundensatz* → live: **„≈ X € / Jahr gebunden“** + „So viel davon
> ist automatisierbar".
Warum es zündet: Es **demonstriert** deine Denkweise (in Zahlen, in Hebeln), erzeugt
einen Aha-Moment und endet natürlich im CTA „Lass uns deinen Fall durchrechnen". Reines
React, scrollt sich von selbst in jede Sales-Mail. **Top-Priorität.**

### C2. Case-Study-Detailseiten — *Wirkung hoch · Aufwand M–L* (deine Idee)
Für die Flaggschiffe (SmartMaintain, SmartLessons, QSR-Dashboard) je eine eigene Seite:
**Kontext → Problem → Lösung → Architektur-Skizze → belegte Zahlen**. Gibt Tiefe für
ernsthafte Interessenten, mehr SEO-Fläche, und einen Ort für ein projektbezogenes
Testimonial. Datenmodell (`projects.ts`) ist dafür schon fast bereit (nur `slug` + Lang-Text).

### C3. Scroll-gezeichnete Prozess-Linie (SVG „draw on scroll") — *Wirkung mittel · Aufwand S–M*
Der „Vier Schritte"-Ablauf als **SVG-Pfad, der sich beim Scrollen zeichnet** (Motion
`useScroll` + `pathLength`). Das ist der *eine* cinematische Effekt, der **ohne**
Higgsfield, ohne Frames, ohne Kosten auskommt — und perfekt zu „Prozess" passt.

### C4. ⌘K Command-Palette — *Wirkung mittel (Signal!) · Aufwand M*
Eine Tastatur-Navigation (⌘K / Strg+K → springe zu Projekt/Seite, Theme toggeln,
„Kontakt"). Für eine technische Zielgruppe ein subtiles Kompetenz-Signal: „diese Person
baut Tools, die sich gut anfühlen". Rein clientseitig.

### C5. „Profil als PDF / One-Pager" Download — *Wirkung hoch (B2B) · Aufwand S–M*
Entscheider **leiten weiter**. Ein sauberer 1-Seiter (Foto, Positionierung, 3 Top-
Projekte, Zahlen, Kontakt) als Download = du bist im Meeting dabei, ohne dort zu sein.
Generierbar zur Build-Zeit oder als gepflegtes statisches PDF.

### C6. Sprachumschalter DE/EN — *Wirkung hoch (Reichweite) · Aufwand M–L*
Deine Zielgruppe ist teils international/Konzern. Eine englische Variante öffnet
LinkedIn-Recruiter und internationale Mittelständler. Next App Router macht das sauber
(`/en/...`). Größerer Brocken, aber hoher Reichweiten-Hebel — gut als eigenes Etappenziel.

### C7. Tech-Stack als interaktive „Constellation" — *Wirkung mittel · Aufwand M*
Statt der Chip-Listen eine kleine interaktive Karte: Technologien gruppiert, beim Hover
leuchten die Projekte auf, in denen sie steckten. Zeigt **Tiefe statt Logo-Sammlung**
(genau deine Botschaft im About) — spielerisch, aber substanzgetrieben.

### C8. Mikro-Politur (Quick Wins) — *Wirkung niedrig je Stück, in Summe spürbar · Aufwand S*
- **View Transitions API** für sanfte Seitenwechsel (Next unterstützt das nativ).
- **Kontaktformular-Erfolg ehrlicher:** Beim `mailto`-Fallback erst „Erfolg" zeigen,
  wenn das Mailprogramm wirklich getriggert wurde (heute optimistisch).
- **Aktiver Scroll-Spy** in der Nav (welche Sektion gerade sichtbar ist).
- **Hover-Glow auf Projektkarten** richtet sich nach der Maus (Spotlight-Effekt).

---

## Priorisierte Roadmap (Vorschlag)

| Reihenfolge | Maßnahme | Warum zuerst |
|---|---|---|
| **1** | B0 Primärziel klären | Multipliziert alles danach |
| **2** | C1 Impact-Rechner | Größtes „Wow" für deine Zielgruppe, beweist Kompetenz |
| **3** | B1 Social Proof (Omnibus-Testimonial + Logos) | Schließt das größte Conversion-Loch |
| **4** | B3 200k-Aufschlüsselung + B2 Headline-Test | Glaubwürdigkeit + Klarheit, minimaler Aufwand |
| **5** | C2 Case-Study-Seiten (Flaggschiffe) | Tiefe + SEO-Fläche |
| **6** | Higgsfield-Hero (eigenes Doc) | Erst Substanz, dann der Glanz obendrauf |
| **7** | C6 DE/EN, C3/C4/C7 nach Lust | Reichweite & Politur |

> **Merksatz für die ganze Seite:** Dein Alleinstellungsmerkmal ist *Substanz*. Jede
> Funktion sollte Kompetenz **beweisen**, nicht nur dekorieren. Der Impact-Rechner (C1)
> tut das. Ein zurückhaltender Brand-Hero (Higgsfield-Doc) schmückt — mehr soll er auch
> nicht. In dieser Reihenfolge gewinnst du Kunden.
