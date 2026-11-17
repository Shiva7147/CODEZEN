"use client";

import React from "react";

export function ActivityMatrix() {
  // Generate 52 weeks x 7 days = 364 days + 1 = 365 glyphs
  const glyphs = Array.from({ length: 365 }, (_, i) => {
    // Generate deterministic status pattern
    const rand = (i * 17 + 7) % 100;
    let type: "compliant" | "routine_fix" | "sensitive_quarantine" = "compliant";
    if (rand > 92) type = "sensitive_quarantine";
    else if (rand > 75) type = "routine_fix";

    return {
      day: i + 1,
      type
    };
  });

  return (
    <section id="ledger" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24 scroll-mt-20">
      <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-xs space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border/40 pb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
              Annual Audit Ledger
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              A year of brand governance in 365 glyphs.
            </h2>
          </div>

          {/* Cumulative KPI totals */}
          <div className="flex items-center gap-6 sm:gap-10 text-xs font-mono">
            <div>
              <div className="text-xl font-medium text-foreground tabular-nums">
                4,120
              </div>
              <div className="text-[11px] text-muted-foreground">Clean Publications</div>
            </div>
            <div>
              <div className="text-xl font-medium text-foreground tabular-nums">
                284
              </div>
              <div className="text-[11px] text-muted-foreground">Claims Escalated</div>
            </div>
            <div>
              <div className="text-xl font-medium text-foreground tabular-nums">
                99.8%
              </div>
              <div className="text-[11px] text-muted-foreground">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* 365 Activity Glyphs Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-1">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-2">
            {glyphs.map((g) => (
              <div
                key={g.day}
                title={`Day ${g.day}: ${g.type.replace("_", " ")}`}
                className={`size-2.5 rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${
                  g.type === "sensitive_quarantine"
                    ? "bg-accent"
                    : g.type === "routine_fix"
                    ? "bg-foreground/50"
                    : "bg-muted hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-[11px] font-mono text-muted-foreground border-t border-border/40">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs bg-muted" />
                <span>Clean Publication</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs bg-foreground/50" />
                <span>Routine Fix Accepted</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-xs bg-accent" />
                <span>Sensitive Claim Quarantined</span>
              </span>
            </div>

            <div className="text-[11px]">
              Immutable HMAC-SHA256 Chaining
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
