import type { DesignData, DesignInputs } from '@/types';
import type { DesignService } from './types';

/**
 * Deterministic offline generator used when no Gemini API key is configured.
 *
 * Produces the exact same `DesignData` shape as the real service — complete
 * with a generated placeholder visualisation — so the entire UI (Studio form,
 * history, detail modal, zoom modal, PDF export) remains fully interactive
 * without any network calls or API key.
 */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Tiny deterministic hash so different inputs yield stable-but-varied output. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const DIMENSIONS_BY_TYPE: Record<string, string> = {
  chair: 'H 85 x W 52 x D 55 cm',
  table: 'H 75 x W 160 x D 90 cm',
  sofa: 'H 80 x W 210 x D 95 cm',
  bed: 'H 110 x W 180 x D 200 cm',
  lamp: 'H 150 x W 35 x D 35 cm',
  shelf: 'H 180 x W 90 x D 35 cm',
  cabinet: 'H 120 x W 80 x D 45 cm',
  default: 'H 90 x W 120 x D 60 cm',
};

function inferDimensions(functionText: string): string {
  const key = Object.keys(DIMENSIONS_BY_TYPE).find((k) =>
    functionText.toLowerCase().includes(k)
  );
  return DIMENSIONS_BY_TYPE[key ?? 'default'];
}

function buildSvgPlaceholder(name: string, material: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#ffffff"/>
  <g fill="none" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="250" y="430" width="300" height="170" rx="14"/>
    <line x1="280" y1="600" x2="280" y2="660"/>
    <line x1="520" y1="600" x2="520" y2="660"/>
    <rect x="300" y="360" width="200" height="80" rx="14"/>
  </g>
  <text x="400" y="720" font-family="Inter, sans-serif" font-size="34" font-weight="700" fill="#0f172a" text-anchor="middle">${name}</text>
  <text x="400" y="760" font-family="Inter, sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">${material}</text>
</svg>`;
  const base64 =
    typeof btoa !== 'undefined'
      ? btoa(unescape(encodeURIComponent(svg)))
      : Buffer.from(svg, 'utf-8').toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

class MockDesignService implements DesignService {
  async generateDesign(
    inputs: DesignInputs,
    updateStatus: (status: string) => void
  ): Promise<DesignData> {
    if (!inputs.function || !inputs.style || !inputs.material) {
      throw new Error('Function, Style, and Material fields are required.');
    }

    updateStatus('AI is analyzing & creating specifications...');
    await sleep(900);

    const seed = hash(
      `${inputs.function}|${inputs.style}|${inputs.material}|${inputs.color}|${inputs.details}`
    );
    const title = `${inputs.style} ${inputs.function}`.trim();
    const dimensions = inferDimensions(inputs.function);

    const materialCost = 120 + (seed % 180);
    const manufacturingCost = 80 + ((seed >> 3) % 140);
    const finishingQCCost = 40 + ((seed >> 6) % 60);
    const salePrice =
      Math.round(
        (materialCost + manufacturingCost + finishingQCCost) * 1.8 * 10
      ) / 10;

    const description = `${title} is a thoughtfully composed piece that fuses the ${inputs.style} aesthetic with practical everyday function. Built primarily from ${inputs.material}${
      inputs.color ? ` in a refined ${inputs.color} finish` : ''
    }, it is engineered for both visual harmony and long-term durability. Ideal for modern living spaces, hospitality fit-outs, and design-conscious homes${
      inputs.details ? `. ${inputs.details}.` : '.'
    }`;

    const manufacturing = [
      `<strong>Material Selection:</strong> Hand-pick ${inputs.material} stock, inspecting for grain consistency and structural integrity.`,
      `<strong>Cutting & Joinery:</strong> Precision-cut components to spec; reinforce key joints with dowels and wood glue.`,
      `<strong>Assembly:</strong> Dry-fit the frame, then permanently assemble, ensuring square alignment and load stability.`,
      `<strong>Surface Prep:</strong> Sand progressively to 240-grit; fill imperfections for a flawless base.`,
      `<strong>Final Assembly:</strong> Attach hardware and apply protective pads to contact points.`,
    ].join('\n');

    const finishing = [
      `<strong>Natural Doff:</strong> Apply a matte clear coat to protect while preserving the raw ${inputs.material} character.`,
      `<strong>QC Inspection:</strong> Check dimensions, finish uniformity, and weight tolerance before packaging.`,
      `<strong>Protective Wrap:</strong> Foam-wrap and corner-guard for safe transit.`,
    ].join('\n');

    const bom = [
      `- Main Frame: ${inputs.material}, primary structural component`,
      `- Side Panels: ${inputs.material}, 2.5cm thickness`,
      `- Joinery Hardware: Zinc-plated screws & dowels`,
      `- Surface Finish: Low-VOC clear coat, 0.5L`,
      `- Feet/Pads: Felt-backed rubber, 4 units`,
    ].join('\n');

    updateStatus('AI is creating the product visualization...');
    await sleep(700);

    return {
      id: Date.now(),
      name: title,
      description,
      dimensions,
      weight: `${18 + (seed % 22)} kg`,
      buildTime: pick(
        ['2-3 Weeks', '3-4 Weeks', '1-2 Weeks', '4-5 Weeks'],
        seed
      ),
      manufacturing,
      finishing,
      bom,
      materialCost,
      manufacturingCost,
      finishingQCCost,
      salePrice,
      imageUrl: buildSvgPlaceholder(title, inputs.material),
      style: inputs.style,
      material: inputs.material,
    };
  }
}

export function createMockService(): DesignService {
  return new MockDesignService();
}
