"use client";

import { useEffect } from "react";
import { useOutfit } from "@/lib/context/outfitContext";
import { clothing } from "@/lib/data/clothing";

export function CharacterCanvas() {
  const { outfit } = useOutfit();

  useEffect(() => {
    clothing.forEach(({ assetPath }) => {
      const img = new Image();
      img.src = assetPath;
    });
  }, []);

  const layers = [
    outfit.tops,
    outfit.bottoms,
    outfit.shoes,
    ...(outfit.socks ?? []),
    outfit.hair,
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
