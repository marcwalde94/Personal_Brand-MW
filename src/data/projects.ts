// Echte Projekte, echte Zahlen — Quelle: Masterprompt (Copy nicht verändern).

export type ProjectCategory = "industrie" | "kunde";

export interface Kpi {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  index: string; // "01" … "05"
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
    id: "amr-fts",
    index: "01",
    title: "AMR/FTS Autonome Intralogistik",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie",
    context:
      "End-to-End Integration autonomer Roboter (MiR-Systeme) in regulierte Produktionsumgebung.",
    did: [
      "Stack: MiR-Roboter, IoT-Plattform, SAP S/4HANA-Anbindung, Aufzugintegration",
      "Teamführung: Logistik, Fertigung, IT, Real Estate, Quality, externe Partner",
    ],
    result:
      "Stabiler Serienbetrieb, bis zu 100.000 € Einsparpotenzial p.a., Blueprint für neue Werke.",
    kpis: [
      { value: "bis zu 100.000 €", label: "Einsparpotenzial p.a." },
      { value: "Serienbetrieb", label: "Stabil & ausgerollt" },
    ],
    stack: ["MiR-Roboter", "IoT-Plattform", "SAP S/4HANA", "Aufzugintegration"],
    featured: true,
  },
  {
    id: "sap-simdia",
    index: "02",
    title: "SAP-Automatisierung via SimDia²",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie",
    context:
      "Identifikation und Implementierung einer Automatisierungslösung für manuelle Excel→SAP-Prozesse.",
    did: [
      "Eigenständig von Konzept bis Rollout inkl. IT-Abstimmung und Nutzer-Schulungen",
    ],
    result: "ca. 60.000 € Einsparung p.a., deutlich höhere Prozessstabilität.",
    kpis: [
      { value: "ca. 60.000 €", label: "Einsparung p.a." },
      { value: "Excel → SAP", label: "Vollautomatisiert" },
    ],
    stack: ["SimDia²", "SAP", "Excel-Automatisierung"],
    featured: true,
  },
  {
    id: "python-pruefalgorithmus",
    index: "03",
    title: "Python-Prüfalgorithmus (9K-Test)",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie",
    context:
      "Eigenentwicklung eines Python-basierten Algorithmus zur Qualitätsprüfung in Gantry-Systemen.",
    did: [
      "Automatisierte Qualitätsprüfung statt manueller Kontrolle — direkt in der Linie",
    ],
    result: "18h Stillstandsreduktion pro Woche, ca. 24.000 € Einsparung p.a.",
    kpis: [
      { value: "18h / Woche", label: "Weniger Stillstand" },
      { value: "ca. 24.000 €", label: "Einsparung p.a." },
    ],
    stack: ["Python", "Bildverarbeitung", "Gantry-Systeme"],
    featured: false,
  },
  {
    id: "wpf-legacy",
    index: "04",
    title: "WPF Legacy-Ablösung (Druckanwendung)",
    org: "Siemens Healthineers",
    category: "industrie",
    categoryLabel: "Industrie",
    context:
      "Entwicklung einer .NET/WPF-Desktop-Anwendung als Ablösung instabiler Excel-Makros.",
    did: ["SAP-Datenanbindung via CSV-Verarbeitung, im Corporate Design"],
    result: "−90 % Bearbeitungszeit, über 20.000 € Einsparung p.a.",
    kpis: [
      { value: "−90 %", label: "Bearbeitungszeit" },
      { value: "über 20.000 €", label: "Einsparung p.a." },
    ],
    stack: [".NET / WPF", "C#", "SAP-CSV", "Corporate Design"],
    featured: false,
  },
  {
    id: "omnibus-schoenfelder",
    index: "05",
    title: "Omnibus Schönfelder: Website + Business-Cockpit",
    org: "Externes Kundenprojekt",
    category: "kunde",
    categoryLabel: "Kundenprojekt",
    context:
      "Vollständige digitale Transformation eines Busunternehmens in Bayern.",
    did: [
      "Gebaut: Kundenwebsite + internes Operations-Cockpit (FastAPI + React + TypeScript + Tailwind)",
      "Automatische E-Mail-Buchungsverarbeitung via GPT-4o-mini",
      "PDF-Dokumentengenerierung (Angebot, Auftragsbestätigung, Fahrauftrag, Rechnung)",
      "Digitale Fahrer-App + sipgate AI Telefon-Integration (Webhook → automatische Anfrageerkennung)",
    ],
    result:
      "Manuelle Dateneingabe in 4 Excel-Sheets → 1× eingeben → 4 Dokumente automatisch.",
    kpis: [
      { value: "1× statt 4×", label: "Eingabe je Anfrage" },
      { value: "4 Dokumente", label: "Automatisch generiert" },
    ],
    stack: [
      "FastAPI",
      "SQLite / PostgreSQL",
      "SQLAlchemy",
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "N8n",
      "WeasyPrint",
      "OpenAI API",
      "sipgate Webhook",
    ],
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
