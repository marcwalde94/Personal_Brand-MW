import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
      <h2 className="mt-5 font-display t-h2 font-bold text-balance">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 t-lead text-muted text-pretty">
          {intro}
        </p>
      )}
    </Reveal>
  );
}
