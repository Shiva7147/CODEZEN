"use client";

import React from "react";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { X, BookOpen, Check } from "lucide-react";

interface ClauseDrawerProps {
  clause: StoredClause | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClauseDrawer({ clause, isOpen, onClose }: ClauseDrawerProps) {
  if (!isOpen || !clause) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-muted-foreground" />
              <span className="font-mono text-sm font-medium text-foreground">{clause.clauseCode}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Section Heading & Category */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Section</div>
            <div className="text-sm font-medium text-foreground">{clause.sectionHeading || "General Brand Guidance"}</div>
          </div>

          {/* Full Clause Content */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Official Clause Text</div>
            <div className="rounded-xl border border-border bg-muted/20 p-4 font-mono text-xs text-foreground leading-relaxed">
              {clause.clauseText}
            </div>
          </div>

          {/* Source Verification Badge */}
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3.5 flex items-start gap-2.5 text-xs text-muted-foreground">
            <Check className="size-4 text-foreground shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Official Approved Source</div>
              <div className="text-muted-foreground mt-0.5 text-[11px] font-mono">
                Grounding Clause ID: <span className="font-semibold text-foreground">{clause.id}</span> in Aegis Brand Pack.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-border/40 mt-6">
          <button
            onClick={onClose}
            className="w-full rounded-full border border-border bg-muted/40 hover:bg-muted py-2.5 text-xs font-medium text-foreground transition-colors"
          >
            Close Clause View
          </button>
        </div>
      </div>
    </div>
  );
}
