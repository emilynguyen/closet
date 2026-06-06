import { ClothingItem } from "@/lib/types/clothing";
import rawItems from "./clothing.json";
import cropOffsets from "./cropOffsets.json";

type CropEntry = number | { cropY: number; cropScale: number };
const cropYMap = cropOffsets as Record<string, CropEntry>;

const CATEGORY_LAYER: Record<string, number> = {
  tops: 4,
  bottoms: 3,
  shoes: 2,
  socks: 5,
};

type RawItem = { id: string; category: string; name: string; assetPath: string; layer?: number; tags?: string[] };

// To add new items: edit clothing.json, then run `npm run generate-crops`.
export const clothing: ClothingItem[] = (rawItems as RawItem[]).map((item) => ({
  id: item.id,
  category: item.category as ClothingItem["category"],
  name: item.name,
  assetPath: item.assetPath,
  layer: item.layer ?? CATEGORY_LAYER[item.category] ?? 5,
  ...(item.tags ? { tags: item.tags } : {}),
  ...(() => {
    const entry = cropYMap[item.id];
    if (entry === undefined) return {};
    if (typeof entry === "number") return { cropY: entry };
    return { cropY: entry.cropY, cropScale: entry.cropScale };
  })(),
}));
