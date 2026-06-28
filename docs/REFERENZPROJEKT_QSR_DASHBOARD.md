# QSR-Dashboard – Automatisierte Qualitätssicherungs-Reklamation

### Digitalisierung eines manuellen Qualitätsprozesses in der Strahler-Fertigung

**Referenzprojekt · Industrielle Prozessautomatisierung · Digitaler Fabrikzwilling**

> Branche: Medizintechnik / High-Tech-Fertigung (Röntgenstrahler-Produktion)
> Standort: Siemens Healthineers, Werk Forchheim (HEP-06)
> Rolle: Konzeption, Architektur, Full-Stack-Entwicklung, Deployment & Betrieb
> Status: Produktiv (Pilot-Release V2.1.0)

---

## 1. Management Summary

In der Strahler-Fertigung von Siemens Healthineers werden sicherheitskritische
Umgebungsparameter (Temperatur, Druck, Feuchte) in Produktions- und Reinräumen
kontinuierlich überwacht. Jede Grenzwertüberschreitung erzeugt eine
**QSR-Alarmmeldung** (Qualitätssicherungs-Reklamation), die lückenlos dokumentiert,
bewertet und revisionssicher abgelegt werden muss – eine regulatorische Pflicht in
einem auditierten Medizintechnik-Umfeld.

Bis zur Einführung des QSR-Dashboards war dieser Prozess **vollständig manuell**:
Schichtleiter durchsuchten täglich E-Mail-Postfächer, ordneten zusammengehörige
„KOMMT"- und „GEHT"-Ereignisse von Hand zu, übertrugen die Daten in ein
Word-Template und legten die Dokumente manuell in SharePoint ab.

Das im Rahmen dieses Projekts entwickelte System **automatisiert den gesamten
Prozess durchgängig** – vom Abruf der Alarm-E-Mails über die regelbasierte
Zuordnung, die Anreicherung mit Sensordaten aus dem **digitalen Fabrikzwilling**,
die automatische Dokumentengenerierung bis hin zur revisionssicheren Ablage.

> **Wirtschaftlicher Effekt: rund 44.000 € eingesparte Personalkosten pro Jahr**
> bei gleichzeitig deutlich höherer Prozesssicherheit und vollständiger
> Nachverfolgbarkeit.

---

## 2. Ausgangslage – Der manuelle Prozess

Die Bearbeitung einer einzelnen QSR-Meldung erforderte eine Kette manueller,
fehleranfälliger Schritte:

| Schritt | Tätigkeit | Schwachstelle |
|---|---|---|
| 1 | **Manuelle Sichtung** des Postfachs zur Identifikation QSR-relevanter Alarme | Hoher Suchaufwand, Alarme gehen im Mail-Aufkommen unter |
| 2 | **Separate Suche** nach zusammengehöriger „KOMMT"- und „GEHT"-E-Mail je Ereignis | Fehlerhafte Zuordnung, übersehene Paare |
| 3 | **Manuelles Übertragen** der Inhalte (Sensor, Kabine, Messwerte, Grenzwerte) in ein Word-Template | Tippfehler, unvollständige Daten |
| 4 | **Manuelle Benennung & Ablage** des Dokuments in SharePoint | Inkonsistente Namen, falsche Ordner, fehlende Nachverfolgbarkeit |

**Kernprobleme:**

- **Hoher Suchaufwand** – die manuelle Identifikation und Zuordnung der
  KOMMT/GEHT-Paare band wertvolle Schichtleiterzeit.
- **Fehlerhafte Zuordnung** – falsch verknüpfte Ereignisse, unvollständige
  Dokumentation und inkonsistente Ablage gefährdeten die Auditfähigkeit.
- **Mehraufwand pro Produkt** – die involvierten Mitarbeiter hatten **bis zu
  10–15 Minuten Mehraufwand pro produziertem Strahler** allein für die
  administrative Abwicklung der Qualitätsmeldungen.
- **Verzögerungen** – Zeit, die für echte Ursachenanalyse und Problemlösung
  fehlte, floss in reine Verwaltung.

