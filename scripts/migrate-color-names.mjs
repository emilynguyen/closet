import { readFileSync, writeFileSync, renameSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CLOTHING_PATH = resolve(ROOT, "lib/data/clothing.json");
const PUBLIC_DIR = resolve(ROOT, "public");

const COLORS = ["Black", "White", "Grey", "Brown", "Blue", "Green", "Ivory", "Dune", "Camo"];

function extractColor(name) {
  // Color at start: "Black Cami" → { base: "Cami", color: "Black" }
  for (const color of COLORS) {
    if (name.startsWith(color + " ")) {
      return { base: name.slice(color.length + 1), color };
    }
  }
  // Color at end: "Scuffers Double Polo Grey"
  for (const color of COLORS) {
    if (name.endsWith(" " + color)) {
      return { base: name.slice(0, name.length - color.length - 1), color };
    }
  }
  // Color in middle: "Jaded London Black Parachute Pants"
  for (const color of COLORS) {
    const idx = name.indexOf(" " + color + " ");
    if (idx !== -1) {
      const base = name.slice(0, idx) + name.slice(idx + color.length + 1);
      return { base, color };
    }
  }
  return null;
}

const clothing = JSON.parse(readFileSync(CLOTHING_PATH, "utf8"));
const updated = [];
const renames = [];
const skipped = [];

for (const item of clothing) {
  const result = extractColor(item.name);
  if (!result) {
    skipped.push(item.name);
    updated.push(item);
    continue;
  }

  const { base, color } = result;
  const newName = `${base} [${color}]`;
  const newFilename = `${base.toLowerCase()} [${color.toLowerCase()}].png`;
  const category = item.category;
  const oldAssetPath = item.assetPath;
  const oldFilename = decodeURIComponent(oldAssetPath.split("/").pop());
  const dir = `assets/clothing/${category}`;
  const oldFullPath = resolve(PUBLIC_DIR, dir, oldFilename);
  const newFullPath = resolve(PUBLIC_DIR, dir, newFilename);
  const newAssetPath = `/${dir}/${encodeURIComponent(newFilename)}`;

  if (!existsSync(oldFullPath)) {
    console.warn(`  ⚠ File not found: ${oldFullPath}`);
    updated.push(item);
    continue;
  }

  renames.push({ from: oldFilename, to: newFilename, oldName: item.name, newName });
  renameSync(oldFullPath, newFullPath);
  updated.push({ ...item, name: newName, assetPath: newAssetPath });
}

writeFileSync(CLOTHING_PATH, JSON.stringify(updated, null, 2));

console.log(`\nRenamed ${renames.length} items:\n`);
for (const r of renames) {
  console.log(`  ${r.oldName}`);
  console.log(`  → ${r.newName}`);
  console.log(`    ${r.from} → ${r.to}\n`);
}

console.log(`Skipped (no color detected):`);
for (const s of skipped) console.log(`  ${s}`);

console.log(`\n✓ clothing.json updated`);
console.log("  Run: npm run generate-crops to regenerate crop offsets");
