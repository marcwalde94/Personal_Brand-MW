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
      <h1 className="mt-5 font-display t-h1 font-bold text-balance">
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
