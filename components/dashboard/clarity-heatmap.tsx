"use client";

import React from "react";
import { ClauseClarityMetric } from "@/lib/workflow/clarity-analytics";
import { AlertTriangle, Check, GraduationCap } from "lucide-react";

interface ClarityHeatmapProps {
  metrics: ClauseClarityMetric[];
}

export function ClarityHeatmap({ metrics }: ClarityHeatmapProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6 text-xs text-foreground shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">
            Guideline Clarity & Dispute Heatmap
          </h2>
          <p className="text-muted-foreground text-xs mt-0.5">
            Ranks brand rules by creator dispute frequency to separate employee training needs from ambiguous guidelines.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground" />
            <span>High Clarity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground" />
            <span>Training Gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" />
            <span>Ambiguous Clause</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/40 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 px-3">Clause Code</th>
              <th className="py-2.5 px-3">Section & Title</th>
              <th className="py-2.5 px-3 text-right">Flagged</th>
              <th className="py-2.5 px-3 text-right">Accepted</th>
              <th className="py-2.5 px-3 text-right">Disputed</th>
              <th className="py-2.5 px-3 text-right">Dispute Rate</th>
              <th className="py-2.5 px-3">Clarity Verdict</th>
              <th className="py-2.5 px-3">Recommended Next Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 font-mono text-xs">
            {metrics.map((row) => {
              const isAmbiguous = row.clarityVerdict === "AMBIGUOUS_GUIDELINE";
              const isTraining = row.clarityVerdict === "TRAINING_NEED";

              return (
                <tr
                  key={row.clauseId}
                  className={`transition-colors hover:bg-muted/30 ${
                    isAmbiguous ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-foreground">
                    {row.clauseCode}
                  </td>
                  <td className="py-3 px-3 font-sans text-muted-foreground max-w-xs truncate">
                    {row.sectionHeading}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-foreground">
                    {row.timesFlagged}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-foreground">
                    {row.timesAccepted}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-foreground">
                    {row.timesDisputed}
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums font-medium">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] border ${
                        row.disputeRate > 20
                          ? "border-accent/40 bg-accent/10 text-foreground"
                          : row.disputeRate > 5
                          ? "border-border bg-muted/40 text-foreground"
                          : "border-border/60 bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {row.disputeRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    {row.clarityVerdict === "NOT_ENOUGH_DATA" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                        <span>Not enough data</span>
                      </span>
                    ) : isAmbiguous ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-[11px] text-foreground font-medium">
                        <AlertTriangle className="size-3 text-accent" />
                        <span>Ambiguous</span>
                      </span>
                    ) : isTraining ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] text-foreground">
                        <GraduationCap className="size-3 text-muted-foreground" />
                        <span>Training Gap</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Check className="size-3 text-foreground" />
                        <span>Clear Rule</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-sans text-xs text-muted-foreground">
                    {row.recommendation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
