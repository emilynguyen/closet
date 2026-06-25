import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ALPHA_THRESHOLD = 10;

async function countOpaquePixels(assetPath) {
  const fullPath = resolve(ROOT, "public", decodeURIComponent(assetPath.replace(/^\//, "")));
  let result;
  try {
    result = await sharp(fullPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  } catch (e) {
    console.warn(`  ⚠ Could not read ${assetPath}: ${e.message}`);
    return 0;
  }
  const { data, info } = result;
  const { channels } = info;
  const totalPixels = info.width * info.height;
  let opaque = 0;
  for (let i = 0; i < totalPixels; i++) {
    if (data[i * channels + 3] > ALPHA_THRESHOLD) opaque++;
  }
  return opaque;
}

const items = JSON.parse(readFileSync(resolve(ROOT, "lib/data/clothing.json"), "utf8"));

console.log(`Counting pixels for ${items.length} items...\n`);

const coverage = {};
for (const item of items) {
  process.stdout.write(`  ${item.name.padEnd(36)}`);
  const count = await countOpaquePixels(item.assetPath);
  coverage[item.id] = count;
  console.log(`${count}`);
}

writeFileSync(resolve(ROOT, "lib/data/pixelCoverage.json"), JSON.stringify(coverage, null, 2));
console.log(`\n✓ lib/data/pixelCoverage.json updated`);
