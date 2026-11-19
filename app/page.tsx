"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DemoStepper } from "@/components/layout/demo-stepper";
import { FindingCard } from "@/components/review/finding-card";
import { ClauseDrawer } from "@/components/review/clause-drawer";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { FIFTEEN_TEST_SUBMISSIONS, TestSubmissionCase } from "@/lib/data/test-submissions";
import { AEGIS_BRAND_GUIDELINE_CLAUSES, CLAUSE_DATABASE_MAP } from "@/lib/data/sample-brand-guidelines";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { executeGovernanceReview, FullReviewOutput } from "@/lib/engine/orchestrator";
import { GovernanceStateMachine } from "@/lib/workflow/workflow-engine";
import { SubmissionsStore } from "@/lib/workflow/submissions-store";
import { DemoStepperStore } from "@/lib/workflow/demo-stepper-store";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { downloadSampleMarketingPDF, downloadComplianceReportPDF } from "@/lib/utils/pdf-generator";
import {
  Play,
  Upload,
  FileText,
  FileDown,
  Download,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronDown
} from "lucide-react";

export default function HomePage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => PersonaStore.getActivePersona());
  const [selectedCase, setSelectedCase] = useState<TestSubmissionCase>(FIFTEEN_TEST_SUBMISSIONS[0]);
  const [activeText, setActiveText] = useState(FIFTEEN_TEST_SUBMISSIONS[0].rawText);
  const [activeTab, setActiveTab] = useState<"write" | "upload">("write");

  const [stateMachine] = useState<GovernanceStateMachine>(() => new GovernanceStateMachine());
  const [reviewOutput, setReviewOutput] = useState<FullReviewOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRunCheck, setHasRunCheck] = useState(false);
  const [findingFilter, setFindingFilter] = useState<"ALL" | "SENSITIVE" | "ROUTINE">("ALL");

  // Clause Drawer
  const [activeClause, setActiveClause] = useState<StoredClause | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  // Listen to global persona changes
  useEffect(() => {
    const handlePersonaChange = (e: Event) => {
      const custom = e as CustomEvent<Persona>;
      if (custom.detail) setCurrentPersona(custom.detail);
      else setCurrentPersona(PersonaStore.getActivePersona());
    };
    window.addEventListener("verity-persona-changed", handlePersonaChange);
    return () => window.removeEventListener("verity-persona-changed", handlePersonaChange);
  }, []);

  // When selectedCase changes
  const handleSelectCase = (caseId: string) => {
    const found = FIFTEEN_TEST_SUBMISSIONS.find((c) => c.id === caseId);
    if (!found) return;
    setSelectedCase(found);
    setActiveText(found.rawText);
    setHasRunCheck(false);
    setReviewOutput(null);
  };

  // Run Check
  const handleRunCheck = async () => {
    setIsAnalyzing(true);
    setHasRunCheck(true);
    try {
      const output = await executeGovernanceReview(
        {
          submissionId: selectedCase.id,
          title: selectedCase.title,
          rawText: activeText,
          statedIntent: selectedCase.statedIntent,
          targetChannel: selectedCase.targetChannel,
        },
        stateMachine
      );
      setReviewOutput(output);

      // Mark Stepper Step 1
      DemoStepperStore.markStep(1);

      // Route sensitive findings automatically to Review Queue in SubmissionsStore
      const sensitiveList = output.findings.filter((f) => f.severity === "SENSITIVE");
      if (sensitiveList.length > 0) {
        SubmissionsStore.updateSubmission(selectedCase.id, {
          status: "Sensitive Hold",
          rawText: activeText,
          findings: output.findings,
        });
      } else {
        SubmissionsStore.updateSubmission(selectedCase.id, {
          rawText: activeText,
          findings: output.findings,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 1-Click Fix Handler
  const handleAcceptFinding = (findingId: string) => {
    if (!reviewOutput) return;
    const target = reviewOutput.findings.find((f) => f.id === findingId);
    if (!target) return;

    if (target.severity === "SENSITIVE" && currentPersona.role === "CREATOR") {
      alert("Creators cannot dismiss or accept-away sensitive findings. This claim has been quarantined and sent to the Review Queue.");
      return;
    }

    // Replace text in editor
    const originalPhrase = target.suggestedDiff.original;
    const replacementPhrase = target.suggestedDiff.replacement;
    if (originalPhrase && replacementPhrase && activeText.includes(originalPhrase)) {
      const newContent = activeText.replace(originalPhrase, replacementPhrase);
      setActiveText(newContent);
    }

    // Update finding state
    const updatedFindings = reviewOutput.findings.map((f) =>
      f.id === findingId ? { ...f, status: "ACCEPTED" as const } : f
    );
    setReviewOutput({
      ...reviewOutput,
      findings: updatedFindings,
    });

    // Log to History
    SubmissionsStore.logHistory({
      action: "accepted fix",
      submissionId: selectedCase.id,
      submissionTitle: selectedCase.title,
      actor: currentPersona.name,
      role: currentPersona.role,
      clauseInvolved: target.clauseCode || "TERM-1.1",
      rationale: `Accepted 1-click replacement: "${originalPhrase}" -> "${replacementPhrase}"`,
    });

    // Mark Stepper Step 2
    DemoStepperStore.markStep(2);
  };

  const handleDisputeFinding = (findingId: string, rationale: string) => {
    if (!reviewOutput) return;
    const target = reviewOutput.findings.find((f) => f.id === findingId);
    if (!target) return;

    const updatedFindings = reviewOutput.findings.map((f) =>
      f.id === findingId ? { ...f, status: "DISPUTED" as const } : f
    );
    setReviewOutput({
      ...reviewOutput,
      findings: updatedFindings,
    });

    SubmissionsStore.logHistory({
      action: "disputed",
      submissionId: selectedCase.id,
      submissionTitle: selectedCase.title,
      actor: currentPersona.name,
      role: currentPersona.role,
      clauseInvolved: target.clauseCode || "GOV-1.0",
      rationale,
    });
  };

  const handleEditFinding = (findingId: string, newReplacement: string, rationale: string) => {
    if (!reviewOutput) return;
    const target = reviewOutput.findings.find((f) => f.id === findingId);
    if (!target) return;

    const originalPhrase = target.suggestedDiff.original;
    if (originalPhrase && newReplacement && activeText.includes(originalPhrase)) {
      const newContent = activeText.replace(originalPhrase, newReplacement);
      setActiveText(newContent);
    }

    const updatedFindings = reviewOutput.findings.map((f) =>
      f.id === findingId ? { ...f, status: "ACCEPTED" as const } : f
    );
    setReviewOutput({
      ...reviewOutput,
      findings: updatedFindings,
    });

    SubmissionsStore.logHistory({
      action: "accepted fix",
      submissionId: selectedCase.id,
      submissionTitle: selectedCase.title,
      actor: currentPersona.name,
      role: currentPersona.role,
      clauseInvolved: target.clauseCode || "GOV-1.0",
      rationale: `Author provided edit: "${newReplacement}" (${rationale})`,
    });
  };

  // Open Clause Details Drawer
  const handleOpenClause = (clauseId: string) => {
    const clause = CLAUSE_DATABASE_MAP.get(clauseId);
    if (clause) {
      setActiveClause(clause);
      setIsDrawerOpen(true);
    }
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("submissionId", selectedCase.id);

      const res = await fetch("/api/review/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to parse document");
      }

      const data = await res.json();
      if (data.extractedText) {
        setActiveText(data.extractedText);
        setUploadMsg(`Extracted ${data.charCount || data.extractedText.length} characters from ${file.name}.`);
        setActiveTab("write");
        setHasRunCheck(false);
      }
    } catch (err: any) {
      setUploadMsg(`Error uploading document: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Download Sample PDF
  const handleDownloadSamplePDF = () => {
    downloadSampleMarketingPDF();
  };

  // Download PDF Report
  const handleDownloadReport = () => {
    if (!reviewOutput) return;
    const unresolvedCount = reviewOutput.findings.filter((f) => f.status !== "ACCEPTED").length;
    const score = Math.max(10, 100 - unresolvedCount * 15);

    downloadComplianceReportPDF({
      documentName: selectedCase.title,
      originalText: selectedCase.rawText,
      sanitizedText: activeText,
      findings: reviewOutput.findings.map((f) => ({
        id: f.id,
        flaggedText: f.flaggedText,
        category: String(f.issueCategory),
        riskLevel: String(f.severity),
        description: f.explanation || "Compliance policy requirement",
        suggestedDiff: {
          replacement: f.suggestedDiff?.replacement || "",
          rationale: f.creatorRationale || f.explanation,
        },
        guidelineClauseId: f.clauseId,
      })),
      complianceScore: score,
      reviewerRole: currentPersona.role,
    });
  };

  // Filter Findings
  const allFindings = reviewOutput?.findings || [];
  const sensitiveFindings = allFindings.filter((f) => f.severity === "SENSITIVE");
  const routineFindings = allFindings.filter((f) => f.severity === "ROUTINE");

  const visibleFindings = allFindings.filter((f) => {
    if (findingFilter === "SENSITIVE") return f.severity === "SENSITIVE";
    if (findingFilter === "ROUTINE") return f.severity === "ROUTINE";
    return true;
  });

  return (
    <AppLayout activePersona={currentPersona} onSelectPersona={setCurrentPersona}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* 1. Purpose Strip (Top of Studio, exactly two lines) */}
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-1">
          <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
            Verity checks content against your approved brand guidelines before publication. Every finding cites the exact rule, risky claims go to a human reviewer, and nothing is changed without a person&apos;s approval.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Demo with a fictional company, Aegis BioHealth. Switch roles at the top right. No real sign-in.
          </p>
        </section>

        {/* 2. Persistent 4-Step Progress Stepper */}
        <DemoStepper
          onTriggerCheck={handleRunCheck}
          onFocusFinding={() => {
            const firstCard = document.querySelector('[aria-expanded="false"]');
            (firstCard as HTMLElement)?.click();
          }}
        />

        {/* 3. Compact "Sample drafts" Dropdown & Tab Selection */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Draft selector dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground whitespace-nowrap">
              Sample drafts:
            </span>
            <div className="relative">
              <select
                value={selectedCase.id}
                onChange={(e) => handleSelectCase(e.target.value)}
                className="appearance-none rounded-lg border border-border bg-card py-1.5 pl-3 pr-8 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:border-foreground transition-colors cursor-pointer"
              >
                {FIFTEEN_TEST_SUBMISSIONS.slice(0, 6).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            </div>
          </div>

          {/* Mode switch: Write/Paste vs Upload Document */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
            <button
              onClick={() => setActiveTab("write")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === "write"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Write or Paste
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload Document
            </button>
          </div>
        </div>

        {/* 4. Side-by-Side Studio: Editor on Left, Findings on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols): Content Editor / Upload */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
              {activeTab === "write" ? (
                <>
                  <div className="flex items-center justify-between text-xs border-b border-border pb-2.5">
                    <span className="font-semibold text-foreground">Content Draft</span>
                    <span className="font-mono text-muted-foreground text-[11px]">
                      {activeText.trim().split(/\s+/).filter(Boolean).length} words · {activeText.length} chars
                    </span>
                  </div>

                  <textarea
                    value={activeText}
                    onChange={(e) => {
                      setActiveText(e.target.value);
                      if (hasRunCheck) setHasRunCheck(false);
                    }}
                    rows={12}
                    className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground font-mono leading-relaxed focus:outline-none focus:border-foreground transition-colors resize-y"
                    placeholder="Paste or write marketing copy, video script transcript, or product announcement..."
                  />

                  {/* Primary Scan Button */}
                  <button
                    id="btn-check-script"
                    onClick={handleRunCheck}
                    disabled={isAnalyzing || !activeText.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background py-2.5 px-4 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shadow-2xs"
                  >
                    {isAnalyzing ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        <span>Checking against approved guidelines...</span>
                      </span>
                    ) : (
                      <>
                        <Play className="size-3.5 fill-current" />
                        <span>Check My Script for Mistakes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Document Upload Tab */
                <div className="py-4 space-y-4 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground">
                    <Upload className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Upload Document
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                      Select a Word document (.docx), PDF (.pdf), or plain text (.txt). Verity parses it locally in your browser.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-2xs">
                    <span>{isUploading ? "Extracting..." : "Choose File from Computer"}</span>
                    <input
                      type="file"
                      accept=".txt,.md,.docx,.pdf,.json"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {/* Sample PDF helper */}
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-center space-y-1.5 mt-2">
                    <div className="text-[11px] font-semibold text-foreground">
                      Need a sample file to test upload?
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadSamplePDF}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      <Download className="size-3" />
                      <span>Download sample-marketing-pitch.pdf</span>
                    </button>
                  </div>

                  {uploadMsg && (
                    <p className="text-xs text-foreground bg-muted p-2 rounded-lg border border-border">
                      {uploadMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Findings & Diff Remediations */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
              {/* Header with Filter Pills & Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Findings &amp; Rule Citations ({allFindings.length})
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any finding to inspect cited rule policy and apply 1-click fixes
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {reviewOutput && allFindings.length > 0 && (
                    <button
                      onClick={handleDownloadReport}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      title="Download PDF report"
                    >
                      <FileDown className="size-3 text-foreground" />
                      <span>PDF Report</span>
                    </button>
                  )}

                  <button
                    onClick={() => setFindingFilter("ALL")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      findingFilter === "ALL"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All ({allFindings.length})
                  </button>

                  <button
                    onClick={() => setFindingFilter("SENSITIVE")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      findingFilter === "SENSITIVE"
                        ? "bg-[#cf4f27] text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Legal Hold ({sensitiveFindings.length})
                  </button>

                  <button
                    onClick={() => setFindingFilter("ROUTINE")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      findingFilter === "ROUTINE"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    1-Click Fixes ({routineFindings.length})
                  </button>
                </div>
              </div>

              {/* Slim Mandatory Notice Banner */}
              <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-foreground flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#cf4f27] shrink-0" />
                <span className="text-xs leading-relaxed">
                  Findings come from rules and AI, checked against your approved sources. People make every decision.
                </span>
              </div>

              {/* Findings Content Area */}
              {!hasRunCheck ? (
                /* State 1: Before check run */
                <div className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center space-y-2">
                  <FileText className="size-7 text-muted-foreground mx-auto" />
                  <div className="font-semibold text-foreground text-xs">
                    No check run yet.
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Click <strong>&quot;Check My Script for Mistakes&quot;</strong> on the left to scan this draft against approved Aegis brand guidelines.
                  </p>
                </div>
              ) : visibleFindings.length === 0 && allFindings.length === 0 ? (
                /* State 2: Check run and ZERO issues found */
                <div className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-2">
                  <ShieldCheck className="size-7 text-emerald-600 mx-auto" />
                  <div className="font-semibold text-foreground text-sm">
                    No Policy Violations Found
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    No unapproved claims, false promises, or tone infractions detected in this script. Content is aligned with approved guidelines.
                  </p>
                </div>
              ) : visibleFindings.length === 0 ? (
                <div className="rounded-xl border border-border bg-muted/10 p-6 text-center text-xs text-muted-foreground">
                  No findings match the selected filter.
                </div>
              ) : (
                /* State 3: List of findings */
                <div className="space-y-3">
                  {visibleFindings.map((f) => (
                    <FindingCard
                      key={f.id}
                      finding={f}
                      userRole={currentPersona.role}
                      onAccept={handleAcceptFinding}
                      onDispute={handleDisputeFinding}
                      onEdit={handleEditFinding}
                      onViewClause={handleOpenClause}
                      defaultExpanded={false}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Official Rule Inspection Drawer */}
      <ClauseDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        clause={activeClause}
      />
    </AppLayout>
  );
}
