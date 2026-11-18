// Tells search engines which pages changed, through IndexNow. Bing, Yandex, Naver, Seznam, and Yep
// take part, and Bing's index is what ChatGPT and Copilot search. Google doesn't take part: it reads
// the sitemap. Run it after every upload, which `npm run deploy` does.
//
//   node scripts/indexnow.mjs            submit the pages that changed since the last time
//   node scripts/indexnow.mjs --dry-run  only say how many would be submitted
//
// It remembers what it last submitted in .indexnow-sent.json. Without that file every page counts
// as changed and is submitted again, which is allowed but shouldn't be done often.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://rowdysearch.com";
const ENDPOINT = "https://api.indexnow.org/indexnow";
// IndexNow takes at most this many addresses in one request.
export const BATCH_SIZE = 10_000;
const TIMEOUT_MS = 30_000;
// 403 means IndexNow couldn't check the key file. It happened on the very first submission, seconds
// after the upload, and worked a minute later. So a 403 is tried once more after this long.
const RETRY_WAIT_MS = 30_000;

const site = path.resolve(import.meta.dirname, "..");

// A short fingerprint of each page in the sitemap, by its address. Scripts and styles have a
// fingerprint in their file names that changes with every build, so those names are left out:
// a page only counts as changed when what it says changed.
export function pageFingerprints(builtSite, siteUrl = SITE_URL) {
  const locationsIn = (file) => [...readFileSync(path.join(builtSite, file), "utf8").matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1]);
  const addresses = locationsIn("sitemap-index.xml").flatMap((part) => locationsIn(part.replace(`${siteUrl}/`, "")));

  const fingerprints = {};
  for (const address of addresses) {
    const page = readFileSync(path.join(builtSite, address.replace(siteUrl, ""), "index.html"), "utf8");
    const whatItSays = page.replaceAll(/\/_astro\/[^"'\s)]+/g, "").replaceAll(/search-index\.[0-9a-f]+\.json/g, "");
    fingerprints[address] = createHash("sha256").update(whatItSays).digest("hex").slice(0, 16);
  }
  return fingerprints;
}

// The addresses to tell search engines about: pages that are new, pages that say something
// different, and pages that are gone (so they get dropped).
export function changedAddresses(sentBefore, now) {
  const changed = Object.keys(now).filter((address) => sentBefore[address] !== now[address]);
  const gone = Object.keys(sentBefore).filter((address) => !(address in now));
  return [...changed, ...gone];
}

// Submits the addresses, 10,000 at a time. Returns the ones that were accepted and, if a request
// failed, why. It stops at the first failure, so the rest are tried again next time.
export async function submit(addresses, { key, siteUrl = SITE_URL, endpoint = ENDPOINT, timeoutMs = TIMEOUT_MS, retryWaitMs = RETRY_WAIT_MS }) {
  const accepted = [];
  let hasRetried = false;
  for (let start = 0; start < addresses.length; start += BATCH_SIZE) {
    const batch = addresses.slice(start, start + BATCH_SIZE);
    try {
      const send = () => fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation: `${siteUrl}/indexnow-key.txt`, urlList: batch }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      let reply = await send();
      if (reply.status === 403 && !hasRetried) {
        hasRetried = true;
        await new Promise((done) => setTimeout(done, retryWaitMs));
        reply = await send();
      }
      // 200 is accepted. 202 is accepted, with the key still being checked.
      if (reply.status !== 200 && reply.status !== 202) return { accepted, problem: `IndexNow answered ${reply.status}` };
    } catch (error) {
      return { accepted, problem: `IndexNow couldn't be reached (${error.name})` };
    }
    accepted.push(...batch);
  }
  return { accepted, problem: null };
}

// What was last submitted, after these addresses were accepted.
export function afterSubmitting(sentBefore, now, accepted) {
  const sent = { ...sentBefore };
  for (const address of accepted) {
    if (address in now) sent[address] = now[address];
    else delete sent[address];
  }
  return sent;
}

// True when the live site has the key file, which is how IndexNow knows the request is the owner's.
export async function siteHasKey(key, siteUrl = SITE_URL) {
  try {
    const reply = await fetch(`${siteUrl}/indexnow-key.txt`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    return reply.ok && (await reply.text()).trim() === key;
  } catch {
    return false;
  }
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const sentFile = path.join(site, ".indexnow-sent.json");
  const key = readFileSync(path.join(site, "public/indexnow-key.txt"), "utf8").trim();

  const sentBefore = existsSync(sentFile) ? JSON.parse(readFileSync(sentFile, "utf8")) : {};
  const now = pageFingerprints(path.join(site, "dist"));
  const addresses = changedAddresses(sentBefore, now);
  console.log(`${addresses.length.toLocaleString()} of ${Object.keys(now).length.toLocaleString()} pages changed since they were last submitted.`);
  if (addresses.length === 0 || isDryRun) return;

  if (!(await siteHasKey(key))) {
    console.error(`${SITE_URL}/indexnow-key.txt isn't on the live site, or doesn't match. Upload the site first.`);
    process.exit(1);
  }
  const { accepted, problem } = await submit(addresses, { key });
  writeFileSync(sentFile, JSON.stringify(afterSubmitting(sentBefore, now, accepted)));
  console.log(`${accepted.length.toLocaleString()} pages submitted to IndexNow.`);
  if (problem !== null) {
    console.error(`${problem}. The other ${(addresses.length - accepted.length).toLocaleString()} will be tried the next time this runs.`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
