import type { APIRoute } from "astro";
import { sitemapIndex } from "../data/sitemap.ts";

// Writes /sitemap-index.xml, which lists the parts of the sitemap. robots.txt points here.
export const GET: APIRoute = () =>
  new Response(sitemapIndex(), { headers: { "Content-Type": "application/xml; charset=utf-8" } });
