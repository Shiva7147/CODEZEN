"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, AlertCircle, Cpu, FileCheck, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: {
    heading: string;
    description: string;
    points: { label: string; detail: string }[];
    metrics?: { value: string; label: string }[];
  };
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: "Step 1: The Problem",
    title: "Why Creator Scripts Get Banned or Rejected",
    subtitle: "Creators move fast on social media. Brand guidelines are 40-page legal PDFs nobody reads until an ad gets flagged.",
    icon: <AlertCircle className="size-5 text-[#cf4f27]" />,
    content: {
      heading: "The Creator & Brand Disconnect",
      description:
        "When influencers and marketing teams write scripts, using words like '100% cure', 'dirt-cheap', or 'guaranteed profit' violates consumer protection laws (FTC/ASCI). Brands reject payouts, and videos get taken down.",
      points: [
        { label: "Slow Approvals", detail: "Legal review takes 3 to 5 days, killing timely social video trends." },
        { label: "Accidental Violations", detail: "Most violations come from common hype words creators didn't know were banned." },
        { label: "No Audit Proof", detail: "Edits agreed upon in WhatsApp or DMs leave no legal proof when regulators audit." },
      ],
      metrics: [
        { value: "3-5 Days", label: "Average Legal Bottleneck" },
        { value: "84%", label: "Infractions from Simple Hype" },
        { value: "0 Logs", label: "Proof in Chat Messages" },
      ],
    },
  },
  {
    id: 2,
    badge: "Step 2: Instant Scan",
    title: "Checking Scripts Against Rules in Under 10ms",
    subtitle: "Paste your script and get instant feedback before you ever shoot or publish.",
    icon: <Cpu className="size-5 text-[#cf4f27]" />,
    content: {
      heading: "Instant Local Rule Execution",
      description:
        "Verity runs an instant scanner that identifies banned hype words, false promises, and missing disclaimers in less than 10 milliseconds. Complex sentences are evaluated by Gemini against the brand's verified rulebook.",
      points: [
        { label: "Under 10ms Check", detail: "Checks every sentence client-side with zero wait time." },
        { label: "Contextual Understanding", detail: "Understands the creator's audience and video format (reels, YouTube, ads)." },
        { label: "No Forced Changes", detail: "Verity never overwrites your script automatically. You decide every change." },
      ],
      metrics: [
        { value: "<10 ms", label: "Instant Scan Latency" },
        { value: "100%", label: "Creator Control" },
        { value: "0", label: "Surprise Overwrites" },
      ],
    },
  },
  {
    id: 3,
    badge: "Step 3: Grounded Proof",
    title: "Proving Every Mistake with Real Brand Rules",
    subtitle: "Verified against guidelines. Every flagged issue shows the exact sentence from the brand rulebook.",
    icon: <FileCheck className="size-5 text-[#cf4f27]" />,
    content: {
      heading: "Bitap Citation Verification",
      description:
        "Generic AI tools can cite inconsistent rules. Verity runs a mathematical Bitap fuzzy search against the brand's official guideline database. If a rule does not exist, the issue is not shown.",
      points: [
        { label: "Real Policy Citations", detail: "Every mistake links to an exact Clause ID (e.g. Clause TERM-1.1)." },
        { label: "1-Click Rule Inspection", detail: "Creators can tap 'Inspect Rule' to read the full policy in plain English." },
        { label: "Verified Policy Rules", detail: "Mathematically verifies that quotes match official company policy." },
      ],
      metrics: [
        { value: "100%", label: "Real Guideline Matches" },
        { value: "Verified", label: "Grounding in Rules" },
        { value: "1 Click", label: "To Inspect Rule Text" },
      ],
    },
  },
  {
    id: 4,
    badge: "Step 4: Smart Actions",
    title: "1-Click Fixes for Slang, Legal Holds for Risk",
    subtitle: "Routine wording is fixed in one click. High-liability claims are kept safe.",
    icon: <ShieldCheck className="size-5 text-[#cf4f27]" />,
    content: {
      heading: "Empowering Creators While Protecting Brands",
      description:
        "If you used an unapproved hype word like 'miracle', Verity gives you a punchy compliant alternative you can accept with one click. But if you made an unverified medical or financial guarantee, it puts a hold on the script until a brand manager approves it.",
      points: [
        { label: "1-Click Diff Acceptance", detail: "Accept compliant wording with a single tap and keep working." },
        { label: "Legal Quarantine", detail: "High-liability claims freeze until authorized compliance reviewers sign off." },
        { label: "Role Separation", detail: "Creators, managers, and legal reviewers each have clear, designated permissions." },
      ],
      metrics: [
        { value: "1 Click", label: "To Fix Routine Mistakes" },
        { value: "Safe Hold", label: "On High-Liability Claims" },
        { value: "3 Roles", label: "Creator / Manager / Legal" },
      ],
    },
  },
  {
    id: 5,
    badge: "Step 5: Safe Publication",
    title: "Complete Audit History & Proof",
    subtitle: "Every fix and sign-off is logged so creators and brands have verified proof.",
    icon: <CheckCircle2 className="size-5 text-[#cf4f27]" />,
    content: {
      heading: "Immutable Compliance Ledger",
      description:
        "Every approved change appends to a tamper-evident audit ledger with timestamps and reviewer signatures. Simultaneously, marketing managers can see which rules creators struggle with most on the Clarity Heatmap.",
      points: [
        { label: "Proof of Approval", detail: "Full proof that your script was verified and approved before filming." },
        { label: "Clarity Heatmap", detail: "Shows brands which rules are confusing so they can rewrite their guidelines." },
        { label: "Turnkey Influencer Workflow", detail: "Simple, distraction-free interface built for creators in tier-2 and tier-3 cities." },
      ],
      metrics: [
        { value: "SHA-256", label: "Cryptographic Audit Trail" },
        { value: "Real-Time", label: "Rule Clarity Analytics" },
        { value: "Verified", label: "Pre-Publication Review" },
      ],
    },
  },
];

