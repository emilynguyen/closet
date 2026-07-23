"use client";

import { useEffect } from "react";
import { useOutfit } from "@/lib/context/outfitContext";
import { clothing } from "@/lib/data/clothing";
import { getOutfitImageSources } from "@/lib/utils/outfitLayers";

export function CharacterCanvas() {
  const { outfit } = useOutfit();

  useEffect(() => {
    clothing.forEach(({ assetPath }) => {
      const img = new Image();
      img.src = assetPath;
    });
  }, []);

  const sources = getOutfitImageSources(outfit);

  const noInteract = {
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    draggable: false as const,
  };

  return (
    <div className="character-canvas">
      {sources.map((src) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" {...noInteract} />
      ))}
    </div>
  );
}
