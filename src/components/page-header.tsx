import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <Reveal className="max-w-3xl">
      {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
      <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.6rem] lg:leading-[1.05]">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 text-lg leading-relaxed text-muted text-pretty">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
