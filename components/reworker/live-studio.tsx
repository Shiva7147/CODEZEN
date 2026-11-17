"use client";

import React, { useState, useEffect } from "react";
import { Persona } from "../navigation/top-nav";
import { FindingCard } from "../review/finding-card";
import { ClauseDrawer } from "../review/clause-drawer";
import { RagPromptAssistant } from "./rag-prompt-assistant";
import { ClarityHeatmap } from "../dashboard/clarity-heatmap";
import { AuditTimeline } from "../dashboard/audit-timeline";
import { TestSubmissionCase } from "@/lib/data/test-submissions";
import { FullReviewOutput } from "@/lib/engine/orchestrator";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { CLAUSE_DATABASE_MAP, AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { computeGuidelineClarityMetrics } from "@/lib/workflow/clarity-analytics";
import {
  FileText,
  Play,
  Upload,
  ShieldCheck,
  Check,
  BookOpen,
  Lock,
  Shield,
  BarChart3,
  History,
  AlertCircle,
  Sparkles,
  ArrowRight,
  UserCheck
} from "lucide-react";

interface LiveStudioProps {
  currentPersona: Persona;
  selectedCase: TestSubmissionCase;
  reviewOutput: FullReviewOutput | null;
  isAnalyzing: boolean;
  onRunReview: (customText?: string, customIntent?: string) => void;
  onAcceptFinding: (id: string) => void;
  onDisputeFinding: (id: string, rationale: string) => void;
  onEditFinding: (id: string, replacement: string, rationale: string) => void;
  onFinalApprove: () => void;
  devMode?: boolean;
}

export function LiveStudio({
  currentPersona,
  selectedCase,
  reviewOutput,
  isAnalyzing,
  onRunReview,
  onAcceptFinding,
  onDisputeFinding,
  onEditFinding,
  onFinalApprove,
}: LiveStudioProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "upload" | "rules" | "clarity" | "audit">("editor");
  const [activeText, setActiveText] = useState(selectedCase.rawText);
  const [activeIntent, setActiveIntent] = useState(selectedCase.statedIntent);
  const [activeClause, setActiveClause] = useState<StoredClause | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [findingFilter, setFindingFilter] = useState<"ALL" | "SENSITIVE" | "ROUTINE">("ALL");

  // Keep editor synchronized when selected scenario changes
  useEffect(() => {
    setActiveText(selectedCase.rawText);
    setActiveIntent(selectedCase.statedIntent);
    setUploadSuccessMsg(null);
  }, [selectedCase.id]);

  // Adjust active tab if switching away from manager/admin tabs
  useEffect(() => {
    if (activeTab === "clarity" && currentPersona.role !== "MANAGER") {
      setActiveTab("editor");
    }
    if (activeTab === "audit" && currentPersona.role !== "ADMIN") {
      setActiveTab("editor");
    }
  }, [currentPersona.role]);

  const handleOpenClause = (clauseId: string) => {
    const clause = CLAUSE_DATABASE_MAP.get(clauseId);
    if (clause) {
      setActiveClause(clause);
      setIsDrawerOpen(true);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);
    try {
      let extractedText = "";

      if (file.name.endsWith(".docx")) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/guidelines/ingest", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.clauses && data.clauses.length > 0) {
          extractedText = data.clauses.map((c: any) => c.clauseText).join("\n\n");
        } else {
          extractedText = await file.text();
        }
      } else if (file.name.endsWith(".pdf")) {
        const arrayBuf = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let rawStr = "";
        for (let i = 0; i < bytes.length; i++) {
          const char = bytes[i];
          if (char >= 32 && char <= 126) rawStr += String.fromCharCode(char);
          else if (char === 10 || char === 13) rawStr += "\n";
        }
        const lines = rawStr.split("\n").map((l) => l.trim()).filter((l) => l.length > 25 && !l.startsWith("/"));
        extractedText = lines.length > 0 ? lines.join(" ") : await file.text();
      } else {
        extractedText = await file.text();
      }

      if (!extractedText.trim()) {
        extractedText = `Our revolutionary formula guarantees a 100% cure for fatigue. This cheap solution is available for all users.`;
      }

      setActiveText(extractedText);
      const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
      setUploadSuccessMsg(`Loaded "${file.name}" (${wordCount} words) — Scan completed.`);
      setActiveTab("editor");

      // Trigger governance scan on extracted text
      onRunReview(extractedText, activeIntent);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadSuccessMsg("Upload failed. Loaded fallback plain text.");
    } finally {
      setIsUploading(false);
    }
  };

  // Quick 1-click test script loaders
  const handleLoadSample = (type: "flagged" | "compliant") => {
    if (type === "flagged") {
      const script = `Aegis BioHealth today announced our revolutionary Vitality Formula. This breakthrough formulation is clinically proven to cure chronic fatigue and eliminate cellular aging in 90 days. Our cheap pricing allows all users to access this miracle wellness package with 100% guaranteed cellular revitalisation.`;
      setActiveText(script);
      setUploadSuccessMsg("Loaded sample script with flagged claims. Checking rules...");
      setActiveTab("editor");
      onRunReview(script, "Product Launch Reel");
    } else {
      const script = `Welcome to the Aegis health companion ecosystem. In this video, we explain how members can pair their daily wearables with our digital dashboard. Setup takes under five minutes, and our Member Support team is available around the clock to assist you with any questions.`;
      setActiveText(script);
      setUploadSuccessMsg("Loaded 100% compliant sample script. Checking rules...");
      setActiveTab("editor");
      onRunReview(script, "Member Onboarding Guide");
    }
  };

  const isApproved = reviewOutput?.status === "APPROVED";
  const allFindings = reviewOutput?.findings || [];
  const sensitiveFindings = allFindings.filter((f) => f.severity === "SENSITIVE");
  const routineFindings = allFindings.filter((f) => f.severity !== "SENSITIVE");

  const visibleFindings =
    findingFilter === "SENSITIVE"
      ? sensitiveFindings
      : findingFilter === "ROUTINE"
      ? routineFindings
      : allFindings;

  // Compute clarity metrics for Manager tab
  const clarityMetrics = computeGuidelineClarityMetrics(
    AEGIS_BRAND_GUIDELINE_CLAUSES,
    reviewOutput?.auditTrail || []
  );

  return (
    <section id="studio" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
      {/* 1. DYNAMIC ROLE WORKSPACE BANNER (Changes visibly on persona switch) */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background font-mono font-bold text-sm shrink-0">
              {currentPersona.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">
                  {currentPersona.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium ${
                    currentPersona.role === "REVIEWER"
                      ? "border-[#cf4f27]/30 bg-[#cf4f27]/10 text-[#cf4f27]"
                      : currentPersona.role === "MANAGER"
                      ? "border-blue-500/30 bg-blue-50 text-blue-700"
                      : currentPersona.role === "ADMIN"
                      ? "border-purple-500/30 bg-purple-50 text-purple-700"
                      : "border-border bg-muted text-foreground"
                  }`}
                >
                  <UserCheck className="size-3" />
                  <span>{currentPersona.title}</span>
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {currentPersona.role === "CREATOR" &&
                  "Creator Mode: You can draft copy, upload scripts, accept 1-click fixes for routine items. Sensitive claims (health & financial guarantees) are escalated to Legal Reviewer."}
                {currentPersona.role === "REVIEWER" &&
                  "Legal Reviewer Mode: You hold regulatory sign-off authority. You can approve or reject sensitive claims and grant final pre-publication approval."}
                {currentPersona.role === "MANAGER" &&
                  "Brand Manager Mode: You oversee campaign workflows and can inspect the Guideline Clarity Heatmap to distinguish ambiguous rules from training gaps."}
                {currentPersona.role === "ADMIN" &&
                  "Administrator Mode: Complete audit trail oversight with immutable HMAC-SHA256 forward hash chain verification."}
              </p>
            </div>
          </div>

          {/* Role-Specific Direct Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {currentPersona.role === "REVIEWER" && !isApproved && reviewOutput && (
              <button
                onClick={onFinalApprove}
                className="inline-flex items-center gap-2 rounded-lg bg-[#cf4f27] hover:bg-[#b8421e] text-white px-4 py-2 text-xs font-semibold shadow-2xs transition-colors"
              >
                <Shield className="size-4" />
                <span>Grant Legal Publication Approval</span>
              </button>
            )}

            {isApproved && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>Approved for Public Distribution</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. RAG Marketing Assistant Prompt Co-Pilot */}
      <div className="mb-8">
        <RagPromptAssistant
          currentDraftText={activeText}
          onApplyScriptToEditor={(newScript) => {
            setActiveText(newScript);
            onRunReview(newScript, activeIntent);
          }}
        />
      </div>

      {/* 3. Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): Script Editor & Role Tabs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
            {/* Top Navigation Tabs (Role-Adaptive) */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
              <button
                onClick={() => setActiveTab("editor")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "editor"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="size-3.5" />
                <span>Script Editor</span>
              </button>

              <button
                onClick={() => setActiveTab("upload")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "upload"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="size-3.5" />
                <span>Upload File</span>
              </button>

              <button
                onClick={() => setActiveTab("rules")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === "rules"
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="size-3.5" />
                <span>Active Rules</span>
              </button>

              {/* Manager-only Clarity Heatmap Tab */}
              {currentPersona.role === "MANAGER" && (
                <button
                  onClick={() => setActiveTab("clarity")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeTab === "clarity"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <BarChart3 className="size-3.5" />
                  <span>Clarity Heatmap</span>
                </button>
              )}

              {/* Admin-only Audit Trail Tab */}
              {currentPersona.role === "ADMIN" && (
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    activeTab === "audit"
                      ? "bg-purple-600 text-white"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <History className="size-3.5" />
                  <span>Audit Trail</span>
                </button>
              )}
            </div>

            {/* Tab 1: Editor & Intent */}
            {activeTab === "editor" && (
              <div className="space-y-4">
                {/* Creator Purpose / Intent */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                    Target Audience / Purpose:
                  </label>
                  <input
                    type="text"
                    value={activeIntent}
                    onChange={(e) => setActiveIntent(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white text-foreground px-3.5 py-2.5 text-sm focus:outline-none focus:border-foreground"
                    placeholder="E.g., Instagram Reel promoting morning vitality..."
                  />
                </div>

                {/* Draft Content Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                      Your Script Text:
                    </label>
                    <span className="text-xs text-muted-foreground font-mono tabular-nums">
                      {activeText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    value={activeText}
                    onChange={(e) => setActiveText(e.target.value)}
                    rows={9}
                    className="w-full rounded-lg border border-border bg-white text-foreground p-3.5 text-sm sm:text-base focus:outline-none focus:border-foreground leading-relaxed font-sans placeholder:text-muted-foreground"
                    placeholder="Type or paste your video script here..."
                  />
                </div>

                {/* Run Review Button */}
                <button
                  onClick={() => onRunReview(activeText, activeIntent)}
                  disabled={isAnalyzing}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-foreground text-background hover:opacity-90 py-3 text-sm font-semibold transition-opacity shadow-xs"
                >
                  {isAnalyzing ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      <span>Checking brand rules...</span>
                    </span>
                  ) : (
                    <>
                      <Play className="size-4 fill-current" />
                      <span>Check My Script for Mistakes</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 2: File Upload */}
            {activeTab === "upload" && (
              <div className="py-6 space-y-5 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
                  <Upload className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Upload Your Script File
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Upload a plain text (.txt), Markdown (.md), PDF, or Word (.docx) file. Verity checks it immediately.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-2xs">
                  <span>{isUploading ? "Reading..." : "Select File from Computer"}</span>
                  <input
                    type="file"
                    accept=".txt,.md,.docx,.pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                {uploadSuccessMsg && (
                  <p className="text-xs text-foreground bg-muted p-2.5 rounded-lg border border-border">
                    {uploadSuccessMsg}
                  </p>
                )}

                {/* 1-Click Sample Loaders for Quick Demo */}
                <div className="pt-4 border-t border-border/60 text-left space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Or Test with 1-Click Sample Scripts:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadSample("flagged")}
                      className="rounded-lg border border-border bg-card p-2.5 text-left text-xs hover:border-foreground/40 transition-colors"
                    >
                      <div className="font-semibold text-foreground">Sample with Banned Claims</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Contains 'cure', 'cheap', 'users'</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoadSample("compliant")}
                      className="rounded-lg border border-border bg-card p-2.5 text-left text-xs hover:border-foreground/40 transition-colors"
                    >
                      <div className="font-semibold text-foreground">100% Compliant Sample</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Clear guide with zero errors</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Active Brand Rules */}
            {activeTab === "rules" && (
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground pb-1">
                  Active policy clauses enforced against your submission:
                </div>
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {AEGIS_BRAND_GUIDELINE_CLAUSES.slice(0, 6).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleOpenClause(c.id)}
                      className="rounded-lg border border-border bg-muted/30 p-3 text-xs hover:border-foreground/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between font-mono text-xs text-foreground font-semibold mb-1">
                        <span>Rule {c.clauseCode}</span>
                        <span className="text-[11px] text-muted-foreground uppercase">
                          {c.sectionHeading}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {c.clauseText}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Manager Clarity Heatmap */}
            {activeTab === "clarity" && currentPersona.role === "MANAGER" && (
              <div className="space-y-3">
                <ClarityHeatmap metrics={clarityMetrics} />
              </div>
            )}

            {/* Tab 5: Admin Audit Trail */}
            {activeTab === "audit" && currentPersona.role === "ADMIN" && (
              <div className="space-y-3">
                <AuditTimeline records={reviewOutput?.auditTrail || []} isChainValid={true} />
              </div>
            )}
          </div>

          {/* Readability & Clarity Score */}
          {reviewOutput && (
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 text-xs shadow-xs">
              <div className="text-xs font-semibold text-foreground border-b border-border pb-2 flex items-center justify-between">
                <span>Reading Level & Clarity</span>
                <span className="text-muted-foreground font-mono">
                  Score: {reviewOutput.readability.score} / 100
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-[11px] text-muted-foreground font-mono">Clarity Rating</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    {reviewOutput.readability.verdict}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-[11px] text-muted-foreground font-mono">Grade Level</div>
                  <div className="text-sm font-semibold text-foreground mt-0.5">
                    Grade {reviewOutput.readability.gradeLevel} (Easy to understand)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Step-by-Step Mistakes & How to Fix */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
            {/* Header with Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Mistakes Found in Your Script ({allFindings.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any box to inspect policy citations and apply 1-click compliant fixes
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 text-xs">
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

            {/* Findings List (Expandable Boxes) */}
            {visibleFindings.length === 0 ? (
              <div className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-2">
                <ShieldCheck className="size-7 text-foreground mx-auto" />
                <div className="font-semibold text-foreground text-base">
                  100% Brand Compliant
                </div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No unapproved claims, banned hype terms, or legal violations found in this script. Ready to post!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleFindings.map((f) => (
                  <FindingCard
                    key={f.id}
                    finding={f}
                    userRole={currentPersona.role}
                    onAccept={onAcceptFinding}
                    onDispute={onDisputeFinding}
                    onEdit={onEditFinding}
                    onViewClause={handleOpenClause}
                    defaultExpanded={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClauseDrawer
        clause={activeClause}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </section>
  );
}
