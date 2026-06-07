"use client";

import { useRef, useState, useEffect } from "react";
import { ClothingCategory, ClothingItem } from "@/lib/types/clothing";
import { useOutfit } from "@/lib/context/outfitContext";

interface InventoryItemProps {
  item: ClothingItem;
  equipped: boolean;
  onToggle: () => void;
}

function InventoryItem({ item, equipped, onToggle }: InventoryItemProps) {
  return (
    <button
      onClick={onToggle}
      title={item.name}
      className="relative w-full rounded-[4px] overflow-hidden group"
    >
      <div className="clothing-thumbnail">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </div>
      <div className={`absolute inset-0 rounded-[4px] transition-colors pointer-events-none ${equipped ? "ring-1 ring-inset ring-zinc-900 bg-black/0 group-hover:bg-black/5" : "bg-black/0 group-hover:bg-black/5"}`} />
      {equipped && (
        <span className="absolute top-1.5 right-1.5 text-zinc-900 leading-none">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </span>
      )}
    </button>
  );
}

function TabBar({
  categories,
  activeCategory,
  getCount,
  onSelect,
}: {
  categories: { key: ClothingCategory; label: string }[];
  activeCategory: ClothingCategory;
  getCount: (key: ClothingCategory) => number;
  onSelect: (key: ClothingCategory) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  function onMouseDown(e: React.MouseEvent) {
    drag.current = { active: true, startX: e.pageX, scrollLeft: ref.current!.scrollLeft };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!drag.current.active) return;
    ref.current!.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  }
  function onMouseUp() { drag.current.active = false; }

  return (
    <div className="-mx-4 sm:-mx-6 border-b" style={{ borderColor: "var(--black)" }}>
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      className="flex gap-2 px-4 sm:px-6 overflow-x-auto select-none cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
    >
      {categories.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          style={{ borderColor: "var(--black)", borderRadius: "4px 4px 0 0" }}
          className={`shrink-0 px-3 py-1 text-[12px] font-medium uppercase border border-b-0 ${key === activeCategory ? "bg-black text-white" : "text-black"}`}
        >
          {label} ({getCount(key)})
        </button>
      ))}
    </div>
    </div>
  );
}

const GRID_CONFIG = {
  base: { cols: 3, rows: 4 },
  sm:   { cols: 4, rows: 4 },
  md:   { cols: 5, rows: 4 },
  lg:   { cols: 4, rows: 4 },
  "2xl": { cols: 5, rows: 4 },
} as const;

function useGridConfig() {
  const [key, setKey] = useState<keyof typeof GRID_CONFIG>("base");
  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1536px)").matches) setKey("2xl");
      else if (window.matchMedia("(min-width: 1024px)").matches) setKey("lg");
      else if (window.matchMedia("(min-width: 768px)").matches) setKey("md");
      else if (window.matchMedia("(min-width: 640px)").matches) setKey("sm");
      else setKey("base");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return GRID_CONFIG[key];
}

const CATEGORIES: { key: ClothingCategory; label: string }[] = [
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Shoes" },
  { key: "socks", label: "Socks" },
];

export function Inventory() {
  const {
    activeCategory,
    setActiveCategory,
    getItemsByCategory,
    equip,
    unequip,
    isEquipped,
  } = useOutfit();

  const items = getItemsByCategory(activeCategory);
  const { cols, rows } = useGridConfig();
  const totalSlots = Math.max(cols * rows, Math.ceil(items.length / cols) * cols);
  const emptyCount = totalSlots - items.length;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:min-h-0 lg:flex-1">
      {/* Category tabs */}
      <TabBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        getCount={(key) => getItemsByCategory(key).length}
        onSelect={setActiveCategory}
      />

      {/* Item grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 2xl:grid-cols-5 gap-[4px]">
        {items.map((item) => {
          const equipped = isEquipped(item);
          return (
            <InventoryItem
              key={item.id}
              item={item}
              equipped={equipped}
              onToggle={() => equipped ? unequip(item.category) : equip(item)}
            />
          );
        })}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div key={`empty-${i}`} className="clothing-thumbnail" />
        ))}
      </div>
    </div>
  );
}
