import { classUrl, courseUrl, professorUrl, subjectUrl } from "./addresses.ts";
import { loadCatalog } from "./catalog.ts";
import { dataDate, loadData } from "./professors.ts";
import { SITE_URL } from "./site.ts";

// The sitemap: the list of every page, for search engines. It's split by kind of page, and
// /sitemap-index.xml lists the parts. The build check (scripts/check-site.mjs) fails when a page
// is missing from it or it lists a page that isn't there.

// The pages that aren't made from the data. A new one has to be added here.
const PAGES = ["/", "/subjects/", "/professors/", "/compare/", "/extension/", "/about/", "/data/", "/contact/", "/privacy/"];

export const SITEMAP_PARTS = ["pages", "subjects", "courses", "professors", "classes"] as const;
export type SitemapPart = (typeof SITEMAP_PARTS)[number];

export function sitemapPartUrl(part: SitemapPart): string {
  return `${SITE_URL}/sitemap-${part}.xml`;
}

function addressesIn(part: SitemapPart): string[] {
  const professors = Object.values(loadData().professors);
  if (part === "pages") return PAGES;
  if (part === "subjects") return [...loadCatalog().subjects.keys()].map(subjectUrl);
  if (part === "courses") return [...loadCatalog().courses.keys()].map(courseUrl);
  if (part === "professors") return professors.map((professor) => professorUrl(professor.name));
  return professors.flatMap((professor) => professor.courses.map((course) => classUrl(professor.name, course.code)));
}

// One part of the sitemap. Pages made from the data are dated with the day the data was built.
export function sitemapPart(part: SitemapPart): string {
  const changed = part === "pages" ? "" : `<lastmod>${dataDate()}</lastmod>`;
  const entries = addressesIn(part).map((address) => `<url><loc>${inXml(SITE_URL + address)}</loc>${changed}</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

// An address as XML needs it written.
function inXml(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// The list of the parts.
export function sitemapIndex(): string {
  const entries = SITEMAP_PARTS.map((part) => `<sitemap><loc>${sitemapPartUrl(part)}</loc><lastmod>${dataDate()}</lastmod></sitemap>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</sitemapindex>\n`;
}
