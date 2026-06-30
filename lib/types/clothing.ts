export type ClothingCategory = "tops" | "bottoms" | "shoes" | "socks" | "hair";

export const REQUIRED_CATEGORIES = new Set<ClothingCategory>(["hair", "tops", "bottoms"]);

export interface ClothingItem {
  id: string;
  category: ClothingCategory;
  name: string;
  assetPath: string;
  tags?: string[];
  layer: number;
  cropY?: number;
  cropScale?: number;
  undergarments?: string[];
  pixelCoverage?: number;
  brightness?: number;
}

export interface CurrentOutfit {
  tops?: ClothingItem;
  bottoms?: ClothingItem;
  shoes?: ClothingItem;
  socks?: ClothingItem;
  hair?: ClothingItem;
}
