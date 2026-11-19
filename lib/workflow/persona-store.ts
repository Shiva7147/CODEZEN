import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";

const PERSONA_STORAGE_KEY = "verity_active_persona_v2";

export class PersonaStore {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getActivePersona(): Persona {
    if (!this.isClient()) return DEMO_PERSONAS[0];
    try {
      const savedId = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (savedId) {
        const found = DEMO_PERSONAS.find((p) => p.id === savedId);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return DEMO_PERSONAS[0];
  }

  public static setActivePersona(persona: Persona): void {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, persona.id);
      window.dispatchEvent(new CustomEvent("verity-persona-changed", { detail: persona }));
    } catch (e) {
      console.warn("Failed to save persona:", e);
    }
  }
}
