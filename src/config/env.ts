/**
 * Centralised environment configuration.
 *
 * Reads from Vite's `import.meta.env` so values can be provided via a `.env`
 * file (e.g. `VITE_GEMINI_API_KEY=...`) at build/dev time. See `.env.example`.
 */

/** Vite exposes env vars prefixed with `VITE_` on `import.meta.env`. */
const env = import.meta.env;

export const envConfig = {
  /** Gemini API key. If empty, the app transparently falls back to a mock generator. */
  geminiApiKey: (env.VITE_GEMINI_API_KEY as string | undefined) ?? '',
} as const;

/** Whether a real Gemini backend is available. */
export const hasGeminiKey = envConfig.geminiApiKey.trim().length > 0;
