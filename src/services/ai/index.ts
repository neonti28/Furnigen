import { hasGeminiKey } from '@/config/env';
import type { DesignService } from './types';
import { createGeminiService } from './geminiService';
import { createMockService } from './mockService';

/**
 * Resolve the active design service.
 *
 * Uses the real Gemini backend when `VITE_GEMINI_API_KEY` is present,
 * otherwise transparently falls back to the offline generator so the app
 * stays fully interactive in any environment.
 */
export function getDesignService(): DesignService {
  if (hasGeminiKey) {
    return createGeminiService();
  }
  return createMockService();
}

export const designService = getDesignService();
