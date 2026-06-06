export type ClothingCategory = "tops" | "bottoms" | "shoes" | "socks";

export interface ClothingItem {
  id: string;
  category: ClothingCategory;
  name: string;
  assetPath: string;
  tags?: string[];
  layer: number;
  cropY?: number;
  cropScale?: number;
}

export interface CurrentOutfit {
  tops?: ClothingItem;
  bottoms?: ClothingItem;
  shoes?: ClothingItem;
  socks?: ClothingItem[];
}
