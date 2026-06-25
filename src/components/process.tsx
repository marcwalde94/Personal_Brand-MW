import { Search, PenTool, Hammer, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  text: string;
};

const steps: Step[] = [
  {
    n: "01",
    icon: Search,
    title: "Analyse",
    text: "Ich höre zu und seziere den Prozess — wo bricht er, was kostet das, wo liegt der größte Hebel.",
  },
  {
    n: "02",
    icon: PenTool,
    title: "Konzept",
    text: "Klare Lösung mit Zahlen statt Bauchgefühl: Aufwand, Nutzen, Risiken — abgestimmt mit allen Beteiligten.",
  },
  {
    n: "03",
    icon: Hammer,
    title: "Umsetzung",
    text: "Ich baue selbst — schnell, sauber, im engen Feedback-Loop. Keine halbfertigen Übergaben.",
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Stabiler Betrieb",
    text: "Bis es nachweisbar läuft: Tests, Schulung, Übergabe. Erst dann ist es für mich fertig.",
  },
];

export function Process() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal key={s.n} delay={i * 0.07}>
          <div className="card h-full p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-soft">
                <s.icon size={20} aria-hidden="true" />
              </span>
              <span className="font-display text-2xl font-bold text-faint">
                {s.n}
              </span>
            </div>
            <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
