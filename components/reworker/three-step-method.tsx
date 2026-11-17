"use client";

import React, { useState } from "react";
import { ChevronRight, ArrowRight, ShieldCheck, Cpu, GitCommit } from "lucide-react";

export function ThreeStepMethod() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "Draft your marketing copy naturally",
      tagline: "Write in your voice. Verity checks brand guidelines silently in the background.",
      image: "/method-1.jpg",
      imageAlt: "Minimal creator desk with soft window light",
      technicalHeading: "Module 2: Source Parser & Clause Chunker",
      technicalDetails:
        "Deterministic AST parser chunks text into semantic clauses using boundary markers. Tracks character offsets without losing context, normalizing formatting across plain text, markdown, and Word documents.",
      keyStat: "<10ms AST parsing",
    },
    {
      num: "02",
      title: "Instant deterministic verification",
      tagline: "Zero hallucinations. Every flag quotes the exact brand guideline clause.",
      image: "/method-2.jpg",
      imageAlt: "Editorial hands reviewing typography proofs",
      technicalHeading: "Module 1 & 4: Regex Engine + Citation Verifier",
      technicalDetails:
        "Combines high-speed deterministic regex patterns with embedding-based vector retrieval. High-risk health and financial claims quarantine automatically into an Authorised Reviewer escalation queue.",
      keyStat: "100% citation verified",
    },
    {
      num: "03",
      title: "One-click diffs and certified audit history",
      tagline: "Accept proposed wording with 1 click or customize. Logged immutably.",
      image: "/method-3.jpg",
      imageAlt: "Clean editorial layout on warm stone surface",
      technicalHeading: "Module 6: Governance State Machine & Audit Trail",
      technicalDetails:
        "Finite state machine (FSM) enforces role-based access control. Authors accept or dispute word-level diffs; reviewers provide final pre-publication sign-off recorded in a tamper-proof append-only ledger.",
      keyStat: "SHA-256 audit integrity",
    },
  ];

  const toggleStep = (idx: number) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  return (
    <section id="method" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
      {/* Section Header matching Reworker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Three steps, then it mostly gets out of the way
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md md:text-right">
          Write freely. Verity verifies citations and catches unapproved claims before you post.
        </p>
      </div>

      {/* 3 Asymmetric Vertical Sections matching Reworker reference */}
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

            {/* Click to expand deeper technical details */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(0)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 0 ? "Hide technical architecture" : "How clause chunking works"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 0 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 0 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[0].technicalHeading}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {steps[0].technicalDetails}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#cf4f27]">
                    Performance Metric: {steps[0].keyStat}
                  </div>
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

            {/* Click to expand deeper technical details */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 1 ? "Hide technical architecture" : "How citation verification works"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 1 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 1 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[1].technicalHeading}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {steps[1].technicalDetails}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#cf4f27]">
                    Performance Metric: {steps[1].keyStat}
                  </div>
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

            {/* Click to expand deeper technical details */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground hover:opacity-75 transition-opacity underline underline-offset-4"
              >
                <span>{expandedStep === 2 ? "Hide technical architecture" : "How state machine & audit logs work"}</span>
                <ChevronRight
                  className={`size-3 transition-transform duration-200 ${
                    expandedStep === 2 ? "rotate-90" : ""
                  }`}
                />
              </button>

              {expandedStep === 2 && (
                <div className="mt-3 rounded-xl border border-border/70 bg-card p-4 space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="font-mono text-[11px] font-semibold text-foreground uppercase tracking-wider">
                    {steps[2].technicalHeading}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {steps[2].technicalDetails}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-[#cf4f27]">
                    Performance Metric: {steps[2].keyStat}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
