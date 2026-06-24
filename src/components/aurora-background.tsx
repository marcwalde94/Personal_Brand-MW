import type { CSSProperties } from "react";

// Animierter Aurora-Hintergrund aus weichen Farbverläufen + feinem Punktraster.
// Reine CSS-Animation (kein JS) — performant und reduced-motion-tauglich.
const blob = (extra: CSSProperties): CSSProperties => ({
  position: "absolute",
  borderRadius: "50%",
  ...extra,
});

export function AuroraBackground() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="dotgrid absolute inset-0" />
      <div
        className="aurora-blob"
        style={blob({
          width: "42vw",
          height: "42vw",
          top: "-14vw",
          left: "-8vw",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.55), transparent 62%)",
          animation: "drift1 23s ease-in-out infinite alternate",
        })}
      />
      <div
        className="aurora-blob"
        style={blob({
          width: "40vw",
          height: "40vw",
          top: "-10vw",
          right: "-10vw",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.45), transparent 64%)",
          animation: "drift2 28s ease-in-out infinite alternate",
        })}
      />
      <div
        className="aurora-blob"
        style={blob({
          width: "36vw",
          height: "36vw",
          bottom: "-18vw",
          left: "38%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.30), transparent 66%)",
          animation: "drift3 31s ease-in-out infinite alternate",
        })}
      />
    </div>
  );
}
