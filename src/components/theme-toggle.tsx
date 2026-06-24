"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";
  // Vor dem Mount neutrales Label -> erste Client-Render == Server-Render (kein Hydration-Mismatch).
  const label = mounted
    ? isDark
      ? "Hellen Modus aktivieren"
      : "Dunklen Modus aktivieren"
    : "Farbschema umschalten";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted transition-colors hover:border-accent/50 hover:text-ink"
    >
      {mounted ? (
        isDark ? <Sun size={18} /> : <Moon size={18} />
      ) : (
        <span className="block h-[18px] w-[18px]" />
      )}
    </button>
  );
}
