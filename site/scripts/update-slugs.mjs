// Gives every professor a permanent address, and remembers it in slugs.json.
//
// It runs before every build. A professor already in slugs.json keeps their address forever, so a
// link someone saved or a page Google indexed never breaks. Only new professors get new ones.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const siteFolder = path.resolve(import.meta.dirname, "..");
const dataFile = path.resolve(siteFolder, "../data/professors.json");
const slugsFile = path.resolve(siteFolder, "slugs.json");

// "Bülent Temel" -> "bulent-temel"
function slugOf(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const names = Object.keys(JSON.parse(readFileSync(dataFile, "utf8")));
const slugs = existsSync(slugsFile) ? JSON.parse(readFileSync(slugsFile, "utf8")) : {};
const taken = new Set(Object.values(slugs));

let added = 0;
for (const name of names) {
  if (slugs[name] !== undefined) continue;

  const base = slugOf(name);
  if (base === "") throw new Error(`"${name}" has no letters or numbers to make an address from.`);

  // Two professors with the same name: the second gets "-2", the third "-3".
  let slug = base;
  for (let number = 2; taken.has(slug); number++) slug = `${base}-${number}`;

  slugs[name] = slug;
  taken.add(slug);
  added++;
}

if (added > 0) {
  const sorted = Object.fromEntries(Object.entries(slugs).sort(([first], [second]) => first.localeCompare(second)));
  writeFileSync(slugsFile, `${JSON.stringify(sorted, null, 2)}\n`);
}
console.log(`slugs.json: ${Object.keys(slugs).length} addresses, ${added} new.`);
