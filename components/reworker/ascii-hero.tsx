"use client";

import React from "react";
import { ArrowRight, Presentation, ShieldCheck, UserCheck } from "lucide-react";
import { Persona, DEMO_PERSONAS } from "../navigation/top-nav";

interface AsciiHeroProps {
  currentPersona: Persona;
  onSelectPersona: (p: Persona) => void;
  onScrollToStudio: () => void;
  onScrollToMethod: () => void;
  onOpenPresentation?: () => void;
}

export function AsciiHero({
  currentPersona,
  onSelectPersona,
  onScrollToStudio,
  onScrollToMethod,
  onOpenPresentation,
}: AsciiHeroProps) {
  return (
    <section id="top" className="relative w-full pt-16">
      {/* Editorial Hero Container with Rounded Bottom */}
      <div className="relative isolate min-h-[520px] lg:min-h-[580px] overflow-hidden rounded-b-3xl bg-[#0f0f10] text-white flex flex-col justify-end">
        {/* Editorial Background Image with Quiet Contrast */}
        <div className="absolute inset-0 select-none overflow-hidden">
          <img
            src="/hero.jpg"
            alt="Verity Editorial Studio"
            className="size-full object-cover object-center filter grayscale contrast-[1.1] brightness-[0.32]"
          />
        </div>

        {/* Ambient Dark Charcoal Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-[#0f0f10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f10]/95 via-[#0f0f10]/60 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12 sm:py-16 w-full space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs text-white/90 backdrop-blur-md font-mono">
            <span className="size-2 rounded-full bg-[#f27d55]" />
            <span>Pre-Publication Brand & Video Script Governance</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white max-w-3xl leading-[1.15]"
          >
            Check your video scripts before you post.
            <span className="block text-white/60 font-normal mt-1">
              Never get an ad rejected or account strike again.
            </span>
          </h1>

          {/* Subtitle written in 100% human, plain English */}
          <p className="max-w-2xl text-base leading-relaxed text-white/80 font-normal">
            Instant rule scanner for creator captions, reels, and sponsorship copy. Catches unapproved claims, locks legal liabilities, and gives you 1-click compliant fixes.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onScrollToStudio}
              className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-white px-6 text-sm font-semibold text-black hover:bg-white/90 transition-colors shadow-sm"
            >
              <span>Paste Your Script in Studio</span>
              <ArrowRight className="size-4" />
            </button>

            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <Presentation className="size-4 text-[#f27d55]" />
                <span>See 5-Slide Walkthrough</span>
              </button>
            )}

            <button
              onClick={onScrollToMethod}
              className="inline-flex h-12 items-center rounded-lg border border-white/15 px-4 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              How It Works
            </button>
          </div>

          {/* One-Click Role Switcher inside Hero */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-3 text-xs">
            <span className="text-white/60 font-mono">Switch Active Role:</span>
            <div className="flex flex-wrap items-center gap-2">
              {DEMO_PERSONAS.map((p) => {
                const isActive = p.id === currentPersona.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPersona(p)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "border border-white/20 bg-white/10 text-white/80 hover:bg-white/20"
                    }`}
                  >
                    <UserCheck className="size-3.5" />
                    <span>{p.name.split(" ")[0]}</span>
                    <span className="text-[10px] opacity-70 font-mono uppercase">
                      ({p.role})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
