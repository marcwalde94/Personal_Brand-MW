"use client";

import { useState } from "react";
import { Check, Copy, ArrowUpRight } from "lucide-react";
import { aiLinks, aiPrompt } from "@/lib/site";
import { Reveal } from "./reveal";

const links = [
  { label: "ChatGPT fragen", href: aiLinks.chatgpt },
  { label: "Claude fragen", href: aiLinks.claude },
  { label: "Perplexity fragen", href: aiLinks.perplexity },
];

export function AskAiBlock() {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="wrap py-20 sm:py-28">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-card p-8 text-center md:p-14">
          <span className="eyebrow mb-6">Frag eine KI über Marc</span>
          <h2 className="mt-6 font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            Neugierig, aber gerade keine Zeit zu lesen?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">Frag direkt nach.</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                {link.label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-bg2/60 p-4 text-left">
              <p className="flex-1 font-mono text-xs leading-relaxed text-muted">
                {aiPrompt}
              </p>
              <button
                type="button"
                onClick={copyPrompt}
                className="btn btn-ghost btn-sm shrink-0"
                aria-label="Prompt kopieren"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Kopiert!" : "Kopieren"}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