---

## 3. Wirtschaftlicher Mehrwert

### 3.1 Produktbezogene Einsparung (Mitarbeiter-Mehraufwand)

Die unmittelbarste Einsparung entsteht beim **administrativen Mehraufwand pro
produziertem Strahler**, der durch die Automatisierung vollständig entfällt:

| Kennzahl | Wert |
|---|---|
| Mehraufwand pro Strahler (vorher, manuell) | 10–15 min (Ø ~12,5 min) |
| Produzierte Strahler pro Jahr | 300 |
| Gemittelter Stundensatz (vollkostenbasiert) | 100 €/h |
| **Eingesparte Zeit pro Jahr** | 300 × 12,5 min ≈ **62,5 h** |
| **Eingesparte Personalkosten (produktbezogen)** | ≈ **6.250 €/Jahr** |

### 3.2 Prozessbezogene Einsparung (QSR-Bearbeitung gesamt)

Über den produktbezogenen Mehraufwand hinaus entfällt der **gesamte manuelle
Bearbeitungsaufwand** je QSR-Fall (Suche, Zuordnung, Word-Erstellung, Ablage):

| Kennzahl | Wert |
|---|---|
| Bearbeitungszeit Einzel-KAPA (vorher) | 8–9 min/Fall (Word + Screenshots + SharePoint) |
| Bearbeitungszeit Sammel-KAPA (vorher) | 3,5 min/Fall (gebündelt) |
| Anteil Sammel-KAPAs | ≈ 35 % (Spanne 30–40 %) |
| **Ø gewichtete Zeit pro Fall** | **6,8 min** |
| Vollständige QSR-Fälle im Betrachtungszeitraum | 4.608 |
| – davon Einzel-KAPAs (≈ 65 %) | 2.995 |
| – davon in Sammel-KAPAs gebündelt (≈ 35 %) | 1.613 |
| **Eingesparte Arbeitszeit (gewichtet)** | **≈ 518,4 h** |
| Stundensatz | 100 €/h |
| **Eingesparte Personalkosten (gewichtet)** | **≈ 44.064 €** |
| Referenz ohne Sammel-Korrektur (8,5 min × 100 €/h) | ≈ 65.280 € |

> **Gesamteinsparung im betrachteten Zeitraum: rund 44.000 €** – eine bewusst
> konservative, gewichtete Rechnung, die den Effizienzgewinn durch die
> Sammel-KAPA-Bündelung bereits gegenrechnet.

### 3.3 Qualitativer Nutzen

- **Höhere Prozesssicherheit** durch Standardisierung und Systemlogik
- **Bessere Nachverfolgbarkeit** (Status, Historie, revisionssicheres Archiv)
- **Weniger Fehler** bei Zuordnung, Vollständigkeit und Ablage
- **Verlagerung von Verwaltung auf Wertschöpfung** – Schichtleiterzeit fließt in
  Ursachenanalyse und Maßnahmensteuerung statt in Dokumentation
- **Skalierungspotenzial** auf **Fertigungsebene 4 und 2** sowie auf weitere
  Bereiche mit identischem Meldeprozess – der Nutzen wächst proportional zum Rollout

---

## 4. Die Lösung – QSR-Dashboard

Das QSR-Dashboard bündelt sämtliche administrativen **Such-, Zuordnungs- und
Dokumentationsschritte** in einer durchgängig automatisierten Webapplikation.
Die Lösung ist **von jedem Siemens-Endgerät im Netzwerk** erreichbar und
unterstützt das **parallele Arbeiten mehrerer Schichtleiter**.

### Automatisierter End-to-End-Prozess

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ 1. ABRUF     │ → │ 2. PARSING & │ → │ 3. ANREICHE- │ → │ 4. DOKUMENT  │ → │ 5. ABLAGE    │
│ Graph API    │   │ ZUORDNUNG    │   │ RUNG         │   │ Word + Screen│   │ SharePoint   │
│ 2 Postfächer │   │ KOMMT/GEHT   │   │ Fabrikzwilling│  │ -shots       │   │ revisionssich.│
│ alle 10 Min  │   │ regelbasiert │   │ (InfluxDB)   │   │ Content Ctrl │   │ Namenskonv.  │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

