# Higgsfield-Hero — Upgrade in EINEM Prompt

> **Zweck dieses Dokuments:** Wenn Higgsfield-Tokens da sind, soll der cinematische
> Hero in **einem einzigen Arbeitsgang** entstehen — ohne dass du dir die 6 Pipeline-
> Schritte merken musst. Du kopierst **einen Prompt** in Claude Code, der Rest läuft
> automatisch. Die technische Engine ist bereits in
> [`HIGGSFIELD-CINEMATIC-UPGRADE.md`](./HIGGSFIELD-CINEMATIC-UPGRADE.md) dokumentiert —
> dieses Dokument ist die **ausführbare Kurzform** plus eine ehrliche Empfehlung.

---

## 0. Lohnt sich das überhaupt? (Ehrliche Einschätzung)

**Kurzantwort: Ja — aber in der *zurückhaltenden* Variante, nicht im DuyuCare-Stil.**

Die Seite, von der du fasziniert bist ([duyucare.dops.agency](https://duyucare.dops.agency/),
Awwwards Honorable Mention, gebaut mit GSAP + React + WebGL + 3D + Video) ist ein
**Consumer-Brand** für Nahrungsergänzung/Skincare. Dort *ist* die visuelle Erfahrung das
Produkt — die Kaufentscheidung läuft über Emotion, Ästhetik, Impuls. Volles WebGL-Kino
ist da goldrichtig.

**Deine Seite verkauft das Gegenteil:** Substanz an B2B-Entscheider (CIOs, Werkleiter,
Mittelstand). Deine ganze Positionierung ist „echte Zahlen, kein Bauchgefühl, ohne
Buzzword-Bingo". Ein 6-Sektionen-WebGL-Feuerwerk würde genau diese Botschaft
**unterlaufen** — es signalisiert „Style over Substance", das Gegenteil deiner Stärke.
Dazu kommt: Ladezeit (schwere Frame-Sequenzen), laufende Kosten (Higgsfield-Credits) und
Wartung.

**Die richtige Dosis für dich:** **EIN** cinematischer Hero-Moment — ein abstrakter,
in deinen Markenfarben gehaltener Loop hinter der bestehenden Headline. Das hebt die
wahrgenommene Qualität spürbar, **ohne** ins Verkäuferische zu kippen. Kosten: ~**1–2 $**
einmalig, vollständig reversibel (Aurora bleibt als Fallback). Das ist kein „too much" —
das ist ein gezielter Premium-Akzent.

> **Faustregel:** DuyuCare-Vollausbau = nein (falsche Zielgruppe, verwässert deine
> Glaubwürdigkeit). EIN abstrakter Brand-Hero = ja (billig, reversibel, wertet auf).
> Das eigentliche „Wow" für *deine* Zielgruppe baust du ohne Higgsfield — siehe
> [`WEBSITE-OPTIMIERUNG.md`](./WEBSITE-OPTIMIERUNG.md), Abschnitt „Interaktiver
> Impact-Rechner".

---

## 1. Voraussetzungen (einmalig prüfen)

- [ ] **Higgsfield MCP** verbunden + Credits vorhanden (~54 Credits / 1080p-Clip, ~1–2 $).
- [ ] **ffmpeg** verfügbar (`winget install Gyan.FFmpeg` oder statische Binary).
- [ ] **OneDrive pausiert** während Frame-Erzeugung & Build (sonst Datei-Locks/`EPERM`).
- [ ] Du arbeitest im Ordner `marcwalde-website/`.

---

## 2. DER PROMPT (kopieren → in Claude Code einfügen → laufen lassen)

> Alles zwischen den Linien ist **ein** Prompt. Er enthält die komplette Pipeline,
> die exakten Modelle, den fertigen Bild-/Video-Prompt, die Next-Integration und die
> Abnahme-Kriterien. Claude führt ihn End-to-End aus.

---

```text
Baue den cinematischen Higgsfield-Hero für meine Next.js-Seite (marcwalde-website)
in der ZURÜCKHALTENDEN Variante A: ein abstrakter Brand-Loop hinter der bestehenden
Headline. Ziel: B2B-Premium, kein Verkaufskino. Aurora bleibt als Fallback. Arbeite
die Pipeline komplett selbst ab und melde dich nur bei einer Moderations-Ablehnung
oder zu wenig Credits.

KONTEXT/ENGINE: Lies vorher docs/HIGGSFIELD-CINEMATIC-UPGRADE.md (Engine + Gotchas)
und src/components/hero.tsx (dort wird AuroraBackground eingebunden). Markenfarben:
Indigo #6366f1 → Violett #8b5cf6 → Emerald #34d399 auf tiefem Navy #090d18.

1) KEYFRAME — Higgsfield generate_image, Modell nano_banana_pro, 16:9. Prompt:
   "Abstract premium 3D render, flowing liquid-metal and glass ribbons, deep navy
   background #090d18, glowing indigo to violet to emerald gradient light, soft
   volumetric haze, ultra sharp, photorealistic, 8k, editorial tech aesthetic,
   centered composition, generous negative space on the LEFT third for text."
   job_display pollen bis completed, die Job-id merken.

2) CLIP — Higgsfield generate_video, Modell seedance_2_0, resolution 1080p,
   aspect_ratio 16:9, duration 6, medias:[{role:"start_image", value:<keyframe-id>}],
   declined_preset_id:"24bae836-2c4a-48e0-89b6-49fcc0b21612". Motion-Prompt:
   "elegant slow-morphing liquid-metal and glass form drifting and gently rotating,
   seamless loop, continuous motion, no hard cuts, stays centered."
   Einmal get_cost:true preflighten. Bei nsfw/failed -> refunded, Wording entschärfen
   oder grok_video_v15 (720p) probieren. Bei completed results.rawUrl per curl laden.

3) FRAMES — ffmpeg (OneDrive vorher pausieren):
   ffmpeg -i hero.mp4 -vf "fps=30,scale=1600:-1:flags=lanczos" -q:v 4 \
     public/cinematic/frames/frame_%04d.jpg
   Frame-Anzahl notieren.

4) KOMPONENTE — Erstelle src/components/cinematic-hero.tsx als "use client"-Canvas-
   Komponente nach der Engine-Skizze in docs/HIGGSFIELD-CINEMATIC-UPGRADE.md:
   alle Frames vorladen, Frame 0 sofort zeichnen, Frame-Index aus Scroll-Fortschritt,
   cover-fit + HiDPI (devicePixelRatio cap 2), Redraw nur bei Indexwechsel. Bei
   useReducedMotion ODER fehlenden Frames -> KEIN Canvas rendern, AuroraBackground
   bleibt. FRAME_COUNT auf die echte Anzahl aus Schritt 3 setzen.

5) INTEGRATION in src/components/hero.tsx: CinematicHero als unterste Schicht HINTER
   AuroraBackground (Aurora als Fallback, z-Index darunter). Die .intro-Headline,
   CTAs und das Porträt bleiben 1:1 unverändert. Für vollen Scroll-Scrub die Hero-
   <section> auf min-h-[260vh] setzen, innen ein sticky top-0 h-[100svh] Wrapper um
   Canvas+Content (sonst spielt der Clip nicht über die Scroll-Distanz). Wenn das den
   Seitenfluss zu stark ändert, lieber als sanfter Auto-Loop (kein Scroll-Scrub) statt
   Sticky-Stage — entscheide nach Augenschein, Lesbarkeit der Headline hat Vorrang.

6) ABNAHME: npx tsc --noEmit muss grün sein. Dev-Server starten, Hero bei Theme
   dark UND light prüfen, reduced-motion prüfen (Aurora-Fallback muss greifen),
   Konsole sauber, Headline jederzeit lesbar (genug Kontrast/Overlay). Screenshot
   mobil + desktop. Public/cinematic/frames/ ist groß -> in .gitignore aufnehmen ODER
   bewusst committen und in der Antwort die zusätzliche Repo-Größe nennen.

Gib mir am Ende: was generiert wurde, Credits-Verbrauch, Frame-Anzahl, ob Sticky-
Scrub oder Auto-Loop gewählt wurde und warum, plus die Screenshots.
```

---

## 3. Nach dem Lauf — Qualitäts-Check (manuell)

- **Lesbarkeit zuerst.** Wenn die Headline auf dem Loop irgendwo schlecht lesbar wird:
  dunkleren Overlay-Verlauf links verstärken — *nicht* den Clip heller machen.
- **Mobil = statisch ok.** Auf kleinen Screens darf der Hero ruhig nur das erste Frame
  oder die Aurora zeigen (Performance > Effekt).
- **Gefällt nicht? Ein-Zeilen-Rückbau:** In `hero.tsx` `<CinematicHero />` entfernen —
  Aurora ist sofort wieder allein da. Kein Schaden, keine Reue.

## 4. Kostenrahmen

| Posten | Menge | Credits / $ |
|---|---|---|
| Keyframe (`nano_banana_pro`) | 1 | gering |
| Clip (`seedance_2_0`, 1080p, 6 s) | 1 | ~54 Credits |
| Retry-Puffer (Moderation) | 0–1 | bis ~54 Credits |
| **Summe realistisch** | — | **~1–2 $** |

> Mehr als einen Hero-Clip braucht diese Seite **nicht**. Wenn später Case-Study-
> Detailseiten kommen (siehe Optimierungs-Doc), kann *je Flaggschiff-Projekt* optional
> ein eigener kurzer Loop dazukommen — aber das ist Kür, nicht Pflicht.
