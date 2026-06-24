import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LinkedinIcon } from "./icons";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="wrap py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-accent to-accent2 font-display text-sm font-bold text-white">
                {site.shortName}
              </span>
              <span className="font-display text-lg font-medium tracking-tight">
                {site.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.jobTitleDe}. Shopfloor, IT und Management — fließend in allen
              drei Sprachen. {site.location}.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <p className="text-xs font-medium uppercase tracking-widest text-faint">
                Navigation
              </p>
              <ul className="mt-4 space-y-3">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-faint">
                Kontakt
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    <LinkedinIcon size={16} /> LinkedIn
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    Kontaktformular <ArrowUpRight size={16} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-faint sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.
          </p>
          <p>Gebaut mit Next.js, TypeScript &amp; Tailwind — ohne Buzzword-Bingo.</p>
        </div>
      </div>
    </footer>
  );
}
