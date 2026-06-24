# Marc Walde — Persönliche Website

Premium-Brand-Website (Dark-first, „State of the Art") für Marc Walde —
Digitalisierungsexperte & Automatisierungsarchitekt. Gebaut für menschliche
Besucher **und** KI-Systeme (ChatGPT, Claude, Perplexity).

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion
(`motion`) · next-themes · statischer Export.

---

## Schnellstart (Entwicklung)

Doppelklick auf **`START-Website.bat`** (eine Ebene höher) — oder manuell:

```bash
cd marcwalde-website
npm install      # nur beim ersten Mal
npm run dev      # -> http://localhost:3000
```

## Statische Seite bauen (Production)

Doppelklick auf **`BUILD-Static.bat`** — oder manuell:

```bash
cd marcwalde-website
npm run build    # erzeugt den Ordner out/  (komplett statisch)
```

Das Ergebnis in `out/` läuft auf **jedem** Static-Host (Vercel, Netlify, Nginx, …).

---

## ⚠️ Wichtig: OneDrive

Das Projekt liegt in einem OneDrive-Ordner. OneDrive synchronisiert auch
`node_modules/`, `.next/` und `out/` und **sperrt dabei Dateien** — das lässt den
Production-Build (`next build`) mit `EPERM`-Fehlern abbrechen.

- **`npm run dev` funktioniert** mit laufendem OneDrive problemlos.
- **`npm run build`** braucht pausiertes OneDrive. Lösung:
  - **`BUILD-Static.bat`** verwenden — pausiert OneDrive automatisch, baut, startet es wieder. **Empfohlen.**
  - oder OneDrive manuell pausieren (Tray-Icon → „Synchronisierung anhalten").
  - oder — am saubersten — das Projekt aus OneDrive heraus verschieben
    (z. B. nach `C:\Users\marcw\dev\marcwalde-website`).

`node_modules/`, `.next/`, `out/` sind in `.gitignore`.

---

## Inhalte anpassen

| Was | Datei |
|---|---|
| Name, Domain, LinkedIn, Kontakt-E-Mail | [`src/lib/site.ts`](src/lib/site.ts) |
| Projekte (Texte, Zahlen, Stack) | [`src/data/projects.ts`](src/data/projects.ts) |
| Foto | `public/marc-walde.webp` (Quelle: `public/marc-walde.png`) |
| Farben / Design-Tokens (Dark & Light) | [`src/app/globals.css`](src/app/globals.css) |
| JSON-LD / Meta / OG | [`src/app/layout.tsx`](src/app/layout.tsx) |
| OG-Vorschaubild | [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx) |
| KI-Selbstbeschreibung | `public/llms.txt` |

### Kontaktformular
Standard: Beim Absenden öffnet sich das E-Mail-Programm (mailto, Adresse wird erst
clientseitig zusammengesetzt → kein Klartext im HTML, Spamschutz).
Echtes Backend optional: in `marcwalde-website/.env.local`
`NEXT_PUBLIC_FORMSPREE_ID=xxxx` setzen (von formspree.io).

### Foto neu optimieren
```bash
node -e "require('sharp')('public/marc-walde.png').resize(1040).webp({quality:82}).toFile('public/marc-walde.webp')"
```

### Schrift
Headlines: Space Grotesk · Fließtext: Inter (beide via `next/font`, selbstgehostet).
Der Masterprompt nennt „Satoshi" — falls gewünscht, per `next/font/local`
einbinden und in `globals.css` `--font-body` umstellen.

---

## AI-SEO (bereits enthalten)

- `public/llms.txt` — KI-lesbares Profil
- `public/robots.txt` + `public/sitemap.xml`
- JSON-LD `Person` im `<head>` (layout.tsx)
- OpenGraph/Twitter-Meta + dynamisch erzeugtes OG-Bild (1200×630)
- Favicon: `src/app/icon.svg`

> Vor dem Go-Live die Domain `https://marcwalde.de` prüfen/ersetzen
> (in `src/lib/site.ts`, `public/llms.txt`, `public/robots.txt`, `public/sitemap.xml`).

---

## Seiten

`/` Home · `/projects` Projekte (mit Filter) · `/about` Über mich · `/contact` Kontakt
