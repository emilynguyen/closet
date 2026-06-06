"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ClothingItem, ClothingCategory, CurrentOutfit } from "@/lib/types/clothing";
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
    const saved = localStorage.getItem("closet-outfit");
    if (saved) {
      try {
        // Persisted as { tops?: id, bottoms?: id, shoes?: id, socks?: id[] }
        const ids: { tops?: string; bottoms?: string; shoes?: string; socks?: string[] } = JSON.parse(saved);
        const restored: CurrentOutfit = {};
        if (ids.tops && byId[ids.tops]) restored.tops = byId[ids.tops];
        if (ids.bottoms && byId[ids.bottoms]) restored.bottoms = byId[ids.bottoms];
        if (ids.shoes && byId[ids.shoes]) restored.shoes = byId[ids.shoes];
        if (ids.socks) restored.socks = ids.socks.flatMap((id) => byId[id] ? [byId[id]] : []);
        setOutfit(restored);
      } catch {
        // ignore malformed saved state
      }
    } else {
      setOutfit({
        tops:    byId["top-white-tank"],
        bottoms: byId["bottom-black-cargos"],
        shoes:   byId["footwear-dr-martens-1461"],
        socks:   [byId["accessory-white-crew-socks"]],
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const ids = {
      ...(outfit.tops ? { tops: outfit.tops.id } : {}),
      ...(outfit.bottoms ? { bottoms: outfit.bottoms.id } : {}),
      ...(outfit.shoes ? { shoes: outfit.shoes.id } : {}),
      ...(outfit.socks?.length ? { socks: outfit.socks.map((a) => a.id) } : {}),
    };
    localStorage.setItem("closet-outfit", JSON.stringify(ids));
  }, [outfit]);

  function equip(item: ClothingItem) {
    setOutfit((prev) => {
      if (item.category === "socks") {
        const current = prev.socks ?? [];
        const alreadyOn = current.some((a) => a.id === item.id);
        return {
          ...prev,
          socks: alreadyOn
            ? current.filter((a) => a.id !== item.id)
            : [...current, item],
        };
      }
      return { ...prev, [item.category]: item };
    });
  }

  function unequip(category: ClothingCategory) {
    setOutfit((prev) => {
      if (category === "socks") return { ...prev, socks: [] };
      const next = { ...prev };
      delete next[category];
      return next;
    });
  }

  function isEquipped(item: ClothingItem): boolean {
    if (item.category === "socks") {
      return (outfit.socks ?? []).some((a) => a.id === item.id);
    }
    return outfit[item.category]?.id === item.id;
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
