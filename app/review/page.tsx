"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { SubmissionsStore, StoredSubmission, SubmissionStatus } from "@/lib/workflow/submissions-store";
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
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[2]); // Default to Ananya (Reviewer)
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

  const queueSubmissions = submissions.filter(
    (s) => s.status === "Sensitive Hold" || s.status === "Legal Review"
  );

  const selectedSubmission = submissions.find((s) => s.id === selectedSubId) || queueSubmissions[0];

  const isCreator = currentPersona.role === "CREATOR";

  // Run instant findings on the selected submission if needed
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

    setActionModal(null);
    setActionReason("");
    refreshSubmissions();
  };

  return (
    <OuterFrame>
      <NotchedNavbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-24 pb-20 space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/#studio"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
                <ShieldAlert className="size-5 text-[#cf4f27]" />
                <span>Legal & Manager Review Queue</span>
              </h1>
              <span className="rounded-full border border-[#cf4f27]/30 bg-[#cf4f27]/10 px-2.5 py-0.5 text-xs font-mono font-medium text-[#cf4f27]">
                {queueSubmissions.length} Pending
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fictional demo company: Aegis BioHealth. Quarantined marketing claims requiring mandatory human review before publication.
            </p>
          </div>
        </div>

        {/* Access Restriction for Creators */}
        {isCreator ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm my-12">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-orange-50 border border-orange-200 text-[#cf4f27]">
              <Lock className="size-6" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Creator Access Restricted
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
              Creators cannot access the Review Queue or unilaterally dismiss sensitive legal claims. This gatekeeper queue is restricted to Reviewers (Ananya) and Managers to ensure rigorous compliance.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentPersona(DEMO_PERSONAS[2])} // Ananya (Reviewer)
                className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <UserCheck className="size-3.5" />
                <span>Switch to Reviewer (Ananya Sen)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (4 cols): Queue of Submissions */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-foreground px-1">
                <span>Pending Claims ({queueSubmissions.length})</span>
                <span className="text-[11px] text-muted-foreground">Sensitive Hold & Review</span>
              </div>

              {queueSubmissions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                  No submissions currently awaiting legal review.
                </div>
              ) : (
                <div className="space-y-2">
                  {queueSubmissions.map((sub) => {
                    const isSelected = selectedSubmission?.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubId(sub.id)}
                        className={`w-full text-left rounded-xl border p-3.5 transition-all space-y-2 ${
                          isSelected
                            ? "border-foreground bg-card shadow-xs"
                            : "border-border bg-card/60 hover:bg-card hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-foreground line-clamp-1">
                            {sub.title}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-semibold shrink-0 ${
                              sub.status === "Sensitive Hold"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-orange-50 text-orange-700 border border-orange-200"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {sub.statedIntent || sub.rawText}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/50">
                          <span>{sub.targetChannel.replace(/_/g, " ")}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>{new Date(sub.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column (8 cols): Submission Details, Quoted Clause, Human Decisions & Comments */}
            {selectedSubmission ? (
              <div className="lg:col-span-8 space-y-5">
                {/* 1. Mandatory Trust & Honesty Banner */}
                <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-foreground flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="text-[11px] leading-relaxed">
                    <strong>Notice:</strong> Findings are generated by rules and AI and checked against your approved sources. People make every decision.
                  </span>
                </div>

                {/* 2. Submission Header & Controls */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-foreground">
                          {selectedSubmission.title}
                        </span>
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-mono font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                          {selectedSubmission.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Author: {selectedSubmission.creatorName} · Channel: {selectedSubmission.targetChannel}
                      </div>
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActionModal({ type: "approve", isOpen: true })}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="size-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionModal({ type: "changes", isOpen: true })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <AlertTriangle className="size-3.5 text-amber-600" />
                        <span>Request Changes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActionModal({ type: "reject", isOpen: true })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
                      >
                        <XCircle className="size-3.5 text-red-600" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission Draft Text */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
                      Full Script Content:
                    </span>
                    <div className="rounded-xl border border-border bg-muted/20 p-4 text-xs sm:text-sm text-foreground leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedSubmission.rawText}
                    </div>
                  </div>

                  {/* Findings with Exact Quoted Clause Text */}
                  <div className="space-y-3 pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                        Flagged Claims & Quoted Rules ({deterministicResults.findings.length}):
                      </span>
                    </div>

                    <div className="space-y-3">
                      {deterministicResults.findings.map((f) => {
                        const storedClause = CLAUSE_DATABASE_MAP.get(f.clauseId);
                        const clauseText = storedClause?.clauseText || f.exactQuote;

                        return (
                          <div
                            key={f.id}
                            className="rounded-xl border border-border bg-card p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-mono font-medium text-foreground">
                                  <span>Verified against {f.clauseCode}</span>
                                </span>
                                <span className="font-semibold text-xs text-foreground">
                                  "{f.flaggedText}"
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                  f.severity === "SENSITIVE"
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {f.severity}
                              </span>
                            </div>

                            {/* Exact Quoted Clause Text */}
                            <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-1 text-xs">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <BookOpen className="size-3" />
                                <span>Official Approved Rule ({f.clauseCode}):</span>
                              </span>
                              <p className="text-xs text-muted-foreground italic leading-relaxed">
                                "{clauseText}"
                              </p>
                            </div>

                            {/* Proposed Fix Diff */}
                            {f.suggestedDiff && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                                  Proposed Before / After Fix:
                                </span>
                                <SplitDiffViewer
                                  originalText={f.suggestedDiff.original}
                                  replacementText={f.suggestedDiff.replacement}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments Thread */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-muted-foreground" />
                      <span>Submission Comments ({selectedSubmission.comments?.length || 0}):</span>
                    </span>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {(!selectedSubmission.comments || selectedSubmission.comments.length === 0) ? (
                        <div className="text-xs text-muted-foreground italic py-2">
                          No comments posted yet.
                        </div>
                      ) : (
                        selectedSubmission.comments.map((c) => (
                          <div
                            key={c.id}
                            className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="font-semibold text-foreground">
                                {c.author} ({c.role})
                              </span>
                              <span className="font-mono">
                                {new Date(c.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                              </span>
                            </div>
                            <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={`Add note as ${currentPersona.name}...`}
                        className="flex-1 rounded-lg border border-border bg-white text-foreground px-3 py-2 text-xs focus:outline-none focus:border-foreground"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                      >
                        <Send className="size-3" />
                        <span>Post Note</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* Required Reason Decision Modal */}
      {actionModal && actionModal.isOpen && (
        <div
          onClick={() => setActionModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                {actionModal.type === "approve"
                  ? "Approve Submission for Publication"
                  : actionModal.type === "changes"
                  ? "Request Required Changes from Creator"
                  : "Reject Submission"}
              </h3>
              <p className="text-xs text-muted-foreground">
                A regulatory rationale is mandatory and will be permanently recorded in the append-only audit history.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-semibold text-foreground">
                Decision Reason (Required):
              </label>
              <textarea
                rows={3}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter justification (e.g. substantiated by independent clinical documentation or conflicts with FTC disclaimer policy)..."
                className="w-full rounded-lg border border-border bg-white text-foreground p-3 text-xs focus:outline-none focus:border-foreground"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!actionReason.trim()}
                onClick={handleExecuteDecision}
                className={`rounded-lg px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40 ${
                  actionModal.type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : actionModal.type === "changes"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm {actionModal.type === "approve" ? "Approval" : actionModal.type === "changes" ? "Revision Request" : "Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </OuterFrame>
  );
}
