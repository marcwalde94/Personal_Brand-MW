import Link from "next/link";
import { ArrowRight, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { AuroraBackground } from "./aurora-background";
import { Magnetic } from "./magnetic";
import { Parallax } from "./parallax";

// Intro-Animation läuft per CSS (.intro) — kein JS nötig, kein Flash of unstyled/leerem Hero.
export function Hero() {
  return (
    <section className="grain relative overflow-hidden">
      <AuroraBackground />

      <div className="wrap-wide relative z-10 grid min-h-[100svh] items-center gap-14 pt-28 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24">
        {/* Linke Spalte — Text */}
        <div>
          <span className="intro eyebrow" style={{ animationDelay: "0.05s" }}>
            <Sparkles size={14} aria-hidden="true" />
            Digital Talent 2023/24 · Siemens Healthineers
          </span>

          <h1
            className="intro mt-6 font-display t-hero font-bold text-balance"
            style={{ animationDelay: "0.12s" }}
          >
            Prozesse, die wirklich{" "}
            <span className="text-gradient">funktionieren.</span>
          </h1>

          <p
            className="intro mt-6 max-w-xl t-lead text-muted text-pretty"
            style={{ animationDelay: "0.2s" }}
          >
            Ich baue digitale Systeme, die in der Realität halten was sie
            versprechen — messbar, skalierbar, und ohne dass jemand erklärt
            werden muss warum es nicht klappt.
          </p>

          <div
            className="intro mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.28s" }}
          >
            <Magnetic className="inline-block">
              <Link href="/contact" className="btn btn-primary w-full sm:w-auto">
                Projekt anfragen <ArrowRight size={18} />
              </Link>
            </Magnetic>
            <Magnetic className="inline-block">
              <Link href="/projects" className="btn btn-ghost w-full sm:w-auto">
                Projekte ansehen
              </Link>
            </Magnetic>
          </div>

          <p
            className="intro mt-8 flex items-center gap-2 text-sm text-faint"
            style={{ animationDelay: "0.36s" }}
          >
            <ShieldCheck size={15} className="text-emerald" aria-hidden="true" />
            Über 10 Jahre Shopfloor, IT &amp; Projektleitung — in einer Person.
          </p>
        </div>

        {/* Rechte Spalte — Porträt (mit sanftem Parallax) */}
        <Parallax className="mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto 3xl:max-w-[480px]">
          <div
            className="intro relative"
            style={{ animationDelay: "0.3s" }}
          >
            <div
              className="absolute -inset-5 rounded-[36px] bg-gradient-to-tr from-accent/35 via-accent2/25 to-emerald/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-black/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marc-walde.webp"
                width={1040}
                height={962}
                alt="Porträt von Marc Walde"
                className="h-auto w-full"
                loading="eager"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="anim-floaty absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl p-3 pr-4 glass shadow-xl shadow-black/30 sm:-left-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald/15 text-emerald">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-base font-bold leading-none text-emerald">
                  &gt; 200.000 €
                </span>
                <span className="mt-1 block text-xs text-muted">
                  jährlich eingespart · validiert
                </span>
              </span>
            </div>

            <div className="absolute -right-2 top-7 rounded-xl px-3 py-2 glass shadow-lg shadow-black/30 sm:-right-5">
              <span className="block font-display text-sm font-bold leading-none text-ink">
                1 / 7
              </span>
              <span className="mt-1 block text-[11px] text-muted">
                Digital Talent
              </span>
            </div>
          </div>
        </Parallax>
      </div>

      {/* Scroll-Hinweis */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <span className="anim-bob text-faint">
          <ChevronDown size={18} />
        </span>
      </div>
    </section>
  );
}
