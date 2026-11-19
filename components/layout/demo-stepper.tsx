"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, UserCheck, BarChart3, Edit3 } from "lucide-react";
import { DemoStepperStore, DemoStepperState } from "@/lib/workflow/demo-stepper-store";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { DEMO_PERSONAS } from "@/components/navigation/top-nav";

interface DemoStepperProps {
  onTriggerCheck?: () => void;
  onFocusFinding?: () => void;
}

export function DemoStepper({ onTriggerCheck, onFocusFinding }: DemoStepperProps) {
  const router = useRouter();
  const [stepperState, setStepperState] = useState<DemoStepperState>(() => DemoStepperStore.getState());

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<DemoStepperState>;
      if (custom.detail) {
        setStepperState(custom.detail);
      } else {
        setStepperState(DemoStepperStore.getState());
      }
    };
    window.addEventListener("verity-stepper-updated", handleUpdate);
    window.addEventListener("verity-state-updated", handleUpdate);
    return () => {
      window.removeEventListener("verity-stepper-updated", handleUpdate);
      window.removeEventListener("verity-state-updated", handleUpdate);
    };
  }, []);

  const handleGoToStep1 = () => {
    // Step 1: As Creator, trigger Check My Script
    PersonaStore.setActivePersona(DEMO_PERSONAS[0]); // Rahul (Creator)
    if (window.location.pathname !== "/") {
      router.push("/");
    }
    if (onTriggerCheck) {
      onTriggerCheck();
    } else {
      document.getElementById("btn-check-script")?.click();
    }
  };

  const handleGoToStep2 = () => {
    // Step 2: As Creator, inspect and accept fix
    PersonaStore.setActivePersona(DEMO_PERSONAS[0]); // Rahul (Creator)
    if (window.location.pathname !== "/") {
      router.push("/");
    }
    if (onFocusFinding) {
      onFocusFinding();
    }
  };

  const handleGoToStep3 = () => {
    // Step 3: Switch to Reviewer and open Review Queue
    PersonaStore.setActivePersona(DEMO_PERSONAS[1]); // Ananya (Reviewer)
    router.push("/review");
  };

  const handleGoToStep4 = () => {
    // Step 4: Switch to Manager and open History
    PersonaStore.setActivePersona(DEMO_PERSONAS[2]); // Alex (Manager)
    router.push("/history");
  };

  const handleReset = () => {
    DemoStepperStore.resetDemo();
    router.push("/");
  };

  const step4Done = stepperState.step4History && stepperState.step4Insights;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header bar of Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-mono font-bold">
            i
          </span>
          <span className="text-xs font-semibold text-foreground tracking-tight">
            Guided Walkthrough: 4-Step Governance Flow
          </span>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Reset demo data, audit history, and step progress"
        >
          <RotateCcw className="size-3" />
          <span>Reset demo</span>
        </button>
      </div>

      {/* The 4 Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1 */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between transition-colors ${
            stepperState.step1
              ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20"
              : "border-border bg-muted/20"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                {stepperState.step1 ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-mono font-bold">
                    1
                  </span>
                )}
                <span>Step 1 (Creator)</span>
              </span>
              {stepperState.step1 && (
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Click <strong>&quot;Check My Script&quot;</strong> to scan copy against approved guidelines.
            </p>
          </div>

          <button
            onClick={handleGoToStep1}
            className="mt-2.5 inline-flex items-center justify-center gap-1 w-full rounded-lg border border-border bg-card py-1 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Go to step</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </button>
        </div>

        {/* Step 2 */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between transition-colors ${
            stepperState.step2
              ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20"
              : "border-border bg-muted/20"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                {stepperState.step2 ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-mono font-bold">
                    2
                  </span>
                )}
                <span>Step 2 (Creator)</span>
              </span>
              {stepperState.step2 && (
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Open a finding, read the cited rule, accept a fix. Sensitive claims show <em>&quot;Sent to reviewer&quot;</em>.
            </p>
          </div>

          <button
            onClick={handleGoToStep2}
            className="mt-2.5 inline-flex items-center justify-center gap-1 w-full rounded-lg border border-border bg-card py-1 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Go to step</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </button>
        </div>

        {/* Step 3 */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between transition-colors ${
            stepperState.step3
              ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20"
              : "border-border bg-muted/20"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                {stepperState.step3 ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-mono font-bold">
                    3
                  </span>
                )}
                <span>Step 3 (Reviewer)</span>
              </span>
              {stepperState.step3 && (
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Open <strong>Review Queue</strong>, read the claim and cited rule, approve or request changes with a reason.
            </p>
          </div>

          <button
            onClick={handleGoToStep3}
            className="mt-2.5 inline-flex items-center justify-center gap-1 w-full rounded-lg border border-border bg-card py-1 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Go to step</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </button>
        </div>

        {/* Step 4 */}
        <div
          className={`rounded-xl border p-3 flex flex-col justify-between transition-colors ${
            step4Done
              ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20"
              : "border-border bg-muted/20"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                {step4Done ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-mono font-bold">
                    4
                  </span>
                )}
                <span>Step 4 (Manager)</span>
              </span>
              {step4Done && (
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                  Completed
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              Open <strong>History</strong> to inspect the audit trail, then <strong>Insights</strong> to see disputed rules.
            </p>
          </div>

          <button
            onClick={handleGoToStep4}
            className="mt-2.5 inline-flex items-center justify-center gap-1 w-full rounded-lg border border-border bg-card py-1 px-2 text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Go to step</span>
            <ArrowRight className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
