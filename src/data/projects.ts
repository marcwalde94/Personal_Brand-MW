// Echte Referenzprojekte, echte Zahlen.
// Inhalte abstrahiert aus den Projektdokumentationen — bewusst OHNE vertrauliche
// Detaildaten (interne Systeme, IPs, Material-/Idee-Nummern, personenbezogene Angaben).
// Alle €-Angaben sind dokumentierte, nachvollziehbare Modellrechnungen bzw. gemessene Werte.

export type ProjectCategory = "industrie" | "kunde";

export interface Kpi {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  index: string; // "01" … "10"
  title: string;
  org: string;
  category: ProjectCategory;
  categoryLabel: string;
  context: string;
  did: string[];
  result: string;
  kpis: Kpi[];
  stack: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "smartmaintain",
    index: "01",
    title: "SmartMaintain & SMART-Vision",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · AMR & IoT",
    context:
      "Blieb ein autonomer Roboter (AMR) stehen, dauerte die Fehlersuche 1–2 Stunden — das nötige Wissen steckte im Kopf einer einzigen Person.",
    did: [
      "Web-Plattform, die die gesamte MiR-Flotte live überwacht: automatische Störungserkennung, geführte Selbsthilfe und belastbare KPIs auf einer Oberfläche.",
      "Eigene IoT-Edge-Schicht (Industriesensorik + ESP32-Steuergeräte) verhindert Leerfahrten & Blockaden, bevor sie entstehen.",
      "Incident-Engine mit Mustererkennung & Auto-Eskalation; Anbindung an die MiR Fleet API und die SAP-BTP-Landschaft.",
    ],
    result:
      "Live im Produktivbetrieb. Aus echten Maschinendaten belegt: ~30.000–60.000 € vermeidbare Stillstandskosten pro Jahr.",
    kpis: [
      { value: "~710 h/Jahr", label: "Stillstand aus Maschinendaten belegt" },
      { value: "Live-Betrieb", label: "produktiv seit Mai 2026" },
    ],
    stack: [
      "FastAPI",
      "React",
      "IoT / ESP32",
      "MiR Fleet API",
      "OPC UA",
      "SAP BTP",
      "SQLite",
      "SSE",
    ],
    featured: true,
  },
  {
    id: "smartlessons",
    index: "02",
    title: "SmartLessons — Wissensplattform",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Plattform",
    context:
      "Wissen über Produktionsfehler erreichte nicht die richtigen Teams — und ging bei Schichtwechsel oder Personalwechsel verloren.",
    did: [
      "Plattform, die jeden Fehler in eine visuelle One-Point-Lesson überführt und in unter einer Minute automatisch an die betroffenen Teams verteilt.",
      "Intelligentes Routing nach Bereich/Produkt; rechtsverbindlicher Schulungsnachweis per digitaler Signatur.",
      "Mehrschicht-Architektur: Angular + .NET 8 + Python/FastAPI + MongoDB, angebunden an Azure AD und Adobe Acrobat Sign.",
    ],
    result:
      "Konservativ ≈ 134.000 € p.a. durch vermiedene Wiederholungsfehler — auditsicher nach ISO 13485 / 21 CFR Part 11.",
    kpis: [
      { value: "≈ 134.000 €", label: "Einsparpotenzial p.a." },
      { value: "< 1 Min", label: "vom Eintrag zur Schulung" },
    ],
    stack: [
      ".NET 8",
      "Angular",
      "FastAPI",
      "MongoDB",
      "Azure AD / Graph",
      "Adobe Sign",
      "Playwright",
    ],
    featured: true,
  },
  {
    id: "qsr-dashboard",
    index: "03",
    title: "QSR-Dashboard mit digitalem Fabrikzwilling",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Digital Twin",
    context:
      "Sicherheitskritische Qualitätsmeldungen wurden täglich manuell aus Postfächern gesucht, zugeordnet, in Word übertragen und abgelegt.",
    did: [
      "Durchgängige Automatisierung: Abruf, regelbasierte Ereignis-Zuordnung, Anreicherung mit Sensordaten aus dem digitalen Fabrikzwilling, automatische Dokumenten­generierung und revisionssichere Ablage.",
      "Zeitreihen-Analyse (InfluxDB) mit Grenzwert-Plots; Deeplinks in das 3D-Werksmodell.",
    ],
    result:
      "≈ 44.000 € Personalkosten p.a. eingespart — bei deutlich höherer Prozesssicherheit und voller Nachverfolgbarkeit.",
    kpis: [
      { value: "≈ 44.000 €", label: "Einsparung p.a." },
      { value: "Digital Twin", label: "Sensordaten-Anreicherung" },
    ],
    stack: [
      "FastAPI",
      "Angular",
      "SQL Server",
      "Microsoft Graph",
      "InfluxDB",
      "Playwright",
      "SharePoint",
    ],
    featured: true,
  },
  {
    id: "smartpulse",
    index: "04",
    title: "SmartPulse — Automatische Kit-Belieferung",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Automatisierung",
    context:
      "Für jedes Produkt musste manuell ermittelt werden, welche Röhre zu welchem Auftrag gehört — 10–15 Minuten pro Produkt, fehleranfällig.",
    did: [
      "24/7-Service, der SAP-Bewegungsdaten (über Snowflake) überwacht und vollautomatisch das korrekte Begleit-Etikett druckt.",
      "Produktionskritisch gebaut: atomares State-Handling, Self-Healing-Druck, Live-Monitoring-Dashboard.",
    ],
    result:
      "≈ 50.000–75.000 € p.a.; Fehlzuordnungen praktisch eliminiert; von Schichtbetrieb auf 24/7.",
    kpis: [
      { value: "50–75 T€", label: "Einsparung p.a." },
      { value: "24/7", label: "vollautomatisch & self-healing" },
    ],
    stack: ["Python", "Snowflake (SAP)", "ReportLab", "FastAPI", "React", "Tailwind"],
    featured: false,
  },
  {
    id: "anoden-identifikation",
    index: "05",
    title: "Fehlersichere Bauteil-Identifikation",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · OT/IT-Integration",
    context:
      "Ein qualitätsrelevantes Bauteil wurde per Auge mit einem Papier-Begleitschein abgeglichen — Zahlendreher und Verwechslungen inklusive.",
    did: [
      "Software-Middleware liest den optischen Code (DMC/GS1), prüft ihn in Echtzeit gegen das MES und gibt die Maschine nur bei nachgewiesener Freigabe frei — in unter einer Sekunde.",
      "Sichere Maschinenanbindung über OPC UA an eine S7-1500; append-only Audit-Trail für volle Rückverfolgbarkeit.",
    ],
    result:
      "≈ 28.000–67.000 € p.a. pro Station — als wiederverwendbare Blaupause für viele vergleichbare Stationen.",
    kpis: [
      { value: "< 1 Sek.", label: "statt Minuten manuell" },
      { value: "Blaupause", label: "konzernweit skalierbar" },
    ],
    stack: ["Python", "DMC / GS1", "SAP ME / MES", "OPC UA", "S7-1500"],
    featured: false,
  },
  {
    id: "lagerverwaltung",
    index: "06",
    title: "Digitale Lagerverwaltung & Inventarisierung",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Full-Stack",
    context:
      "Defekte Strahler wurden in Excel-Listen geführt; die Jahresinventur band mehrere Mitarbeiter über Tage, die tägliche Suche kostete laufend Zeit.",
    did: [
      "Produktive Web-App mit Echtzeit-Validierung gegen das SAP-Data-Warehouse (ODBC), zweistufigem Scan-Verfahren, FIFO-Logik und automatischer Kategorisierung.",
      "Zeitgesteuerter SAP-Abgleich, Excel-Export, produktiver Betrieb mit CI/CD über Azure Pipelines.",
    ],
    result:
      "≈ 35.000 € p.a. eingespart; Erfassungsfehler eliminiert; durchgängige Inventur-Transparenz.",
    kpis: [
      { value: "≈ 35.000 €", label: "Einsparung p.a." },
      { value: "Echtzeit-SAP", label: "Single Source of Truth" },
    ],
    stack: ["Angular", "Node.js / Express", "SQLite", "ODBC / SAP DWH", "Azure Pipelines"],
    featured: false,
  },
  {
    id: "9k-test",
    index: "07",
    title: "9K-Test Automatisierung (IEC 62304)",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Datenauswertung",
    context:
      "Jeder Röntgenstrahler durchläuft einen mehrstündigen 9K-Dauerlauf — die Auswertung der Messdaten erfolgte manuell und blockierte die Freigabe.",
    did: [
      "Software liest die Messrohdaten, bewertet alle Prüfkriterien deterministisch (inkl. eigener Schlupf- & Frequenz­analyse) und entscheidet auditierbar über Pass/Fail.",
      "Von Beginn an nach IEC 62304 (Software-Klasse B) entwickelt — mit Requirements-Traceability und lückenlosem Logging.",
    ],
    result:
      "≈ 31.250 € p.a.; Wegfall von bis zu 24 h Stillstand pro Strahler bei konsistenterer Prüfqualität.",
    kpis: [
      { value: "bis zu 24 h", label: "weniger Stillstand je Strahler" },
      { value: "IEC 62304", label: "normkonform & auditierbar" },
    ],
    stack: ["Python", "pandas / NumPy", "Plotly", "IEC 62304"],
    featured: false,
  },
  {
    id: "roehrenentnahme",
    index: "08",
    title: "Digitale Röhrenentnahme",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Shopfloor-App",
    context:
      "Rund 18.000 Röhren/Jahr wurden per Papierzettel beauftragt — 2–5 % gingen verloren und mussten aufwändig in SAP rekonstruiert werden.",
    did: [
      "Papierloser Step-by-Step-Workflow im Browser mit SAP-Echtzeitdaten (über Snowflake) und DataMatrix-Quittierung — kein Abtippen mehr.",
      "Automatischer Druckdienst im Hintergrund und visueller Lagerbestand mit Ampel-Logik.",
    ],
    result:
      "Verlustquote von 2–5 % auf 0 %; ≈ 8.700–13.200 € p.a.; vollständig auditsicher und papierlos.",
    kpis: [
      { value: "0 %", label: "Verlustquote (vorher 2–5 %)" },
      { value: "papierlos", label: "~18.000 Ausdrucke/Jahr gespart" },
    ],
    stack: ["Angular", "Python / Flask", "Snowflake (SAP)", "DataMatrix", "ReportLab"],
    featured: false,
  },
  {
    id: "smartalert",
    index: "09",
    title: "SmartAlert — Sekundär-Alarm-System",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie · Hardware & Safety",
    context:
      "Ein zeitkritischer, qualitätssensibler Ofenprozess wurde nur per manipulierbarem Timer überwacht — eine fehlprozessierte Charge kostet fünfstellig.",
    did: [
      "Manipulationssicheres, CE-konformes Sekundär-Alarmsystem (Siemens LOGO! 8) mit zweistufiger Eskalation und Failsafe — ganz ohne Eingriff in die Ofen-Originalsteuerung.",
      "Vollständiges Konstruktionspaket: Lastenheft, Schaltplan & Klemmenplan, Risikobeurteilung (EHS) und Inbetriebnahme-Protokoll.",
    ],
    result:
      "Verhindert fünfstellige Schäden je Fehlcharge — manipulationssicher und normkonform bei rund 810 € Materialeinsatz.",
    kpis: [
      { value: "5-stellig", label: "vermiedener Schaden je Charge" },
      { value: "CE / Failsafe", label: "EN ISO 7731 · DIN EN 60204-1" },
    ],
    stack: [
      "Siemens LOGO! 8",
      "Schaltschrankbau",
      "Risikobeurteilung",
      "EN ISO 7731",
      "DIN EN 60204-1",
    ],
    featured: false,
  },
  {
    id: "omnibus-schoenfelder",
    index: "10",
    title: "Omnibus Schönfelder: Website + Business-Cockpit",
    org: "Externes Kundenprojekt",
    category: "kunde",
    categoryLabel: "Kundenprojekt",
    context:
      "Vollständige digitale Transformation eines Busunternehmens in Bayern — eine Anfrage einmal erfassen statt vierfach.",
    did: [
      "Gebaut: Kundenwebsite + internes Operations-Cockpit (FastAPI + React + TypeScript + Tailwind).",
      "Automatische E-Mail-Buchungsverarbeitung via GPT-4o-mini; PDF-Dokumentengenerierung (Angebot, Auftragsbestätigung, Fahrauftrag, Rechnung).",
      "Digitale Fahrer-App + sipgate-AI-Telefon-Integration (Webhook → automatische Anfrageerkennung).",
    ],
    result:
      "Manuelle Dateneingabe in 4 Excel-Sheets → 1× eingeben → 4 Dokumente automatisch.",
    kpis: [
      { value: "1× statt 4×", label: "Eingabe je Anfrage" },
      { value: "4 Dokumente", label: "automatisch generiert" },
    ],
    stack: [
      "FastAPI",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "OpenAI API",
      "WeasyPrint",
      "sipgate Webhook",
    ],
    featured: false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
