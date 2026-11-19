"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { ClarityHeatmap } from "@/components/dashboard/clarity-heatmap";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { computeGuidelineClarityMetrics } from "@/lib/workflow/clarity-analytics";
import { DemoStepperStore } from "@/lib/workflow/demo-stepper-store";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { AuditRecord } from "@/lib/workflow/workflow-engine";
import { BarChart3, AlertTriangle, GraduationCap, Check, ArrowLeft, HelpCircle } from "lucide-react";

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
    submissionId: "sub_seed_2b",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_style_01",
    clauseCode: "STYLE-1.2",
    rationale: "Accepted tone adjustment.",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc222",
    entryHash: "abc223"
  },
  {
    sequenceIndex: 3,
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
    previousHash: "abc223",
    entryHash: "abc333"
  },
  {
    sequenceIndex: 4,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_3b",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc333",
    entryHash: "abc334"
  },
  {
    sequenceIndex: 5,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_3c",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_01",
    clauseCode: "TERM-1.1",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc334",
    entryHash: "abc335"
  },
  {
    sequenceIndex: 6,
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
    previousHash: "abc335",
    entryHash: "abc444"
  },
  {
    sequenceIndex: 7,
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
  },
  {
    sequenceIndex: 8,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_6",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc555",
    entryHash: "abc666"
  },
  {
    sequenceIndex: 9,
    timestamp: new Date().toISOString(),
    submissionId: "sub_seed_7",
    actorId: "p_rahul",
    actorName: "Rahul Sharma",
    actorRole: "CREATOR",
    action: "FINDING_ACCEPTED",
    clauseId: "cl_term_04",
    clauseCode: "TERM-4.5",
    previousStatus: "IN_CREATOR_REVIEW",
    newStatus: "IN_CREATOR_REVIEW",
    previousHash: "abc666",
    entryHash: "abc777"
  }
];

export default function InsightsPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => PersonaStore.getActivePersona());

  useEffect(() => {
    // Mark Step 4 (Insights visited) in stepper
    DemoStepperStore.markStep("insights");
  }, []);

  const metrics = computeGuidelineClarityMetrics(
    AEGIS_BRAND_GUIDELINE_CLAUSES,
    INITIAL_BENCHMARK_AUDIT_EVENTS
  );

  const ambiguousCount = metrics.filter((m) => m.clarityVerdict === "AMBIGUOUS_GUIDELINE").length;
  const trainingCount = metrics.filter((m) => m.clarityVerdict === "TRAINING_NEED").length;
  const clearCount = metrics.filter((m) => m.clarityVerdict === "HIGH_CLARITY").length;
  const notEnoughDataCount = metrics.filter((m) => m.clarityVerdict === "NOT_ENOUGH_DATA").length;

  return (
    <AppLayout activePersona={currentPersona} onSelectPersona={setCurrentPersona}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <BarChart3 className="size-5 text-muted-foreground" />
                <span>Guideline Clarity Analytics</span>
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fictional demo company: Aegis BioHealth. Separates ambiguous guidelines from employee training gaps using creator dispute data.
            </p>
          </div>
        </div>

        {/* 4 Summary Metric Cards (Matching the table exact counts) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Ambiguous Rules */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                Ambiguous Rules
              </span>
              <AlertTriangle className="size-3.5 text-[#cf4f27]" />
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">
              {ambiguousCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Dispute rate &gt; 20% with ≥ 3 flags.
            </p>
          </div>

          {/* Training Needs */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                Training Needs
              </span>
              <GraduationCap className="size-3.5 text-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">
              {trainingCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Frequently violated, low dispute rate.
            </p>
          </div>

          {/* Clear Rules */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                Clear Rules
              </span>
              <Check className="size-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">
              {clearCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              High creator alignment with ≥ 3 flags.
            </p>
          </div>

          {/* Not Enough Data */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                Not Enough Data
              </span>
              <span className="size-2 rounded-full bg-muted-foreground" />
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums">
              {notEnoughDataCount}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Fewer than 3 total flags logged.
            </p>
          </div>
        </div>

        {/* Clarity Heatmap Table */}
        <ClarityHeatmap metrics={metrics} />
      </div>
    </AppLayout>
  );
}
