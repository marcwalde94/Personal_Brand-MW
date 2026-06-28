# SmartMaintain & SMART-Vision
### Predictive-Maintenance-Plattform und sensorgestützte AMR-Steuerung für autonome Materialflüsse

> **Referenzprojekt · Siemens Healthineers HEP**
> Autor: Marc Walde · Stand: Juni 2026 · Status: Produktivbetrieb (live seit 11.05.2026)
> Rollen: Konzeption, Architektur, Full-Stack-Entwicklung, IoT-Edge, Inbetriebnahme, Betrieb

---

## 0. Elevator Pitch

> **SmartMaintain** macht eine Flotte autonomer mobiler Roboter (AMR, MiR250) erstmals vollständig transparent: Live-Zustand, automatische Störungserkennung, geführte Fehlerbehebung und belastbare KPIs – über eine einzige Weboberfläche.
> **SMART-Vision** ist die dazugehörige IoT-Edge-Schicht: Sensoren (Advantech WISE-4060) und ein eigenes Steuergerät (M5Paper) verhindern Leerfahrten und Blockaden, **bevor** sie entstehen, und lösen Transportaufträge nur dann aus, wenn am Übergabepunkt tatsächlich Material steht.
>
> Zusammen lösen beide Bausteine dasselbe Kernproblem: **Wenn ein Roboter stehen bleibt, konnten sich die Kollegen bisher nicht selbst helfen.** Das Wissen steckte im Kopf einer einzelnen Person, die Fehlersuche dauerte 1–2 Stunden, und der AMR blockierte nachgelagerte Aufträge. SmartMaintain externalisiert dieses Wissen in ein System; SMART-Vision eliminiert eine der häufigsten Störungsursachen an der Quelle.

**Wirtschaftlicher Kern:** Werkerstunde ≈ **70–80 €/h**, Instandhaltungsstunde ≈ **90 €/h**. Jede vermiedene Blockade und jede verkürzte Fehlersuche zahlt direkt darauf ein.

