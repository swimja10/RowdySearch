import type { APIRoute } from "astro";
import { compareFiles } from "../../compare/groups.ts";

// Writes the data Analytical Mode downloads, as /compare-data/<number>.<fingerprint>.json.
export function getStaticPaths() {
  return compareFiles().files.map((file) => ({ params: { file: file.name }, props: { json: file.json } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(props.json, { headers: { "Content-Type": "application/json; charset=utf-8" } });
