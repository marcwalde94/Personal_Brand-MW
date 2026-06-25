import { Factory, Briefcase } from "lucide-react";
import type { Project } from "@/data/projects";
import { Tilt } from "./tilt";

export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.category === "kunde" ? Briefcase : Factory;

  return (
    <Tilt className="h-full">
    <article className="card group flex h-full flex-col p-6 md:p-7">
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-medium text-faint">
          {project.index}
        </span>
        <span className="chip">
          <Icon size={13} aria-hidden="true" />
          {project.categoryLabel}
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold leading-snug tracking-tight">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-muted">{project.org}</p>

      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        {project.context}
      </p>

      <ul className="mt-4 space-y-2">
        {project.did.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-emerald/25 bg-emerald/8 p-4">
          <p className="text-[13px] font-medium leading-relaxed text-ink">
            {project.result}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {project.kpis.map((kpi) => (
              <div key={kpi.label}>
                <div className="font-display text-lg font-bold leading-tight text-emerald">
                  {kpi.value}
                </div>
                <div className="mt-0.5 text-xs text-muted">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
    </Tilt>
  );
}