export function PresentationModal({ isOpen, onClose }: PresentationModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              {currentSlide.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  {currentSlide.badge}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs font-mono text-foreground font-semibold">
                  Slide {currentSlideIndex + 1} of {SLIDES.length}
                </span>
              </div>
              <h2 className="text-base font-semibold text-foreground">
                {currentSlide.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 mr-3">
              {SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? "w-6 bg-foreground"
                      : "w-1.5 bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 space-y-6">
          <p className="text-lg font-medium leading-relaxed text-foreground max-w-3xl">
            {currentSlide.subtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase font-mono">
                {currentSlide.content.heading}
              </h3>
              <p className="text-sm leading-relaxed text-foreground">
                {currentSlide.content.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentSlide.content.points.map((pt, i) => (
                  <div key={i} className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-0.5">
                    <div className="text-xs font-semibold text-foreground">
                      {pt.label}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {pt.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics column */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-muted/40 p-5 space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block border-b border-border pb-2 font-semibold">
                  Key Metrics
                </span>
                {currentSlide.content.metrics?.map((m, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                      {m.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-4 text-xs text-foreground space-y-1">
                <span className="font-semibold block text-foreground">Creator Takeaway:</span>
                <p className="text-muted-foreground leading-relaxed">
                  You never have to guess whether your post will get flagged. Verity shows you the exact rule and gives you the fix in 1 click.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-foreground disabled:opacity-30 disabled:pointer-events-none hover:bg-muted transition-colors"
          >
            <ChevronLeft className="size-3.5" />
            Previous
          </button>

          <span className="text-xs font-mono text-muted-foreground">
            Slide {currentSlideIndex + 1} of {SLIDES.length}
          </span>

          {currentSlideIndex < SLIDES.length - 1 ? (
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(SLIDES.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
            >
              Next Slide
              <ChevronRight className="size-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
            >
              Finish & Return to Studio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
