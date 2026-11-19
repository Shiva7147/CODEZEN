"use client";

import React, { useEffect, useState } from "react";
import { Shield, ArrowRight, CheckCircle2, AlertTriangle, Layers, Lock, X } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo?: () => void;
}

export function WelcomeModal({ isOpen, onClose, onStartDemo }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xl space-y-5 text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close welcome guide"
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <Shield className="size-5" />
          </div>
          <div>
            <h2 id="welcome-modal-title" className="text-base font-semibold tracking-tight text-foreground">
              Welcome to Verity
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pre-Publication Brand Governance & Claim Verification
            </p>
          </div>
        </div>

        {/* 3 Short Parts */}
        <div className="space-y-4 text-xs">
          {/* Part 1: The Problem */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <AlertTriangle className="size-3.5 text-[#cf4f27]" />
              <span>1. The Problem</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Editorial feedback is often vague, copy revisions and legal approvals are scattered across emails and chat threads, and risky or unsupported claims slip through into publication unnoticed.
            </p>
          </div>

          {/* Part 2: What Verity Does */}
          <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Layers className="size-3.5 text-foreground" />
              <span>2. What Verity Does</span>
            </div>
            <ul className="space-y-2 text-muted-foreground text-xs leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-foreground">Cites the exact rule:</strong> Every finding quotes your approved company policy clause and rationale with zero ungrounded advice.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-foreground">Quarantines risky claims:</strong> Routine wording has 1-click diff fixes, while sensitive medical or legal claims are sent to a human reviewer.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <span>
                  <strong className="text-foreground">Human-in-the-loop decisions:</strong> Nothing changes automatically; all actions are recorded in an append-only audit trail.
                </span>
              </li>
            </ul>
          </div>

          {/* Demo Note */}
          <div className="text-[11px] text-muted-foreground">
            Fictional demo company: <strong className="text-foreground">Aegis BioHealth</strong>. You can switch between Creator, Reviewer, and Manager roles at any time.
          </div>
        </div>

        {/* Part 3: Action Button */}
        <div className="pt-2 flex items-center justify-between border-t border-border">
          <span className="text-[11px] font-mono text-muted-foreground">
            2-minute interactive demo
          </span>
          <button
            onClick={() => {
              if (onStartDemo) onStartDemo();
              else onClose();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
          >
            <span>Start the 2-minute demo</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
