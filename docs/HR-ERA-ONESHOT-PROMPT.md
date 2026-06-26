# One-Shot-Prompt → HR-Slide-Deck (ERA-11-Case Marc Walde)

So benutzt du diese Datei:

1. **Platzhalter füllen.** Suche im Prompt unten alle `{{...}}` und ersetze sie durch
   echte Werte. Was du nicht belegen kannst, **löschst** du lieber, als es zu erfinden.
2. **Schalter setzen.** Ganz am Ende des Prompts (`### PARAMETER`) `ZWECK`, `ADHS`,
   `SPRACHE` einstellen.
3. **Alles ab der Zeile `===== PROMPT START =====` bis `===== PROMPT ENDE =====`
   kopieren** und in eine neue Claude-Unterhaltung einfügen.
4. Claude gibt dir **eine einzige `praesentation.html`**. Speichern, doppelklicken,
   im Browser mit **Pfeiltasten** durchblättern, mit **Strg/Cmd+P → „Als PDF speichern"**
   exportieren.

> ⚠️ **Vor dem HR-Termin zwingend prüfen:** Jede Zahl muss **einer** Quelle entsprechen.
> Es kursieren bei dir zwei Zahlensätze (z. B. 9K-Test: 31.250 € vs. 24.000 €). Entscheide
> dich für **einen** belegbaren Wert pro Projekt — ein Widerspruch vor einem HR-Direktor
> kostet dich die Glaubwürdigkeit des gesamten Decks. Die `Beleg`-Spalte unten zwingt dich,
> je Zahl die Quelle zu benennen (Maschinendaten, Modellrechnung, Controlling …).

---

===== PROMPT START =====

# ROLLE

Du bist gleichzeitig (a) ein Senior-Präsentationsdesigner für C-Level-Decks und (b) ein
HR-Direktor eines DAX-Konzerns, der ERA-Eingruppierungen entscheidet. Deine Aufgabe:
Erzeuge **eine einzige, in sich geschlossene HTML-Datei** (`praesentation.html`) — ein
überzeugendes Slide-Deck, das den fachlichen Höhergruppierungs-Fall von Marc Walde auf
ERA-11-Niveau belegt. Keine externen Build-Tools, keine npm-Pakete: reines HTML/CSS/JS,
lauffähig per Doppelklick.

# OBERSTE REGELN (nicht verhandelbar)

1. **Keine erfundenen Fakten und keine erfundenen Zahlen.** Verwende ausschließlich die
   Angaben aus dem Abschnitt DATEN. Wo dort `{{TODO}}` steht, lass im Slide einen sichtbaren
   neutralen Platzhalter (`— nachzutragen —`) — niemals selbst ausdenken.
2. **Jede Geldzahl wird mit ihrer Beleg-Art angezeigt** (kleine Fußnote/Caption an der Zahl),
   exakt wie in der Spalte „Beleg" angegeben. Keine Zahl ohne Beleg.
3. **Ton:** sachlich, souverän, faktengetrieben. Kein Marketing-Sprech, keine Superlative
   ohne Zahl dahinter. Understatement + Belegbarkeit schlägt Lautstärke.
4. **Halte dich an die Markenvorgaben** (Abschnitt DESIGN) — das Deck soll wie aus einem Guss
   mit marcwalde.de wirken.
5. Befolge den Schalter `ADHS` aus PARAMETER strikt. Default ist **aus** = das Thema kommt
   im Deck **nicht** vor.

# DATEN (Single Source of Truth)

## Person
- Name: Marc Walde
- Arbeitgeber: Siemens Healthineers AG, Erlangen — seit 2013 (über 10 Jahre)
- Formale Stelle: Prozessplaner Common Function, **ERA 9/10**
- Faktisch gelebte Rolle: Digitalisierungsexperte / Prozessmanager Produktion
  (End-to-End: Shopfloor-Verständnis + eigene Softwareentwicklung + Projektleitung bis
  CIO-Ebene)
- HR-seitig bereits bestätigt: **Die Stellenbeschreibung passt nicht mehr zur gelebten Realität.**
- ERA-Neubewertung: angefragt, läuft — noch ohne verbindlichen Zeitplan.
- Vertrag: aktuell 35 h, angestrebt 40 h.

## Qualifikation & Anerkennung
- B.A. Management & Digitalisierung (berufsbegleitend, Abschluss 2026)
- Industriemeister Elektrotechnik (IHK)
- Digital Talent Programm 2023/24 — **1 von 7** konzernweit ausgewählten Talenten
- Key User LLM (PV Chat Companion, aktiv seit 2024)
- Tech: Python, .NET/WPF, Angular, SAP S/4HANA, SQL, Power Platform, AMR/FTS (MiR), IoT, Power BI
- Methoden: Wertstromanalyse, Lean, FMEA, RACI, Stage-Gate, KPI-/OEE-Analyse

