import { execSync } from "child_process";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CLOTHING_PATH = resolve(ROOT, "lib/data/clothing.json");
const ASSETS_DIR = resolve(ROOT, "public/assets/clothing");

const CATEGORIES = ["tops", "bottoms", "shoes", "socks", "hair"];

const CATEGORY_PREFIX = {
  tops: "top",
  bottoms: "bottom",
  shoes: "footwear",
  socks: "accessory",
  hair: "hair",
};

function toId(category, filename) {
  const stem = filename.replace(/\.png$/i, "");
  const slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${CATEGORY_PREFIX[category]}-${slug}`;
}

function toName(filename) {
  const stem = filename.replace(/\.png$/i, "");
  return stem.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toAssetPath(category, filename) {
  return `/assets/clothing/${category}/${encodeURIComponent(filename)}`;
}

const clothing = JSON.parse(readFileSync(CLOTHING_PATH, "utf8"));
const existingPaths = new Set(clothing.map((item) => decodeURIComponent(item.assetPath)));

const newItems = [];

for (const category of CATEGORIES) {
  const dir = resolve(ASSETS_DIR, category);
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith(".png"));
  } catch {
    continue;
  }

  for (const filename of files) {
    const assetPath = toAssetPath(category, filename);
    if (existingPaths.has(decodeURIComponent(assetPath))) continue;

    const id = toId(category, filename);
    const name = toName(filename);

    const entry = { id, category, name, assetPath };
    newItems.push(entry);
    clothing.push(entry);
    console.log(`  + [${category}] ${name}`);
  }
}

if (newItems.length === 0) {
  console.log("add-items: no new files detected");
  process.exit(0);
}

writeFileSync(CLOTHING_PATH, JSON.stringify(clothing, null, 2));
console.log(`\n✓ ${newItems.length} item(s) added to lib/data/clothing.json`);

console.log("\nRunning generate-crops...");
execSync("node scripts/generate-crops.mjs", { cwd: ROOT, stdio: "inherit" });

console.log("\nRunning generate-pixel-coverage...");
execSync("node scripts/generate-pixel-coverage.mjs", { cwd: ROOT, stdio: "inherit" });

console.log("\nRunning generate-brightness...");
execSync("node scripts/generate-brightness.mjs", { cwd: ROOT, stdio: "inherit" });

console.log("\n  Run: npm run changelog when ready");
