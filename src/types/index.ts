export type Page = 'home' | 'dashboard' | 'studio' | 'about';

export interface DesignData {
  id: number;
  name: string;
  description: string;
  dimensions: string;
  manufacturing: string;
  finishing: string;
  bom: string;
  materialCost: number;
  manufacturingCost: number;
  finishingQCCost: number;
  salePrice: number;
  weight: string;
  buildTime: string;
  imageUrl: string;
  style: string;
  material: string;
}

export interface DesignInputs {
  function: string;
  style: string;
  material: string;
  color: string;
  details: string;
}

export interface DesignHistoryItem {
  id: number;
  inputs: DesignInputs;
  result: DesignData;
}
