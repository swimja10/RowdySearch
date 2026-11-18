import { createEngine, type Engine } from "./engine.ts";
import type { SlimIndex } from "./slimIndex.ts";

// Downloads the slim index and builds the search engine from it. The background thread uses this,
// and so does the page itself when a browser can't start a background thread.
export async function loadEngine(indexUrl: string): Promise<{ engine: Engine; milliseconds: number }> {
  const response = await fetch(indexUrl);
  if (!response.ok) throw new Error(`${indexUrl} answered ${response.status}`);
  const slim: SlimIndex = await response.json();

  const started = performance.now();
  const engine = createEngine(slim);
  return { engine, milliseconds: performance.now() - started };
}
