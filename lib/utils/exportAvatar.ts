import { CurrentOutfit } from "@/lib/types/clothing";
import { getOutfitImageSources } from "@/lib/utils/outfitLayers";

const BASE_AVATAR_ASPECT_RATIO = 128 / 60;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function exportAvatarPng(outfit: CurrentOutfit, targetWidth = 1080): Promise<void> {
  const sources = getOutfitImageSources(outfit);
  const images = await Promise.all(sources.map(loadImage));

  const width = targetWidth;
  const height = Math.round(targetWidth * BASE_AVATAR_ASPECT_RATIO);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2D context");
  ctx.imageSmoothingEnabled = false;

  for (const img of images) {
    ctx.drawImage(img, 0, 0, width, height);
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Failed to export canvas to PNG");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "avatar.png";
  a.click();
  URL.revokeObjectURL(url);
}
