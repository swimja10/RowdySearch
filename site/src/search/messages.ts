import type { SearchResponse } from "./engine.ts";

// What the page and the search's background thread say to each other.

export type ToWorker =
  | { type: "load"; indexUrl: string } // fetch the slim index and get ready
  | { type: "search"; id: number; query: string };

export type FromWorker =
  | { type: "ready"; milliseconds: number } // how long getting ready took, after the download
  | { type: "failed"; reason: string } // the index couldn't be loaded or read
  | { type: "results"; id: number; response: SearchResponse };
