"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function PricingTiers() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
            Predictable Packaging
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            One membership, no reasons to delay.
          </h2>
        </div>

        {/* Billing Switcher matching Reworker */}
        <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 p-1 text-xs">
          <button
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-3.5 py-1 transition-colors ${
              !isAnnual
                ? "bg-card text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`rounded-full px-3.5 py-1 transition-colors flex items-center gap-1.5 ${
              isAnnual
                ? "bg-card text-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] text-accent font-semibold">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Two Clean Pricing Cards matching Reworker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tier 1: Growth & Agency Studio */}
        <div className="rounded-3xl border border-border/70 bg-card p-8 space-y-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground text-base">
                Agency & Marketing Team
              </span>
              <span className="rounded-full bg-muted border border-border/60 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                Team Tier
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-normal tracking-tight text-foreground tabular-nums">
                ${isAnnual ? "49" : "59"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">/ workspace / month</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed font-normal">
              Essential pre-publication checks for agencies, marketing leads, and content creators preventing routine terminology and tone drift.
            </p>

            <ul className="space-y-3 text-xs text-muted-foreground pt-4 border-t border-border/40">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground shrink-0" />
                <span>Deterministic Banned & Preferred Terminology Linter</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground shrink-0" />
                <span>Flesch-Kincaid Readability & Run-on Sentence Detection</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground shrink-0" />
                <span>Mammoth DOCX & PDF Guideline Ingestion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground shrink-0" />
                <span>Word-level Intent-Preserving Suggested Diffs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-foreground shrink-0" />
                <span>Creator & Manager Approval Workflows</span>
              </li>
            </ul>
          </div>

          <button className="w-full rounded-full border border-border bg-muted/40 hover:bg-muted py-2.5 text-xs font-medium text-foreground transition-colors shadow-xs">
            Start Free Agency Sandbox
          </button>
        </div>

        {/* Tier 2: Regulated Enterprise */}
        <div className="rounded-3xl border border-border/80 bg-[#0c0c0b] text-white p-8 space-y-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white text-base">
                Regulated Enterprise & Legal
              </span>
              <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[11px] font-mono text-white/90">
                High-Stakes Control
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-normal tracking-tight text-white tabular-nums">
                ${isAnnual ? "189" : "229"}
              </span>
              <span className="text-xs text-white/60 font-mono">/ workspace / month</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-normal">
              For financial services, healthcare, and enterprises requiring zero-hallucination citation verification and compliance reviewer sign-offs.
            </p>

            <ul className="space-y-3 text-xs text-white/80 pt-4 border-t border-white/15">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Everything in Agency Tier</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Citation Verification (Bitap & Token Fidelity)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Sensitive Claim Escalation & Creator Lock</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Guideline Clarity Dispute Heatmap Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>HMAC-SHA256 Tamper-Evident Audit Chain</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-white shrink-0" />
                <span>Dedicated Authorised Reviewer Sign-off Queue</span>
              </li>
            </ul>
          </div>

          <button className="w-full rounded-full bg-white text-black hover:bg-white/90 py-2.5 text-xs font-medium transition-colors shadow-xs">
            Deploy Regulated Workspace
          </button>
        </div>
      </div>
    </section>
  );
}
