import { ImageResponse } from "next/og";

// Beim Static Export wird das OG-Bild einmalig zur Build-Zeit erzeugt.
export const dynamic = "force-static";

export const alt = "Marc Walde — Digital Solutions Expert";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#090d18",
          backgroundImage:
            "radial-gradient(900px circle at 12% -10%, rgba(99,102,241,0.35), transparent 55%), radial-gradient(800px circle at 100% 110%, rgba(52,211,153,0.20), transparent 50%)",
          color: "#e8edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              fontSize: 30,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            MW
          </div>
          <div style={{ fontSize: 28, color: "#9aa6bd", display: "flex" }}>
            marcwalde.de
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#a5b4fc", display: "flex", marginBottom: 18 }}>
            Digitalisierung · Automatisierung · Industrie 4.0
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <div style={{ display: "flex" }}>Prozesse, die wirklich</div>
            <div style={{ display: "flex" }}>funktionieren.</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#34d399", display: "flex" }}>
              &gt; 200.000 €
            </div>
            <div style={{ fontSize: 22, color: "#9aa6bd", display: "flex" }}>
              jährlich eingespart
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#e8edf7", display: "flex" }}>
              10+
            </div>
            <div style={{ fontSize: 22, color: "#9aa6bd", display: "flex" }}>
              Jahre Erfahrung
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: "#a5b4fc", display: "flex" }}>
              10
            </div>
            <div style={{ fontSize: 22, color: "#9aa6bd", display: "flex" }}>
              E2E-Projekte
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
