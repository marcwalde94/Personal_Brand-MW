import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ProjectsExplorer } from "@/components/projects-explorer";
import { AskAiBlock } from "@/components/ask-ai-block";

export const metadata: Metadata = {
  title: "Projekte",
  description:
    "Zehn echte End-to-End-Transformationsprojekte mit validierten Ergebnissen: AMR-Flottenüberwachung (SmartMaintain), Wissensplattform (SmartLessons), digitaler Fabrikzwilling, MES-/OPC-UA-Integration, SAP-Automatisierung und das Omnibus-Schönfelder-Cockpit.",
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
          intro="Zehn echte Transformationsprojekte — von autonomer Intralogistik und digitalem Fabrikzwilling bis zum kompletten Operations-Cockpit. Jedes von Konzept bis in den stabilen Betrieb, mit dokumentierten Zahlen."
        />
      </section>

      <section className="wrap-wide py-12">
        <ProjectsExplorer />
      </section>

      <AskAiBlock />
    </>
  );
}