## Offizielles Führungskraft-Feedback (Q2 2026, wörtlich zitieren)
„Marc Walde lebt unsere Werte sehr vorbildlich und konsequent vor. Insbesondere Ownership
und Innovationsorientierung — wir wagen Großes — sind hier hervorzuheben. Bitte als
positives Vorbild im Make-Umfeld konsequent weiter vorleben!"

## Impact-Projekte — EIN konsistenter Zahlensatz mit Beleg
> Trage hier genau die Werte ein, die du vor HR vertreten kannst. Standard unten = die
> bereits abstrahierten/validierten Portfolio-Zahlen. Pro Zeile EINE Zahl + EINE Beleg-Art.

| Projekt | Marcs Rolle | Ergebnis (€/Wirkung p.a.) | Beleg |
|---|---|---|---|
| AMR/FTS-Flotte (SmartMaintain & Predictive Maintenance, MiR) | End-to-End-Projektleitung, CIO-Präsentation, cross-functional | {{z. B. ~30.000–60.000 € vermiedene Stillstandskosten; ~710 h Stillstand/Jahr}} | aus echten Maschinendaten |
| SmartLessons — Wissens-/Schulungsplattform | Konzeption, Architektur, Rollout | {{≈ 134.000 € Einsparpotenzial}} | Modellrechnung (vermiedene Wiederholfehler) |
| QSR-Dashboard / digitaler Fabrikzwilling | E2E-Automatisierung | {{≈ 44.000 €}} | Personalkosten-Rechnung |
| SAP-Prozessautomatisierung (Kit-Belieferung / Lager) | Potenzialanalyse, Implementierung, Rollout | {{≈ 35.000–75.000 €}} | Controlling/Modellrechnung |
| 9K-Test-Automatisierung (IEC 62304) | Eigenständige Algorithmus-Entwicklung | {{≈ 31.250 € · bis zu 24 h weniger Stillstand/Strahler}} | gemessene Stillstandszeit |
| {{weiteres Projekt}} | {{Rolle}} | {{Wert}} | {{Beleg}} |
| **Summe (gerundet, konservativ)** | | **> 200.000 € p.a.** | Summe validierter Einzelposten |

## Marktvergleich (externer Anker für den Wert)
- Offene Stelle Siemens GWE Erlangen: **SCM Digitalization Expert, ERA 11** — belegt, dass
  Marcs Profil am Markt auf ERA-11-Niveau ausgeschrieben wird.

## ERA-11-Kriterien-Match (firmenspezifisch — Platzhalter)
> Trage je ERA-11-Kriterium **einen** konkreten Beleg aus den Projekten ein.
- Aufgabenkomplexität / Handlungsspielraum: {{TODO Beleg}}
- Selbstständigkeit / Verantwortung: {{TODO Beleg}}
- Fach-/Methodenkompetenz: {{TODO Beleg}}
- Wirkungsbreite / Schnittstellen: {{TODO Beleg}}
- Führung/Steuerung (fachlich): {{TODO Beleg}}

# DESIGN (Markenvorgaben aus marcwalde.de)

- **Format:** 16:9, eine Folie pro Bildschirm, Tastatur-Navigation (←/→, Leertaste),
  Fortschrittsanzeige + Foliennummer. Für Druck: bei `Strg/Cmd+P` jede Folie auf eine
  eigene A4-Quer-Seite (CSS `@media print` + `page-break`).
- **Modus:** Dark-first.
- **Farben (CSS-Variablen):** `--bg:#090d18; --bg2:#0b1020; --card:#0e1426;
  --border:rgba(255,255,255,.08); --ink:#e8edf7; --muted:#9aa6bd; --faint:#5f6c87;
  --accent:#6366f1; --accent2:#8b5cf6; --accent-soft:#a5b4fc; --emerald:#34d399;`
- **Akzent-Verlauf:** `linear-gradient(135deg,#6366f1,#8b5cf6)`; dezente Aurora-
  Radial-Gradients im Hintergrund (Indigo oben-links, Emerald unten-rechts, niedrige Deckkraft).
- **Schrift:** Headlines „Space Grotesk", Fließtext „Inter" — via Google-Fonts-CDN einbinden.
- **Stil:** Glas-Karten (leichte Transluzenz, 18px Radius, feiner heller Rand), großzügiger
  Weißraum, große Zahlen in Emerald für €-Werte. Logo-Badge „MW" (Verlauf, abgerundet) oben links.
