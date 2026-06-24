import type { Metadata } from "next";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { LinkedinIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt zu Marc Walde — Digitalisierungsexperte aus Bayern. Kurz beschreiben, worum es geht. Antwort meist innerhalb von 24 Stunden.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="wrap pt-32 pb-6 sm:pt-40">
        <PageHeader
          eyebrow="Kontakt"
          title={
            <>
              Lass uns über deinen{" "}
              <span className="text-gradient">Prozess</span> sprechen.
            </>
          }
          intro="Digitalisierungsprojekt, Automatisierung oder eine konkrete Idee — beschreib kurz, worum es geht. Ich antworte meist innerhalb von 24 Stunden."
        />
      </section>

      <section className="wrap py-12 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-5">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-center gap-4 p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/12 text-accent-soft">
                  <LinkedinIcon size={22} />
                </span>
                <span className="flex-1">
                  <span className="block font-display font-bold">LinkedIn</span>
                  <span className="block text-sm text-muted">
                    Direkt vernetzen & schreiben
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  className="text-faint transition-colors group-hover:text-ink"
                />
              </a>

              <div className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/12 text-emerald">
                  <Clock size={22} />
                </span>
                <h3 className="mt-4 font-display font-bold">Antwortzeit</h3>
                <p className="mt-1 text-sm text-muted">
                  Meist innerhalb von 24 Stunden — werktags oft schneller.
                </p>
              </div>

              <div className="card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/12 text-accent-soft">
                  <MapPin size={22} />
                </span>
                <h3 className="mt-4 font-display font-bold">Standort</h3>
                <p className="mt-1 text-sm text-muted">
                  {site.region} · {site.location}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
