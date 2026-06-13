"use client";

import { useEffect } from "react";
import { useOutfit } from "@/lib/context/outfitContext";
import { clothing } from "@/lib/data/clothing";
import undergarmentDefs from "@/lib/data/undergarments.json";

const undergarmentById = Object.fromEntries(undergarmentDefs.map((u) => [u.id, u]));

export function CharacterCanvas() {
  const { outfit } = useOutfit();

  useEffect(() => {
    clothing.forEach(({ assetPath }) => {
      const img = new Image();
      img.src = assetPath;
    });
  }, []);

  const equippedItems = [
    outfit.tops,
    outfit.bottoms,
    outfit.shoes,
    ...(outfit.socks ?? []),
    outfit.hair,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  const activeUndergarments = [
    ...new Set(equippedItems.flatMap((item) => item.undergarments ?? [])),
  ].map((id) => undergarmentById[id]).filter(Boolean);

  const layers = equippedItems.sort((a, b) => a.layer - b.layer);

  const noInteract = {
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    draggable: false as const,
  };

  return (
    <div className="character-canvas">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/avatar/base.png" alt="base avatar" {...noInteract} />
      {activeUndergarments.map((u) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={u.id} src={u.assetPath} alt={u.name} {...noInteract} />
      ))}
      {layers.map((item) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={item.id} src={item.assetPath} alt={item.name} {...noInteract} />
      ))}
    </div>
  );
}