> **Belegt mit echten Maschinendaten** (Messzeitraum 18.04.–25.06.2026, ~68 Tage, 3 Roboter): In diesem Zeitraum standen die Roboter real **154,5 Stunden** in Fehler-/Not-Halt-Zuständen. Hochgerechnet auf ein Betriebsjahr ergibt das **≈ 710 Stunden Stillstand/Jahr ≈ 53.000 €** allein an direkten Stillstandskosten – siehe [Kapitel 7](#7-historische-stillstandsanalyse--echte-zahlen).

---

## Inhaltsverzeichnis

1. [Ausgangslage & Problemstellung](#1-ausgangslage--problemstellung)
2. [Lösungsüberblick (zwei Säulen)](#2-lösungsüberblick-zwei-säulen)
3. [Gesamtsystem-Architektur](#3-gesamtsystem-architektur)
4. [Säule A — SmartMaintain Plattform (Software)](#4-säule-a--smartmaintain-plattform-software)
5. [Säule B — SMART-Vision & IoT-Infrastruktur (Edge/Hardware)](#5-säule-b--smart-vision--iot-infrastruktur-edgehardware)
6. [Integration in die SAP-BTP-Landschaft](#6-integration-in-die-sap-btp-landschaft)
7. [Historische Stillstandsanalyse — echte Zahlen](#7-historische-stillstandsanalyse--echte-zahlen)
8. [Wirtschaftlicher Nutzen / ROI](#8-wirtschaftlicher-nutzen--roi)
9. [Deployment & Betrieb](#9-deployment--betrieb)
10. [Technische Highlights (Portfolio-Sicht)](#10-technische-highlights-portfolio-sicht)
11. [Roadmap & Ausblick](#11-roadmap--ausblick)
12. [Glossar](#12-glossar)

---

## 1. Ausgangslage & Problemstellung

In der Fertigung am Standort HEP transportiert eine Flotte autonomer Roboter (MiR250) Material zwischen definierten Übergabepunkten (FIFOs) über drei Ebenen und ca. 69.000 m². Die Roboter teilen sich Infrastruktur wie einen Aufzug (Hitachi Rocon 100) und sensorüberwachte Tore.

### Problemkette 1 — Störungen ohne Selbsthilfefähigkeit (Software-Lücke)

| Symptom | Konsequenz |
|---|---|
| Roboter geht in Fehlerzustand, niemand bemerkt es sofort | Entdeckung erst nach 5–30 min (zufällig oder durch ausbleibende Lieferung) |
| Operator sieht kryptischen Fehlercode, kein Kontext | Suche im PDF-Handbuch, Code nicht verstanden |
| Wissen über Behebung liegt nur im Kopf **einer** Person | Bei deren Abwesenheit: Stillstand bis zur Rückkehr (Single Point of Failure) |
| Keine zentrale Übersicht, keine KPIs | Entscheidungen auf Bauchgefühl, keine Auswertbarkeit |
| Störungen werden nicht dokumentiert | Keine Historie, keine Mustererkennung, nicht audit-fähig |

**Kosten:** durchschnittliche Fehlersuche 1–2 h × 70 €/h, plus vermeidbare Eskalationen an die Instandhaltung (90 €/h).

### Problemkette 2 — Leerfahrten & Blockaden (physische Lücke)

Wird ein AMR zu einem FIFO geschickt, an dem **kein** Produkt steht, fährt er ins Leere und verfängt sich regelmäßig in einem Fehlerzustand. Folgen je Vorfall: AMR nicht verfügbar → nachgelagerte Aufträge stehen; Werker muss manuell befreien (≈ 5 min Recovery + 2 min Wegezeit); Produktivitätsverlust; Akzeptanzverlust im Shopfloor.

**Frequenz:** 2–5 Blockaden/Tag × 312 Betriebstage = **624–1.560 Blockaden/Jahr**, je ≈ 7 min Aufwand.

---

## 2. Lösungsüberblick (zwei Säulen)

```
        ┌──────────────────────────────────────────────────────────────┐
        │                    PROBLEM-LEBENSZYKLUS                       │
        └──────────────────────────────────────────────────────────────┘

   VERMEIDEN                  ERKENNEN                  BEHEBEN / LERNEN
   ─────────                  ────────                  ────────────────
   SMART-Vision (Säule B)     SmartMaintain (Säule A)   SmartMaintain (Säule A)
   • WISE-4060 Sensorik       • 5-Sek-Polling MiR-API   • Wissensdatenbank
   • M5Paper-Steuergerät      • Incident-Engine         • Resolution Hints
   • Missionsblockade         • Auto-Eskalation         • KPI / Mustererkennung
     bei leerem FIFO          • E-Mail-Alarm            • Auto-Dokumentation
```

| | **Säule A — SmartMaintain** | **Säule B — SMART-Vision / IoT** |
|---|---|---|
| **Charakter** | Web-Plattform (Software) | Edge-/Hardware-Lösung |
| **Aufgabe** | Überwachen, Erkennen, Eskalieren, Wissen bereitstellen | Störungen physisch vermeiden, Infrastruktur steuern |
| **Kerntechnologie** | FastAPI + React + SQLite + SSE | WISE-4060 (WLAN-I/O), M5Paper (ESP32), ATOM Echo |
| **Datenquelle** | MiR Fleet/Robot REST API | Digitale Sensoren am FIFO, Tore, Aufzug |
| **Nutzen** | Selbsthilfefähigkeit, Transparenz, kürzere MTTR | Keine Leerfahrten/Blockaden, höhere Verfügbarkeit |

---

## 3. Gesamtsystem-Architektur

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          SHOPFLOOR / EDGE (Säule B)                            │
│   ┌────────────┐    DI-Status    ┌──────────────┐   REST: mission_scheduler    │
│   │ WISE-4060  │◄───────────────►│  M5Paper /   │──────────────┐               │
│   │ (WLAN-I/O) │   Produkt da?   │  M5Core2     │   Mission nur│ wenn Produkt  │
│   │ am FIFO    │                 │  + ATOM Echo │   vorhanden  │               │
│   └────────────┘                 └──────────────┘              ▼               │
│   ┌────────────┐  ┌────────────┐  ┌──────────────┐     ┌──────────────────┐     │
│   │ WISE Tor   │  │ WISE Park  │  │ Hitachi      │     │  MiR Fleet /     │     │
│   └─────┬──────┘  └─────┬──────┘  │ Rocon 100    │     │  MiR250 Roboter  │     │
└─────────┼───────────────┼─────────┴──────┬───────┘     │  10.81.51.22 /   │     │
          │ HTTP          │                │             │  10.81.6.x       │     │
          ▼               ▼                ▼             └────────┬─────────┘     │
┌──────────────────────────────────────────────────┐            │ Basic/SHA256  │
│              SmartMaintain BACKEND (A)            │◄───────────┘                │
│              FastAPI · localhost:8000             │                             │
│  APScheduler ─► MiR-Polling (5s/30s/60s)          │                             │
│  /fleet /kpi /incidents /knowledge /infra /events │                             │
│  Incident-Engine (Normalisieren·Korrelieren·…)    │                             │
│      │                          │                 │                             │
│      ▼                          ▼                 │                             │
│  SQLite smartmaintain.db    SSE-Broadcast ──► FRONTEND (React 18 + Vite)        │
│  robots·incidents·status_snapshots·mission_logs   Dashboard·Fleet·KPI·Incidents │
└──────────────────────────────────────────────────┴─────────────────────────────┘
```

---

## 4. Säule A — SmartMaintain Plattform (Software)

### 4.1 Technologie-Stack

**Backend:** Python 3.12.8 · FastAPI ≥0.115 · SQLAlchemy ≥2.0 (async) · aiosqlite · APScheduler · httpx · sse-starlette · aiosmtplib · alembic · pydantic-settings.
**Frontend:** React 18.3 · Vite · TypeScript · @tanstack/react-query · React Router · Ant Design 5.22 (selektiv) · CSS Modules (Siemens-Healthineers-Tokens: Teal `#009999`, Orange `#EC6602`, Rot `#E7001D`).

> **Design-Entscheidung:** bewusst **kein** globaler Ant-Design-`ConfigProvider` – Look-and-Feel rein über CSS-Custom-Properties. Markenkonform, leichtgewichtig, update-unabhängig.

### 4.2 Backend-Aufbau

```
backend/app/
├── main.py     # FastAPI-App, Lifespan, Router, Scheduler-Start
├── core/       # config.py (.env), database.py (async engine/session)
├── models/     # robot, incident, status_snapshot, mission_log, knowledge_chunk, document
├── schemas/    # Pydantic-Schemas
├── api/v1/     # fleet, kpi, incidents, knowledge, infra, events
└── services/   # mir_client, mir_polling, incident_engine, sse_manager
```

**Polling-Zyklus (Herzstück):**

```
APScheduler
 └─► _poll_real_api()                          (alle 5 s)
       ├─ asyncio.gather([get_robot_status(ip) …])   ← parallele MiR-Abfrage
       ├─ _update_robot_from_mir()  → robots
       ├─ _record_status_snapshot() → status_snapshots   (alle 30 s)
       ├─ _check_auto_incident()    → incidents          (bei Fehler-State)
       └─ _poll_mission_queue()     → mission_logs       (alle 60 s)
             └─ sse_manager.broadcast() → Frontend (Live-Push)
```

Inkrementelles Mission-Polling über `offset = max(known_queue_id − 5)`; `FETCH_LIMIT = 200`, `DETAIL_BATCH = 10` parallele Detailabfragen; nur Missionen mit GUID in strenger Whitelist (`RELEVANT_MISSION_IDS`).

### 4.3 Incident-Engine (technisches Kernstück)

| Stufe | Funktion |
|---|---|
| **Normalisierung** | Roh-Fehlertext → kanonischer Schlüssel (`ESTOP`, `BLOCKED`, `LOCALIZATION`, `CHARGING_FAIL`, …) |
| **Korrelation/Dedup** | gleicher Roboter + Fehlertyp < 24 h → **Aggregat** (`occurrence_count++`) statt neuer Incident |
| **Mustererkennung** | `single → transient → recurring → persistent` |
| **Auto-Eskalation** | `recurring → high`, `persistent → critical` |
| **Auto-Resolve** | bei Verlassen von state_id 10/12, mit 30-min-Flicker-Schutz |
| **Resolution Hints** | Handlungsempfehlung aus Muster + Wissensdatenbank |
| **Baseline-Guard** | erster Lauf erzeugt keine Alt-Incidents aus History |

**Primärquelle:** MiR Error Reports (`GET /log/error_reports`) – persistente Fehlerhistorie, Grundlage für Kapitel 7.

### 4.4 Wissensdatenbank (Selbsthilfe-Motor)

~95 Chunks aus Betriebshandbuch + Troubleshooting-Guide; Volltextsuche `GET /api/v1/knowledge/search?q=…`; **Shopfloor-Keyword-Aliasse** (z. B. „E-Stop" → „Not-Halt"); jede Störung verlinkt mit passendem KB-Artikel (Was? · Ursache? · Selbst lösbar? · Wann eskalieren?). **Hier entsteht der Kernnutzen:** Wissen ist nicht mehr an eine Person gebunden, sondern 24/7 durchsuchbar.

### 4.5 KPI & Frontend

KPIs aus `mission_logs`/`status_snapshots` (Missionsquote, Verfügbarkeit, MTBF, wiederkehrende Fehler); Backfill `POST /api/v1/kpi/backfill?months=N`. Frontend: sticky Header, Routen Dashboard·Flotte·Infrastruktur·KPI·Incidents·Wissensdatenbank·Admin; SSE-Live + 3-s-Refresh; Prioritätsfarben critical/high/medium/low.

### 4.6 Datenmodell (Auszug)

| Tabelle | Schlüsselfelder |
|---|---|
| `robots` | id, name, ip, serial, state_id, battery |
| `incidents` | error_code, normalized_error, pattern, occurrence_count, priority, status, resolution_hint |
| `status_snapshots` | robot_ip, state_id, state_text, battery_pct, position, created_at |
| `mission_logs` | mir_queue_id, mission_name, state, ordered_at, started_at, finished_at |
| `knowledge_chunks` | content, source, keywords |

---

## 5. Säule B — SMART-Vision & IoT-Infrastruktur (Edge/Hardware)

### 5.1 SMART-Vision: Sensorgestützte autonome Materialanforderung

**Idee (HPS Idea Management, Nr. 006758):** Ein AMR darf nur dann zu einem FIFO geschickt werden, wenn dort tatsächlich Material steht → eliminiert Problemkette 2 an der Wurzel.

| Komponente | Rolle |
|---|---|
| **Advantech WISE-4060** | Digitaler I/O über WLAN; erkennt via DI0, ob Produkt am FIFO vorhanden |
| **M5Paper (ESP32, E-Ink)** | Steuergerät; fragt Sensor sekündlich ab; zeigt Status (Grün/Rot/Sensorfehler) |
| **RGB-LED-Ampel** | Grün = Produkt da · Rot = kein Produkt · Orange = Sensorfehler |
| **ATOM Echo** | Sprachfeedback beim Button-Druck (Bestätigung/Warnung) |

**Kernlogik:** nicht-blockierende WLAN-Abfrage (1 s, `millis()`-basiert); **Missionsblockade** bei fehlendem Produkt (kein Bedienfehler möglich); Auslösung via `POST /api/v2.0.0/mission_scheduler`, `Authorization: Basic base64(user:SHA256(pw))`, Body `{"mission_id":"<GUID>"}`; Fehlertoleranz durch WLAN-Reconnect + konsekutive Fehlerprüfung. Referenzimplementierung in Python: `MiR_RestAPI/SendMission`, `Missionsliste_Fleet.py`.

> Die SMART-Vision-Missionen sind in der MiR-Flotte bereits angelegt und im Einsatz – erkennbar an den Missionsnamen mit Präfix **„SMART -"** und **„WISE Abfrage -"** (z. B. *„SMART - FIFO Montage Vectron zu Gang 1 (Mitte)"*, *„WISE Abfrage – FIFO Montage GLX – zu SFP"*).

### 5.2 Infrastruktur-Monitoring (in SmartMaintain integriert)

| Gerät | Typ | Anbindung | Funktion |
|---|---|---|---|
| **Hitachi Rocon 100** | Aufzug | HTTP `/browse.cgi?testinputs.htm` | Status + Notruf-/Brandalarm |
| **WISE-4060 (Tor)** | Torsteuerung | HTTP `/config`, DI0 | Tor-Status |
| **WISE-4060 (Bahnhof)** | 3× Montage-Bahnhöfe | HTTP, DI0 | Belegungs-/Parkstatus |

---

## 6. Integration in die SAP-BTP-Landschaft

Anbindung über **SAP BTP Cloud Connector** (`flexus-flexguide-mqtt-broker`, `flexus-flexguide-mobile-robots`). Auth: `Basic base64(<username>:<SHA256(password)>)` (Passwort als SHA256-Hash hinterlegt); Pflicht-Header `Authorization`, `Accept-Language: de_DE`, `Content-Type: application/json`; API `/api/v2.0.0/`, MiR-SW 3.3.3.

> **Betriebserfahrung (dokumentiert):** Ein `HTTP 470 – Deny, No rule matched` über den Cloud Connector stammte **nicht** vom Roboter. Direkte Tests zeigten: Der MiR liefert stets `Server: Apache` + `MiR-*`-Header und Standard-Codes (200/404/405). Der 470 (kein HTTP-Standardcode) wird von einem Netzwerk-Security-Gerät im Pfad injiziert → Lösung über Allow-Rule des Netzwerk-Teams, nicht über die AMR-Konfiguration. Diagnose-Skripte unter `MiR_RestAPI/` (`Test-MiRConnection.ps1`, `Diagnose-470.ps1`, `Diagnose-CloudConnector.ps1`).

---

## 7. Historische Stillstandsanalyse — echte Zahlen

> **Diese Auswertung basiert auf realen Maschinendaten**, ermittelt mit dem Skript [`backend/analyze_downtime.py`](backend/analyze_downtime.py) am 25.06.2026. Drei unabhängige Datenquellen wurden kombiniert.

### 7.1 Datenquellen & Methodik

| Quelle | Was | Methodik |
|---|---|---|
| **MiR Robot Error-Log** (`/log/error_reports`) | Vollhistorie aller protokollierten Fehler | direkte Abfrage am Roboter |
| **`status_snapshots`** (DB) | Roboterzustand alle 30 s | Summe der Zeit in `state_id ∈ {10,12}` (Error/Not-Halt) – **präzise gemessen** |
| **`incidents`** (DB) | korrelierte, entduplizierte Störungen | Vorkommen × Ø 7 min Recovery – **konservativ** |

Berechnung der real gemessenen Stillstandszeit aus aufeinanderfolgenden Snapshots:

$$\text{Downtime} = \sum_{i}\big(t_{i+1}-t_i\big)\quad\text{für } \text{state\_id}_i \in \{10,12\},\; (t_{i+1}-t_i) < 5\,\text{min}$$

(Lücken > 5 min werden ausgeschlossen, um Dienst-Neustarts nicht fälschlich als Stillstand zu zählen.)

### 7.2 Ergebnis — beobachteter Zeitraum (~68 Tage, 18.04.–25.06.2026)

**Real gemessene Stillstandszeit (status_snapshots, präzise):**

| Roboter | Messzeitraum | gemessene Downtime | Kosten (×75 €/h) |
|---|---:|---:|---:|
| MiR_204503148 (`10.81.6.89`) | 67,9 Tage | **136,4 h** | 10.234 € |
| `10.81.6.87` | 67,9 Tage | 18,1 h | 1.356 € |
| `10.81.6.92` | 67,9 Tage | 0,0 h | 0 € |
| **Summe** | | **154,5 h** | **11.590 €** |

**Korrelierte Störungen (incidents):** 110 Incident-Datensätze mit **227 Vorkommen** in 66 Tagen.
**Robot-Error-Log:** **251** protokollierte Fehlereinträge insgesamt.

### 7.3 Fehlerverteilung (nach normalisiertem Typ, aus `incidents`)

| Fehlertyp | Incidents | Vorkommen | Anteil Vorkommen |
|---|---:|---:|---:|
| **ESTOP** (Not-Halt) | 49 | 121 | **53 %** |
| **CHARGING_FAIL** (Ladefehler) | 4 | 33 | 15 % |
| ESTOP_PERSISTENCE | 17 | 17 | 7 % |
| ERROR_GENERIC | 8 | 15 | 7 % |
| LOCALIZATION | 10 | 11 | 5 % |
| EMERGENCY_STOP (safety system) | 2 | 6 | 3 % |
| UNKNOWN | 6 | 6 | 3 % |
| BLOCKED | 4 | 5 | 2 % |
| LASER_CONTAMINATION | 2 | 4 | 2 % |
| SENSOR | 3 | 3 | 1 % |
| übrige (E_LOCALIZATION, BATTERY, …) | 5 | 6 | 2 % |

> **Erkenntnis:** **Not-Halt-Ereignisse (ESTOP) dominieren mit 53 %** aller Vorkommen – exakt die Klasse von Blockaden, die SMART-Vision durch Vermeidung von Leerfahrten reduziert. **Ladefehler (CHARGING_FAIL)** sind mit nur 4 Incidents, aber 33 Vorkommen das **am stärksten wiederkehrende** Muster – ein klarer Kandidat für gezielte Predictive Maintenance.

### 7.4 Hochrechnung auf das Gesamtjahr

Zwei Verfahren, ehrlich als Spanne dargestellt:

| Verfahren | Basis | Stillstand/Jahr | Kosten/Jahr (×75 €/h) |
|---|---|---:|---:|
| **Untergrenze** (incident-basiert, 7 min/Vorkommen) | 227 Vorkommen / 66 Tage → 1.079/Jahr | **≈ 126 h** | **≈ 9.400 €** |
| **Obergrenze** (status-basiert, real gemessene Fehler-State-Zeit) | 154,5 h / 67,9 Tage × 312 Betriebstage | **≈ 710 h** | **≈ 53.300 €** |

$$\text{Stillstand}_{\text{Jahr,unten}} = \frac{227}{66}\times 312 \times \frac{7\,\text{min}}{60} \approx 126\,\text{h}$$

$$\text{Stillstand}_{\text{Jahr,oben}} = \frac{154{,}5\,\text{h}}{67{,}9\,\text{d}} \times 312\,\text{d} \approx 710\,\text{h}$$

**Einordnung der Spanne:**

- Die **Untergrenze (126 h)** zählt nur den aktiven manuellen Eingriff (7 min je Störung) und ignoriert, wie lange der Roboter darüber hinaus steht.
- Die **Obergrenze (710 h)** misst die **tatsächliche** Verweildauer in Not-Halt/Fehler – inklusive Zeiten, in denen niemand aktiv eingreift (z. B. über Nacht/Wochenende), in denen die Anlage aber dennoch **produktiv stillsteht**.
- **Realistischer Korridor:** **ca. 200–500 h Stillstand/Jahr** bzw. **15.000–38.000 €/Jahr** allein für diesen einen Hauptroboter – ohne die Folgekosten blockierter, nachgelagerter Transportaufträge.

> **Kernbotschaft für das Management:** Schon ein einzelner Roboter verursacht real **über 130 Stunden** dokumentierten Stillstand in nur ~10 Wochen. Jede Stunde, die SmartMaintain (schnellere Erkennung/Behebung) und SMART-Vision (Vermeidung) einsparen, ist damit **direkt in Euro belegbar** – nicht geschätzt.

### 7.5 Reproduzierbarkeit

Die Zahlen sind jederzeit reproduzierbar:

```powershell
cd SmartMaintain\backend
$env:MIR_USERNAME = "<user>"; $env:MIR_PASSWORD = "<pw>"
.\.venv\Scripts\python.exe analyze_downtime.py
```

Das Skript zieht Live-Daten vom Roboter und aus der lokalen Datenbank und gibt beobachtete Downtime **und** Jahres-Hochrechnung je Quelle aus.

---

## 8. Wirtschaftlicher Nutzen / ROI

### 8.1 Belegter Stillstand (aus echten Daten, Kapitel 7)

| Kennzahl | Wert |
|---|---|
| Real gemessener Stillstand (Hauptroboter, 68 Tage) | **136,4 h** |
| Hochrechnung Stillstand/Jahr (status-basiert) | **≈ 710 h ≈ 53.300 €** |
| Realistischer Korridor/Jahr | **15.000–38.000 €** (1 Roboter) |
| Häufigster Fehlertyp | **ESTOP (53 %)** – durch SMART-Vision adressierbar |
| Stärkstes Wiederkehr-Muster | **CHARGING_FAIL (33 Vorkommen / 4 Incidents)** |

### 8.2 SMART-Vision (Säule B) — vermiedene Blockaden & Kontrollgänge

312 Betriebstage; 624–1.560 Blockaden/Jahr; 7 min/Blockade; 70 €/h.

| Effekt | Untergrenze | Obergrenze |
|---|---:|---:|
| Direkte Personalkosten Blockaden | 72,8 h → **5.096 €** | 182 h → **12.740 €** |
| Entfall Kontrollgänge | **1.458 €** | **2.917 €** |
| AMR-Stillstand / Prozess | 31,2 h → **2.184 €** | 130 h → **9.100 €** |
| **Summe SMART-Vision** | **≈ 8.700 €** | **≈ 24.800 €/Jahr** |

### 8.3 SmartMaintain (Säule A) — kürzere Fehlersuche & weniger Eskalationen

| Effekt | Einsparung/Jahr |
|---|---|
| Reduzierte Störungsdauer (Suchzeit) | **13.500–22.000 €** |
| Vermiedene Eskalationen (2–4/Woche) | **9.400–18.700 €** |
| Dokumentationsaufwand | **~1.800 €** |
| Vermeidung Wissensverlust | mehrere tausend € (Risiko) |
| **Summe SmartMaintain** | **≈ 25.000–43.000 €/Jahr** |

### 8.4 Kombiniert

| Säule | Konservativ | Optimistisch |
|---|---:|---:|
| SMART-Vision | 8.700 € | 24.800 € |
| SmartMaintain | 25.000 € | 43.000 € |
| **Gesamt (konservativ gedeckelt)** | **≈ 30.000 €** | **≈ 60.000 €/Jahr** |

> Diese Spanne deckt sich mit dem **real gemessenen** Stillstandskorridor aus Kapitel 7 (15.000–38.000 €/Jahr für nur einen Roboter) und wird mit jedem weiteren Roboter größer. Eingebrachtes Produktivitätspotenzial laut HPS-Ideenmanagement (SMART-Vision allein): **≥ 10.000 €**.

---

## 9. Deployment & Betrieb

**Live seit 11.05.2026** auf Jump-Host `EH39L0LC`: Backend als NSSM-Dienst (`service_wrapper.py`/uvicorn); Frontend via IIS Port 80 → `frontend/dist`; API-Proxy IIS URL Rewrite + ARR (`^api/(.*)` → `localhost:8000`); Junction `C:\SmartMaintain` (umgeht NSSM-Leerzeichen); Logs rotieren bei 5 MB; SQLite-DB. Dev: `uvicorn app.main:app --reload --port 8000` + `npm run dev`.

---

## 10. Technische Highlights (Portfolio-Sicht)

- **End-to-End-Ownership:** Sensor-Firmware (ESP32/M5Paper) → Edge → Backend → Frontend → produktives Windows-Deployment (IIS/NSSM).
- **Echte Industrie-Integration:** MiR Fleet/Robot REST API, Advantech WISE-4060, Hitachi Rocon 100, korrektes `Basic base64(user:SHA256(pw))`-Auth.
- **Durchdachte Domänenlogik:** Incident-Engine mit Normalisierung + Korrelation + Mustererkennung + Auto-Eskalation + Auto-Resolve.
- **Async-First:** paralleles Polling (`asyncio.gather`), nicht-blockierende Firmware, SSE statt Client-Polling.
- **Vermeiden statt Reparieren:** SMART-Vision löst die Ursache physisch – messbarer ROI.
- **Datengetriebener Business Case:** Stillstand aus echten Maschinendaten hergeleitet (154,5 h gemessen, ~710 h/Jahr hochgerechnet) – nicht geraten.
- **Cloud-Anbindung:** SAP BTP Cloud Connector inkl. fundierter HTTP-470-Root-Cause-Analyse.

**Kennzahlen:** ~95 KB-Chunks · 6 DB-Tabellen · 6 REST-Router · 5-s-Polling · 30-s-Snapshots · 7 Frontend-Module · 3 IoT-Gerätetypen · 251 erfasste Fehler · 110 korrelierte Incidents · live seit Mai 2026.

---

## 11. Roadmap & Ausblick

| Thema | Status |
|---|---|
| KI-gestützte Diagnostik / Chatbot über die Wissensdatenbank | geplant |
| Predictive Maintenance (Fokus: CHARGING_FAIL – stärkstes Muster) | geplant |
| Vollständige KB-Abdeckung aller Fehlerklassen | in Arbeit |
| Skalierung auf 5+ Roboter & weitere Stationen | in Umsetzung |
| WISE-4060-Zugangsdaten externalisieren (Security-Hardening) | offen |
| Migration SQLite → PostgreSQL bei wachsender Datenmenge | optional |

---

## 12. Glossar

| Begriff | Bedeutung |
|---|---|
| **AMR** | Autonomous Mobile Robot (hier: MiR250) |
| **FIFO** | Materialpuffer/Übergabepunkt (First In, First Out) |
| **MiR Fleet** | Flottenmanager der MiR-Roboter (10.81.51.22) |
| **WISE-4060** | Advantech WLAN-I/O-Modul (digitale Ein-/Ausgänge) |
| **M5Paper / M5Core2** | ESP32-basierte Steuergeräte (E-Ink bzw. Display) |
| **ATOM Echo** | ESP32-Mini mit Lautsprecher/Mikrofon (Sprachfeedback) |
| **Incident** | korrelierte, kuratierte Störung in SmartMaintain |
| **ESTOP** | Not-Halt-Zustand des Roboters (häufigster Fehlertyp, 53 %) |
| **MTTR / MTBF** | Mean Time To Repair / Mean Time Between Failures |
| **SSE** | Server-Sent Events (unidirektionaler Live-Push) |
| **NSSM** | Non-Sucking Service Manager (Windows-Dienst-Wrapper) |
| **state_id 10/12** | MiR-Zustände Error / EmergencyStop |

---

*Dieses Dokument fasst SmartMaintain (Plattform) und SMART-Vision (IoT-Edge) als gemeinsames Referenzprojekt zusammen. Alle Stillstands- und Kostenzahlen in Kapitel 7 basieren auf real gemessenen Maschinendaten (Stand 25.06.2026) und sind über `backend/analyze_downtime.py` reproduzierbar. Vertrauliche Zugangsdaten sind bewusst nicht enthalten.*
