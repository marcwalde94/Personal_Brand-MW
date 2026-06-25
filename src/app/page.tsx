import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { KpiBand } from "@/components/kpi-band";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { StrengthGrid } from "@/components/strength-grid";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { AskAiBlock } from "@/components/ask-ai-block";
import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";
import { featuredProjects } from "@/data/projects";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* KPI-Band */}
      <section className="wrap-wide relative z-20 -mt-8 sm:-mt-12">
        <Reveal>
          <KpiBand />
        </Reveal>
      </section>

      {/* Leistungen / Angebot */}
      <section className="wrap-wide section">
        <SectionHeading
          eyebrow="Leistungen"
          title="Was ich für dich baue."
          intro="Vom manuellen Prozess zur stabilen Lösung — ich übernehme von der Analyse bis in den nachgewiesenen Betrieb."
        />
        <div className="mt-12">
          <Services />
        </div>
      </section>

      {/* Projekte-Teaser (Beweis) */}
      <section className="wrap-wide section">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Ausgewählte Projekte"
            title="Echte Projekte. Echte Zahlen."
            intro="Jedes Projekt endet mit validierten Ergebnissen — kein Bauchgefühl, keine Schätzung."
          />
          <Reveal delay={0.1}>
            <Link href="/projects" className="btn btn-ghost btn-sm whitespace-nowrap">
              Alle Projekte ansehen <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ablauf / So arbeiten wir */}
      <section className="wrap section">
        <SectionHeading
          eyebrow="So arbeiten wir zusammen"
          title="Vier Schritte bis es läuft."
          intro="Transparent, ohne Risiko-Sprünge — du weißt immer, wo wir stehen."
        />
        <div className="mt-12">
          <Process />
        </div>
      </section>

      {/* Kurzprofil / Positionierung */}
      <section className="wrap section">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading eyebrow="Kurzprofil" title="Ich bin kein Standardfall." />
          <Reveal delay={0.1}>
            <p className="t-lead text-muted text-pretty">
              Die meisten Menschen können entweder mit Maschinen reden, mit Code
              reden oder mit Management reden. Ich kann alle drei.
            </p>
            <p className="mt-4 t-lead text-muted text-pretty">
              Was mich antreibt: Ich denke in Systemen. Ich sehe sofort, wo ein
              Prozess bricht — und was es braucht, damit er es nicht mehr tut.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 font-medium text-accent-soft transition-colors hover:text-ink"
            >
              Mehr über mich <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stärken-Preview */}
      <section className="wrap section">
        <SectionHeading
          eyebrow="Was mich unterscheidet"
          title="Vier Eigenschaften, die den Unterschied machen."
          center
        />
        <div className="mt-14">
          <StrengthGrid />
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="wrap section">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-card p-8 text-center md:p-14">
            <h2 className="font-display t-h2 font-bold text-balance">
              Bereit, deinen Prozess wirklich zu fixen?
            </h2>
            <p className="mx-auto mt-4 max-w-xl t-lead text-muted text-pretty">
              Beschreib in zwei Sätzen, woran es hakt — du bekommst eine ehrliche,
              konkrete Einschätzung. Keine Verkaufsschleife.
            </p>
            <div className="mt-8 flex justify-center">
              <Magnetic className="inline-block">
                <Link href="/contact" className="btn btn-primary">
                  Projekt anfragen <ArrowRight size={18} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      <AskAiBlock />
    </>
  );
}
