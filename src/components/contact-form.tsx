"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-xl border border-border bg-bg2/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-faint focus:border-accent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    // Echtes Form-Backend (optional, via .env aktivierbar)
    if (formspreeId) {
      setStatus("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (res.ok) {
          setStatus("sent");
          form.reset();
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
      return;
    }

    // mailto-Fallback — Adresse wird erst hier zusammengesetzt (nicht im HTML sichtbar)
    const to = `${site.emailUser}@${site.emailDomain}`;
    const subject = encodeURIComponent(`Anfrage über marcwalde.de — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nE-Mail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center justify-center p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald/15 text-emerald">
          <Check size={26} />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold">Danke!</h3>
        <p className="mt-2 max-w-sm text-muted">
          {formspreeId
            ? "Deine Nachricht ist angekommen. Ich melde mich zeitnah."
            : "Dein E-Mail-Programm sollte sich geöffnet haben. Falls nicht, schreib mir gern direkt auf LinkedIn."}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-ghost btn-sm mt-6"
        >
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 md:p-8">
      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dein Name"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="name@firma.de"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium">
            Nachricht
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Worum geht es? Ein, zwei Sätze genügen."
            className={`${fieldClass} resize-none`}
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-400">
            Da ist etwas schiefgegangen. Bitte später erneut versuchen oder via
            LinkedIn schreiben.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary mt-1 w-full disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Wird gesendet …
            </>
          ) : (
            <>
              Nachricht senden <Send size={17} />
            </>
          )}
        </button>
        <p className="text-center text-xs text-faint">
          Kein Tracking, keine Weitergabe. Deine Angaben landen direkt bei mir.
        </p>
      </div>
    </form>
  );
}
