"use client";

import React from "react";
import { diffWords, Change } from "diff";

interface SplitDiffViewerProps {
  originalText: string;
  replacementText: string;
  leftLabel?: string;
  rightLabel?: string;
}

export function SplitDiffViewer({
  originalText,
  replacementText,
  leftLabel = "Current Text (Flagged)",
  rightLabel = "Intent-Preserving Suggestion"
}: SplitDiffViewerProps) {
  const diffs: Change[] = diffWords(originalText, replacementText);

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card text-xs">
      {/* Header Bar */}
      <div className="grid grid-cols-2 border-b border-border/60 bg-muted/40 px-3 py-2 font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-muted-foreground" />
          <span className="text-[11px] font-mono">{leftLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-border/60 pl-3">
          <span className="size-1.5 rounded-full bg-accent" />
          <span className="text-[11px] font-mono">{rightLabel}</span>
        </div>
      </div>

      {/* Side-by-Side Diff Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
        {/* Left: Original with removals highlighted in muted line-through */}
        <div className="p-3 font-mono text-[11px] leading-relaxed text-muted-foreground bg-muted/20">
          {diffs.map((part, index) => {
            if (part.added) return null; // do not show additions on left side
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="rounded-xs bg-muted text-foreground line-through px-1 py-0.5"
                >
                  {part.value}
                </span>
              );
            }
            return <span key={index}>{part.value}</span>;
          })}
        </div>

        {/* Right: Suggested replacement with additions highlighted in subtle accent */}
        <div className="p-3 font-mono text-[11px] leading-relaxed text-foreground bg-card">
          {diffs.map((part, index) => {
            if (part.removed) return null; // do not show removals on right side
            if (part.added) {
              return (
                <span
                  key={index}
                  className="rounded-xs bg-accent/15 text-foreground font-semibold px-1 py-0.5 border-b border-accent"
                >
                  {part.value}
                </span>
              );
            }
            return <span key={index}>{part.value}</span>;
          })}
        </div>
      </div>
    </div>
  );
}
