import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CLOTHING_PATH = resolve(ROOT, "lib/data/clothing.json");
const CHANGELOG_PATH = resolve(ROOT, "lib/data/changelog.json");
const BUILD_META_PATH = resolve(ROOT, "lib/data/buildMeta.json");

function getPreviousClothing() {
  try {
    const raw = execSync("git show HEAD:lib/data/clothing.json", { cwd: ROOT }).toString();
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

const current = JSON.parse(readFileSync(CLOTHING_PATH, "utf8"));
const previous = getPreviousClothing();

const prevIds = new Set(previous.map((i) => i.id));
const prevCategories = new Set(previous.map((i) => i.category));

const added = current.filter((i) => !prevIds.has(i.id));

if (added.length === 0) {
  console.log("changelog: no new items");
  process.exit(0);
}

// Group by category
const byCategory = {};
for (const item of added) {
  (byCategory[item.category] ??= []).push(item.name);
}

const lines = [];
for (const [category, names] of Object.entries(byCategory)) {
  const isNewCategory = !prevCategories.has(category);
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  const nameList = names.length <= 2
    ? names.join(" and ")
    : `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
  if (isNewCategory) {
    lines.push(`Added ${label} category with ${nameList}`);
  } else {
    lines.push(`Added ${nameList} to ${label}`);
  }
}

const now = new Date();
const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

const entry = {
  date: localDate,
  changes: lines,
};

const changelog = JSON.parse(readFileSync(CHANGELOG_PATH, "utf8"));
changelog.unshift(entry);
writeFileSync(CHANGELOG_PATH, JSON.stringify(changelog, null, 2));

writeFileSync(BUILD_META_PATH, JSON.stringify({ buildTime: Date.now() }, null, 2));

console.log(`changelog: added entry for ${localDate}`);
lines.forEach((l) => console.log(`  • ${l}`));
