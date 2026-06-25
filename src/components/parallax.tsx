"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Sanftes Scroll-Parallax (relativ zum Seiten-Scroll). Bei Load y=0, kein Layout-Sprung.
export function Parallax({
  children,
  className,
  speed = 0.06,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => (reduce ? 0 : v * speed));

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
