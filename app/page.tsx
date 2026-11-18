"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { AsciiHero } from "@/components/reworker/ascii-hero";
import { CampaignsCombobox } from "@/components/reworker/campaigns-combobox";
import { ThreeStepMethod } from "@/components/reworker/three-step-method";
import { LiveStudio } from "@/components/reworker/live-studio";
import { FaqAccordion } from "@/components/reworker/faq-accordion";
import { FooterWordmark } from "@/components/reworker/footer-wordmark";
import { PresentationModal } from "@/components/reworker/presentation-modal";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { FIFTEEN_TEST_SUBMISSIONS, TestSubmissionCase } from "@/lib/data/test-submissions";
import { executeGovernanceReview, FullReviewOutput } from "@/lib/engine/orchestrator";
import { GovernanceStateMachine } from "@/lib/workflow/workflow-engine";

export default function ProductizedApp() {
  // Active Demo Persona
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[0]); // Rahul (Creator) by default

  // Active Campaign / Submission
  const [selectedCase, setSelectedCase] = useState<TestSubmissionCase>(FIFTEEN_TEST_SUBMISSIONS[0]);

  // State Machine and Review Output
  const [stateMachine] = useState<GovernanceStateMachine>(() => new GovernanceStateMachine());
  const [reviewOutput, setReviewOutput] = useState<FullReviewOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  // Run Hybrid Review Engine
  const handleRunReview = async (customText?: string, customIntent?: string) => {
    setIsAnalyzing(true);
    try {
      const textToReview = customText !== undefined ? customText : selectedCase.rawText;
      const intentToReview = customIntent !== undefined ? customIntent : selectedCase.statedIntent;

      const output = await executeGovernanceReview(
        {
          submissionId: selectedCase.id,
          title: selectedCase.title,
          rawText: textToReview,
          statedIntent: intentToReview,
          targetChannel: selectedCase.targetChannel
        },
        stateMachine
      );
      setReviewOutput(output);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run review on scenario switch
  useEffect(() => {
    handleRunReview(selectedCase.rawText, selectedCase.statedIntent);
  }, [selectedCase.id]);

  // Smooth scroll helpers
  const scrollToStudio = () => {
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMethod = () => {
    document.getElementById("method")?.scrollIntoView({ behavior: "smooth" });
  };

  // Handlers for Finding Actions
  const handleAcceptFinding = (findingId: string) => {
    if (!reviewOutput) return;
    const targetFinding = reviewOutput.findings.find((f) => f.id === findingId);
    if (!targetFinding) return;

    const res = stateMachine.handleFindingAction({
      finding: targetFinding,
      actorRole: currentPersona.role,
      action: "ACCEPT",
      rationale: `Accepted by ${currentPersona.name}`
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    stateMachine.logTransition({
      submissionId: selectedCase.id,
      actorId: currentPersona.id,
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      action: "FINDING_ACCEPTED",
      findingId,
      clauseId: targetFinding.clauseId,
      clauseCode: targetFinding.clauseCode,
      rationale: `Accepted proposed fix for ${targetFinding.clauseCode}`,
      previousStatus: reviewOutput.status,
      newStatus: reviewOutput.status
    });

    setReviewOutput({
      ...reviewOutput,
      findings: reviewOutput.findings.map((f) => (f.id === findingId ? res.updatedFinding : f)),
      auditTrail: stateMachine.getAuditHistory(selectedCase.id)
    });
  };

  const handleDisputeFinding = (findingId: string, rationale: string) => {
    if (!reviewOutput) return;
    const targetFinding = reviewOutput.findings.find((f) => f.id === findingId);
    if (!targetFinding) return;

    const res = stateMachine.handleFindingAction({
      finding: targetFinding,
      actorRole: currentPersona.role,
      action: "DISPUTE",
      rationale
    });

    if (res.error) {
      alert(res.error);
      return;
    }

    stateMachine.logTransition({
      submissionId: selectedCase.id,
      actorId: currentPersona.id,
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      action: "FINDING_DISPUTED",
      findingId,
      clauseId: targetFinding.clauseId,
      clauseCode: targetFinding.clauseCode,
      rationale,
      previousStatus: reviewOutput.status,
      newStatus: reviewOutput.status
    });

    setReviewOutput({
      ...reviewOutput,
      findings: reviewOutput.findings.map((f) => (f.id === findingId ? res.updatedFinding : f)),
      auditTrail: stateMachine.getAuditHistory(selectedCase.id)
    });
  };

  const handleEditFinding = (findingId: string, newReplacement: string, rationale: string) => {
    if (!reviewOutput) return;
    const targetFinding = reviewOutput.findings.find((f) => f.id === findingId);
    if (!targetFinding) return;

    const res = stateMachine.handleFindingAction({
      finding: targetFinding,
      actorRole: currentPersona.role,
      action: "EDIT",
      rationale,
      newReplacementText: newReplacement
    });

    stateMachine.logTransition({
      submissionId: selectedCase.id,
      actorId: currentPersona.id,
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      action: "FINDING_EDITED",
      findingId,
      clauseId: targetFinding.clauseId,
      clauseCode: targetFinding.clauseCode,
      rationale: `Author provided revised replacement: "${newReplacement}"`,
      previousStatus: reviewOutput.status,
      newStatus: reviewOutput.status
    });

    setReviewOutput({
      ...reviewOutput,
      findings: reviewOutput.findings.map((f) => (f.id === findingId ? res.updatedFinding : f)),
      auditTrail: stateMachine.getAuditHistory(selectedCase.id)
    });
  };

  const handleFinalApproval = () => {
    if (!reviewOutput) return;

    if (
      reviewOutput.status === "ESCALATED_TO_REVIEWER" &&
      currentPersona.role !== "REVIEWER" &&
      currentPersona.role !== "ADMIN"
    ) {
      alert(
        "Permission Denied: This submission contains escalated sensitive claims and can only be given final approval by an Authorised Reviewer (Ananya / Legal)."
      );
      return;
    }

    stateMachine.logTransition({
      submissionId: selectedCase.id,
      actorId: currentPersona.id,
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      action: "SUBMISSION_APPROVED",
      previousStatus: reviewOutput.status,
      newStatus: "APPROVED",
      rationale: `Final pre-publication approval granted by ${currentPersona.name} (${currentPersona.role})`
    });

    setReviewOutput({
      ...reviewOutput,
      status: "APPROVED",
      auditTrail: stateMachine.getAuditHistory(selectedCase.id)
    });
  };

  return (
    <OuterFrame>
      {/* 1. Header Navigation */}
      <NotchedNavbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* 2. Editorial Hero Section with Direct Role Switcher */}
      <AsciiHero
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
        onScrollToStudio={scrollToStudio}
        onScrollToMethod={scrollToMethod}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* 3. Start Here 4-Step Interactive Guide Panel */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-8">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-mono font-bold">
                !
              </span>
              <span className="text-sm font-semibold text-foreground">
                Start Here: 4-Step Interactive Governance Flow
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Fictional demo company: Aegis BioHealth
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-mono font-bold">
                  1
                </span>
                <span className="text-xs font-semibold text-foreground">As Creator</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Click <strong>Check My Script</strong> below. Routine terms have 1-click fixes; sensitive claims are quarantined.
              </p>
            </div>

            {/* Step 2 */}
            <Link
              href="/review"
              className="rounded-xl border border-border bg-muted/20 hover:border-foreground/40 hover:bg-muted/40 p-3.5 space-y-1.5 transition-colors group block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#cf4f27] text-white text-[11px] font-mono font-bold">
                    2
                  </span>
                  <span className="text-xs font-semibold text-foreground group-hover:text-[#cf4f27] transition-colors">
                    Open /review
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Open <strong>/review</strong> as Reviewer to approve or request changes with a mandatory reason.
              </p>
            </Link>

            {/* Step 3 */}
            <Link
              href="/history"
              className="rounded-xl border border-border bg-muted/20 hover:border-foreground/40 hover:bg-muted/40 p-3.5 space-y-1.5 transition-colors group block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-mono font-bold">
                    3
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Open /history
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Open <strong>/history</strong> to inspect the immutable audit trail of every check, fix, and decision.
              </p>
            </Link>

            {/* Step 4 */}
            <Link
              href="/insights"
              className="rounded-xl border border-border bg-muted/20 hover:border-foreground/40 hover:bg-muted/40 p-3.5 space-y-1.5 transition-colors group block"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-mono font-bold">
                    4
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    As Manager
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Open <strong>Insights</strong> to distinguish ambiguous guidelines from employee training gaps.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. The Core Product: The Live Interactive Studio with Role Capabilities (Moved to top under Hero) */}
      <LiveStudio
        currentPersona={currentPersona}
        selectedCase={selectedCase}
        reviewOutput={reviewOutput}
        isAnalyzing={isAnalyzing}
        onRunReview={handleRunReview}
        onAcceptFinding={handleAcceptFinding}
        onDisputeFinding={handleDisputeFinding}
        onEditFinding={handleEditFinding}
        onFinalApprove={handleFinalApproval}
      />

      {/* 5. Real Creator Examples */}
      <CampaignsCombobox
        selectedId={selectedCase.id}
        onSelectCampaign={(c) => {
          setSelectedCase(c);
          scrollToStudio();
        }}
      />

      {/* 6. Three-Step Method Walkthrough (Shrunk and placed below Studio) */}
      <ThreeStepMethod />

      {/* 7. FAQ Accordion (Shrunk and placed below Studio) */}
      <FaqAccordion />

      {/* 8. Footer with Closing CTA & Team Accreditation */}
      <FooterWordmark onScrollToStudio={scrollToStudio} />

      {/* 9. 2-Minute Guided Demo Overview Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </OuterFrame>
  );
}
