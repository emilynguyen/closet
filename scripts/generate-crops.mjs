import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ALPHA_THRESHOLD = 10;
const PADDING = 0.08; // minimum fraction of container to leave as padding on each side

async function findCropY(assetPath) {
  const fullPath = resolve(ROOT, "public", decodeURIComponent(assetPath.replace(/^\//, "")));

  let result;
  try {
    result = await sharp(fullPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  } catch (e) {
    console.warn(`  ⚠ Could not read ${assetPath}: ${e.message}`);
    return 0;
  }

  const { data, info } = result;
  const { width, height, channels } = info;

  let topRow = height;
  let bottomRow = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > ALPHA_THRESHOLD) {
        if (y < topRow) topRow = y;
        if (y > bottomRow) bottomRow = y;
      }
    }
  }

  if (bottomRow === -1) {
    console.warn(`  ⚠ No visible pixels found`);
    return 0;
  }

  // If the item fills more than (1 - 2*PADDING) of the container, zoom out so
  // it fits with the minimum padding on each side. Otherwise scale stays 1.
  const itemHeight = bottomRow - topRow + 1;
  const maxFill = 1 - 2 * PADDING;
  const scale = (itemHeight / width) > maxFill ? maxFill * width / itemHeight : 1;

  const centerRow = (topRow + bottomRow) / 2;
  const cropY = parseFloat(((0.5 - centerRow * scale / width) * 100).toFixed(4));
  return scale === 1 ? cropY : { cropY, cropScale: parseFloat(scale.toFixed(4)) };
}

const items = JSON.parse(readFileSync(resolve(ROOT, "lib/data/clothing.json"), "utf8"));

console.log(`Analyzing ${items.length} items...\n`);

const offsets = {};
for (const item of items) {
  process.stdout.write(`  ${item.name.padEnd(32)}`);
  const result = await findCropY(item.assetPath);
  offsets[item.id] = result;
  if (typeof result === "number") {
    console.log(`cropY: ${result}%`);
  } else {
    console.log(`cropY: ${result.cropY}%  scale: ${result.cropScale}x`);
  }
}

writeFileSync(resolve(ROOT, "lib/data/cropOffsets.json"), JSON.stringify(offsets, null, 2));
console.log(`\n✓ lib/data/cropOffsets.json updated`);
