import { Workflow, Truck, Code2, Bot } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { Tilt } from "./tilt";

type Service = {
  icon: LucideIcon;
  title: string;
  text: string;
  proof: string;
};

const services: Service[] = [
  {
    icon: Workflow,
    title: "Prozessautomatisierung",
    text: "Manuelle Excel-, SAP- und Papierprozesse werden zu automatischen Abläufen. Weniger Fehler, weniger Aufwand, planbare Stabilität.",
    proof: "Excel→SAP: ca. 60.000 € p.a. eingespart",
  },
  {
    icon: Truck,
    title: "Autonome Intralogistik (AMR/FTS)",
    text: "End-to-End Integration autonomer Roboter in reale, regulierte Produktion — von der Idee bis zum stabilen Serienbetrieb.",
    proof: "bis zu 100.000 € p.a. Einsparpotenzial",
  },
  {
    icon: Code2,
    title: "Individuelle Software & Web-Apps",
    text: "Maßgeschneiderte Tools statt instabiler Workarounds: FastAPI, React, .NET — sauber gebaut, im Corporate Design, wartbar.",
    proof: "WPF-Ablösung: −90 % Bearbeitungszeit",
  },
  {
    icon: Bot,
    title: "KI- & Workflow-Automation",
    text: "KI dort, wo sie wirklich Arbeit abnimmt: automatische Daten- & E-Mail-Verarbeitung, Dokumente, Schnittstellen — von der Idee bis zum Rollout.",
    proof: "Cockpit: 1× eingeben → 4 Dokumente automatisch",
  },
];

export function Services() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {services.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.07}>
          <Tilt className="h-full">
            <div className="card h-full p-6 md:p-7">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-soft">
                <s.icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                {s.text}
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald"
                  aria-hidden="true"
                />
                {s.proof}
              </p>
            </div>
          </Tilt>
        </Reveal>
      ))}
    </div>
  );
}
