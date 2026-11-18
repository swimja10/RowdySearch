import type { Engine } from "./engine.ts";
import { loadEngine } from "./loadEngine.ts";
import type { FromWorker, ToWorker } from "./messages.ts";

// The search's background thread. Searching here means typing never stutters, even on a slow
// phone: the page only draws results, and this does the looking.

const say = (message: FromWorker) => postMessage(message);
let engine: Engine | undefined;

addEventListener("message", async (event: MessageEvent<ToWorker>) => {
  const message = event.data;

  if (message.type === "load") {
    try {
      const loaded = await loadEngine(message.indexUrl);
      engine = loaded.engine;
      say({ type: "ready", milliseconds: loaded.milliseconds });
    } catch (error) {
      say({ type: "failed", reason: String(error) });
    }
    return;
  }

  // The page only searches once it has heard "ready", so the engine is there.
  if (engine !== undefined) say({ type: "results", id: message.id, response: engine.search(message.query) });
});
