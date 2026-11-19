import { SubmissionsStore } from "./submissions-store";
import { PersonaStore } from "./persona-store";
import { DEMO_PERSONAS } from "@/components/navigation/top-nav";

export interface DemoStepperState {
  step1: boolean; // Clicked "Check My Script"
  step2: boolean; // Accepted a fix
  step3: boolean; // Approved / requested changes in Review Queue
  step4History: boolean; // Visited History
  step4Insights: boolean; // Visited Insights
}

const STEPPER_STORAGE_KEY = "verity_demo_stepper_state_v2";

const INITIAL_STEPPER_STATE: DemoStepperState = {
  step1: false,
  step2: false,
  step3: false,
  step4History: false,
  step4Insights: false,
};

export class DemoStepperStore {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getState(): DemoStepperState {
    if (!this.isClient()) return INITIAL_STEPPER_STATE;
    try {
      const data = localStorage.getItem(STEPPER_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_STEPPER_STATE;
  }

  public static updateState(updates: Partial<DemoStepperState>): DemoStepperState {
    const current = this.getState();
    const updated = { ...current, ...updates };
    if (this.isClient()) {
      try {
        localStorage.setItem(STEPPER_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("verity-stepper-updated", { detail: updated }));
      } catch (e) {
        console.warn("Failed to save stepper state:", e);
      }
    }
    return updated;
  }

  public static markStep(step: 1 | 2 | 3 | "history" | "insights"): void {
    if (step === 1) this.updateState({ step1: true });
    else if (step === 2) this.updateState({ step2: true });
    else if (step === 3) this.updateState({ step3: true });
    else if (step === "history") this.updateState({ step4History: true });
    else if (step === "insights") this.updateState({ step4Insights: true });
  }

  public static resetDemo(): void {
    if (!this.isClient()) return;
    try {
      localStorage.removeItem("verity_submissions_v2");
      localStorage.removeItem("verity_history_v2");
      localStorage.setItem(STEPPER_STORAGE_KEY, JSON.stringify(INITIAL_STEPPER_STATE));
      PersonaStore.setActivePersona(DEMO_PERSONAS[0]); // Reset to Rahul (Creator)
      window.dispatchEvent(new Event("verity-state-updated"));
      window.dispatchEvent(new CustomEvent("verity-stepper-updated", { detail: INITIAL_STEPPER_STATE }));
    } catch (e) {
      console.warn("Failed to reset demo:", e);
    }
  }
}
