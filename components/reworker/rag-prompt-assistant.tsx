"use client";

import React, { useState } from "react";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import {
  FileCheck,
  Shield,
  Clock,
  HelpCircle,
  Edit,
  Send,
  Check,
  Copy,
  ArrowRight,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface RagPromptAssistantProps {
  currentDraftText: string;
  onApplyScriptToEditor: (newScript: string) => void;
}

interface AssistantResponse {
  prompt: string;
  answer: string;
  citedClause?: {
    code: string;
    heading: string;
    text: string;
  };
  suggestedScript?: string;
}

export function RagPromptAssistant({
  currentDraftText,
  onApplyScriptToEditor,
}: RagPromptAssistantProps) {
  // Minimalist default: collapsed at rest! Only opens when user clicks
  const [isOpen, setIsOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [activeResponse, setActiveResponse] = useState<AssistantResponse | null>(null);

  const promptPresets = [
    {
      label: "Fix banned words",
      icon: FileCheck,
      query: "Rewrite my script to remove all prohibited claims and guarantees while keeping it energetic for an Instagram Reel.",
    },
    {
      label: "Add FTC disclosure",
      icon: Shield,
      query: "How should I add an FTC-compliant paid partnership disclosure to this caption?",
    },
    {
      label: "Shorten for 30s video",
      icon: Clock,
      query: "Condense this script to a simple 30-second video script that an ordinary viewer can understand.",
    },
    {
      label: "Medical claim rules",
      icon: HelpCircle,
      query: "Can I say our product cures morning fatigue or provides guaranteed energy?",
    },
    {
      label: "Professional tone",
      icon: Edit,
      query: "Remove cheap marketing words like 'dirt-cheap' or 'magic' and make it project calm authority.",
    },
  ];

  const handleRunPrompt = (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setCopied(false);
    setApplied(false);

    const lowerQuery = queryText.toLowerCase();

    let matchedClause = AEGIS_BRAND_GUIDELINE_CLAUSES.find((c) => {
      const cText = (c.clauseText + " " + c.sectionHeading + " " + c.clauseCode).toLowerCase();
      if (lowerQuery.includes("cure") || lowerQuery.includes("fatigue") || lowerQuery.includes("medical")) {
        return c.clauseCode === "TERM-1.1";
      }
      if (lowerQuery.includes("guarantee") || lowerQuery.includes("100%") || lowerQuery.includes("return")) {
        return c.clauseCode === "TERM-2.4";
      }
      if (lowerQuery.includes("tone") || lowerQuery.includes("miracle") || lowerQuery.includes("magic") || lowerQuery.includes("professional")) {
        return c.clauseCode === "TERM-3.2";
      }
      if (lowerQuery.includes("cheap") || lowerQuery.includes("pricing") || lowerQuery.includes("budget")) {
        return c.clauseCode === "TERM-4.5";
      }
      if (lowerQuery.includes("user") || lowerQuery.includes("client") || lowerQuery.includes("consumer")) {
        return c.clauseCode === "TERM-5.1";
      }
      if (lowerQuery.includes("best") || lowerQuery.includes("unrivaled") || lowerQuery.includes("world")) {
        return c.clauseCode === "CLAIM-1.3";
      }
      return cText.split(" ").some((word) => word.length > 4 && lowerQuery.includes(word));
    }) || AEGIS_BRAND_GUIDELINE_CLAUSES[0];

    setTimeout(() => {
      let answerText = "";
      let scriptRewrite = "";

      if (lowerQuery.includes("ftc") || lowerQuery.includes("disclosure") || lowerQuery.includes("sponsorship")) {
        answerText =
          "FTC guidelines require '#PaidPartnership' or '#Ad' at the beginning of your caption before the fold. It cannot be hidden in hashtags.";
        scriptRewrite = `[Paid Partnership with Aegis]\n\n${currentDraftText.replace(
          /guarantees 100% cure/gi,
          "supports active wellness"
        )}\n\n#ad #sponsored`;
      } else if (lowerQuery.includes("shorten") || lowerQuery.includes("30-second") || lowerQuery.includes("30s")) {
        answerText =
          "For a 30-second video, keep your script to 65 words maximum using simple conversational sentences.";
        scriptRewrite =
          "Tired of low energy in the morning? Here is my daily routine.\n\nI drink Aegis Vitality every morning. It is formulated to support natural energy and daily focus, backed by clinical studies.\n\nTap the link in my bio to check out the member discount!";
      } else if (lowerQuery.includes("medical") || lowerQuery.includes("cure")) {
        answerText =
          "Under brand rule TERM-1.1, you cannot say any product 'cures' or 'eliminates' health issues. Use approved phrasing like 'supports metabolic vitality'.";
        scriptRewrite = currentDraftText
          .replace(/guarantees 100% cure for downtime/gi, "supports active energy recovery")
          .replace(/guarantees 100% cure/gi, "supports metabolic vitality")
          .replace(/unrivaled industry-first/gi, "clinically evaluated");
      } else {
        answerText = `Under Rule ${matchedClause.clauseCode} (${matchedClause.sectionHeading}), replace hype words with honest, tested descriptions. Here is your compliant script:`;
        scriptRewrite = currentDraftText
          .replace(/guarantees 100% cure/gi, "supports daily wellness")
          .replace(/dirt-cheap/gi, "accessible")
          .replace(/miracle breakthrough/gi, "scientifically tested formula");
      }

      setActiveResponse({
        prompt: queryText,
        answer: answerText,
        citedClause: {
          code: matchedClause.clauseCode,
          heading: matchedClause.sectionHeading || "Brand Guideline",
          text: matchedClause.clauseText,
        },
        suggestedScript: scriptRewrite,
      });

      setIsLoading(false);
      setPromptInput("");
    }, 250);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = (script: string) => {
    onApplyScriptToEditor(script);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-2xs">
      {/* 1. Minimal Header Strip (Clean at rest) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
            <BookOpen className="size-3.5" />
          </span>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-foreground">
              Script Assistant & Quick Rewrites
            </div>
            <div className="text-xs text-muted-foreground">
              {isOpen ? "Click to collapse" : "Click to ask brand questions or generate compliant scripts"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground font-mono">
          <span className="text-[11px] hidden sm:inline">
            {isOpen ? "Close" : "Open Assistant"}
          </span>
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* 2. Expanded Assistant Body: ONLY SHOWN WHEN CLICKED */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-border space-y-4 bg-muted/10 animate-in fade-in duration-150">
          {/* Quick Action Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Quick 1-Click Tasks:
            </div>
            <div className="flex flex-wrap gap-2">
              {promptPresets.map((preset, idx) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleRunPrompt(preset.query)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors font-medium shadow-2xs"
                  >
                    <Icon className="size-3 text-muted-foreground" />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunPrompt(promptInput);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask a question about brand rules (e.g. 'Can I say 100% cure?')..."
              className="flex-1 rounded-lg border border-border bg-white text-foreground px-3.5 py-2 text-xs focus:outline-none focus:border-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={isLoading || !promptInput.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background hover:opacity-90 px-4 py-2 text-xs font-semibold disabled:opacity-40 transition-colors shadow-2xs"
            >
              {isLoading ? (
                <span className="size-3.5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <>
                  <span>Ask</span>
                  <Send className="size-3" />
                </>
              )}
            </button>
          </form>

          {/* Output Card */}
          {activeResponse && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-semibold text-foreground">
                  Compliance Guidance
                </span>
                <button
                  onClick={() => setActiveResponse(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <p className="text-xs text-foreground leading-relaxed">
                {activeResponse.answer}
              </p>

              {activeResponse.citedClause && (
                <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-xs space-y-0.5">
                  <div className="text-[10px] font-mono text-muted-foreground uppercase">
                    Rule Cited: Clause {activeResponse.citedClause.code} ({activeResponse.citedClause.heading})
                  </div>
                  <p className="text-xs text-foreground italic">
                    "{activeResponse.citedClause.text}"
                  </p>
                </div>
              )}

              {activeResponse.suggestedScript && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Compliant Script Rewrite:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopyToClipboard(activeResponse.suggestedScript!)
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground hover:bg-muted font-medium"
                      >
                        {copied ? (
                          <>
                            <Check className="size-3 text-foreground" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleApply(activeResponse.suggestedScript!)
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-foreground text-background hover:opacity-90 px-3 py-1 text-xs font-semibold"
                      >
                        {applied ? (
                          <>
                            <Check className="size-3" />
                            <span>Applied!</span>
                          </>
                        ) : (
                          <>
                            <span>Apply to Editor</span>
                            <ArrowRight className="size-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
                    {activeResponse.suggestedScript}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
