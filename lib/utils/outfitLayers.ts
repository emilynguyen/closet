import undergarmentDefs from "@/lib/data/undergarments.json";
import { CurrentOutfit } from "@/lib/types/clothing";

const undergarmentById = Object.fromEntries(undergarmentDefs.map((u) => [u.id, u]));

export const BASE_AVATAR_SRC = "/assets/avatar/base.png";

export function getOutfitImageSources(outfit: CurrentOutfit): string[] {
  const equippedItems = [
    outfit.tops,
    outfit.bottoms,
    outfit.shoes,
    outfit.socks,
    outfit.hair,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  const activeUndergarments = [
    ...new Set(equippedItems.flatMap((item) => item.undergarments ?? [])),
  ].map((id) => undergarmentById[id]).filter(Boolean);

  const layers = [...equippedItems].sort((a, b) => a.layer - b.layer);

  return [
    BASE_AVATAR_SRC,
    ...activeUndergarments.map((u) => u.assetPath),
    ...layers.map((item) => item.assetPath),
  ];
}
