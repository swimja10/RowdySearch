import type { APIRoute } from "astro";
import { searchIndexFile } from "../search/indexFile.ts";

// Writes the search's slim index as /search-index.<fingerprint>.json.
export function getStaticPaths() {
  return [{ params: { fingerprint: searchIndexFile().fingerprint } }];
}

export const GET: APIRoute = () =>
  new Response(searchIndexFile().json, { headers: { "Content-Type": "application/json; charset=utf-8" } });
