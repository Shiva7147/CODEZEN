"use client";

import React, { useState } from "react";
import { Persona } from "../navigation/top-nav";
import { FindingCard } from "../review/finding-card";
import { ClauseDrawer } from "../review/clause-drawer";
import { RagPromptAssistant } from "./rag-prompt-assistant";
import { TestSubmissionCase } from "@/lib/data/test-submissions";
import { FullReviewOutput } from "@/lib/engine/orchestrator";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { CLAUSE_DATABASE_MAP, AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import {
  FileText,
  Play,
  Upload,
  ShieldCheck,
  Check,
  BookOpen,
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<"editor" | "upload" | "rules">("editor");
  const [activeText, setActiveText] = useState(selectedCase.rawText);
  const [activeIntent, setActiveIntent] = useState(selectedCase.statedIntent);
  const [activeClause, setActiveClause] = useState<StoredClause | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [findingFilter, setFindingFilter] = useState<"ALL" | "SENSITIVE" | "ROUTINE">("ALL");

  React.useEffect(() => {
    setActiveText(selectedCase.rawText);
    setActiveIntent(selectedCase.statedIntent);
  }, [selectedCase.id]);

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
          extractedText = `[Uploaded: ${file.name}]\nDocument text extracted.`;
        }
      } else {
        extractedText = await file.text();
      }

      setActiveText(extractedText);
      const wordCount = extractedText.split(/\s+/).filter(Boolean).length;
      setUploadSuccessMsg(`Loaded "${file.name}" (${wordCount} words) — Scan completed.`);
      setActiveTab("editor");

      onRunReview(extractedText, activeIntent);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadSuccessMsg("Upload failed. Please upload a plain text, PDF, or Word file.");
    } finally {
      setIsUploading(false);
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

  return (
    <section id="studio" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8 border-b border-border pb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5 font-semibold">
            The Interactive Studio
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
            Paste your script and fix errors step-by-step
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Write or paste your video caption. Verity flags any words that violate advertising rules and gives you 1-click replacements.
          </p>
        </div>

        {/* Status Pill & Role Sign-off Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs shadow-2xs">
            <span className="text-muted-foreground font-mono">Current Status:</span>
            <span className="font-semibold text-foreground">
              {reviewOutput?.status === "ESCALATED_TO_REVIEWER"
                ? "Needs Legal Reviewer"
                : reviewOutput?.status === "APPROVED"
                ? "Approved to Publish"
                : "In Review"}
            </span>
          </div>

          {!isApproved && reviewOutput && (
            <button
              onClick={onFinalApprove}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background hover:opacity-90 px-4 py-2 text-xs font-semibold transition-opacity shadow-2xs"
            >
              <Check className="size-4" />
              <span>Approve Script</span>
            </button>
          )}
        </div>
      </div>

      {/* RAG Marketing Assistant Prompt Co-Pilot */}
      <div className="mb-8">
        <RagPromptAssistant
          currentDraftText={activeText}
          onApplyScriptToEditor={(newScript) => {
            setActiveText(newScript);
            onRunReview(newScript, activeIntent);
          }}
        />
      </div>

      {/* Main Studio Grid: 2 Clear Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): Script Editor */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-1.5">
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
              </div>

              <span className="text-xs text-muted-foreground font-mono">
                {currentPersona.name.split(" ")[0]} ({currentPersona.role})
              </span>
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

                {/* Draft Content Textarea (High-contrast 15px text) */}
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
              <div className="py-8 space-y-4 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-muted-foreground">
                  <Upload className="size-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Upload Your Script File
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                    Upload a plain text (.txt), Markdown (.md), or Word (.docx) file. Verity checks it immediately.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity shadow-2xs">
                  <span>{isUploading ? "Reading..." : "Select File"}</span>
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
          </div>

          {/* Simple Readability Score */}
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
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Mistakes Found in Your Script ({allFindings.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any box to see why it was flagged and click to fix it
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
                {visibleFindings.map((f, idx) => (
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
