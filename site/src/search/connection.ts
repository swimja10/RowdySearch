import type { SearchResponse } from "./engine.ts";
import type { FromWorker, ToWorker } from "./messages.ts";

// The page's line to the search engine. It hides where the engine runs (a background thread, or
// the page itself when that can't start) and handles a slim index that fails to load.

export type SearchState = "idle" | "loading" | "ready" | "failed";

// A failed load tries again by itself twice, after 1 and then 3 seconds, before saying so.
const RETRY_DELAYS = [1000, 3000];
// It normally takes well under a second. One that hangs this long is given up on and tried again.
const GIVE_UP_AFTER = 15_000;
let giveUpTimer: ReturnType<typeof setTimeout> | undefined;

type Listener = (state: SearchState) => void;

let state: SearchState = "idle";
let indexUrl = "";
let attempt = 0;
const listeners = new Set<Listener>();

// How searches reach the engine once it's ready: through the background thread, or straight to it.
let ask: ((query: string) => Promise<SearchResponse>) | undefined;
let worker: Worker | undefined;
let nextId = 1;
const waiting = new Map<number, (response: SearchResponse) => void>();

export function searchState(): SearchState {
  return state;
}

// Calls `listener` every time the search becomes ready, starts loading, or fails.
export function onSearchState(listener: Listener): void {
  listeners.add(listener);
}

function setState(next: SearchState) {
  state = next;
  for (const listener of listeners) listener(next);
}

// Starts getting the search ready, if it isn't ready or on its way already. Safe to call often:
// the search box calls it when it's touched, and the page calls it once it has finished loading.
export function startSearch(url: string): void {
  if (state === "loading" || state === "ready") return;
  indexUrl = url;
  attempt = 0;
  setState("loading");
  load();
}

// The search's answer for `query`. Only call it once the state is "ready".
export function searchFor(query: string): Promise<SearchResponse> {
  return ask!(query);
}

function load() {
  // A download that hangs is given up on, and counted as a failed try.
  clearTimeout(giveUpTimer);
  giveUpTimer = setTimeout(() => {
    if (state !== "loading") return;
    worker?.terminate();
    worker = undefined;
    retryOrGiveUp(`no answer after ${GIVE_UP_AFTER / 1000} seconds`);
  }, GIVE_UP_AFTER);

  if (worker === undefined) {
    try {
      worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
      worker.addEventListener("message", (event: MessageEvent<FromWorker>) => hear(event.data));
      // The thread's own code failed to load or crashed, so search on the page instead. Searches
      // it never answered are dropped: the search box asks again once the search is ready.
      worker.addEventListener("error", (event) => {
        event.preventDefault();
        ask = undefined;
        waiting.clear();
        if (state !== "loading") setState("loading");
        searchOnThePage();
      });
    } catch {
      searchOnThePage();
      return;
    }
  }

  worker.postMessage({ type: "load", indexUrl } satisfies ToWorker);
}

function hear(message: FromWorker) {
  if (message.type === "ready") {
    clearTimeout(giveUpTimer);
    ask = (query) =>
      new Promise((resolve) => {
        const id = nextId++;
        waiting.set(id, resolve);
        worker!.postMessage({ type: "search", id, query } satisfies ToWorker);
      });
    setState("ready");
  } else if (message.type === "failed") {
    retryOrGiveUp(message.reason);
  } else {
    waiting.get(message.id)?.(message.response);
    waiting.delete(message.id);
  }
}

// Without a background thread, the engine runs on the page. It's the same engine and the same
// index, so the answers are the same. Typing may stutter on a slow phone.
async function searchOnThePage() {
  worker?.terminate();
  worker = undefined;
  try {
    const { loadEngine } = await import("./loadEngine.ts");
    const { engine } = await loadEngine(indexUrl);
    clearTimeout(giveUpTimer);
    ask = (query) => Promise.resolve(engine.search(query));
    setState("ready");
  } catch (error) {
    retryOrGiveUp(String(error));
  }
}

function retryOrGiveUp(reason: string) {
  clearTimeout(giveUpTimer);
  if (attempt < RETRY_DELAYS.length) {
    console.warn(`RowdySearch: the search couldn't load, trying again (${attempt + 1} of ${RETRY_DELAYS.length}).`, reason);
    setTimeout(load, RETRY_DELAYS[attempt++]);
    return;
  }
  console.error("RowdySearch: the search couldn't load.", reason);
  setState("failed");
}
