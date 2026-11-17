"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface FooterWordmarkProps {
  onScrollToStudio: () => void;
}

export function FooterWordmark({ onScrollToStudio }: FooterWordmarkProps) {
  return (
    <footer className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-16 pb-20 space-y-16">
      {/* Closing Call to Action in Rounded Duotone Frame matching Reworker */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-[#0c0c0b] text-white p-8 sm:p-14 text-center space-y-6 shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 font-mono">
            <span className="size-1.5 rounded-full bg-accent" />
            <span className="text-[11px] uppercase tracking-wider">
              Zero Unverified Claims
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white leading-snug">
            Your next campaign is already written. <br />
            <span className="text-white/60">Make sure it's on-brand.</span>
          </h3>

          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed font-normal">
            Eliminate handoff breakdowns, protect regulatory posture, and verify citations before content ever reaches the public.
          </p>

          <div className="pt-2">
            <button
              onClick={onScrollToStudio}
              className="inline-flex items-center gap-2.5 rounded-full bg-white text-black hover:bg-white/90 px-6 py-3 text-xs sm:text-sm font-medium transition-transform active:scale-[0.98] shadow-sm group"
            >
              <span>Open Pre-Publication Studio</span>
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Width Typographic Wordmark & Team Accreditation */}
      <div className="border-t border-border/40 pt-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <div>
            <span className="text-foreground font-medium">Verity</span> · Team OPK (Shiva Shankar S, Sanjay V, D V Visvajit Chandran)
          </div>

          <div>
            Problem Statement by <span className="text-foreground font-medium">Inkloom AI</span> · Round 1 Submission
          </div>
        </div>

        {/* Giant Monolithic Wordmark matching Reworker Footer */}
        <div className="text-center select-none overflow-hidden py-6">
          <span className="font-extrabold tracking-tighter text-7xl sm:text-9xl md:text-[14rem] text-muted-foreground/15 uppercase block leading-none">
            VERITY
          </span>
        </div>
      </div>
    </footer>
  );
}
