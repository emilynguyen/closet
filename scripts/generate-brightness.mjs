import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ALPHA_THRESHOLD = 10;

async function calcBrightness(assetPath) {
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

  let sum = 0;
  let count = 0;
  for (let i = 0; i < totalPixels; i++) {
    const alpha = data[i * channels + 3];
    if (alpha <= ALPHA_THRESHOLD) continue;
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    count++;
  }

  return count === 0 ? 0 : parseFloat((sum / count).toFixed(2));
}

const items = JSON.parse(readFileSync(resolve(ROOT, "lib/data/clothing.json"), "utf8"));

console.log(`Calculating brightness for ${items.length} items...\n`);

const brightness = {};
for (const item of items) {
  process.stdout.write(`  ${item.name.padEnd(36)}`);
  const value = await calcBrightness(item.assetPath);
  brightness[item.id] = value;
  console.log(`${value}`);
}

writeFileSync(resolve(ROOT, "lib/data/brightness.json"), JSON.stringify(brightness, null, 2));
console.log(`\n✓ lib/data/brightness.json updated`);
