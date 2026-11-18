import type { APIRoute } from "astro";
import { SITEMAP_PARTS, sitemapPart, type SitemapPart } from "../data/sitemap.ts";

// Writes one file for each part of the sitemap: /sitemap-professors.xml, /sitemap-classes.xml, ...
export function getStaticPaths() {
  return SITEMAP_PARTS.map((part) => ({ params: { part } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(sitemapPart(params.part as SitemapPart), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
