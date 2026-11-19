"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { SubmissionsStore, StoredSubmission, SubmissionStatus } from "@/lib/workflow/submissions-store";
import { DemoStepperStore } from "@/lib/workflow/demo-stepper-store";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { CLAUSE_DATABASE_MAP } from "@/lib/data/sample-brand-guidelines";
import { runDeterministicChecks } from "@/lib/engine/rules";
import { SplitDiffViewer } from "@/components/review/split-diff-viewer";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  UserCheck,
  BookOpen,
  FileText,
  Lock,
  ChevronRight
} from "lucide-react";

export default function ReviewQueuePage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => {
    const active = PersonaStore.getActivePersona();
    // Default to Reviewer if creator is active so reviewers see queue immediately
    if (active.role === "CREATOR") {
      const reviewer = DEMO_PERSONAS.find((p) => p.role === "REVIEWER") || DEMO_PERSONAS[1];
      return reviewer;
    }
    return active;
  });

  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<string | null>("sub_test_01");
  const [commentInput, setCommentInput] = useState("");
  const [actionModal, setActionModal] = useState<{
    type: "approve" | "changes" | "reject";
    isOpen: boolean;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");

  const refreshSubmissions = () => {
    const list = SubmissionsStore.getSubmissions();
    setSubmissions(list);
  };

  useEffect(() => {
    refreshSubmissions();
    const handler = () => refreshSubmissions();
    window.addEventListener("verity-state-updated", handler);
    return () => window.removeEventListener("verity-state-updated", handler);
  }, []);

  useEffect(() => {
    const handlePersonaChange = (e: Event) => {
      const custom = e as CustomEvent<Persona>;
      if (custom.detail) setCurrentPersona(custom.detail);
      else setCurrentPersona(PersonaStore.getActivePersona());
    };
    window.addEventListener("verity-persona-changed", handlePersonaChange);
    return () => window.removeEventListener("verity-persona-changed", handlePersonaChange);
  }, []);

  const queueSubmissions = submissions.filter(
    (s) => s.status === "Sensitive Hold" || s.status === "Legal Review"
  );

  const selectedSubmission =
    submissions.find((s) => s.id === selectedSubId) || queueSubmissions[0] || submissions[0];

  const isCreator = currentPersona.role === "CREATOR";

  // Run instant findings on the selected submission
  const deterministicResults = selectedSubmission
    ? runDeterministicChecks(selectedSubmission.rawText, selectedSubmission.id)
    : { findings: [] };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedSubmission) return;

    SubmissionsStore.addComment(
      selectedSubmission.id,
      currentPersona.name,
      currentPersona.role,
      commentInput.trim()
    );
    setCommentInput("");
    refreshSubmissions();
  };

  const handleExecuteDecision = () => {
    if (!actionModal || !actionReason.trim() || !selectedSubmission) return;

    let newStatus: SubmissionStatus = "Approved";
    if (actionModal.type === "reject") newStatus = "Rejected";
    if (actionModal.type === "changes") newStatus = "Changes Requested";

    SubmissionsStore.updateStatus(
      selectedSubmission.id,
      newStatus,
      currentPersona.name,
      currentPersona.role,
      actionReason.trim(),
      deterministicResults.findings[0]?.clauseCode || "GOV-1.0"
    );

    // Mark Step 3 in Stepper
    DemoStepperStore.markStep(3);

    setActionModal(null);
    setActionReason("");
    refreshSubmissions();
  };

  const handleSwitchToReviewer = () => {
    const reviewer = DEMO_PERSONAS.find((p) => p.role === "REVIEWER") || DEMO_PERSONAS[1];
    setCurrentPersona(reviewer);
    PersonaStore.setActivePersona(reviewer);
  };

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
                <ShieldAlert className="size-5 text-[#cf4f27]" />
                <span>Review Queue</span>
              </h1>
              <span className="rounded-full border border-[#cf4f27]/30 bg-[#cf4f27]/10 px-2.5 py-0.5 text-xs font-mono font-medium text-[#cf4f27]">
                {queueSubmissions.length} Pending Hold
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fictional demo company: Aegis BioHealth. Quarantined marketing claims requiring mandatory human review before publication.
            </p>
          </div>
        </div>

        {/* Access Restriction for Creators */}
        {isCreator ? (
          <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4 shadow-xs my-8">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-[#cf4f27] dark:bg-orange-950/30 dark:border-orange-900">
              <Lock className="size-6" />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              Review Queue Restricted to Reviewers
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Creators cannot access the Review Queue or unilaterally dismiss sensitive legal claims. This gate is restricted to Reviewers (Ananya) and Managers to guarantee compliance.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSwitchToReviewer}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity shadow-2xs"
              >
                <UserCheck className="size-3.5" />
                <span>Switch to Ananya (Reviewer)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Reviewer Queue Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (4 Cols): Queue Submissions List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                Quarantined Submissions ({queueSubmissions.length})
              </div>

              {queueSubmissions.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-6 text-center text-xs text-muted-foreground space-y-2">
                  <CheckCircle2 className="size-7 text-emerald-600 mx-auto" />
                  <div className="font-semibold text-foreground">Queue is Clear</div>
                  <p>All sensitive claims have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {queueSubmissions.map((sub) => {
                    const isSelected = sub.id === selectedSubmission?.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubId(sub.id)}
                        className={`w-full text-left rounded-xl border p-3.5 transition-all text-xs space-y-2 cursor-pointer ${
                          isSelected
                            ? "border-foreground bg-muted/60 shadow-xs ring-1 ring-border"
                            : "border-border bg-card hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-foreground line-clamp-1 leading-snug">
                            {sub.title}
                          </span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-mono shrink-0 bg-[#cf4f27]/15 text-[#cf4f27] font-semibold">
                            {sub.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>{sub.creatorName.split(" ")[0]}</span>
                          <span>{new Date(sub.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column (8 Cols): Selected Submission Details & Actions */}
            {selectedSubmission && (
              <div className="lg:col-span-8 space-y-5">
                {/* Submission Header Card */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                          {selectedSubmission.targetChannel}
                        </span>
                        <span className="rounded-full bg-[#cf4f27]/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#cf4f27]">
                          {selectedSubmission.status}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-semibold text-foreground">
                        {selectedSubmission.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Author: {selectedSubmission.creatorName} · Stated Intent: &quot;{selectedSubmission.statedIntent}&quot;
                      </p>
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActionModal({ type: "changes", isOpen: true })}
                        className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400 hover:opacity-90 transition-opacity"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => setActionModal({ type: "reject", isOpen: true })}
                        className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-3 py-1.5 text-xs font-semibold text-red-800 dark:text-red-400 hover:opacity-90 transition-opacity"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setActionModal({ type: "approve", isOpen: true })}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Approve Submission</span>
                      </button>
                    </div>
                  </div>

                  {/* Flagged Findings in this submission */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                      Quarantined Claims &amp; Cited Clauses
                    </div>

                    {deterministicResults.findings.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No policy violations detected.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {deterministicResults.findings.map((finding) => (
                          <div
                            key={finding.id}
                            className="rounded-xl border border-border bg-muted/20 p-4 space-y-3 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-foreground flex items-center gap-1.5">
                                <AlertTriangle className="size-3.5 text-[#cf4f27]" />
                                <span>Flagged phrase: &quot;{finding.flaggedText}&quot;</span>
                              </span>
                              <span className="inline-flex items-center gap-1 font-mono text-[11px] rounded-full bg-muted border border-border px-2 py-0.5 text-foreground">
                                Verified against {finding.clauseCode}
                              </span>
                            </div>

                            {/* Quoted clause text */}
                            <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                                Approved Policy Rule ({finding.clauseCode}):
                              </span>
                              <p className="text-xs italic text-muted-foreground leading-relaxed">
                                &quot;{finding.exactQuote || "Approved corporate guideline clause requirement."}&quot;
                              </p>
                            </div>

                            {/* Proposed remediation diff */}
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                                Proposed Replacement Diff:
                              </span>
                              <SplitDiffViewer
                                originalText={finding.suggestedDiff.original}
                                replacementText={finding.suggestedDiff.replacement}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Raw Text Preview */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                      Full Submitted Copy
                    </span>
                    <div className="rounded-xl border border-border bg-muted/10 p-3.5 font-mono text-xs text-foreground leading-relaxed max-h-48 overflow-y-auto">
                      {selectedSubmission.rawText}
                    </div>
                  </div>
                </div>

                {/* Collaboration & Comments Card */}
                <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <MessageSquare className="size-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                      Review Comments ({selectedSubmission.comments?.length || 0})
                    </span>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {(!selectedSubmission.comments || selectedSubmission.comments.length === 0) ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No review comments yet. Add an internal compliance note below.
                      </p>
                    ) : (
                      selectedSubmission.comments.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-border bg-muted/30 p-3 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">
                              {c.author}{" "}
                              <span className="text-[10px] font-mono text-muted-foreground">
                                ({c.role})
                              </span>
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {c.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add an internal reviewer comment or guideline instruction..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3.5 py-2 text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shadow-2xs"
                    >
                      <Send className="size-3" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mandatory Reason Modal for Decision */}
      {actionModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 text-foreground">
            <h3 className="text-sm font-semibold capitalize text-foreground">
              Confirm {actionModal.type === "changes" ? "Change Request" : actionModal.type} Decision
            </h3>
            <p className="text-xs text-muted-foreground">
              A written justification is required by organizational governance policy before logging this decision into the permanent audit ledger.
            </p>

            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:border-foreground"
              placeholder="State the regulatory, brand, or scientific justification for this decision..."
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionModal(null);
                  setActionReason("");
                }}
                className="rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!actionReason.trim()}
                onClick={handleExecuteDecision}
                className="rounded-lg bg-foreground text-background px-4 py-1.5 text-xs font-semibold hover:opacity-90 disabled:opacity-40"
              >
                Confirm &amp; Log Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
