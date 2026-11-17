"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export function ThreeStepMethod() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "Catch banned claims before you hit publish",
      tagline: "Write normally. Verity catches unapproved claims, false guarantees, and banned hype terms before you post.",
      image: "/method-1.jpg",
      imageAlt: "Creator desk with script and notebook",
      benefitTitle: "What this does for you:",
      benefitPoints: [
        "Instantly scans your video captions, reels, and sponsorship copy against official advertising and brand safety guidelines.",
        "Catches sensitive claims like '100% cure' or 'guaranteed returns' that cause ad account bans and strike penalties.",
        "Works with plain text, pasted captions, and uploaded documents in under 10 milliseconds."
      ],
    },
    {
      num: "02",
      title: "Instant 1-click compliant rewrites",
      tagline: "No legal confusion. Get natural-sounding replacements that keep your message engaging and 100% compliant.",
      image: "/method-2.jpg",
      imageAlt: "Editorial script review and approved replacements",
      benefitTitle: "What this does for you:",
      benefitPoints: [
        "Shows you the exact flagged words side-by-side with approved, natural-sounding replacements.",
        "Click 'Accept Fix' to update your script instantly, or edit with your own preferred wording.",
        "Quotes the exact brand rule so creators know why the change was made without memorizing legal policies."
      ],
    },
    {
      num: "03",
      title: "Safe publication with zero account strikes",
      tagline: "Automated legal protection and clear team sign-off for creators, brand managers, and legal reviewers.",
      image: "/method-3.jpg",
      imageAlt: "Approved script ready for publication",
      benefitTitle: "What this does for you:",
      benefitPoints: [
        "Routine wording fixes are accepted by creators in seconds without back-and-forth email delays.",
        "High-risk claims are automatically quarantined for Legal Reviewer sign-off before content goes live.",
        "Stores a complete, verified approval record so you can prove compliance if an ad platform ever audits your copy."
      ],
    },
  ];

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  return (
    <section id="method" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Three steps, then it mostly gets out of the way
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md md:text-right">
          Write freely. Verity catches unapproved claims and gives you 1-click compliant fixes.
        </p>
      </div>

      {/* 3 Asymmetric Vertical Sections */}
      <div className="space-y-16">
        {/* Step 1: Image Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[4/3] shadow-xs">
              <img
                src={steps[0].image}
                alt={steps[0].imageAlt}
                className="size-full object-cover filter contrast-[1.05] brightness-[0.96]"
              />
            </div>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 space-y-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {steps[0].num}
            </span>
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              {steps[0].title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {steps[0].tagline}
            </p>

            {/* Click to expand what it does */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(0)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 0 ? "Hide details" : "See what this does for you"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 0 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 0 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[0].benefitTitle}
                  </div>
                  <ul className="space-y-1.5 text-muted-foreground leading-relaxed list-disc list-inside">
                    {steps[0].benefitPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Text Left, Image Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {steps[1].num}
            </span>
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              {steps[1].title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {steps[1].tagline}
            </p>

            {/* Click to expand what it does */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 1 ? "Hide details" : "See what this does for you"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 1 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 1 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[1].benefitTitle}
                  </div>
                  <ul className="space-y-1.5 text-muted-foreground leading-relaxed list-disc list-inside">
                    {steps[1].benefitPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[4/3] shadow-xs">
              <img
                src={steps[1].image}
                alt={steps[1].imageAlt}
                className="size-full object-cover filter contrast-[1.05] brightness-[0.96]"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Image Left, Text Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted aspect-[4/3] shadow-xs">
              <img
                src={steps[2].image}
                alt={steps[2].imageAlt}
                className="size-full object-cover filter contrast-[1.05] brightness-[0.96]"
              />
            </div>
          </div>

          <div className="md:col-span-7 order-1 md:order-2 space-y-3">
            <span className="font-mono text-xs font-semibold text-muted-foreground">
              {steps[2].num}
            </span>
            <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-foreground">
              {steps[2].title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {steps[2].tagline}
            </p>

            {/* Click to expand what it does */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 2 ? "Hide details" : "See what this does for you"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 2 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 2 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[2].benefitTitle}
                  </div>
                  <ul className="space-y-1.5 text-muted-foreground leading-relaxed list-disc list-inside">
                    {steps[2].benefitPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
