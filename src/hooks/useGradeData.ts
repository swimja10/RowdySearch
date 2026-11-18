import { useEffect, useState } from "react";
import { buildSearchIndex, type SearchIndex } from "../searcher.ts";
import { readProfessors, type Professor } from "../utils/gradeData.ts";

// The sidebar page is dist/index.html, so this points at data/ in the project folder.
// Reading it from there means the 10 MB file isn't copied into dist/ as well.
const PROFESSORS_URL = "../data/professors.json";

// A failed load tries again by itself twice, after 1 and then 3 seconds, before asking you.
const RETRY_DELAYS = [1000, 3000];
// It normally takes about a second. One that hangs this long is given up on and tried again.
const GIVE_UP_AFTER = 20_000;
// After this long, the loading screen offers to start over.
const SLOW_AFTER = 8_000;

export type GradeData = {
  professors: Record<string, Professor>;
  searchIndex: SearchIndex;
};

export type GradeDataState =
  | { status: "loading"; isSlow: boolean }
  | { status: "failed"; triedByHand: boolean } // triedByHand: Try again was clicked and it failed again
  | { status: "ready"; gradeData: GradeData };

// Loads data/professors.json, trying again by itself when that fails.
// `retry` starts over, for the Try again buttons.
export function useGradeData() {
  const [state, setState] = useState<GradeDataState>({ status: "loading", isSlow: false });
  const [timesRetried, setTimesRetried] = useState(0);

  useEffect(() => {
    const stop = new AbortController();
    const slowTimer = setTimeout(() => setState({ status: "loading", isSlow: true }), SLOW_AFTER);

    loadWithRetries(stop.signal)
      .then((gradeData) => setState({ status: "ready", gradeData }))
      .catch((error) => {
        if (stop.signal.aborted) return;
        console.error("RowdySearch: couldn't load the professors.", error);
        setState({ status: "failed", triedByHand: timesRetried > 0 });
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      stop.abort();
      clearTimeout(slowTimer);
    };
  }, [timesRetried]);

  function retry() {
    setState({ status: "loading", isSlow: false });
    setTimesRetried((count) => count + 1);
  }

  return { state, retry };
}

async function loadWithRetries(signal: AbortSignal): Promise<GradeData> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await loadGradeData(signal);
    } catch (error) {
      if (signal.aborted || attempt === RETRY_DELAYS.length) throw error;
      console.warn(`RowdySearch: loading the professors failed, trying again (${attempt + 1} of ${RETRY_DELAYS.length}).`, error);
      await wait(RETRY_DELAYS[attempt], signal);
    }
  }
}

async function loadGradeData(signal: AbortSignal): Promise<GradeData> {
  const response = await fetch(PROFESSORS_URL, { signal: AbortSignal.any([signal, AbortSignal.timeout(GIVE_UP_AFTER)]) });
  if (!response.ok) throw new Error(`${PROFESSORS_URL} answered ${response.status}`);

  const professors = readProfessors(await response.json());
  if (Object.keys(professors).length === 0) throw new Error(`${PROFESSORS_URL} has no professors in it`);
  return { professors, searchIndex: buildSearchIndex(professors) };
}

function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    }, { once: true });
  });
}
