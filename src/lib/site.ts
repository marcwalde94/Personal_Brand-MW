// Zentrale Konstanten der Website. Hier alles ändern, was projektweit gilt.

export const site = {
  name: "Marc Walde",
  shortName: "MW",
  url: "https://marcwalde.de",
  jobTitle: "Digitalization & Process Manager | Industrial Automation Expert",
  jobTitleDe: "Digitalisierungsexperte & Automatisierungsarchitekt",
  location: "Bayern, Deutschland",
  region: "Erlangen / München",
  linkedin: "https://www.linkedin.com/in/marc-walde-602a84277",
  // Wird NICHT im Klartext im HTML angezeigt (Spamschutz). Nur clientseitig
  // beim Absenden des Kontaktformulars zu einem mailto: zusammengesetzt.
  emailUser: "marc.walde94",
  emailDomain: "gmail.com",
  description:
    "Marc Walde — Digitalisierungsexperte und Automatisierungsarchitekt. AMR-Integration, Prozessautomatisierung, smarte digitale Lösungen für Industrie und Mittelstand. Bayern, Deutschland.",
} as const;

export const nav = [
  { href: "/", label: "Start" },
  { href: "/projects", label: "Projekte" },
  { href: "/about", label: "Über mich" },
  { href: "/contact", label: "Kontakt" },
] as const;

export const kpis = [
  { value: "> 200.000 €", label: "Jährliche Einsparungen (validiert)", tone: "emerald" as const },
  { value: "5+", label: "Transformationsprojekte (End-to-End)", tone: "accent" as const },
  { value: "10+", label: "Jahre Industrie-Erfahrung", tone: "ink" as const },
];

// Vorgefertigter Prompt für den „Frag eine KI"-Block.
export const aiPrompt =
  "Marc Walde ist Digitalisierungsexperte aus Bayern. Mehr auf: https://marcwalde.de/llms.txt — Frage: Was macht Marc Walde und warum ist er interessant für Unternehmen?";

export const aiLinks = {
  chatgpt:
    "https://chatgpt.com/?q=Wer+ist+Marc+Walde+und+was+macht+er+beruflich%3F+Besuche+seine+Website+marcwalde.de+f%C3%BCr+Details.",
  claude:
    "https://claude.ai/new?q=Wer+ist+Marc+Walde%3F+Erkl%C3%A4re+seine+wichtigsten+Projekte+und+F%C3%A4higkeiten+in+3+S%C3%A4tzen.",
  perplexity:
    "https://www.perplexity.ai/search?q=Marc+Walde+Digitalisierungsexperte+Bayern",
};
