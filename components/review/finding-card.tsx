"use client";

import React, { useState } from "react";
import { Finding, UserRole } from "@/lib/engine/types";
import { SplitDiffViewer } from "./split-diff-viewer";
import {
  Check,
  Edit3,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Send
} from "lucide-react";

interface FindingCardProps {
  finding: Finding;
  userRole: UserRole;
  onAccept: (findingId: string) => void;
  onDispute: (findingId: string, rationale: string) => void;
  onEdit: (findingId: string, newReplacement: string, rationale: string) => void;
  onViewClause: (clauseId: string) => void;
  defaultExpanded?: boolean;
}

export function FindingCard({
  finding,
  userRole,
  onAccept,
  onDispute,
  onEdit,
  onViewClause,
  defaultExpanded = false,
}: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isDisputing, setIsDisputing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rationaleInput, setRationaleInput] = useState("");
  const [customReplacement, setCustomReplacement] = useState(
    finding.suggestedDiff.replacement
  );

  const isSensitive = finding.severity === "SENSITIVE";
  const isCreator = userRole === "CREATOR";
  const isLockedForCreator = isSensitive && isCreator;

  const handleDisputeSubmit = () => {
    if (!rationaleInput.trim()) return;
    onDispute(finding.id, rationaleInput.trim());
    setIsDisputing(false);
    setRationaleInput("");
  };

  const handleEditSubmit = () => {
    if (!customReplacement.trim()) return;
    onEdit(
      finding.id,
      customReplacement.trim(),
      rationaleInput.trim() || "Custom replacement provided by author."
    );
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        finding.status === "ACCEPTED"
          ? "border-border bg-muted/20 opacity-80"
          : isSensitive
          ? "border-border bg-card hover:border-[#cf4f27]/40"
          : "border-border bg-card hover:border-foreground/30"
      }`}
    >
      {/* 1. Clickable Summary Strip */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer group"
        aria-expanded={isExpanded}
      >
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Badge: Clause Verification */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-mono font-medium text-foreground shrink-0">
            {finding.confidence === "low_confidence" ? (
              <span className="text-amber-700">Low confidence</span>
            ) : (
              <span>Verified against {finding.clauseCode || "Guideline"}</span>
            )}
          </span>

          {/* Severity Badge */}
          {isSensitive ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#cf4f27]/30 bg-[#cf4f27]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#cf4f27] shrink-0 font-mono">
              <ShieldAlert className="size-3" />
              <span>Sensitive (Sent to reviewer)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0 font-mono">
              <span>Severity: Routine</span>
            </span>
          )}

          {/* Flagged phrase */}
          <div className="text-xs truncate font-medium text-foreground max-w-xs">
            &quot;{finding.flaggedText}&quot;
          </div>
        </div>

        {/* Right side: Expand indicator */}
        <div className="flex items-center gap-2 shrink-0 ml-3 text-xs text-muted-foreground group-hover:text-foreground">
          {finding.status === "ACCEPTED" ? (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground">
              <Check className="size-3 text-emerald-600" />
              <span>Accepted</span>
            </span>
          ) : (
            <span className="font-mono text-[11px] hidden sm:inline">
              {isExpanded ? "Collapse" : "Click to view fix"}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </div>
      </button>

      {/* 2. Expanded Details (Revealed on Click) */}
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-5 space-y-4 bg-muted/10 animate-in fade-in duration-150">
          {/* Explanation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
              Issue Explanation:
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {finding.explanation}
            </p>
          </div>

          {/* Quoted Approved Source Clause */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
              Quoted Clause Policy ({finding.clauseCode}):
            </span>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              &quot;{finding.exactQuote || "Approved source guideline clause requirement."}&quot;
            </p>
          </div>

          {/* Word-Level Before/After Replacement Diff */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
              Before / After Diff:
            </span>
            <SplitDiffViewer
              originalText={finding.suggestedDiff.original}
              replacementText={finding.suggestedDiff.replacement}
            />
          </div>

          {/* Rule Citation Link */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewClause(finding.clauseId);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono font-medium text-foreground">
              Rule {finding.clauseCode}
            </span>
            <span>·</span>
            <span>View Rule Details</span>
            <ExternalLink className="size-3" />
          </button>

          {/* Custom Edit Form */}
          {isEditing && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="text-xs font-semibold text-foreground">
                Custom Replacement:
              </div>
              <textarea
                value={customReplacement}
                onChange={(e) => setCustomReplacement(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-background text-foreground p-2 text-xs focus:outline-none focus:border-foreground"
                placeholder="Type your revised phrase..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="rounded-lg bg-foreground text-background px-3 py-1 text-xs font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Dispute Form */}
          {isDisputing && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-3 shadow-xs">
              <div className="text-xs font-semibold text-foreground">
                Dispute Reason:
              </div>
              <textarea
                value={rationaleInput}
                onChange={(e) => setRationaleInput(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-background text-foreground p-2 text-xs focus:outline-none focus:border-foreground"
                placeholder="Explain why this rule shouldn't apply here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDisputing(false)}
                  className="rounded-lg px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisputeSubmit}
                  className="rounded-lg bg-foreground text-background px-3 py-1 text-xs font-semibold"
                >
                  Submit Dispute
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <div className="text-[11px] font-mono">
              {isLockedForCreator ? (
                <span className="inline-flex items-center gap-1.5 text-[#cf4f27] font-medium">
                  <Lock className="size-3" />
                  <span>Sent to reviewer: Quarantined for Reviewer sign-off</span>
                </span>
              ) : finding.status === "ACCEPTED" ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="size-3" />
                  <span>Fix applied to script</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Action required</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {finding.status !== "ACCEPTED" && (
                <>
                  {!isLockedForCreator && (
                    <>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs text-foreground hover:bg-muted font-medium"
                      >
                        Custom Edit
                      </button>

                      <button
                        onClick={() => setIsDisputing(!isDisputing)}
                        className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground font-medium"
                      >
                        Dispute
                      </button>

                      <button
                        onClick={() => onAccept(finding.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-foreground text-background hover:opacity-90 px-3 py-1 text-xs font-semibold shadow-2xs"
                      >
                        <Check className="size-3" />
                        <span>Accept Proposed Fix</span>
                      </button>
                    </>
                  )}

                  {isLockedForCreator && (
                    <span className="text-[11px] text-muted-foreground italic">
                      Creators cannot dismiss sensitive findings.
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
