"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "./project-card";
import { projects, type ProjectCategory } from "@/data/projects";

type Filter = "alle" | ProjectCategory;

const filters: { key: Filter; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "industrie", label: "Industrie" },
  { key: "kunde", label: "Kundenprojekt" },
];

export function ProjectsExplorer() {
  const [active, setActive] = useState<Filter>("alle");
  const reduce = useReducedMotion();

  const list =
    active === "alle" ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.key === "alle"
              ? projects.length
              : projects.filter((p) => p.category === f.key).length;
          const on = active === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                on ? "text-white" : "text-muted hover:text-ink"
              }`}
            >
              {on && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-accent to-accent2"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {f.label}{" "}
              <span className="opacity-55">{count}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        layout
        className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={reduce ? {} : { opacity: 1, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