1. **Automatischer Abruf** der QSR-Alarm-E-Mails alle 10 Minuten aus **zwei
   Postfächern** (Grauraum + Reinraum) via Microsoft Graph API.
2. **Regelbasierte Verknüpfung** von „KOMMT" und „GEHT" über Sensor/Kabine +
   Zeitbezug – nur vollständige Ereignis-Paare werden gespeichert.
3. **Statusführung und Persistenz** in einer SQL-Datenbank inkl. Archivlogik.
4. **Standardisierte UI (Angular)** zur Anzeige, Bewertung (Kommentar,
   Sofortmaßnahmen) und Archivierung.
5. **Automatische Word-Dokumentgenerierung** über ein Template mit Content
   Controls inkl. Befüllung aller Felder, eingebetteter Sensor-Plots und
   E-Mail-Screenshots.
6. **Automatischer Upload nach SharePoint** inkl. einheitlicher Namenskonvention
   (Ereignis-ID / Datum).
7. **Vermeidung von Doppelverarbeitung** durch Verschieben verarbeiteter E-Mails
   in einen „Processed"-Ordner.

---

## 5. Der digitale Fabrikzwilling als Datenrückgrat

Ein zentrales Differenzierungsmerkmal der Lösung ist die Anbindung an den
**digitalen Fabrikzwilling** der Produktion. Die QSR-Alarme aus den E-Mails
liefern nur den Auslöser – die fachliche Bewertung entsteht erst durch die
Verknüpfung mit den **realen, kontinuierlich erfassten Sensordaten** der Anlage.

- **InfluxDB-Zeitreihendatenbank** als Datenquelle des Fabrikzwillings: Das System
  fragt zu jedem Alarm die **historischen Messverläufe** des betroffenen Sensors
  ab (Temperatur, Druck, Feuchte) und validiert die Grenzwertüberschreitung gegen
  den tatsächlichen Verlauf.
- **Automatische Plot-Generierung**: Aus den Zeitreihendaten werden
  Sensor-Diagramme mit Grenzwertlinien und Abweichungsbereichen erzeugt und direkt
  in die QSR-Dokumentation eingebettet – aus einem reinen Alarm-Text wird eine
  belastbare, visuell nachvollziehbare Qualitätsanalyse.
- **Intosite-Deeplinks (3D-Werksmodell)**: Jeder Sensor wird dynamisch mit seinem
  Pendant im **digitalen 3D-Fabrikmodell (Intosite)** verlinkt. Der Schichtleiter
  springt aus dem Dashboard mit einem Klick an die exakte physische Position der
  Messstelle in der Fabrik – die Brücke zwischen Alarmmeldung, Zeitreihe und realem
  Standort in der Halle.
- **Sensor-Klarschrift-Mapping**: Technische AKS-Sensorcodes werden über eine aus
  den Anlagenstammdaten generierte Lookup-Tabelle in verständliche Bezeichnungen
  (Kabine, Achse, Bereich) übersetzt – der digitale Zwilling spricht die Sprache
  der Fertigung.

> So entsteht die durchgängige Kette **Physische Anlage → Sensorik →
> Zeitreihen-Zwilling → Alarm → automatisierte Bewertung → 3D-Verortung →
> revisionssichere Dokumentation.**

---

## 6. Systemarchitektur

Klassische **Drei-Schichten-Architektur** mit klar getrennten Verantwortlichkeiten,
asynchroner Verarbeitung und Service-orientiertem Backend.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Externe Systeme                              │
├──────────────┬──────────────┬───────────────┬───────────────────────┤
│ Outlook /    │ SharePoint   │ InfluxDB      │ Intosite (3D)         │
│ Graph API    │ (Ablage)     │ (Fabrikzwilling)│ Werksmodell         │
│ 2 Postfächer │              │ Sensordaten   │ Deeplinks             │
└──────┬───────┴──────┬───────┴───────┬───────┴───────────┬───────────┘
       ▼              ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 FastAPI Backend (Python) :8000                       │
