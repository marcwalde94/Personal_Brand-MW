"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Tone = "emerald" | "accent" | "ink";

type Kpi = {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  tone: Tone;
};

const data: Kpi[] = [
  {
    target: 200000,
    prefix: "> ",
    suffix: " €",
    label: "Jährliche Einsparungen (validiert)",
    tone: "emerald",
  },
  {
    target: 5,
    suffix: "+",
    label: "Transformationsprojekte (End-to-End)",
    tone: "accent",
  },
  {
    target: 10,
    suffix: "+",
    label: "Jahre Industrie-Erfahrung",
    tone: "ink",
  },
];

const toneClass: Record<Tone, string> = {
  emerald: "text-emerald",
  accent: "text-accent-soft",
  ink: "text-ink",
};

function Counter({ kpi }: { kpi: Kpi }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(kpi.target);
      return;
    }
    const controls = animate(0, kpi.target, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, reduce, kpi.target]);

  return (
    <div ref={ref}>
      <div
        className={`font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${toneClass[kpi.tone]}`}
      >
        {kpi.prefix}
        {Math.round(val).toLocaleString("de-DE")}
        {kpi.suffix}
      </div>
      <p className="mt-3 text-sm text-muted sm:text-base">{kpi.label}</p>
    </div>
  );
}

export function KpiBand() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-3">
      {data.map((kpi) => (
        <div key={kpi.label} className="bg-bg2 px-6 py-10 text-center sm:py-12">
          <Counter kpi={kpi} />
        </div>
      ))}
    </div>
  );
}
