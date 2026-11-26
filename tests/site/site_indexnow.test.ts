// Checks the script that tells search engines which pages changed (site/scripts/indexnow.mjs),
// against a stand-in for IndexNow that can be made to fail. Nothing is sent to the real IndexNow.
//
//   cd site && npm run test:indexnow
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  BATCH_SIZE,
  afterSubmitting,
  changedAddresses,
  pageFingerprints,
  siteHasKey,
  submit,
} from "../../site/scripts/indexnow.mjs";

const SITE = "https://rowdysearch.com";
const KEY = "0123456789abcdef0123456789abcdef";

type Request = { path: string; body: any };

// A server that answers each request the way `answer` says, and keeps what it was sent.
async function standIn(
  answer: (request: Request, number: number) => { status: number; body?: string; hang?: boolean },
) {
  const requests: Request[] = [];
  const server = createServer((incoming: IncomingMessage, reply: ServerResponse) => {
    let text = "";
    incoming.on("data", (chunk) => (text += chunk));
    incoming.on("end", () => {
      const request = { path: incoming.url!, body: text === "" ? null : JSON.parse(text) };
      requests.push(request);
      const { status, body = "", hang = false } = answer(request, requests.length);
      if (hang) return; // never answers
      reply.writeHead(status).end(body);
    });
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  return {
    address,
    requests,
    close: () => {
      server.closeAllConnections();
      server.close();
    },
  };
}

const pages = (count: number) =>
  Array.from({ length: count }, (_, number) => `${SITE}/professors/p${number}/`);

// A built site with these pages, and a sitemap that lists them.
function builtSite(contents: Record<string, string>): string {
  const folder = mkdtempSync(path.join(tmpdir(), "indexnow-"));
  const locations = Object.keys(contents)
    .map((address) => `<url><loc>${SITE}${address}</loc></url>`)
    .join("");
  writeFileSync(
    path.join(folder, "sitemap-index.xml"),
    `<sitemapindex><sitemap><loc>${SITE}/sitemap-pages.xml</loc></sitemap></sitemapindex>`,
  );
  writeFileSync(path.join(folder, "sitemap-pages.xml"), `<urlset>${locations}</urlset>`);
  for (const [address, page] of Object.entries(contents)) {
    mkdirSync(path.join(folder, address), { recursive: true });
    writeFileSync(path.join(folder, address, "index.html"), page);
  }
  return folder;
}

test("new, changed, and removed pages are submitted, and unchanged ones aren't", () => {
  const before = { a: "1", b: "2", c: "3" };
  const now = { a: "1", b: "changed", d: "new" };
  assert.deepEqual(changedAddresses(before, now).sort(), ["b", "c", "d"]);
  assert.deepEqual(changedAddresses({}, now).sort(), ["a", "b", "d"]);
  assert.deepEqual(changedAddresses(now, now), []);
});

test("a page counts as changed when what it says changed, not when a script or style was renamed", () => {
  const page = (style: string, median: string) =>
    `<link rel="stylesheet" href="/_astro/Base.${style}.css"><script src="/_astro/search.${style}.js"></script>` +
    `<link rel="preload" href="/search-index.${"ab12".repeat(3)}${style === "one" ? "0" : "1"}.json"><p>The median grade was ${median}.</p>`;
  const first = pageFingerprints(
    builtSite({ "/": page("one", "B"), "/courses/mat-1213/": page("one", "C+") }),
  );
  const rebuilt = pageFingerprints(
    builtSite({ "/": page("two", "B"), "/courses/mat-1213/": page("two", "C") }),
  );
  assert.deepEqual(Object.keys(first), [`${SITE}/`, `${SITE}/courses/mat-1213/`]);
  assert.deepEqual(changedAddresses(first, rebuilt), [`${SITE}/courses/mat-1213/`]);
});

test("addresses go 10,000 at a time, with the key and where to find it", async () => {
  const indexNow = await standIn(() => ({ status: 200 }));
  const addresses = pages(BATCH_SIZE * 2 + 5);
  const result = await submit(addresses, { key: KEY, endpoint: indexNow.address });
  indexNow.close();

  assert.equal(result.problem, null);
  assert.deepEqual(result.accepted, addresses);
  assert.deepEqual(
    indexNow.requests.map((request) => request.body.urlList.length),
    [BATCH_SIZE, BATCH_SIZE, 5],
  );
  for (const request of indexNow.requests) {
    assert.equal(request.body.host, "rowdysearch.com");
    assert.equal(request.body.key, KEY);
    assert.equal(request.body.keyLocation, `${SITE}/indexnow-key.txt`);
  }
});

test("202 (accepted, key still being checked) counts as submitted", async () => {
  const indexNow = await standIn(() => ({ status: 202 }));
  const result = await submit(pages(3), { key: KEY, endpoint: indexNow.address });
  indexNow.close();
  assert.equal(result.problem, null);
  assert.equal(result.accepted.length, 3);
});

for (const status of [400, 403, 422, 429, 500, 503]) {
  test(`when IndexNow answers ${status} on the second request, only the first 10,000 count as submitted`, async () => {
    const indexNow = await standIn((_, number) => ({ status: number >= 2 ? status : 200 }));
    const addresses = pages(BATCH_SIZE * 3);
    const result = await submit(addresses, {
      key: KEY,
      endpoint: indexNow.address,
      retryWaitMs: 10,
    });
    indexNow.close();

    assert.equal(result.problem, `IndexNow answered ${status}`);
    assert.deepEqual(result.accepted, addresses.slice(0, BATCH_SIZE));
    // A 403 is tried once more. Nothing else is.
    assert.equal(indexNow.requests.length, status === 403 ? 3 : 2, "it kept going after a failure");
  });
}

test("a 403 is tried once more, since IndexNow refused the first submission and took the second", async () => {
  const indexNow = await standIn((_, number) => ({ status: number === 1 ? 403 : 200 }));
  const addresses = pages(BATCH_SIZE + 2);
  const result = await submit(addresses, { key: KEY, endpoint: indexNow.address, retryWaitMs: 10 });
  indexNow.close();
  assert.equal(result.problem, null);
  assert.deepEqual(result.accepted, addresses);
  assert.deepEqual(
    indexNow.requests.map((request) => request.body.urlList.length),
    [BATCH_SIZE, BATCH_SIZE, 2],
  );
});

test("when IndexNow never answers, it gives up and nothing counts as submitted", async () => {
  const indexNow = await standIn(() => ({ status: 200, hang: true }));
  const result = await submit(pages(3), { key: KEY, endpoint: indexNow.address, timeoutMs: 300 });
  indexNow.close();
  assert.deepEqual(result.accepted, []);
  assert.match(result.problem!, /couldn't be reached/);
});

test("when IndexNow can't be reached at all, nothing counts as submitted", async () => {
  const result = await submit(pages(3), { key: KEY, endpoint: "http://127.0.0.1:9/" });
  assert.deepEqual(result.accepted, []);
  assert.match(result.problem!, /couldn't be reached/);
});

test("only what was accepted is remembered, so the rest is tried again", () => {
  const before = { a: "1", b: "2", gone: "3", goneLater: "4" };
  const now = { a: "changed", b: "changed too", c: "new" };
  const sent = afterSubmitting(before, now, ["a", "gone"]);
  assert.deepEqual(sent, { a: "changed", b: "2", goneLater: "4" });
  assert.deepEqual(changedAddresses(sent, now).sort(), ["b", "c", "goneLater"]);
  assert.deepEqual(changedAddresses(afterSubmitting(sent, now, ["b", "c", "goneLater"]), now), []);
});

test("the live site has to have the matching key file before anything is submitted", async () => {
  const live = await standIn((request) =>
    request.path === "/indexnow-key.txt" ? { status: 200, body: `${KEY}\n` } : { status: 404 },
  );
  assert.equal(await siteHasKey(KEY, live.address), true);
  assert.equal(await siteHasKey("another-key", live.address), false);
  live.close();

  const notUploaded = await standIn(() => ({ status: 404, body: "not found" }));
  assert.equal(await siteHasKey(KEY, notUploaded.address), false);
  notUploaded.close();
  assert.equal(await siteHasKey(KEY, "http://127.0.0.1:9"), false);
});
