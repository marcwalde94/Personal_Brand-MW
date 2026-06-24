import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { KpiBand } from "@/components/kpi-band";
import { SectionHeading } from "@/components/section-heading";
import { ProjectCard } from "@/components/project-card";
import { StrengthGrid } from "@/components/strength-grid";
import { AskAiBlock } from "@/components/ask-ai-block";
import { Reveal } from "@/components/reveal";
import { featuredProjects } from "@/data/projects";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* KPI-Band */}
      <section className="wrap relative z-20 -mt-8 sm:-mt-12">
        <Reveal>
          <KpiBand />
        </Reveal>
      </section>

      {/* Kurzprofil / Positionierung */}
      <section className="wrap py-20 sm:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Kurzprofil"
            title="Ich bin kein Standardfall."
          />
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-muted text-pretty">
              Die meisten Menschen können entweder mit Maschinen reden, mit Code
              reden oder mit Management reden. Ich kann alle drei.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
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

      {/* Projekte-Teaser */}
      <section className="wrap py-20 sm:py-28">
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

      {/* Stärken-Preview */}
      <section className="wrap py-20 sm:py-28">
        <SectionHeading
          eyebrow="Was mich unterscheidet"
          title="Vier Eigenschaften, die den Unterschied machen."
          center
        />
        <div className="mt-14">
          <StrengthGrid />
        </div>
      </section>

      <AskAiBlock />
    </>
  );
}
