import { Network, Workflow, Target, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

type Strength = {
  icon: LucideIcon;
  title: string;
  text: string;
};

const strengths: Strength[] = [
  {
    icon: Network,
    title: "Systemdenker",
    text: "Ich erkenne Muster in Prozessen, die andere erst nach langer Analyse sehen. Das macht mich schnell in der Diagnose — und präzise in der Lösung.",
  },
  {
    icon: Workflow,
    title: "End-to-End Ownership",
    text: "Ich übergebe keine halbfertigen Konzepte. Jedes Projekt, das ich starte, führe ich bis in den stabilen, nachgewiesenen Betrieb.",
  },
  {
    icon: Target,
    title: "Tiefenarbeit",
    text: "Wenn ein Problem komplex genug ist, arbeite ich mit einer Intensität, die Ergebnisse liefert, die andere in dieser Zeit nicht schaffen.",
  },
  {
    icon: Sparkles,
    title: "KI als natürliches Werkzeug",
    text: "Ich baue aktiv neue Workflows mit KI — keine passive Nutzung. Idee → Implementierung → Feedback → nächste Iteration. Das ist mein natürlicher Arbeitsmodus.",
  },
];

export function StrengthGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {strengths.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.08}>
          <div className="card h-full p-6 md:p-7">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-soft">
              <s.icon size={22} aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
              {s.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