│  EmailService · GraphAuth · SharePointService · DocumentService      │
│  ScreenshotService (Playwright) · InfluxDBService · PlotService      │
│  SensorNameService · IntositeService · Scheduler (10-Min-Zyklus)     │
│  ───────────────────────────────────────────────────────────────    │
│  SQL Server (MSSQL) · Tabellen: qsr_meldungen, dateien               │
└────────────────────────────┬────────────────────────────────────────┘
                             │ REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Angular 18 Frontend (IIS :8060)                    │
│  Dashboard (Karten) · Sammelkapa · Archiv (ag-Grid)                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Technologie-Stack

**Frontend**

| Technologie | Version | Zweck |
|---|---|---|
| Angular | 18.2 | SPA-Framework (Standalone Components) |
| TypeScript | 5.5 | Typsichere Implementierung |
| RxJS | 7.8 | Reaktive Datenströme |
| Angular Material | 17 | UI-Komponenten |
| ag-Grid | 33 | Performante Archiv-Tabelle |

**Backend**

| Technologie | Version | Zweck |
|---|---|---|
| FastAPI | 0.109 | Async REST-Framework |
| Uvicorn | 0.27 | ASGI-Server |
| SQLAlchemy | 2.0 | ORM |
| pyodbc | 5.1 | SQL-Server-Treiber |
| Pydantic | 2.5 | Daten-Validierung |
| python-docx | 1.1 | Word-Generierung (Content Controls) |
| Playwright | – | Headless-Rendering der E-Mail-Screenshots |
| influxdb-client | 1.38 | Zeitreihen-Abfrage (Fabrikzwilling) |
| Plotly + Kaleido | 5.18 | Sensor-Plots als PNG |

**Plattform & Betrieb**

- Backend als **Windows-Dienst** (NSSM) auf HTTPS, Port 8000, mit Log-Rotation und
  automatischem Neustart.
- Frontend ausgeliefert über **IIS**, Port 8060.
- **CI/CD über Azure Pipelines**, automatisiertes Deployment-Skript.
- **SQL Server (MSSQL)** als zentrale, auditfähige Persistenzschicht.

---

## 7. Fachliche Kernlogik (Engineering-Highlights)

### 7.1 KOMMT/GEHT-Korrelation

Jede Meldung besteht aus einem **KOMMT**-Ereignis (Alarmbeginn mit Sensor, Kabine,
Messwert, Grenzwert) und einem **GEHT**-Ereignis (Normalisierung). Beide werden
über die **Ereignis-ID** regelbasiert zusammengeführt; nur vollständige Paare
werden persistiert, die Alarmdauer wird automatisch berechnet. Das Parsing ist
**Regex-basiert mit mehrstufigen Fallbacks** (Plaintext → HTML-Tabelle →
Sensorname), um die Robustheit gegenüber unterschiedlichen Mail-Formaten zu
gewährleisten.

### 7.2 Dual-Mailbox-Verarbeitung (Grauraum + Reinraum)

Der Scheduler überwacht **zwei Postfächer** parallel. Sensoren werden anhand ihres
AKS-Patterns automatisch klassifiziert:

| Sensor-Pattern | Raumtyp |
|---|---|
| `FQS.RR` | Reinraum |
| `FQS.PR` | Grauraum |

Ein In-Memory-Duplikatschutz (`seen_eids`) verhindert Doppelverarbeitung über die
Postfach-Grenzen hinweg.

### 7.3 Einzel-, Sammel- und Sonderfall-KAPA

Das System unterscheidet drei Dokumenttypen – ein zentraler Hebel für die
Effizienz: Mehrere Meldungen desselben Sensors innerhalb eines Zeitraums können zu
**einer Sammel-KAPA** gebündelt werden, was den Bearbeitungsaufwand von ~8,5 min
auf ~3,5 min pro Fall senkt (siehe Wirtschaftlichkeitsrechnung).

