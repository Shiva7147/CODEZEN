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
  ShieldAlert
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
  defaultExpanded = false, // Minimalist default: collapsed until user clicks!
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

  // Clean, short category label
  const categoryLabel =
    finding.issueCategory === "unsupported_claim"
      ? "Unsupported Claim"
      : finding.issueCategory === "promotional_guarantee" || isSensitive
      ? "Sensitive Claim (Legal Hold)"
      : finding.issueCategory === "terminology"
      ? "Terminology Rule"
      : finding.issueCategory === "tone"
      ? "Brand Tone"
      : finding.issueCategory === "readability"
      ? "Readability"
      : String(finding.issueCategory).replace(/_/g, " ");

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
      {/* 1. Minimal Clickable Strip (Clean & Minimal at rest) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer group"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Badge: Clause Verification */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-mono font-medium text-foreground shrink-0">
            {finding.confidence === "low_confidence" ? (
              <span className="text-amber-700">Low confidence</span>
            ) : (
              <span>Verified against {finding.clauseCode || "Guideline"}</span>
            )}
          </span>

          {isSensitive && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#cf4f27]/30 bg-[#cf4f27]/10 px-2 py-0.5 text-[10px] font-medium text-[#cf4f27] shrink-0 font-mono">
              <ShieldAlert className="size-3" />
              <span>Sensitive Hold</span>
            </span>
          )}

          {/* Minimal Flagged Word Preview */}
          <div className="text-xs truncate font-medium text-foreground">
            "{finding.flaggedText}"
          </div>
        </div>

        {/* Right side: Click to open indicator */}
        <div className="flex items-center gap-2 shrink-0 ml-3 text-xs text-muted-foreground group-hover:text-foreground">
          {finding.status === "ACCEPTED" ? (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-foreground">
              <Check className="size-3" />
              <span>Fixed</span>
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

      {/* 2. Expanded Details: ONLY SHOWN WHEN CLICKED */}
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-5 space-y-4 bg-muted/10 animate-in fade-in duration-150">
          {/* Why it was flagged */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
              Why this was flagged:
            </span>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
              {finding.explanation}
            </p>
          </div>

          {/* Quoted Approved Source Clause */}
          <div className="rounded-lg border border-border/80 bg-muted/40 p-3 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">
              Approved Guideline Clause ({finding.clauseCode}):
            </span>
            <p className="text-xs text-muted-foreground italic leading-relaxed">
              "{finding.exactQuote || "Approved source guideline clause requirement."}"
            </p>
          </div>

          {/* Word-Level Replacement Diff */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">
              Proposed Replacement:
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
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono font-medium text-foreground">
              Rule {finding.clauseCode}
            </span>
            <span>·</span>
            <span>Inspect Official Rule in Drawer</span>
            <ExternalLink className="size-3" />
          </button>

          {/* Custom Edit Drawer */}
          {isEditing && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-3.5 shadow-2xs">
              <div className="text-xs font-semibold text-foreground">
                Type Your Own Compliant Phrasing:
              </div>
              <textarea
                value={customReplacement}
                onChange={(e) => setCustomReplacement(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-white text-foreground p-2.5 text-xs focus:outline-none focus:border-foreground"
                placeholder="Type your revised sentence..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
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

          {/* Dispute Drawer */}
          {isDisputing && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-3.5 shadow-2xs">
              <div className="text-xs font-semibold text-foreground">
                Explain Why This Phrase is Appropriate:
              </div>
              <textarea
                value={rationaleInput}
                onChange={(e) => setRationaleInput(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-white text-foreground p-2.5 text-xs focus:outline-none focus:border-foreground"
                placeholder="Explain why this rule shouldn't apply here..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDisputing(false)}
                  className="rounded-lg px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <span className="text-[11px] font-mono text-muted-foreground">
              {isLockedForCreator ? (
                <span className="inline-flex items-center gap-1 text-[#cf4f27]">
                  <Lock className="size-3" />
                  <span>Requires Legal Reviewer Sign-off</span>
                </span>
              ) : finding.status === "ACCEPTED" ? (
                <span className="text-foreground font-semibold">Fixed & Staged</span>
              ) : (
                <span>Ready to apply</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              {finding.status !== "ACCEPTED" && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isLockedForCreator}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted font-medium disabled:opacity-40"
                  >
                    Custom Edit
                  </button>

                  <button
                    onClick={() => setIsDisputing(!isDisputing)}
                    disabled={isLockedForCreator}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground font-medium disabled:opacity-40"
                  >
                    Dispute
                  </button>

                  <button
                    onClick={() => onAccept(finding.id)}
                    disabled={isLockedForCreator}
                    className="inline-flex items-center gap-1 rounded-lg bg-foreground text-background hover:opacity-90 px-3.5 py-1.5 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                  >
                    <Check className="size-3" />
                    <span>Accept 1-Click Fix</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
