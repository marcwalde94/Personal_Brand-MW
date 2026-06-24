import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SectionHeading } from "@/components/section-heading";
import { StrengthGrid } from "@/components/strength-grid";
import { AskAiBlock } from "@/components/ask-ai-block";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Marc Walde verbindet über 10 Jahre Shopfloor-Erfahrung mit Softwareentwicklung und Projektleitung auf CIO-Ebene. Systemdenker, End-to-End-Macher, KI-Multiplikator.",
  alternates: { canonical: "/about" },
};

const facts = [
  { label: "Arbeitgeber", value: "Siemens Healthineers (10+ Jahre)" },
  { label: "Ausbildung", value: "B.A. Management & Digitalisierung (2026)" },
  { label: "Qualifikation", value: "Industriemeister Elektrotechnik (IHK)" },
  { label: "Auszeichnung", value: "Digital Talent 2023/24 — 1 von 7" },
  { label: "Standort", value: "Bayern · Erlangen / München" },
];

const stack = [
  {
    group: "Automatisierung & Robotik",
    items: [
      "AMR / FTS (MiR-Systeme)",
      "IoT-Plattformen",
      "Industrie 4.0 / Smart Factory",
      "Aufzug- & Anlagenintegration",
    ],
  },
  {
    group: "Prozesse & Integration",
    items: ["SAP S/4HANA", "SimDia²", "N8n Workflow Automation", "FMEA", "Stage-Gate"],
  },
  {
    group: "Entwicklung",
    items: [
      "Python",
      "C# / .NET (WPF)",
      "TypeScript",
      "React",
      "FastAPI",
      "Node.js",
      "Tailwind CSS",
    ],
  },
  {
    group: "Künstliche Intelligenz",
    items: [
      "OpenAI API",
      "Prompt Engineering",
      "KI-gestützte Prozessautomatisierung",
    ],
  },
];

const timeline = [
  {
    org: "Siemens Healthineers",
    phase: "Shopfloor-Start",
    text: "Als Prüfer & Monteur begonnen — Produktionsprozesse von innen verstanden.",
  },
  {
    org: "IHK",
    phase: "Industriemeister Elektrotechnik",
    text: "Fundierte technische Leitungs- und Fachqualifikation erworben.",
  },
  {
    org: "Vom Anwender zum Entwickler",
    phase: "Eigene Automatisierungssysteme",
    text: "Produktionsnahe Software selbst gebaut — Python, .NET/WPF, SAP-Integration.",
  },
  {
    org: "bis CIO-Ebene",
    phase: "Projektleitung",
    text: "Interdisziplinäre Teams geführt, vor CIO-Ebene präsentiert, in Business Value gedacht.",
  },
  {
    org: "2023/24",
    phase: "Digital Talent Programm",
    text: "1 von 7 ausgewählten Talenten im konzernweiten Programm.",
  },
  {
    org: "2026",
    phase: "Bachelor Management & Digitalisierung",
    text: "Akademische Fundierung des seltenen Hybridprofils.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="wrap pt-32 pb-6 sm:pt-40">
        <PageHeader eyebrow="Über mich" title="Ich bin kein Standardfall." />
      </section>

      {/* Positionierung */}
      <section className="wrap py-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative mx-auto w-full max-w-[340px]">
                <div
                  className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-accent/30 via-accent2/20 to-emerald/15 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden rounded-[24px] border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/marc-walde.webp"
                    width={1040}
                    height={962}
                    alt="Porträt von Marc Walde"
                    className="h-auto w-full"
                  />
                </div>
              </div>

              <dl className="mt-8 space-y-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex flex-col border-b border-border pb-3 sm:flex-row sm:justify-between"
                  >
                    <dt className="text-xs uppercase tracking-widest text-faint">
                      {f.label}
                    </dt>
                    <dd className="text-sm font-medium sm:text-right">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <p className="font-display text-2xl font-medium leading-snug text-balance sm:text-[1.7rem]">
                Die meisten Menschen können entweder mit Maschinen reden, mit Code
                reden oder mit Management reden.{" "}
                <span className="text-gradient">Ich kann alle drei.</span>
              </p>
              <p className="text-lg leading-relaxed text-muted text-pretty">
                Das hat sich nicht durch Glück ergeben — sondern durch über 10
                Jahre, in denen ich mir jede Fähigkeit in der Praxis erarbeitet
                habe: erst als Prüfer und Monteur auf dem Shopfloor, dann als
                Entwickler eigener Automatisierungssysteme, dann als Projektleiter
                vor CIO-Ebene.
              </p>
              <p className="text-lg leading-relaxed text-muted text-pretty">
                Was mich dabei antreibt: Ich denke in Systemen. Ich sehe sofort, wo
                ein Prozess bricht — und was es braucht, damit er es nicht mehr tut.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stärken */}
      <section className="wrap py-20 sm:py-24">
        <SectionHeading
          eyebrow="Stärken"
          title="Wie ich arbeite."
          intro="Vier Eigenschaften, die sich in jedem Projekt wiederfinden."
        />
        <div className="mt-12">
          <StrengthGrid />
        </div>
      </section>

      {/* Tech-Stack */}
      <section className="wrap py-20 sm:py-24">
        <SectionHeading
          eyebrow="Werkzeugkasten"
          title="Tech-Stack — gewachsen, nicht gegoogelt."
          intro="Tiefe statt Logo-Sammlung: Werkzeuge, die ich in echten Projekten eingesetzt habe."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {stack.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.08}>
              <div className="card h-full p-6 md:p-7">
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {group.group}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Werdegang */}
      <section className="wrap py-20 sm:py-24">
        <SectionHeading
          eyebrow="Werdegang"
          title="Vom Shopfloor bis vor die CIO-Ebene."
        />
        <Reveal>
          <ol className="mt-12 space-y-9 border-l border-border pl-8">
            {timeline.map((t) => (
              <li key={t.phase} className="relative">
                <span
                  className="absolute -left-[2.1rem] top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-accent bg-bg"
                  aria-hidden="true"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <p className="text-xs uppercase tracking-widest text-faint">
                  {t.org}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                  {t.phase}
                </h3>
                <p className="mt-1 text-muted">{t.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <AskAiBlock />
    </>
  );
}
