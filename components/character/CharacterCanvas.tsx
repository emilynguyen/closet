"use client";

import { useOutfit } from "@/lib/context/outfitContext";

export function CharacterCanvas() {
  const { outfit } = useOutfit();

  const layers = [
    outfit.tops,
    outfit.bottoms,
    outfit.shoes,
    ...(outfit.socks ?? []),
  ]
    .filter((item): item is NonNullable<typeof item> => item != null)
    .sort((a, b) => a.layer - b.layer);

  return (
    <div className="character-canvas">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/avatar/base.png" alt="base avatar" />
      {layers.map((item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={item.id} src={item.assetPath} alt={item.name} />
      ))}
    </div>
  );
}
