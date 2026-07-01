"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ClothingItem, ClothingCategory, CurrentOutfit, REQUIRED_CATEGORIES } from "@/lib/types/clothing";
import { clothing as allClothingData } from "@/lib/data/clothing";

interface OutfitContextType {
  outfit: CurrentOutfit;
  allClothing: ClothingItem[];
  isLoaded: boolean;
  activeCategory: ClothingCategory;
  setActiveCategory: (category: ClothingCategory) => void;
  getItemsByCategory: (category: ClothingCategory) => ClothingItem[];
  equip: (item: ClothingItem) => void;
  unequip: (category: ClothingCategory) => void;
  isEquipped: (item: ClothingItem) => boolean;
}

const OutfitContext = createContext<OutfitContextType | null>(null);

export function OutfitProvider({ children }: { children: ReactNode }) {
  const [outfit, setOutfit] = useState<CurrentOutfit>({});
  const [activeCategory, setActiveCategory] = useState<ClothingCategory>("tops");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const byId = Object.fromEntries(allClothingData.map((c) => [c.id, c]));

    function preload(outfit: CurrentOutfit): Promise<void> {
      const urls = [
        "/assets/avatar/base.png",
        outfit.tops?.assetPath,
        outfit.bottoms?.assetPath,
        outfit.shoes?.assetPath,
        outfit.socks?.assetPath,
        outfit.hair?.assetPath,
      ].filter((u): u is string => !!u);
      return Promise.all(
        urls.map((src) => new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
        }))
      ).then(() => {});
    }

    async function init() {
      const saved = localStorage.getItem("closet-outfit");
      let outfit: CurrentOutfit;
      if (saved) {
        try {
          const ids: { tops?: string; bottoms?: string; shoes?: string; socks?: string | string[]; hair?: string } = JSON.parse(saved);
          const restored: CurrentOutfit = {};
          if (ids.tops && byId[ids.tops]) restored.tops = byId[ids.tops];
          if (ids.bottoms && byId[ids.bottoms]) restored.bottoms = byId[ids.bottoms];
          if (ids.shoes && byId[ids.shoes]) restored.shoes = byId[ids.shoes];
          // socks was previously persisted as an array — take the first if so
          const sockId = Array.isArray(ids.socks) ? ids.socks[0] : ids.socks;
          if (sockId && byId[sockId]) restored.socks = byId[sockId];
          if (ids.hair && byId[ids.hair]) restored.hair = byId[ids.hair];
          if (!restored.hair) restored.hair = byId["hair-down"];
          outfit = restored;
        } catch {
          outfit = {};
        }
      } else {
        outfit = {
          tops:    byId["top-white-tank"],
          bottoms: byId["bottom-black-parachute-pants"],
          shoes:   byId["footwear-salomon-acs-pros"],
          socks:   byId["accessory-white-crew-socks"],
          hair:    byId["hair-down"],
        };
      }
      await preload(outfit);
      setOutfit(outfit);
      setIsLoaded(true);
    }

    init();
  }, []);

  useEffect(() => {
    const ids = {
      ...(outfit.tops ? { tops: outfit.tops.id } : {}),
      ...(outfit.bottoms ? { bottoms: outfit.bottoms.id } : {}),
      ...(outfit.shoes ? { shoes: outfit.shoes.id } : {}),
      ...(outfit.socks ? { socks: outfit.socks.id } : {}),
      ...(outfit.hair ? { hair: outfit.hair.id } : {}),
    };
    localStorage.setItem("closet-outfit", JSON.stringify(ids));
  }, [outfit]);

  function equip(item: ClothingItem) {
    setOutfit((prev) => ({ ...prev, [item.category]: item }));
  }

  function unequip(category: ClothingCategory) {
    if (REQUIRED_CATEGORIES.has(category)) return;
    setOutfit((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  }

  function isEquipped(item: ClothingItem): boolean {
    return (outfit[item.category] as ClothingItem | undefined)?.id === item.id;
  }

  function getItemsByCategory(category: ClothingCategory): ClothingItem[] {
    return allClothingData.filter((item) => item.category === category);
  }

  return (
    <OutfitContext.Provider
      value={{ outfit, allClothing: allClothingData, isLoaded, activeCategory, setActiveCategory, getItemsByCategory, equip, unequip, isEquipped }}
    >
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfit(): OutfitContextType {
  const ctx = useContext(OutfitContext);
  if (!ctx) throw new Error("useOutfit must be used within OutfitProvider");
  return ctx;
}
