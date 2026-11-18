// Runs after every build. It fails the build when the site has grown past Cloudflare's free limit,
// when any link on any page points at a page that isn't there, when words are glued to a link,
// when a page would be kept by browsers instead of fetched fresh, or when a page is missing what
// search engines read: its title, description, address, preview picture, and place in the sitemap.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// Cloudflare's free plan allows 20,000 files per deployment. Workers Paid allows 100,000.
const FILE_LIMIT = 20_000;
const SITE_URL = "https://rowdysearch.com";

const builtSite = path.resolve(import.meta.dirname, "../dist");

function filesIn(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(folder, entry.name);
    return entry.isDirectory() ? filesIn(full) : [full];
  });
}

const files = filesIn(builtSite);
const served = new Set(files.map((file) => `/${path.relative(builtSite, file).split(path.sep).join("/")}`));

// "/courses/mat-1213/" is served by "/courses/mat-1213/index.html".
function exists(address) {
  const clean = address.split("#")[0].split("?")[0];
  return served.has(clean) || served.has(`${clean}index.html`) || served.has(`${clean}/index.html`);
}

const broken = new Map(); // a missing address -> the first page that links to it
let linksChecked = 0;

// The build drops a line break between words and a link, which shows as "pages.See what". The
// fix is {" "} at the end of the line before the link.
const GLUED = /[A-Za-z0-9.,;:]<a\s[^>]*>[^<]{0,30}|<\/a>[A-Za-z0-9][^<]{0,30}/g;
const glued = new Map(); // the glued words -> the first page they're on

