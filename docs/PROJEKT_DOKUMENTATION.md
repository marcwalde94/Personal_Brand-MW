# QSR Dashboard – Vollständige Projektdokumentation

**Version:** 2.1.0 (Pilot-Release)  
**Stand:** März 2026  
**Plattform:** Angular 18 (Frontend) + FastAPI/Python (Backend)  
**Standort:** Siemens Healthineers, Werk Forchheim (HEP-06)

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Architektur](#2-architektur)
3. [Tech-Stack & Versionen](#3-tech-stack--versionen)
4. [Backend](#4-backend)
   - [API-Endpunkte](#41-api-endpunkte)
   - [Datenbank-Schema](#42-datenbank-schema)
   - [Services](#43-services)
   - [Scheduler](#44-scheduler)
   - [Konfiguration](#45-konfiguration)
5. [Frontend](#5-frontend)
   - [Komponenten](#51-komponenten)
   - [Datenmodelle](#52-datenmodelle)
   - [API-Service](#53-api-service)
6. [Fachliche Logik](#6-fachliche-logik)
   - [Email-Verarbeitung (KOMMT/GEHT)](#61-email-verarbeitung-kommtgeht)
   - [Dual-Mailbox (Grauraum + Reinraum)](#62-dual-mailbox-grauraum--reinraum)
   - [Einzelkapa vs. Sammelkapa](#63-einzelkapa-vs-sammelkapa)
   - [Sonderfälle](#64-sonderfälle)
   - [Raumtyp-Klassifizierung](#65-raumtyp-klassifizierung)
   - [Sensor-Namenszuordnung](#66-sensor-namenszuordnung)
   - [InfluxDB-Integration](#67-influxdb-integration)
   - [Screenshot-Einbettung](#68-screenshot-einbettung)
7. [Word-Dokument-Generierung](#7-word-dokument-generierung)
8. [Deployment & Betrieb](#8-deployment--betrieb)
   - [Frontend (IIS)](#81-frontend-iis)
   - [Backend (Windows-Dienst)](#82-backend-windows-dienst)
   - [Entwicklungsumgebung](#83-entwicklungsumgebung)
9. [Verzeichnisstruktur](#9-verzeichnisstruktur)
10. [Externe Systeme](#10-externe-systeme)

---

## 1. Projektübersicht

Das **QSR Dashboard** automatisiert die Verarbeitung von QSR-Alarm-E-Mails (Qualitätssicherungs-Reklamationen) am Siemens Healthineers Standort Forchheim. Das System:

1. **Empfängt** QSR-Alarm-E-Mails automatisch alle 10 Minuten aus **zwei Postfächern** (Grauraum + Reinraum) via Microsoft Graph API
2. **Parst** die E-Mails (KOMMT/GEHT-Paare) und extrahiert Sensor-, Kabinen- und Messwertdaten
3. **Speichert** die Meldungen in einer **SQL Server-Datenbank** (MSSQL)
4. **Visualisiert** alle Meldungen in einem Angular-Dashboard mit Filterung und Statusverwaltung
5. **Generiert** Word-Dokumente (Einzel-, Sammelkapa oder Sonderfall) über Content Controls
6. **Bettet Screenshots** der Original-E-Mail-Bodies als Bilder in die Dokumente ein
7. **Lädt** die Dokumente automatisch auf SharePoint hoch

---

## 2. Architektur

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Externe Systeme                              │
├──────────────┬──────────────┬───────────────┬───────────────────────┤
│ Outlook/     │ SharePoint   │ InfluxDB      │ Word Template         │
│ Graph API    │ (PVQSR)      │ (Sensordaten) │ (QSR_Vorlage.docx)   │
│ 2 Postfächer │ Dok-Upload   │ Grenzwerte    │ Content Controls      │
└──────┬───────┴──────┬───────┴───────┬───────┴───────────┬───────────┘
       │              │               │                   │
       ▼              ▼               ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (:8000)                          │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ EmailService │  │ SharePoint   │  │ InfluxDB     │               │
│  │ (Parsing)    │  │ Service      │  │ Service      │               │
│  └──────┬───────┘  └──────────────┘  └──────────────┘               │
│         │                                                           │
│  ┌──────▼───────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Scheduler    │  │ Document     │  │ Screenshot   │               │
│  │ (10 Min)     │  │ Service      │  │ Service      │               │
│  │ Dual-Mailbox │  └──────────────┘  │ (Playwright) │               │
│  └──────┬───────┘                    └──────────────┘               │
│         │           ┌──────────────┐  ┌──────────────┐               │
│         │           │ Plot         │  │ SensorName   │               │
│         │           │ Service      │  │ Service      │               │
│         │           └──────────────┘  └──────────────┘               │
│  ┌──────▼──────────────────────────────────────────────┐            │
│  │         SQL Server (MSSQL) Datenbank                 │            │
│  │         erlr14ra.ad005.onehc.net/PV_QSR              │            │
│  │                                                      │            │
│  │   Tabellen: qsr_meldungen, dateien                   │            │
│  └─────────────────────────────────────────────────────┘            │
└────────────────────────────┬────────────────────────────────────────┘
                             │ REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Angular 18 Frontend                               │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Dashboard    │  │ Sammelkapa   │  │ Archiv       │               │
│  │ (Karten)     │  │ (Aggregiert) │  │ (ag-Grid)    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                     │
│  Port: 4200 (Dev) / 8060 (IIS Prod)                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech-Stack & Versionen

### Frontend

| Paket | Version |
|---|---|
| Angular Core | ^18.2.0 |
| Angular CLI | ^18.2.11 |
| TypeScript | ~5.5.2 |
| RxJS | ~7.8.0 |
| Angular Material | ^17.0.0 |
| ag-Grid Angular | ^33.0.3 |
| zone.js | ~0.14.10 |
| exceljs | ^4.4.0 |
| @angular/ssr | ^18.2.11 |

### Backend

| Paket | Version | Zweck |
|---|---|---|
| FastAPI | 0.109.0 | Web-Framework |
| Uvicorn | 0.27.0 | ASGI Server |
| SQLAlchemy | 2.0.25 | ORM / Datenbank |
| pyodbc | 5.1.0 | SQL Server Treiber |
| Pydantic | 2.5.3 | Daten-Validierung |
| python-docx | 1.1.0 | Word-Dokument-Generierung |
| docx2pdf | 0.1.8 | DOCX → PDF Konvertierung |
| httpx | 0.26.0 | Async HTTP Client |
| requests | 2.31.0 | HTTP Client (Graph API) |
| influxdb-client | 1.38.0 | InfluxDB Abfragen |
| plotly | 5.18.0 | Sensorplots |
| kaleido | 0.2.1 | Plotly PNG-Export |
| python-dotenv | 1.0.0 | .env-Unterstützung |
| python-dateutil | 2.8.2 | Datum/Zeit-Utilities |
| tzdata | 2024.1 | Zeitzonen-Daten |

---

## 4. Backend

### 4.1 API-Endpunkte

Alle Endpunkte unter dem Prefix `/api/qsr` — insgesamt **29 Endpunkte**.

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/stats` | Dashboard-Statistiken (total, neu, in_bearbeitung, bearbeitet) |
| `GET` | `/meldungen` | Alle Meldungen mit Filter (status, kabine, limit, offset, sort) |
| `GET` | `/meldungen/open` | Nur offene Meldungen (status ≠ bearbeitet) |
| `GET` | `/meldungen/sammelkapa` | Sammelkapa-Meldungen (nach Sensor + 14-Tage-Zeitraum aggregiert) |
| `GET` | `/meldungen/archiv` | Archivierte/bearbeitete Meldungen |
| `GET` | `/meldungen/{id}` | Einzelne Meldung nach ID |
| `POST` | `/meldungen` | Neue Meldung erstellen |
| `PATCH` | `/meldungen/{id}` | Meldung aktualisieren (Status, Beschreibung, kapa_typ, Zeitraum etc.) |
| `DELETE` | `/meldungen/{id}` | Meldung löschen |
| `POST` | `/meldungen/{id}/bearbeiten` | Bearbeitung starten (Status → in_bearbeitung) |
| `POST` | `/meldungen/{id}/generate-document` | Einzel-Word-Dokument generieren |
| `POST` | `/meldungen/{id}/upload-sharepoint` | Einzel-Dokument auf SharePoint hochladen |
| `POST` | `/meldungen/{id}/complete` | Meldung abschließen (Dokument + SharePoint) |
| `POST` | `/meldungen/sonderfall/generate-document` | Sonderfall-Dokument generieren |
| `POST` | `/meldungen/sammelkapa/generate-document` | Sammelkapa Word-Dokument generieren |
| `POST` | `/meldungen/sammelkapa/upload-sharepoint` | Sammelkapa-Dokument auf SharePoint hochladen |
| `POST` | `/meldungen/sammelkapa/check-available` | Prüft verfügbare Meldungen für manuelles Sammelkapa |
| `POST` | `/sync-emails` | Email-Synchronisierung manuell triggern |
| `POST` | `/process-emails` | E-Mails verarbeiten (Background-Task) |
| `POST` | `/process-emails-sync` | E-Mails synchron verarbeiten |
| `POST` | `/reprocess/{id}` | Einzelne Meldung erneut verarbeiten |
| `GET` | `/kabinen` | Liste aller bekannten Kabinen (distinct) |
| `GET` | `/sensor-analysis/{sensor}` | Sensor-Analyse aus InfluxDB (Grenzwerte, Plot) |
| `GET` | `/sensor-auffaelligkeiten` | Auffälligkeiten/Grenzwertüberschreitungen für Sammelkapa |
| `GET` | `/sensors` | Alle eindeutigen Sensoren (für Dropdowns) |
| `POST` | `/meldungen/sonderfall/upload-sharepoint` | Sonderfall-Dokument auf SharePoint hochladen |
| `POST` | `/meldungen/{id}/upload-complete` | Upload + Abschluss in einem Schritt |
| `POST` | `/meldungen/sammelkapa/upload-complete` | Sammelkapa Upload + Abschluss |
| `POST` | `/meldungen/sonderfall/upload-complete` | Sonderfall Upload + Abschluss |

### 4.2 Datenbank-Schema

**Datenbank:** SQL Server (MSSQL)  
**Server:** `erlr14ra.ad005.onehc.net`  
**Datenbank:** `PV_QSR`  
**Treiber:** SQL Server Native Client 11.0  
**Benutzer:** `QSR_Reader`

#### Tabelle `qsr_meldungen`

| Spalte | Typ | Beschreibung |
|---|---|---|
| `id` | Integer, PK, Auto-Increment | Primärschlüssel |
| `ereignis_id` | String(50), Index | Event-ID aus E-Mail |
| `email_betreff` | String(500) | Original E-Mail-Betreff |
| `kabine` | String(200), Index, NOT NULL | z.B. "Kabine 674 Strahler Achse 13-14" |
| `sensor` | String(200), NOT NULL | AKS-Sensorbezeichnung |
| `fuehlerbezeichnung` | String(200) | Vollständige Fühlerbezeichnung |
| `sensor_display_name` | String(200) | Klarschrift-Sensorname |
| `werk` | String(100), NOT NULL | Standort |
| `flur` | String(50) | z.B. "Flur 6" |
| `raum` | String(100) | Raum |
| `alarm_typ` | String(50) | 'temperatur' oder 'druck' |
| `grenzwert_typ` | String(100) | "Obere Grenze" / "Untere Grenze" |
| `spezifikation` | String(200) | Grenzwertspezifikation z.B. "16°C - 29°C" |
| `eingetretener_wert` | String(100) | Tatsächlicher Messwert z.B. "29,59°C" |
| `kommt_zeit` | DateTime, NOT NULL, Index | KOMMT-Zeitpunkt |
| `kommt_email_id` | String(255) | Graph API Email-ID |
| `geht_zeit` | DateTime | GEHT-Zeitpunkt |
| `geht_email_id` | String(255) | Graph API Email-ID |
| `dauer` | String(100) | Formatierte Dauer z.B. "0d 0:11:54" |
| `email_body` | Text | HTML-Body der Original-E-Mail (für Screenshots) |
| `status` | String(20), Index | 'neu', 'in_bearbeitung', 'bearbeitet' |
| `bearbeiter` | String(100) | Bearbeiter-Name |
| `bearbeitet_am` | DateTime | Bearbeitungszeitpunkt |
| `beschreibung` | Text | Kommentar/Bewertung |
| `sofortmassnahmen` | Text | Durchgeführte Maßnahmen |
| `dokument_generiert` | Boolean | Word-Dokument erzeugt? |
| `dokument_pfad` | String(500) | Lokaler Dateipfad |
| `sharepoint_url` | String(500) | SharePoint-URL |
| `sharepoint_hochgeladen` | Boolean | Upload erfolgt? |
| `kapa_typ` | String(20), Nullable | 'einzelkapa', 'sammelkapa', 'sonderfall' oder NULL |
| `zeitraum_start` | String(20), Nullable | Sammelkapa-Zeitraum Start (ISO-Datum) |
| `zeitraum_ende` | String(20), Nullable | Sammelkapa-Zeitraum Ende (ISO-Datum) |
| `created_at` | DateTime | Erstellungszeitpunkt (auto) |
| `updated_at` | DateTime | Letzter Update (auto) |

#### Tabelle `dateien`

Speichert E-Mail-Screenshots und Anhänge.

| Spalte | Typ | Beschreibung |
|---|---|---|
| `QSRID` | Integer, FK → qsr_meldungen.id | **PK (Teil 1)** |
| `FileName` | String(50) | **PK (Teil 2)**, Dateiname |
| `CreatedOn` | DateTime | Zeitpunkt der Speicherung |
| `FileContent` | LargeBinary (VARBINARY) | Binärer Dateiinhalt |
| `ContentType` | String(100) | MIME-Typ (z.B. "image/png") |

**Zusammengesetzter Primärschlüssel:** `(QSRID, FileName)` — kein Auto-Increment.

### 4.3 Services

| Service | Datei | Beschreibung |
|---|---|---|
| **EmailService** | `services/email_service.py` | E-Mail-Abruf via Microsoft Graph API. Parst QSR-Alarm-Mails per Regex (KOMMT/GEHT-Erkennung, Ereignis-ID, Kabine+Achse, Temperatur, Fühler, Werk). Speichert E-Mail-Body für Screenshots. |
| **GraphAuthService** | `services/graph_auth_service.py` | OAuth2 Token-Management für Microsoft Graph API. Separate Tokens für E-Mail und SharePoint mit automatischem Caching/Refresh. |
| **SharePointService** | `services/sharepoint_service.py` | Upload zu SharePoint via Graph API. Site: `healthineers.sharepoint.com/teams/PVQSR`. Automatische Ordnerstruktur. |
| **DocumentService** | `services/document_service.py` | Word-Dokument-Generierung via python-docx. Verwendet ContentControlFiller mit Template `QSR_Vorlage.docx`. Unterstützt Einzel-, Sammel- und Sonderfälle. |
| **ContentControlFiller** | `services/content_control_filler.py` | Füllt Word-Templates über Structured Document Tags (Content Controls) statt einfacher Platzhalter-Ersetzung. |
| **ScreenshotService** | `services/screenshot_service.py` | Rendert E-Mail-HTML-Bodies via Playwright (Chromium headless) zu PNG-Screenshots. Speichert in DB-Tabelle `dateien`. Bettet Bilder optimal skaliert in Word-Dokumente ein. |
| **InfluxDBService** | `services/influxdb_service.py` | Sensordaten-Abfrage aus InfluxDB (`data_glt_pv` Bucket). Grenzwertvalidierung. MEZ→UTC Zeitzonenkonvertierung. |
| **PlotService** | `services/plot_service.py` | Erstellt Sensor-Plots mit Plotly (Temperatur/Feuchte). Erzeugt PNG für Word-Dokumente und Base64 für Frontend. |
| **QSRProcessingService** | `services/qsr_processing_service.py` | Orchestrator: E-Mail-Abruf → Parsing → Gruppierung → DB-Speicherung → Dokument-Generierung → SharePoint-Upload. |
| **SensorNameService** | `services/sensor_name_service.py` | Übersetzt technische AKS-Sensornamen in Klarschrift über `sensor_names.json`. Liefert korrekte Kabinennummern, Achsen, Bereiche. |

### 4.4 Scheduler

**Datei:** `scheduler.py`  
**Klasse:** `EmailScheduler`

- **Intervall:** 600 Sekunden (10 Minuten), konfigurierbar via `EMAIL_SYNC_INTERVAL`
- **Dual-Mailbox-Sync:** Iteriert über **beide** konfigurierten Postfächer (Grauraum + Reinraum)
- **Logik pro Postfach:**
  1. Holt die TOP 200 E-Mails aus dem letzten Monat (sortiert nach Datum)
  2. Gruppiert nach Ereignis-ID (max. 50 Events)
  3. Nur vollständige Paare (KOMMT + GEHT) werden gespeichert
  4. In-Memory Duplikat-Schutz über Postfach-Grenzen hinweg (`seen_eids` Set)
  5. Prüft auf existierende Ereignis-IDs in der DB → Update oder Insert
  6. Nach erfolgreichem DB-Commit: Emails in den „Processed"-Ordner verschieben
- **Singleton-Instanz**, gestartet im FastAPI Lifespan-Handler
- **Methoden:** `start()`, `stop()`, `manual_sync()`, `get_status()`
- **Status-API:** `/api/qsr/sync-emails` liefert `last_sync`, `next_sync`, `sync_count`, `error_count`

### 4.5 Konfiguration

**Datei:** `config.py` (liest aus `.env`)

| Parameter | Default-Wert | Beschreibung |
|---|---|---|
| `DATABASE_URL` | `mssql+pyodbc://...` (SQL Server) | SQL Server Verbindungsstring |
| `GRAPH_TENANT_ID` | `5dbf1add-202a-4b8d-815b-bf0fb024e033` | Azure AD Tenant |
| `GRAPH_MAILBOX` | `hep06prod.qsr.team@siemens-healthineers.com` | Grauraum-Postfach |
| `GRAPH_MAILBOX_REINRAUM` | `hep-rr.qsr.team@siemens-healthineers.com` | Reinraum-Postfach |
| `MAILBOX_CONFIG` | Dict: Grauraum + Reinraum → Raumtyp | Zuordnung Postfach → Raumtyp |
| `SHAREPOINT_SITE_URL` | `https://healthineers.sharepoint.com/teams/PVQSR` | SharePoint Site |
| `SHAREPOINT_LIBRARY` | `Documents` | Dokumentenbibliothek |
| `SHAREPOINT_TARGET_FOLDER` | `QSR F06 Fertigung/Softwarelösung` | Zielordner |
| `EMAIL_SUBJECT_FILTER` | `QSR-Alarm` | Subject-Filter für E-Mails |
| `EMAIL_PROCESSED_FOLDER` | `Processed` | Archivierungsordner |
| `EMAIL_SYNC_INTERVAL` | `600` (Sekunden) | Sync-Intervall |
| `EMAIL_SYNC_ENABLED` | `true` | Scheduler an/aus |
| `EMAIL_MAX_RESULTS` | `10` | Max E-Mails pro Abruf |
| `INFLUXDB_URL` | `http://fors379x.ad005.onehc.net:8089/` | InfluxDB-Server |
| `INFLUXDB_ORG` | `IT` | InfluxDB Organisation |
| `INFLUXDB_BUCKET` | `data_glt_pv` | InfluxDB Bucket |
| `INFLUXDB_MEASUREMENT` | `sensor_data_test` | InfluxDB Messung |
| `LOG_LEVEL` | `INFO` | Logging-Detailgrad |
| `CORS_ORIGINS` | `http://localhost:4200, http://127.0.0.1:4200` | Erlaubte CORS-Origins |

---

## 5. Frontend

### 5.1 Komponenten

| Komponente | Verzeichnis | Beschreibung |
|---|---|---|
| **QsrDashboardComponent** | `src/app/qsr/qsr-dashboard/` | Hauptkomponente (~860 Zeilen TS, ~740 Zeilen HTML). Standalone-Komponente mit Statusfilter, Stats-Cards, Bearbeitungs-Panel und Sammelkapa-Modal. |
| **QsrCardComponent** | `src/app/qsr/qsr-card/` | Einzelne Meldungs-Karte mit Status-Badge, Kabine, Sensor, Zeitangaben. |
| **SammelkapaCardComponent** | `src/app/qsr/sammelkapa-card/` | Sammelkapa-Karte mit SAMMEL-Badge, aggregierter Ansicht, Amber/Gelb-Farbschema. |
| **QsrArchivComponent** | `src/app/qsr/qsr-archiv/` | Archiv-Ansicht mit ag-Grid Tabelle für bearbeitete Meldungen. Zeigt `zeitraum_start` und `zeitraum_ende`. |

### 5.2 Datenmodelle

**Datei:** `src/app/models/qsr.models.ts` (~282 Zeilen)

**Wichtige Interfaces:**
- `QsrMeldung` – Hauptdatenmodell mit allen DB-Feldern inkl. `kapa_typ`, `zeitraum_start`, `zeitraum_ende`
- `QsrStatus` – Status-Typ ('neu' | 'in_bearbeitung' | 'bearbeitet')
- `BearbeitungsRequest` – Request-Body für Meldungsbearbeitung
- `SammelkapaMeldung` – Aggregierte Sammelkapa-Ansicht (sensor, kabine, zeitraum, meldungen[])
- `SammelkapaFilter` – Filter für Sammelkapa-Ansicht (sensor, kabine, raumtyp, zeitraum)
- `SammelkapaGenerateRequest` – Request für Sammelkapa-Dokument-Generierung

**Konstanten:**
- `STATUS_LABELS` – Deutsche Bezeichnungen für Status
- `STATUS_COLORS` – Farbzuordnung pro Status

### 5.3 API-Service

**Datei:** `src/app/services/qsr-api.service.ts` (~462 Zeilen)

Zentrale Serviceklasse mit 19+ Methoden:
- CRUD-Operationen für Meldungen
- Sammelkapa-Aggregation (Frontend-seitig, nicht Backend)
- Raumtyp-Ermittlung über Sensor-Pattern (`FQS.RR` → Reinraum, `FQS.PR` → Grauraum)
- Filter-Persistenz via LocalStorage

**Sammelkapa-Aggregationslogik:**
- Gruppiert Meldungen nach Sensor und 14-Tage-Zeiträumen (Montag–Sonntag)
- Zeigt Sammelkapa-Karten **nur** wenn Meldungen explizit `kapa_typ='sammelkapa'` gesetzt haben
- Verwendet gespeicherten Zeitraum (`zeitraum_start`/`zeitraum_ende`) wenn vorhanden

---

## 6. Fachliche Logik

### 6.1 Email-Verarbeitung (KOMMT/GEHT)

Jede QSR-Meldung besteht aus einem **KOMMT**- und **GEHT**-Ereignis:

- **KOMMT:** Alarm beginnt – enthält Sensor, Kabine, Messwert, Grenzwert
- **GEHT:** Alarm endet – enthält Zeitpunkt der Normalisierung

Beide werden über die **Ereignis-ID** zusammengeführt. Nur vollständige Paare (KOMMT + GEHT) werden als Meldung gespeichert. Die Dauer wird automatisch berechnet.

**Email-Parsing:** Regex-basiert, extrahiert:
- Ereignis-ID
- Fühlerbezeichnung (AKS-Code)
- Kabine + Achse (z.B. "Kabine 674 Strahler Achse 13-14")
- Messwert und Grenzwerte (Spezifikation + eingetretener Wert)
- Werk, Flur, Raum

**Flur-Parsing** mit mehreren Fallback-Stufen:
1. `Flur\s+(\d+)` im Plaintext
2. HTML-Tabelle `<td>Flur</td><td>06</td>`
3. Sensor-Name-Fallback `FQS.(RR|PR).06.` → Flur 06

**HTML-Body-Speicherung:** Der originale E-Mail-HTML-Body wird in der Spalte `email_body` gespeichert und dient als Grundlage für die Screenshot-Generierung.

### 6.2 Dual-Mailbox (Grauraum + Reinraum)

Das System überwacht **zwei Postfächer** gleichzeitig:

| Postfach | Raumtyp | Beschreibung |
|---|---|---|
| `hep06prod.qsr.team@siemens-healthineers.com` | **Grauraum** | Sensoren mit Pattern `FQS.PR` |
| `hep-rr.qsr.team@siemens-healthineers.com` | **Reinraum** | Sensoren mit Pattern `FQS.RR` |

Der Scheduler iteriert bei jedem Sync über beide Postfächer. Ein In-Memory `seen_eids` Set verhindert Duplikate über Postfach-Grenzen hinweg.

### 6.3 Einzelkapa vs. Sammelkapa

| Aspekt | Einzelkapa | Sammelkapa |
|---|---|---|
| **kapa_typ** | `'einzelkapa'` | `'sammelkapa'` |
| **Umfang** | Eine einzelne Meldung | Mehrere Meldungen eines Sensors in einem 14-Tage-Zeitraum |
| **Dokument** | Ein Word-Dokument pro Meldung | Ein Word-Dokument für alle Meldungen des Zeitraums |
| **Erstellung** | Direkt über Bearbeitungs-Panel | Über Sammelkapa-Modal (User wählt Zeitraum + Meldungen) |
| **Zeitraum** | Nicht relevant | User-gewählter Zeitraum wird in DB persistiert (`zeitraum_start`/`zeitraum_ende`) |
| **Dashboard** | Normale Karte | Amber/Gelbe Karte mit SAMMEL-Badge |

**Sammelkapa-Workflow:**
1. User öffnet Sammelkapa-Modal
2. User wählt Sensor und Zeitraum
3. System zeigt verfügbare Meldungen im Zeitraum
4. User bearbeitet (Beschreibung, Sofortmaßnahmen, Bearbeiter)
5. User speichert → Alle gewählten Meldungen erhalten `kapa_typ='sammelkapa'` + `zeitraum_start`/`zeitraum_ende`
6. Sammelkapa-Karte erscheint im Dashboard unter dem entsprechenden Status

### 6.4 Sonderfälle

Für Alarme, die nicht in das Standard-Einzelkapa- oder Sammelkapa-Schema passen:

- **kapa_typ:** `'sonderfall'`
- **Separate Endpunkte** für Dokumentgenerierung und SharePoint-Upload
- **Eigene Dokumentlogik** im Router mit Screenshot-Einbettung
- **Duplikat-Schutz:** Verwendet `seen_keys = set()` mit zusammengesetztem Schlüssel `(datei.QSRID, datei.FileName)` zur Deduplizierung von Screenshots

### 6.5 Raumtyp-Klassifizierung

Die Raumtyp-Zuordnung erfolgt **sensor-basiert** über das AKS-Pattern:

| Sensor-Pattern | Raumtyp |
|---|---|
| `FQS.RR` im Sensornamen | **Reinraum** |
| `FQS.PR` im Sensornamen | **Grauraum** |
| Alles andere | **unbekannt** |

Diese Logik ist konsistent im Backend (`_get_raumtyp()`) und Frontend (`getRaumtypFromSensor()`) implementiert.

### 6.6 Sensor-Namenszuordnung

**Service:** `SensorNameService` (Singleton)  
**Datenquelle:** `sensor_names.json` (~3846 Zeilen, 10 Top-Level-Keys)

Generiert mit `build_sensor_names.py` aus zwei Excel-Dateien:
1. `QSR Grundlage/HEP QSR Datenpunkt- und Messstellenliste.xlsx` – Bereich-Zuordnung, MSR-Stelle
2. `QSR Grundlage/Messstelllen mit Kabinenbezeichnung_Marc.xlsx` – Korrekte Kabinennummern, Achsen

**Lookup-Tabellen:**

| Key | Beschreibung |
|---|---|
| `sensor_lookup` / `measure_unit_fallback` | AKS → Display-Name |
| `kabine_lookup` / `kabine_fallback` | AKS → Kabine-Bezeichnung |
| `bereich_lookup` / `bereich_fallback` | AKS → Bereich (z.B. "VP Kabine", "Reinraum Temp / Feuchte") |
| `kabine_nr_lookup` / `kabine_nr_fallback` | AKS → korrekte Kabine-Nr (z.B. "Kabine 116") |
| `achse_lookup` / `achse_fallback` | AKS → vollständige Achse (z.B. "07-08-G-H") |

**Methoden:**
- `get_display_name(sensor)` – Kurzbezeichnung + Klarname
- `get_klarname(sensor)` – Nur der Klarname
- `get_kabine(sensor)` – Kabine-Bezeichnung aus Excel
- `get_kabine_nr(sensor)` – Korrekte Kabine-Nr
- `get_achse(sensor)` – Vollständige Achse
- `get_bereich(sensor)` – Bereich-Zuordnung
- `get_pilot_bereiche()` – Alle Pilot-relevanten Bereiche (PR06 + RR)
- `is_pilot_relevant(sensor)` – Prüft Pilot-Scope

### 6.7 InfluxDB-Integration

- **Server:** `fors379x.ad005.onehc.net:8089`
- **Bucket:** `data_glt_pv`
- **Org:** `IT`
- **Messung:** `sensor_data_test`
- **Zweck:** Sensordaten-Abfrage für Grenzwertanalyse und Plot-Generierung
- **Zeitzonen:** MEZ/MESZ (Europe/Berlin) ↔ UTC Konvertierung
- **Plots:** Plotly-Diagramme mit Grenzwertlinien und Abweichungsbereichen

### 6.8 Screenshot-Einbettung

**Service:** `ScreenshotService`  
**Technologie:** Playwright (Chromium headless)

1. **Rendering:** Der gespeicherte HTML-Body der E-Mail wird via Playwright zu einem PNG-Screenshot gerendert
2. **Speicherung:** Screenshots werden in der DB-Tabelle `dateien` mit zusammengesetztem PK `(QSRID, FileName)` gespeichert
3. **Einbettung:** Bei der Word-Dokumentgenerierung werden Screenshots aus der DB geladen und in das Dokument eingefügt
4. **Skalierung:** `_calc_image_size()` skaliert Bilder **immer auf die volle nutzbare Seitenbreite** (6.0"), Höhe proportional. Hohe Screenshots dürfen über eine Seite hinausgehen (Word bricht automatisch um)
5. **Deduplizierung:** Beim Sammelkapa und Sonderfall wird ein `seen_keys` Set mit `(datei.QSRID, datei.FileName)` Tupeln verwendet, um doppelte Screenshots zu verhindern

**Unterstützte MIME-Typen:** image/png, image/jpeg, image/gif, image/bmp, image/tiff, image/webp

---

## 7. Word-Dokument-Generierung

**Template:** `Template_filler/QSR_Vorlage.docx`  
**Methode:** Content Controls (Structured Document Tags)

Das System füllt Word-Templates über **Content Controls** (SDTs):
- Formatierung bleibt erhalten
- Tabellen und Bilder werden korrekt eingefügt
- Sensor-Plots (PNG) werden eingebettet
- **E-Mail-Screenshots** (PNG aus Playwright) werden eingebettet

**Dokumenttypen:**

| Typ | Endpunkt | Inhalt |
|---|---|---|
| **Einzelkapa** | `POST /{id}/generate-document` | Eine Meldung, ein Plot, ein Screenshot |
| **Sammelkapa** | `POST /sammelkapa/generate-document` | Mehrere Meldungen, aggregierte Daten, mehrere Screenshots |
| **Sonderfall** | `POST /sonderfall/generate-document` | Spezielle Meldungen, eigene Logik, Screenshots |

**Generierte Felder:** Kabine, Sensor, Flur, Zeitraum, Messwerte, Grenzwerte, Dauer, Beschreibung, Sofortmaßnahmen, Bearbeiter, Sensor-Plot, E-Mail-Screenshots.

---

## 8. Deployment & Betrieb

### 8.1 Frontend (IIS)

| Parameter | Wert |
|---|---|
| **Port** | 8060 |
| **Build-Output** | `dist/frontend/browser` |
| **Build-Befehl** | `ng build --configuration production` |
| **Server** | IIS (Windows) |
| **Server-IP** | `10.81.67.131` |
| **Deploy-Pfad** | `C:\inetpub\wwwroot\QSRDashboard` |

### 8.2 Backend (Windows-Dienst)

| Parameter | Wert |
|---|---|
| **Service-Name** | `QSR Backend V2` |
| **Port** | 8000 |
| **Service-Manager** | NSSM (Non-Sucking Service Manager) |
| **Python-venv** | `qsr-backend/venv/` |
| **Installation** | `install_service.bat` (als Administrator) |
| **Logs** | `qsr-backend/logs/service_stdout.log`, `service_stderr.log` |
| **Log-Rotation** | Automatisch bei 1 MB |
| **Neustart** | Automatisch bei Fehler (5s Verzögerung) |

**Service-Befehle:**
```batch
nssm stop "QSR Backend V2"     :: Dienst stoppen
nssm start "QSR Backend V2"    :: Dienst starten
nssm status "QSR Backend V2"   :: Status prüfen
nssm restart "QSR Backend V2"  :: Dienst neustarten
```

### 8.3 Entwicklungsumgebung

**Backend starten:**
```bash
cd qsr-backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend starten:**
```bash
ng serve
# → http://localhost:4200
```

**API-Dokumentation:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 9. Verzeichnisstruktur

```
QSR - Dashboard - NEU (SAMMELKAPA)/
│
├── src/                                 # Angular Frontend
│   └── app/
│       ├── models/
│       │   └── qsr.models.ts            # TypeScript Interfaces & Typen
│       ├── services/
│       │   └── qsr-api.service.ts       # API-Service + Sammelkapa-Aggregation
│       └── qsr/
│           ├── qsr-dashboard/           # Hauptkomponente (Dashboard)
│           ├── qsr-card/                # Einzelne Meldungs-Karte
│           ├── sammelkapa-card/         # Sammelkapa-Karte
│           └── qsr-archiv/             # Archiv-Ansicht
│
├── qsr-backend/                         # FastAPI Backend
│   ├── main.py                          # FastAPI App + Lifespan
│   ├── config.py                        # Konfiguration (.env)
│   ├── database.py                      # SQLAlchemy Setup (SQL Server)
│   ├── scheduler.py                     # Email-Sync-Scheduler (Dual-Mailbox)
│   ├── service_wrapper.py               # Windows-Dienst-Wrapper
│   ├── install_service.bat              # NSSM Service-Installation
│   ├── build_sensor_names.py            # Generator: Excel → sensor_names.json
│   ├── sensor_names.json                # AKS → Klarschrift Lookup (~3846 Zeilen)
│   ├── requirements.txt                 # Python-Abhängigkeiten
│   ├── create_sql_table.py              # SQL Server Tabellen-Erstellung
│   ├── create_dateien_table.py          # Dateien-Tabelle erstellen
│   ├── .env                             # Umgebungsvariablen (nicht im Git)
│   ├── .env.example                     # Vorlage für .env
│   │
│   ├── models/
│   │   ├── qsr_meldung.py              # SQLAlchemy Model: qsr_meldungen
│   │   └── qsr_datei.py                # SQLAlchemy Model: dateien (Screenshots)
│   ├── schemas/
│   │   └── qsr_schemas.py              # Pydantic Request/Response Schemas
│   ├── routers/
│   │   └── qsr_router.py               # Alle API-Endpunkte (~1900 Zeilen)
│   ├── services/
│   │   ├── email_service.py             # Graph API E-Mail-Abruf + Parsing
│   │   ├── graph_auth_service.py        # OAuth2 Token-Management
│   │   ├── sharepoint_service.py        # SharePoint Upload
│   │   ├── document_service.py          # Word-Dokument-Generierung
│   │   ├── content_control_filler.py    # Content Control Befüllung
│   │   ├── screenshot_service.py        # Playwright Screenshot + Word-Einbettung
│   │   ├── influxdb_service.py          # InfluxDB Sensordaten
│   │   ├── plot_service.py              # Plotly Sensor-Plots
│   │   ├── qsr_processing_service.py    # Orchestrator-Service
│   │   └── sensor_name_service.py       # Sensor-Klarschrift-Zuordnung
│   │
│   ├── output/                          # Generierte Dokumente + Plots
│   └── logs/                            # Log-Dateien
│
├── Template_filler/                     # Word-Templates
│   ├── QSR_Vorlage.docx                # Aktives Template (Content Controls)
│   └── QSR_Vorlage_ALT.docx            # Altes Template (Backup)
│
├── QSR Grundlage/                       # Referenzdaten (Excel)
│   ├── HEP QSR Datenpunkt- und Messstellenliste.xlsx
│   └── Messstelllen mit Kabinenbezeichnung_Marc.xlsx
│
├── angular.json                         # Angular Build-Konfiguration
├── package.json                         # npm Abhängigkeiten
├── tsconfig.json                        # TypeScript Konfiguration
├── PROJEKT_DOKUMENTATION.md             # Diese Dokumentation
├── VALIDIERUNGSDOKUMENT_QSR_DASHBOARD.md # Validierungsdokument
├── DEPLOYMENT_STATUS.md                 # Deployment-Status
└── README.md                            # Kurzübersicht
```

---

## 10. Externe Systeme

### Microsoft Graph API

**Zweck:** E-Mail-Abruf (2 Postfächer) + SharePoint-Upload  
**Tenant-ID:** `5dbf1add-202a-4b8d-815b-bf0fb024e033`

| Funktion | Client-ID | Mailbox/Site |
|---|---|---|
| **E-Mail (Grauraum)** | Konfiguriert in `.env` | `hep06prod.qsr.team@siemens-healthineers.com` |
| **E-Mail (Reinraum)** | Konfiguriert in `.env` | `hep-rr.qsr.team@siemens-healthineers.com` |
| **SharePoint** | `b6431824-3396-4925-a701-e990f26ee0b1` | `healthineers.sharepoint.com/teams/PVQSR` |

### InfluxDB

| Parameter | Wert |
|---|---|
| **URL** | `http://fors379x.ad005.onehc.net:8089/` |
| **Org** | `IT` |
| **Bucket** | `data_glt_pv` |
| **Messung** | `sensor_data_test` |

### SharePoint

| Parameter | Wert |
|---|---|
| **Site** | `https://healthineers.sharepoint.com/teams/PVQSR` |
| **Dokumentenbibliothek** | `Documents` |
| **Zielordner** | `QSR F06 Fertigung/Softwarelösung` |

### SQL Server

| Parameter | Wert |
|---|---|
| **Server** | `erlr14ra.ad005.onehc.net` |
| **Datenbank** | `PV_QSR` |
| **Treiber** | SQL Server Native Client 11.0 |
| **Benutzer** | `QSR_Reader` |
| **Tabellen** | `qsr_meldungen`, `dateien` |

---

## Statusfluss

```
┌───────┐     Bearbeitung     ┌──────────────────┐     Abschluss      ┌─────────────┐
│  NEU  │ ──────starten────── │ IN BEARBEITUNG   │ ───(Dokument +──── │  BEARBEITET  │
│       │                     │                  │    SharePoint)      │  (Archiv)    │
└───────┘                     └──────────────────┘                     └─────────────┘
                                                                              │
                                                                              ▼
                                                                     Archiv-Ansicht
                                                                     (ag-Grid Tabelle)
```

**KAPA-Typen im Abschluss-Workflow:**
- `einzelkapa` – Standard für eine einzelne Meldung
- `sammelkapa` – Aggregierte Meldungen eines Sensors im Zeitraum
- `sonderfall` – Spezielle Meldungen mit eigener Dokumentlogik

---

*Erstellt: Juni 2025 | Aktualisiert: März 2026 | QSR Dashboard V2.1.0 (Pilot-Release)*
