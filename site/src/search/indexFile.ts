import { createHash } from "node:crypto";
import { professorSlug } from "../data/addresses.ts";
import { loadData } from "../data/professors.ts";
import { buildSlimIndex } from "./slimIndex.ts";

// The slim index as the file the browser downloads. Its name has a fingerprint of its contents in
// it, so browsers can keep it forever: when the data changes, the name changes with it.
type IndexFile = {
  json: string;
  fingerprint: string; // "3f9a1c0b7e"
  url: string; // "/search-index.3f9a1c0b7e.json"
};

let built: IndexFile | undefined;

export function searchIndexFile(): IndexFile {
  if (built === undefined) {
    const json = JSON.stringify(buildSlimIndex(loadData().professors, professorSlug));
    const fingerprint = createHash("sha256").update(json).digest("hex").slice(0, 10);
    built = { json, fingerprint, url: `/search-index.${fingerprint}.json` };
  }
  return built;
}
