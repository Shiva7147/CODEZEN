"use client";

import React, { useState } from "react";
import { TestSubmissionCase, FIFTEEN_TEST_SUBMISSIONS } from "@/lib/data/test-submissions";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface CampaignsComboboxProps {
  onSelectCampaign: (testCase: TestSubmissionCase) => void;
  selectedId: string;
}

export function CampaignsCombobox({
  onSelectCampaign,
  selectedId,
}: CampaignsComboboxProps) {
  // Only one expanded at a time; starts collapsed for minimal clean aesthetic
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Formatted campaign list matching Reworker "Plans for the week you're already in"
  const campaignItems = [
    {
      case: FIFTEEN_TEST_SUBMISSIONS[0],
      name: "Vitality Launch",
      preview: "Flagged 'miracle' & 'cure' · 1-click replacement ready",
      days: "Press Release",
      status: "Sensitive Hold",
      statusType: "sensitive" as const,
      highlightWord: "miracle",
      cleanFix: "clinically tested formulation that supports cellular energy",
      policyNote: "Rule TERM-1.1 bans unapproved medical cures in promotional copy.",
    },
    {
      case: FIFTEEN_TEST_SUBMISSIONS[1],
      name: "Yield Portfolio",
      preview: "Guaranteed 8.4% return & 'world's best' · Requires legal sign-off",
      days: "Newsletter",
      status: "Legal Review",
      statusType: "sensitive" as const,
      highlightWord: "guaranteed returns",
      cleanFix: "targeted historic yield of 8.4% subject to market conditions",
      policyNote: "SEC & FTC rules strictly prohibit performance guarantees.",
    },
    {
      case: FIFTEEN_TEST_SUBMISSIONS[2],
      name: "Member Onboarding",
      preview: "Calm tone, approved terminology · Ready to post immediately",
      days: "Blog Guide",
      status: "100% Compliant",
      statusType: "approved" as const,
      highlightWord: null,
      cleanFix: "No changes needed. Fully aligned with brand governance.",
      policyNote: "Approved vocabulary and calm editorial structure verified.",
    },
    {
      case: FIFTEEN_TEST_SUBMISSIONS[3],
      name: "Homepage Hero Copy",
      preview: "Unsubstantiated 'undisputed #1' and 'cheap' pricing",
      days: "Landing Page",
      status: "Routine Fix",
      statusType: "routine" as const,
      highlightWord: "cheap",
      cleanFix: "accessible introductory subscription for active members",
      policyNote: "Rule TERM-4.5 requires 'accessible' or 'transparent' instead of 'cheap'.",
    },
    {
      case: FIFTEEN_TEST_SUBMISSIONS[4],
      name: "Annual Checkup FAQ",
      preview: "Educational diagnostics guide · Verified calm tone",
      days: "FAQ & Help",
      status: "100% Compliant",
      statusType: "approved" as const,
      highlightWord: null,
      cleanFix: "No changes needed. Educational copy meets compliance standards.",
      policyNote: "Uses verified clinical terms without therapeutic overpromises.",
    },
    {
      case: FIFTEEN_TEST_SUBMISSIONS[5],
      name: "Influencer Video Reel",
      preview: "Missing required FTC brand sponsorship tag",
      days: "Instagram Reel",
      status: "Routine Fix",
      statusType: "routine" as const,
      highlightWord: "missing disclosure",
      cleanFix: "Add [Sponsored by Aegis BioHealth] within first 3 seconds",
      policyNote: "FTC 16 CFR § 255 requires clear and conspicuous paid disclosures.",
    },
  ];

  const displayedItems = showAll
    ? campaignItems
    : campaignItems.slice(0, 6);

  const toggleExpand = (item: typeof campaignItems[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedId === item.case.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.case.id);
    }
  };

  const handleSelect = (testCase: TestSubmissionCase) => {
    onSelectCampaign(testCase);
  };

  return (
    <section id="campaigns" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 scroll-mt-20">
      <div id="scenarios" className="scroll-mt-24" />
      {/* Editorial Header matching Reworker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
            Campaigns for the week you're already in
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md md:text-right">
          Tap any row to inspect draft copy. Click to reveal citations and 1-click fixes.
        </p>
      </div>

      {/* Minimal Table-List Container matching Reworker style */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
        {displayedItems.map((item) => {
          const isSelected = item.case.id === selectedId;
          const isExpanded = expandedId === item.case.id;

          return (
            <div
              key={item.case.id}
              className={`transition-colors ${
                isSelected ? "bg-muted/40" : "hover:bg-muted/20"
              }`}
            >
              {/* Minimal Single-Line Row at Rest */}
              <div
                onClick={(e) => toggleExpand(item, e)}
                className="flex items-center justify-between p-4 sm:px-6 cursor-pointer group select-none gap-4"
              >
                {/* Left: Chevron & Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`flex size-6 items-center justify-center rounded-md border text-muted-foreground transition-transform duration-200 ${
                      isExpanded
                        ? "rotate-90 border-foreground text-foreground bg-muted"
                        : "border-border/70 group-hover:border-foreground/40"
                    }`}
                  >
                    <ChevronRight className="size-3.5" />
                  </span>

                  <span className="font-medium text-sm text-foreground truncate">
                    {item.name}
                  </span>

                  <span className="text-xs text-muted-foreground hidden md:inline truncate">
                    {item.preview}
                  </span>
                </div>

                {/* Right: Channel & Status Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                    {item.days}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                      item.statusType === "sensitive"
                        ? "border-[#cf4f27]/30 bg-[#cf4f27]/10 text-[#cf4f27]"
                        : item.statusType === "routine"
                        ? "border-border bg-muted text-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        item.statusType === "sensitive"
                          ? "bg-[#cf4f27]"
                          : item.statusType === "routine"
                          ? "bg-foreground"
                          : "bg-emerald-600"
                      }`}
                    />
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>

              {/* Progressively Disclosed Detail: ONLY VISIBLE WHEN CLICKED */}
              {isExpanded && (
                <div className="px-6 py-5 bg-muted/20 border-t border-border/50 space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Col 1: Draft Text */}
                    <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Draft Script Excerpt:
                      </div>
                      <p className="text-foreground leading-relaxed italic">
                        "{item.case.rawText.slice(0, 140)}..."
                      </p>
                    </div>

                    {/* Col 2: Policy Citation */}
                    <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Policy Rule Matched:
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.policyNote}
                      </p>
                    </div>

                    {/* Col 3: 1-Click Fix */}
                    <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-foreground font-semibold">
                        Suggested Compliant Replacement:
                      </div>
                      <p className="text-foreground leading-relaxed font-medium">
                        "{item.cleanFix}"
                      </p>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      Stated Goal: {item.case.statedIntent}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        handleSelect(item.case);
                        document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <span>Load into Interactive Studio</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Minimal CTA Pill matching Reworker "Explore plans ->" */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card hover:bg-muted/50 px-4 py-2 text-xs font-medium text-foreground transition-colors shadow-2xs"
        >
          <span>{showAll ? "Show fewer campaigns" : "Explore all campaigns"}</span>
          <ArrowRight className="size-3 text-muted-foreground" />
        </button>
      </div>
    </section>
  );
}
