# Higgsfield Cinematic Hero — Upgrade-Playbook (für später)

> Wiederverwendbare Anleitung, um die Marc-Walde-Website mit einem **cinematischen,
> AI-generierten Hero** (3D-Scroll-Effekt) noch dynamischer zu machen — **sobald
> Higgsfield-Tokens vorhanden sind**. Bis dahin bleibt der bestehende Aurora-Hero aktiv.
> Aktuell **nicht** umgesetzt (keine Tokens). Diese Datei kostet nichts.

## Was wir bauen
Der virale „3D-Scroll" ist **kein** Three.js, sondern ein **Canvas-Image-Sequence-Scrub**:
Ein kurzer cinematischer Clip wird in ~180 nummerierte JPGs zerlegt, alle vorgeladen,
und das per Scroll-Fortschritt gewählte Frame auf ein `<canvas>` gezeichnet. Scrollen
spielt den Clip vor/zurück → wirkt wie premium 3D. Das „3D" kommt komplett aus dem
Higgsfield-Video. (Basis: `scroll-cinematic`-Skill.)

## Voraussetzungen
- **Higgsfield MCP** verbunden + Credits (~**$1–2** pro Hero, ~54 Credits / 1080p-Clip).
- **ffmpeg** (für das Zerschneiden der Frames). Auf Windows: `winget install Gyan.FFmpeg`
  oder statische Binary; das `scroll-cinematic`-Skill bringt `scripts/ensure-ffmpeg.sh` mit.

## Zwei Varianten für DIESE Seite

### Variante A — Abstrakter Brand-Loop (empfohlen)
Full-bleed Hintergrund **hinter** der bestehenden Headline/CTAs, ersetzt/ergänzt
`src/components/aurora-background.tsx`. Kein Personen-/IP-Risiko, immer moderationssicher.
- Look: langsam driftende Liquid-Metal-/Glas-/Partikel-Form in den Markenfarben
  (Indigo `#6366f1` → Violett `#8b5cf6` → Emerald `#34d399`), tiefes Dunkel `#090d18`.

### Variante B — Cinematisches Porträt
Sanfter Kamera-Orbit/Parallax um ein Porträt (sauberes 16:9-Quellbild nötig, dezent,
moderationsfreundlich formulieren). Wirkt persönlicher, etwas heikler bei Moderation.

## Schritt-für-Schritt (wenn Tokens da sind)

### 1. Keyframe erzeugen — Higgsfield `generate_image`
- Modell **`nano_banana_pro`**, 16:9.
- Prompt (Variante A, ready to paste):
  > „Abstract premium 3D render, flowing liquid-metal and glass ribbons, deep navy
  > background (#090d18), glowing indigo to violet to emerald gradient light, soft
  > volumetric haze, ultra sharp, photorealistic, 8k, editorial tech aesthetic,
  > centered composition, lots of negative space on the left for text."
- `job_display` pollen bis `status:"completed"`; **Job-`id` merken** (= Start-Frame fürs Video).

### 2. Clip erzeugen — Higgsfield `generate_video`
- Modell **`seedance_2_0`**, `resolution:"1080p"`, `aspect_ratio:"16:9"`, `duration:6`,
  `medias:[{role:"start_image", value:<keyframe-id>}]`, `declined_preset_id:"24bae836-2c4a-48e0-89b6-49fcc0b21612"`.
- Motion-Prompt (A): „elegant slow-morphing liquid-metal and glass form drifting and
  gently rotating, seamless loop, continuous motion, no hard cuts, stays centered."
- Preflight einmal mit `get_cost:true`. Bei `nsfw`/`failed` → refunded, neu wording oder
  `grok_video_v15` (720p, lenienter). Bei Erfolg `results.rawUrl` mit `curl` laden.

### 3. Frames schneiden (ffmpeg)
```bash
mkdir -p public/cinematic/frames
ffmpeg -i hero.mp4 -vf "fps=30,scale=1600:-1:flags=lanczos" -q:v 4 \
  public/cinematic/frames/frame_%04d.jpg
# Ergebnis: ~180 JPGs, 1600px breit, je <~80KB. Frame-Anzahl notieren.
```

### 4. In Next integrieren — `CinematicHero` (Client-Komponente)
Neue Datei `src/components/cinematic-hero.tsx` (Skizze — Engine wie im scroll-cinematic-Skill):
```tsx
"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const FRAME_COUNT = 180; // an Schnitt anpassen
const src = (i: number) =>
  `/cinematic/frames/frame_${String(i).padStart(4, "0")}.jpg`;

export function CinematicHero() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return; // reduced motion -> statisches erstes Frame / Aurora
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const im = new Image();
      im.src = src(i);
      im.onload = () => { if (++loaded === 1) draw(0); };
      imgs.push(im);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    function draw(p: number) {
      const idx = Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1)));
      const im = imgs[idx];
      if (!im?.complete) return;
      // cover-fit
      const cw = canvas.width, ch = canvas.height;
      const ir = im.width / im.height, cr = cw / ch;
      let w = cw, h = ch;
      if (ir > cr) { h = ch; w = ch * ir; } else { w = cw; h = cw / ir; }
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    }
    function onScroll() {
      const sec = canvas.closest("section")!;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      draw(p);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-full w-full"
    />
  );
}
```
- In `hero.tsx` `AuroraBackground` durch `CinematicHero` ersetzen **oder** beides
  schichten (Aurora als Fallback). Die `.intro`-Overlay-Copy (Headline/CTAs) bleibt 1:1.
- **Sticky-Stage** für vollen Scroll-Scrub: Hero-Section z. B. `min-h-[300vh]`, innen
  `sticky top-0 h-screen` (sonst spielt der Clip nicht über die Scroll-Distanz).
- **Fallback**: `prefers-reduced-motion` oder fehlende Frames → bestehender Aurora-Hero.

## Performance / Gotchas
- ~180 Frames, 1600px, q≈88 → schneller Load. Nicht mehr.
- Nur **kontinuierliche** Clips (keine Schnitte — rückwärts gescrubbt sonst hässlich).
- Frames liegen in `public/cinematic/frames/` → werden vom Static Export mitkopiert.
  Achtung: erhöht die Repo-/Build-Größe; ggf. via CDN auslagern.
- OneDrive: viele kleine Frame-Dateien → Build bevorzugt mit pausiertem OneDrive
  (`BUILD-Static.bat`).

## Checkliste
- [ ] Higgsfield-Tokens vorhanden
- [ ] Keyframe (nano_banana_pro) generiert, id notiert
- [ ] Clip (seedance_2_0, 1080p, 6s) generiert & geladen
- [ ] Frames geschnitten (Anzahl in `FRAME_COUNT` eintragen)
- [ ] `CinematicHero` eingebaut, Sticky-Stage + Fallback getestet
- [ ] Build grün, Screenshots mobil/desktop, reduced-motion geprüft
