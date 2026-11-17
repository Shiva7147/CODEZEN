"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { ClarityHeatmap } from "@/components/dashboard/clarity-heatmap";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { computeGuidelineClarityMetrics } from "@/lib/workflow/clarity-analytics";
import { AuditRecord } from "@/lib/workflow/workflow-engine";
import { BarChart3, AlertTriangle, GraduationCap, Check, ArrowLeft } from "lucide-react";

const INITIAL_BENCHMARK_AUDIT_EVENTS: AuditRecord[] = [
  {
    sequenceIndex: 0,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_1",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_DISPUTED",
    clauseId: "cl_style_01",
    clauseCode: "STYLE-1.2",
    rationale: "Sentence was energetic for weekend social campaign, not hypy.",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "000000",
    entryHash: "abc111"
  },
  {
    sequenceIndex: 1,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_2",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_DISPUTED",
    clauseId: "cl_style_01",
    clauseCode: "STYLE-1.2",
    rationale: "Urgency definition is ambiguous.",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc111",
    entryHash: "abc222"
  },
  {
    sequenceIndex: 2,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_3",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc222",
    entryHash: "abc333"
  },
  {
    sequenceIndex: 3,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_4",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc333",
    entryHash: "abc444"
  },
  {
    sequenceIndex: 4,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_5",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc444",
    entryHash: "abc555"
  }
];

export default function InsightsPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[1]); // Priya (Manager)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const metrics = computeGuidelineClarityMetrics(
    AEGIS_BRAND_GUIDELINE_CLAUSES,
    INITIAL_BENCHMARK_AUDIT_EVENTS
  );

  const ambiguousCount = metrics.filter((m) => m.clarityVerdict === "AMBIGUOUS_GUIDELINE").length;
  const trainingCount = metrics.filter((m) => m.clarityVerdict === "TRAINING_NEED").length;
  const clearCount = metrics.filter((m) => m.clarityVerdict === "HIGH_CLARITY").length;

  return (
    <OuterFrame>
      <NotchedNavbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
      />

      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <h1 className="text-2xl font-normal tracking-tight text-foreground flex items-center gap-2.5">
              <BarChart3 className="size-5 text-muted-foreground" />
              <span>Guideline Clarity Analytics</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-normal">
              Resolves Priya's core managerial challenge: distinguishing ambiguous guidelines from team training gaps.
            </p>
          </div>
        </div>

        {/* 3 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">Ambiguous Rules</span>
              <AlertTriangle className="size-4 text-accent" />
            </div>
            <div className="text-3xl font-normal text-foreground tabular-nums">
              {ambiguousCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Dispute rate &gt; 20%. Candidate for brand guideline editorial revision.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">Training Needs</span>
              <GraduationCap className="size-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-normal text-foreground tabular-nums">
              {trainingCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Frequently violated, low dispute rate. Team onboarding gap.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-muted-foreground">High Clarity Rules</span>
              <Check className="size-4 text-foreground" />
            </div>
            <div className="text-3xl font-normal text-foreground tabular-nums">
              {clearCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Clear corporate rules with high author alignment.
            </p>
          </div>
        </div>

        {/* The Clarity Heatmap Table */}
        <ClarityHeatmap metrics={metrics} />
      </main>
    </OuterFrame>
  );
}
