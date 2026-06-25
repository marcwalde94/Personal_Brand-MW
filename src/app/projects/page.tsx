import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { AskAiBlock } from "@/components/ask-ai-block";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Fünf End-to-End Transformationsprojekte mit validierten Ergebnissen: AMR/FTS-Integration, SAP-Automatisierung, Python-Prüfalgorithmus, WPF-Ablösung und das Omnibus-Schönfelder-Cockpit.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="wrap pt-32 pb-6 sm:pt-40">
        <PageHeader
          eyebrow="Portfolio"
          title={
            <>
              Projekte, die in der Realität{" "}
              <span className="text-gradient">halten.</span>
            </>
          }
          intro="Von autonomer Intralogistik bis zum kompletten Digitalisierungs-Cockpit — jedes Projekt von Konzept bis in den stabilen Betrieb, mit dokumentierten Zahlen."
        />
      </section>

      <section className="wrap-wide py-12">
        <ProjectsExplorer />
      </section>

      <AskAiBlock />
    </>
  );
}