- **Animation:** dezentes Fade/Translate beim Folienwechsel, `prefers-reduced-motion` respektieren.
- **Barrierearm:** Kontraste ausreichend, semantisches HTML, Foliennummer auch für Screenreader.

# FOLIEN (Reihenfolge; passe Tiefe an Schalter ZWECK an)

1. **Titel** — „Der Fall für ERA 11", Untertitel: gelebte Rolle + Name; MW-Badge, dezenter
   Marktanker-Hinweis. Wirkt wie die Startseite von marcwalde.de.
2. **Das Delta** — zwei Spalten: *Formal* (Prozessplaner, ERA 9/10) vs. *Faktisch gelebt*
   (Digitalisierungsexperte/Prozessmanager, E2E). Schlusszeile: „HR hat bestätigt: Die
   Stellenbeschreibung passt nicht mehr." Das ist die Spannung des gesamten Decks.
3. **Impact auf einen Blick** — großes KPI-Band: „> 200.000 € / Jahr · validiert",
   daneben Aufschlüsselung der Einzelposten (aus der Tabelle, je mit Beleg-Caption).
4.–7. **Projekt-Deep-Dives** (eine Folie je Hauptprojekt): Struktur *Problem → Lösung →
   Marcs konkrete Rolle → belegtes Ergebnis*. Rolle immer aktiv formulieren („Ich habe …
   geleitet/entwickelt/ausgerollt").
8. **ERA-11-Kriterien-Match** — Tabelle Kriterium ↔ Beleg. **Die Entscheider-Folie.**
9. **Qualifikation & Anerkennung** — Bachelor 2026, Industriemeister, Digital Talent (1/7),
   Key User LLM; darunter das wörtliche Führungsfeedback-Zitat als Trust-Element.
10. **Marktvergleich** — die GWE-ERA-11-Ausschreibung als externer Wert-Anker.
11. **Die Forderung** — klar und konkret: ERA 11 jetzt, 40 h, mit Zeitplan/Meilensteinen
    (nächster Review-Termin, Entscheidungsdatum).
12. **Close** — ein Satz Zusammenfassung + Ask + Kontaktzeile (marcwalde.de / LinkedIn).

# AUSGABE

Gib **nur** den vollständigen Inhalt der Datei `praesentation.html` aus — beginnend mit
`<!DOCTYPE html>`, lauffähig ohne weitere Schritte. Danach kurz auflisten, welche `{{TODO}}`
/ `— nachzutragen —` noch offen sind, damit ich sie ergänzen kann.

### PARAMETER
- ZWECK = intern            # intern | extern | beides
- ADHS = aus                # aus | arbeitsweise | voll   (Default & Empfehlung: aus)
- SPRACHE = de              # de | en

> Hinweis zu ADHS, falls du den Schalter änderst: Bei `arbeitsweise` erscheinen Hyperfokus/
> Mustererkennung/divergentes Denken als beobachtbare *Arbeitsweise* — **ohne** das Wort ADHS
> und **ohne** Produktivitäts-Statistik. Bei `voll` darfst du Diagnose und Statistik nur
> nennen, wenn in DATEN eine zitierfähige Quelle steht; eine unbelegte Zahl (z. B. „14,7x")
> NICHT als Fakt darstellen.

===== PROMPT ENDE =====

---

## Warum dieses Deck so gebaut ist (kurze Strategie-Notiz)

- **Folie 2 „Das Delta" ist der Hebel:** Du argumentierst nicht „ich bin gut", sondern
  „Bezahlung und Eingruppierung hinken der bereits gelebten Realität hinterher" — und HR hat
  das schon bestätigt. Das ist die stärkste, am wenigsten angreifbare Linie.
- **Folie 8 „Kriterien-Match" gewinnt oder verliert den Termin.** Ein HR-Direktor entscheidet
  an *seinen* ERA-Kriterien, nicht an deinen Projekten. Übersetze deine Projekte explizit in
  seine Sprache. Diese Folie unbedingt mit den echten konzerninternen ERA-11-Kriterien füllen.
- **Marktanker (Folie 10):** Die externe GWE-ERA-11-Ausschreibung macht aus „ich hätte gern
  mehr" ein „der Markt — inklusive Siemens selbst — bewertet dieses Profil mit ERA 11".
- **ADHS bewusst draußen (Default):** In einem Eingruppierungs-Termin ist eine Diagnose ein
  unnötiges Risiko und lenkt vom Impact ab. Deine Stärken zeigst du über Ergebnisse, nicht
  über ein Label. Die „14,7x"-Statistik ist nicht belastbar — sie gehört in kein Dokument,
  das Glaubwürdigkeit erzeugen soll.
