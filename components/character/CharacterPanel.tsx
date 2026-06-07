"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClothingCategory, ClothingItem } from "@/lib/types/clothing";
import { useOutfit } from "@/lib/context/outfitContext";
import { CharacterCanvas } from "./CharacterCanvas";
import PixelSky from "./PixelSky";

const LEFT_SLOTS: (ClothingCategory | null)[] = [
  null,
  null,
  "tops",
  null,
  "bottoms",
  null,
  null,
  null,
];

const RIGHT_SLOTS: (ClothingCategory | null)[] = [
  null,
  null,
  null,
  null,
  null,
  null,
  "socks",
  "shoes",
];

const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  shoes: "Shoes",
  socks: "Socks",
};

interface SlotProps {
  category: ClothingCategory;
  label: string;
  item?: ClothingItem;
  onClick: () => void;
}

function EquipmentSlot({ label, item, onClick }: SlotProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="equipment-slot group relative flex flex-col items-center rounded-[4px] border border-black hover:border-black/50 transition-colors"
    >
      <div className="equipment-slot-thumbnail">
        {item ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.assetPath}
            alt={item.name}
            style={{
              top: `${item.cropY ?? 0}%`,
              ...(item.cropScale != null
                ? {
                    width: `${item.cropScale * 100}%`,
                    left: `${((1 - item.cropScale) / 2) * 100}%`,
                  }
                : {}),
            }}
          />
        ) : (
          <span className="leading-tight px-1 text-center uppercase text-black/25">
            {label}
          </span>
        )}
      </div>
    </button>
  );
}

function SlotColumn({
  slots,
  outfit,
  onClickCategory,
}: {
  slots: (ClothingCategory | null)[];
  outfit: ReturnType<typeof useOutfit>["outfit"];
  onClickCategory: (category: ClothingCategory) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      {slots.map((category, i) =>
        category === null ? (
          <div key={i} className="equipment-slot" />
        ) : (
          <EquipmentSlot
            key={category}
            category={category}
            label={CATEGORY_LABELS[category]}
            item={
              category === "socks"
                ? outfit.socks?.[0]
                : (outfit[category as keyof typeof outfit] as
                    | ClothingItem
                    | undefined)
            }
            onClick={() => onClickCategory(category)}
          />
        ),
      )}
    </div>
  );
}

export function CharacterPanel() {
  const { outfit, setActiveCategory, isLoaded } = useOutfit();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add("sky-active");
    return () => document.documentElement.classList.remove("sky-active");
  }, []);

  function handleSlotClick(category: ClothingCategory) {
    setActiveCategory(category);
    if (window.innerWidth < 1024) {
      const target = document.getElementById("inventory-panel");
      if (!target) return;
      const start = window.scrollY;
      const end = target.getBoundingClientRect().top + start;
      const duration = 600;
      const startTime = performance.now();
      function step(now: number) {
        const t = Math.min((now - startTime) / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        window.scrollTo(0, start + (end - start) * ease);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  return (
    <div className="relative flex w-full h-full items-center justify-center [container-type:size] lg:max-h-[66.67vw]">
      {mounted && createPortal(<PixelSky />, document.body)}
      <SlotColumn
        slots={LEFT_SLOTS}
        outfit={outfit}
        onClickCategory={handleSlotClick}
      />

      <div
        className={`h-full aspect-[60/128] min-h-0 overflow-hidden flex items-center justify-center [container-type:size] transition-all duration-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[12px]"}`}
      >
        <CharacterCanvas />
      </div>

      <SlotColumn
        slots={RIGHT_SLOTS}
        outfit={outfit}
        onClickCategory={handleSlotClick}
      />
    </div>
  );
}