// What search engines read from each page. A page's address is "/courses/mat-1213/".
const notFindable = []; // "what's wrong  (on which page)"
const pagesByTitle = new Map(); // a title -> the pages that have it
const addressOf = (file) => `/${path.relative(builtSite, file).split(path.sep).join("/")}`.replace(/index\.html$/, "");
const tagsIn = (page, pattern) => [...page.matchAll(pattern)].map((match) => match[1]);
let markupBlocks = 0;
function checkFindable(file, page) {
  const address = addressOf(file);
  const wrong = (what) => notFindable.push(`${what}  (on ${address})`);

  const titles = tagsIn(page, /<title>([^<]*)<\/title>/g);
  if (titles.length !== 1 || titles[0].trim() === "") wrong(`${titles.length} titles`);
  else pagesByTitle.set(titles[0], [...(pagesByTitle.get(titles[0]) ?? []), address]);

  const descriptions = tagsIn(page, /<meta name="description" content="([^"]*)"/g);
  if (descriptions.length !== 1 || descriptions[0].length < 50) wrong("no description, or one under 50 letters");

  const canonical = tagsIn(page, /<link rel="canonical" href="([^"]*)"/g);
  if (canonical.length !== 1 || canonical[0] !== SITE_URL + address) wrong(`its address is given as ${canonical[0]}`);

  if (!page.includes(`<meta property="og:image" content="${SITE_URL}/preview.png"`)) wrong("no preview picture");

  for (const markup of tagsIn(page, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    markupBlocks++;
    try {
      if (JSON.parse(markup)["@context"] !== "https://schema.org") wrong("markup without schema.org");
    } catch {
      wrong("markup that can't be read");
    }
  }
  // Every page below the home page says where it sits: Home > MAT > MAT 1213.
  const isLookupPage = /^\/(subjects|courses|professors)\//.test(address);
  if (isLookupPage && !page.includes('"@type":"BreadcrumbList"')) wrong("no breadcrumb markup");
}
for (const file of files) {
  if (!file.endsWith(".html")) continue;
  const page = readFileSync(file, "utf8");
  // The "page not found" page has no address of its own and is kept out of search engines.
  if (!file.endsWith(`${path.sep}404.html`)) checkFindable(file, page);
  for (const [, address] of page.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    linksChecked++;
    if (!exists(address) && !broken.has(address)) broken.set(address, path.relative(builtSite, file));
  }
  const visible = page.replaceAll(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
  for (const [words] of visible.matchAll(GLUED)) {
    if (!glued.has(words)) glued.set(words, path.relative(builtSite, file));
  }
}

// Pages must be fetched fresh every time, or a phone keeps showing the old one after an upload.
// Only files (pictures, scripts, styles) may be kept. A rule in _headers that keeps files and
// also matches a page's address is a mistake: "/extension/*" matched the page "/extension/".
const pages = [...served].filter((file) => file.endsWith("/index.html")).map((file) => file.slice(0, -"index.html".length));
const keptPages = new Map(); // a rule -> the first page it would keep
let rule = null;
for (const line of readFileSync(path.join(builtSite, "_headers"), "utf8").split("\n")) {
  if (line.startsWith("/")) rule = line.trim();
  else if (!/^\s/.test(line)) rule = null;
  const kept = /^\s+Cache-Control:.*max-age=(\d+)/i.exec(line);
  if (!rule || !kept || Number(kept[1]) === 0) continue;
  const pattern = rule.replaceAll(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*").replaceAll(/:\w+/g, "[^/]+");
  const page = pages.find((address) => new RegExp(`^${pattern}$`).test(address));
  if (page) keptPages.set(rule, page);
}

// The sitemap has to list every page, and nothing that isn't a page. robots.txt points to it.
const locationsIn = (file) => tagsIn(readFileSync(path.join(builtSite, file), "utf8"), /<loc>([^<]*)<\/loc>/g);
const inSitemap = locationsIn("sitemap-index.xml").flatMap((part) => locationsIn(part.replace(`${SITE_URL}/`, "")));
const listed = new Set(inSitemap);
const pageAddresses = new Set(pages.map((address) => SITE_URL + address));
for (const address of pageAddresses) if (!listed.has(address)) notFindable.push(`not in the sitemap  (${address})`);
for (const address of listed) if (!pageAddresses.has(address)) notFindable.push(`in the sitemap but not a page  (${address})`);
if (inSitemap.length !== listed.size) notFindable.push(`${inSitemap.length - listed.size} pages are in the sitemap twice`);
if (!readFileSync(path.join(builtSite, "robots.txt"), "utf8").includes(`Sitemap: ${SITE_URL}/sitemap-index.xml`)) {
  notFindable.push("robots.txt doesn't point to the sitemap");
}
if (!served.has("/preview.png")) notFindable.push("the preview picture, /preview.png, is missing");
// IndexNow (scripts/indexnow.mjs) proves the site is ours with a key file: 8 to 128 letters a-f, digits, and dashes.
const indexNowKey = served.has("/indexnow-key.txt") ? readFileSync(path.join(builtSite, "indexnow-key.txt"), "utf8").trim() : "";
if (!/^[a-f0-9-]{8,128}$/.test(indexNowKey)) notFindable.push("the IndexNow key file, /indexnow-key.txt, is missing or isn't a key");
for (const [title, withIt] of pagesByTitle) {
  if (withIt.length > 1) notFindable.push(`${withIt.length} pages share the title "${title}"  (${withIt.slice(0, 3).join(", ")})`);
}

const megabytes = files.reduce((total, file) => total + statSync(file).size, 0) / 1_000_000;
console.log(`${files.length.toLocaleString()} files (${megabytes.toFixed(0)} MB), ${(FILE_LIMIT - files.length).toLocaleString()} under the limit of ${FILE_LIMIT.toLocaleString()}.`);
console.log(`${linksChecked.toLocaleString()} links checked, ${broken.size} broken.`);

for (const [address, page] of [...broken].slice(0, 20)) console.error(`  ${address}  (linked from ${page})`);
console.log(`${glued.size} places where words are glued to a link.`);
for (const [words, page] of [...glued].slice(0, 20)) console.error(`  ${words}  (on ${page})`);

console.log(`${keptPages.size} pages that browsers would keep instead of fetching fresh.`);
for (const [kept, page] of keptPages) console.error(`  the rule ${kept} in public/_headers also matches the page ${page}`);

console.log(`${listed.size.toLocaleString()} pages in the sitemap, ${markupBlocks.toLocaleString()} blocks of markup read, ${notFindable.length} problems with what search engines read.`);
for (const problem of notFindable.slice(0, 20)) console.error(`  ${problem}`);

if (files.length > FILE_LIMIT) {
  console.error(`The site is over Cloudflare's free limit of ${FILE_LIMIT.toLocaleString()} files. See "File budget" in docs/website-plan.md.`);
  process.exit(1);
}
if (broken.size > 0 || glued.size > 0 || keptPages.size > 0 || notFindable.length > 0) process.exit(1);
