import { GoogleGenAI } from '@google/genai';
import type { DesignData, DesignInputs } from '@/types';
import { envConfig } from '@/config/env';
import type { DesignService } from './types';

/**
 * Real Gemini-backed design service.
 *
 * Uses the official `@google/genai` SDK. The API key is injected from the
 * environment config (`VITE_GEMINI_API_KEY`) — never hard-coded.
 */
class GeminiDesignService implements DesignService {
  private readonly ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  generateDesign(
    inputs: DesignInputs,
    updateStatus: (status: string) => void
  ): Promise<DesignData> {
    return generateDesignWith(this.ai, inputs, updateStatus);
  }
}

/** Parse the model's plain-text response into structured fields. */
function parseGeneratedText(
  text: string
): Omit<
  DesignData,
  'id' | 'name' | 'imageUrl' | 'style' | 'material' | 'salePrice'
> {
  const getText = (key: string, nextKey: string | null) => {
    const regex = nextKey
      ? new RegExp(`${key}:(.*?)(?=${nextKey}:)`, 's')
      : new RegExp(`${key}:(.*)`, 's');
    return (text.match(regex) || [])[1]?.trim() || '';
  };

  const getNumber = (key: string, nextKey: string | null) => {
    const value = getText(key, nextKey);
    return parseInt(value.replace(/\D/g, '')) || 0;
  };

  return {
    description: getText('DESCRIPTION', 'DIMENSIONS'),
    dimensions: getText('DIMENSIONS', 'WEIGHT'),
    weight: getText('WEIGHT', 'BUILD_TIME'),
    buildTime: getText('BUILD_TIME', 'MANUFACTURING'),
    manufacturing: getText('MANUFACTURING', 'FINISHING'),
    finishing: getText('FINISHING', 'BOM'),
    bom: getText('BOM', 'MATERIAL_COST'),
    materialCost: getNumber('MATERIAL_COST', 'MANUFACTURING_COST'),
    manufacturingCost: getNumber('MANUFACTURING_COST', 'FINISHING_QC_COST'),
    finishingQCCost: getNumber('FINISHING_QC_COST', 'SALE_PRICE'),
  };
}

async function generateText(
  ai: GoogleGenAI,
  inputs: DesignInputs
): Promise<Omit<DesignData, 'id' | 'name' | 'imageUrl' | 'style' | 'material'>> {
  const prompt = `You are an expert furniture designer and production manager for the modern SME market. Create a detailed technical specification for the following product:
- Function: ${inputs.function}
- Style: ${inputs.style}
- Material: ${inputs.material}
- Color: ${inputs.color || 'natural'}
- Additional Details: ${inputs.details || 'none'}

Provide the response in a structured PLAIN TEXT format. DO NOT use markdown. FOLLOW THE SPECIFIC FORMATTING RULES BELOW. Use the following headers, followed by a colon and the content:

DESCRIPTION: (A brief description, design advantages, target market, and placement tips. Write in 1 paragraph.)
DIMENSIONS: (Realistic estimated dimensions in H x W x D cm format.)
WEIGHT: (Realistic estimated weight in kg, e.g., ~15 kg.)
BUILD_TIME: (Estimated production time, e.g., 2-3 Weeks.)
MANUFACTURING: (Suggested manufacturing methods in a NUMBERED LIST format. Each step must start with an HTML <strong>title</strong> tag followed by a colon. Example: 1. <strong>Wood Selection:</strong> Detailed explanation.)
FINISHING: (Finishing options in a BULLETED LIST format. Each point must start with an HTML <strong>title</strong> tag followed by a colon. Example: - <strong>Natural Doff:</strong> Detailed explanation.)
BOM: (Estimated Bill of Materials. MUST follow this format for EACH LINE: "- Component Name: Specification Details". Do not just write the component name. If specific details are unavailable, provide a brief description. Example: "- Table Legs: Mahogany Wood, 5cm diameter".)
MATERIAL_COST: (Provide ONLY a NUMBER for the total material cost from the BOM in USD.)
MANUFACTURING_COST: (Provide ONLY a NUMBER for manufacturing & assembly cost in USD.)
FINISHING_QC_COST: (Provide ONLY a NUMBER for finishing & quality control cost in USD.)
SALE_PRICE: (Provide ONLY a NUMBER for the suggested retail price in USD, e.g., 400)`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error('Failed to get a text response from the AI.');
  }

  const parsedData = parseGeneratedText(responseText);
  const salePriceText =
    (responseText.match(/SALE_PRICE:(.*)/s) || [])[1]?.trim() || '0';
  const salePrice = parseInt(salePriceText.replace(/\D/g, '')) || 0;

  return { ...parsedData, salePrice };
}

async function generateImage(
  ai: GoogleGenAI,
  description: string,
  imageName: string,
  bom: string
): Promise<string> {
  const prompt = `Professional, photorealistic e-commerce product photography for: "${imageName}".

**Product Description (for visual accuracy):**
${description}

**Primary Materials (from Bill of Materials):**
${bom}

**Primary Visual Rules:**
1.  **Single Subject:** Display ONLY ONE fully assembled furniture product.
2.  **Plain White Background:** The product must be on a **perfectly plain white background (#FFFFFF)**. There should be no harsh shadows, gradients, textures, or any other background elements.
3.  **Material Accuracy:** Use the 'Primary Materials' to ensure the texture and appearance of the final product are highly accurate. Wood should look like wood, metal like metal, etc.
4.  **Ideal Studio Lighting:** Use soft, even lighting to highlight product details without creating distracting shadows.
5.  **Pure Catalog Style:** The look must be clean, modern, and minimalist, as if for the main page of a premium product catalog.

**Strict Prohibitions (VERY IMPORTANT):**
-   **DO NOT SHOW RAW MATERIALS:** The material information is for finished product texture reference only. Do not display stacks of wood, metal bars, etc.
-   **DO NOT INCLUDE EXTRA ELEMENTS:** Do not include any decorative elements around the product (e.g., plants, books, vases, rugs, wall art). Only the main product on a white background.
-   **DO NOT INCLUDE TEXT, LOGOS, OR WATERMARKS:** The image must be completely clean of any writing or marks.
-   **DO NOT INCLUDE PEOPLE OR ANIMALS.**
-   **FINISHED PRODUCT ONLY:** Do not show sketches, blueprints, or unassembled products.`;

  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
    },
  });

  const generatedImages = response.generatedImages;
  if (!generatedImages || generatedImages.length === 0) {
    throw new Error('Failed to create an image from the AI.');
  }

  const base64ImageBytes = generatedImages[0]?.image?.imageBytes;
  if (!base64ImageBytes) {
    throw new Error('Failed to create an image from the AI.');
  }

  return base64ImageBytes;
}

async function generateDesignWith(
  ai: GoogleGenAI,
  inputs: DesignInputs,
  updateStatus: (status: string) => void
): Promise<DesignData> {
  if (!inputs.function || !inputs.style || !inputs.material) {
    throw new Error('Function, Style, and Material fields are required.');
  }

  updateStatus('AI is analyzing & creating specifications...');
  const textData = await generateText(ai, inputs);

  updateStatus('AI is creating the product visualization...');
  const imageName = `${inputs.style} ${inputs.function}`;
  const base64Image = await generateImage(
    ai,
    textData.description,
    imageName,
    textData.bom
  );

  return {
    id: Date.now(),
    name: imageName,
    ...textData,
    imageUrl: `data:image/jpeg;base64,${base64Image}`,
    style: inputs.style,
    material: inputs.material,
  };
}

export function createGeminiService(): DesignService {
  return new GeminiDesignService(envConfig.geminiApiKey);
}