| Typ | Umfang | Dokument |
|---|---|---|
| Einzel-KAPA | Eine Meldung | Ein Dokument pro Meldung |
| Sammel-KAPA | Mehrere Meldungen eines Sensors im Zeitraum | Ein gebündeltes Dokument |
| Sonderfall | Nicht standardisierbare Alarme | Eigene Dokumentlogik |

### 7.4 Automatisierte Dokumentengenerierung

Word-Dokumente werden über **Content Controls (Structured Document Tags)** befüllt
– die Formatierung des Templates bleibt vollständig erhalten. Eingebettet werden:

- alle Stammdaten (Kabine, Sensor, Flur, Zeitraum, Messwerte, Grenzwerte, Dauer),
- die fachliche Bewertung (Beschreibung, Sofortmaßnahmen, Bearbeiter),
- **Sensor-Plots aus dem Fabrikzwilling** und
- **pixelgenaue Screenshots der Original-E-Mails**, gerendert via Playwright
  (Chromium headless) und revisionssicher in der Datenbank abgelegt.

### 7.5 Revisionssichere Ablage

Fertige Dokumente werden mit **einheitlicher Namenskonvention** (Ereignis-ID/Datum)
automatisch nach SharePoint hochgeladen. Der Statusfluss
**NEU → IN BEARBEITUNG → BEARBEITET (Archiv)** ist lückenlos in der Datenbank
nachvollziehbar.

---

## 8. Datenmodell (Auszug)

Zwei zentrale Tabellen bilden den auditfähigen Kern:

- **`qsr_meldungen`** – vollständiger Lebenszyklus jeder Meldung: Ereignisdaten,
  Sensor-/Kabinenzuordnung, Messwerte, Grenzwerte, KOMMT/GEHT-Zeiten, Status,
  Bewertung, KAPA-Typ, Dokument- und SharePoint-Referenzen sowie Zeitstempel.
- **`dateien`** – binäre Speicherung der E-Mail-Screenshots mit zusammengesetztem
  Primärschlüssel `(QSRID, FileName)` zur eindeutigen, deduplizierten Zuordnung.

---

## 9. Ergebnis & Ausblick

| Dimension | Vorher (manuell) | Nachher (automatisiert) |
|---|---|---|
| Suchaufwand KOMMT/GEHT | Manuell, fehleranfällig | Vollautomatisch, regelbasiert |
| Bearbeitungszeit pro Fall | 8–15 min | Wenige Sekunden System + reine Bewertung |
| Mehraufwand pro Strahler | 10–15 min | entfällt |
| Dokumentation | Manuell, inkonsistent | Standardisiert, vollständig, mit Plots & Screenshots |
| Ablage | Manuell, fehleranfällig | Automatisch, Namenskonvention, revisionssicher |
| Nachverfolgbarkeit | Eingeschränkt | Lückenlos (Status, Historie, Archiv) |
| **Personalkosten/Jahr** | — | **≈ 44.000 € eingespart** |

**Ausblick:** Die Architektur ist bewusst auf **Skalierung** ausgelegt. Ein Rollout
auf **Fertigungsebene 4 und 2** sowie auf weitere Bereiche mit identischem
Meldeprozess vervielfacht den Nutzen proportional – bei identischer Codebasis und
minimalem Konfigurationsaufwand.

---

## 10. Eingesetzte Kompetenzen

`Full-Stack-Entwicklung` · `Angular 18 / TypeScript` · `Python / FastAPI` ·
`REST-API-Design` · `SQL Server / SQLAlchemy` · `Microsoft Graph API (OAuth2)` ·
`SharePoint-Integration` · `InfluxDB / Zeitreihenanalyse` ·
`Digitaler Fabrikzwilling` · `Intosite 3D-Werksmodell` · `Playwright-Automation` ·
`Prozessautomatisierung` · `Windows-Dienst / IIS / NSSM` · `Azure Pipelines (CI/CD)`

---

*Referenzprojekt · Siemens Healthineers Werk Forchheim · QSR-Dashboard V2.1.0*
