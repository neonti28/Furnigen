import type { DesignData, DesignInputs } from '@/types';

/** A pluggable design-generation backend. */
export interface DesignService {
  /**
   * Generate a full design (specs + visualization) from user inputs.
   * @param inputs  The user-supplied furniture requirements.
   * @param updateStatus  Progress callback for UI status text.
   */
  generateDesign(
    inputs: DesignInputs,
    updateStatus: (status: string) => void
  ): Promise<DesignData>;
}
