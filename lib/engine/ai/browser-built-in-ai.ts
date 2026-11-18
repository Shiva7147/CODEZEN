/**
 * Verity Browser Built-in AI Provider
 * Leverages Google Chrome's native on-device Gemini Nano via the Prompt API (window.ai.languageModel).
 * Requires zero external API keys, zero cloud servers, zero OpenRouter, and zero network latency.
 * Provides seamless fallback to Verity's client-side deterministic engine if window.ai is not enabled.
 */

export interface BrowserAICapability {
  supported: boolean;
  available: "readily" | "after-download" | "unavailable" | "not_supported";
  engineName: string;
  details: string;
}

export async function detectBrowserAI(): Promise<BrowserAICapability> {
  if (typeof window === "undefined") {
    return {
      supported: false,
      available: "not_supported",
      engineName: "Server / SSR",
      details: "Running in non-browser environment.",
    };
  }

  const win = window as any;

  // 1. Check window.ai.languageModel (Chrome 128+)
  if (win.ai?.languageModel) {
    try {
      if (typeof win.ai.languageModel.capabilities === "function") {
        const caps = await win.ai.languageModel.capabilities();
        const state = caps?.available || "unavailable";
        return {
          supported: true,
          available: state === "readily" ? "readily" : state === "after-download" ? "after-download" : "unavailable",
          engineName: "Chrome Built-in AI (Gemini Nano on-device)",
          details: state === "readily" 
            ? "Gemini Nano on-device model is downloaded and active in Chrome." 
            : "Gemini Nano is available in Chrome but requires on-device weights download.",
        };
      }
      if (typeof win.ai.languageModel.availability === "function") {
        const avail = await win.ai.languageModel.availability();
        return {
          supported: true,
          available: avail === "readily" ? "readily" : "unavailable",
          engineName: "Chrome Built-in AI (Gemini Nano on-device)",
          details: "Native browser Language Model API detected.",
        };
      }
      return {
        supported: true,
        available: "readily",
        engineName: "Chrome Built-in AI (Gemini Nano on-device)",
        details: "Native window.ai.languageModel is ready.",
      };
    } catch (e: any) {
      console.warn("Error probing window.ai.languageModel:", e);
    }
  }

  // 2. Check legacy window.ai (Chrome 127 experimental)
  if (win.ai && typeof win.ai.canCreateTextSession === "function") {
    try {
      const can = await win.ai.canCreateTextSession();
      return {
        supported: can !== "no",
        available: can === "readily" ? "readily" : can === "after-download" ? "after-download" : "unavailable",
        engineName: "Chrome Built-in AI (Gemini Nano on-device)",
        details: "Experimental window.ai text session detected.",
      };
    } catch (e) {
      // Continue to fallback
    }
  }

  // 3. Fallback: Verity Inbuilt Local Engine (Zero API Keys)
  return {
    supported: false,
    available: "not_supported",
    engineName: "Inbuilt Local Engine (Zero API Keys)",
    details: "Running local client-side semantic engine. Enable Chrome Gemini Nano via chrome://flags/#prompt-api-for-gemini-nano.",
  };
}

export async function promptBrowserAI(
  prompt: string,
  systemPrompt?: string
): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const win = window as any;

  try {
    // Chrome 128+ Prompt API
    if (win.ai?.languageModel) {
      const session = await win.ai.languageModel.create({
        systemPrompt: systemPrompt || "You are Verity, an automated compliance officer.",
      });
      const response = await session.prompt(prompt);
      if (session.destroy) session.destroy();
      return response;
    }

    // Chrome 127 experimental Prompt API
    if (win.ai?.createTextSession) {
      const session = await win.ai.createTextSession();
      const response = await session.prompt(prompt);
      if (session.destroy) session.destroy();
      return response;
    }
  } catch (error) {
    console.warn("Browser built-in AI session prompt failed, falling back to local engine:", error);
  }

  return null;
}
