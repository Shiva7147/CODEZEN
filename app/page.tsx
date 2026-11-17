"use client";

import React, { useState, useEffect } from "react";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { AsciiHero } from "@/components/reworker/ascii-hero";
import { CampaignsCombobox } from "@/components/reworker/campaigns-combobox";
import { ThreeStepMethod } from "@/components/reworker/three-step-method";
import { LiveStudio } from "@/components/reworker/live-studio";
import { FaqAccordion } from "@/components/reworker/faq-accordion";
import { ActivityMatrix } from "@/components/reworker/activity-matrix";
import { CustomerStories } from "@/components/reworker/customer-stories";
import { PricingTiers } from "@/components/reworker/pricing-tiers";
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
      const output = await executeGovernanceReview(
        {
          submissionId: selectedCase.id,
          title: selectedCase.title,
          rawText: customText || selectedCase.rawText,
          statedIntent: customIntent || selectedCase.statedIntent,
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

      {/* 2. Editorial Hero Section */}
      <AsciiHero
        onScrollToStudio={scrollToStudio}
        onScrollToMethod={scrollToMethod}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      {/* 3. Real Creator Examples (Scenario 1, Scenario 2, Scenario 3) */}
      <CampaignsCombobox
        selectedId={selectedCase.id}
        onSelectCampaign={(c) => {
          setSelectedCase(c);
          scrollToStudio();
        }}
      />

      {/* 4. Three-Step Method Walkthrough */}
      <ThreeStepMethod />

      {/* 5. The Core Product: The Live Interactive Studio with Tabs & Assistant */}
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

      {/* 6. Activity Ledger: 365 Days of Brand Governance */}
      <ActivityMatrix />

      {/* 7. Real People Case Studies */}
      <CustomerStories />

      {/* 8. Pricing & Deployment Tiers */}
      <PricingTiers />

      {/* 9. FAQ Accordion: Governance Architecture & Criteria */}
      <FaqAccordion />

      {/* 10. Footer with Closing CTA & Giant Monolithic Wordmark */}
      <FooterWordmark onScrollToStudio={scrollToStudio} />

      {/* 8. 5-Slide Interactive Presentation Overview Modal */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </OuterFrame>
  );
}
