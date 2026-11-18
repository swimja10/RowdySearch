import { buildSearchIndex, search } from "../../../src/searcher.ts";
import { findCourse } from "../../../src/utils/courses.ts";
import { pageForSearch, withPageFirst } from "../../../src/utils/pageForSearch.ts";
import { expandSlimIndex, type SlimIndex } from "./slimIndex.ts";
import { classPath, coursePath, professorPath } from "./urls.ts";

// The site's search: the extension's search engine (src/searcher.ts) and its rule for where Enter
// goes (src/utils/pageForSearch.ts), run on the slim index. It runs in a background thread
// (worker.ts), or on the page itself where a browser can't start one.

// How many results are drawn. The rest are counted, not shown.
export const MAX_RESULTS = 20;
// Searches kept ready to answer again without searching, for when you backspace.
const REMEMBERED_SEARCHES = 60;

// One professor's class in the results.
export type SearchResult = {
  professor: string;
  code: string;
  title: string;
  lastTaught: string; // "Fall 2026"
  url: string;
};

// Where pressing Enter goes.
export type SearchTarget = {
  kind: "professor" | "class" | "course";
  label: string; // "Sean Beatty", or "MAT 1213 · Calculus I"
  detail: string; // "Professor · 6 classes"
  url: string;
};

export type SearchResponse = {
  query: string;
  target: SearchTarget | null; // null when nothing matched
  results: SearchResult[]; // the best ones, at most MAX_RESULTS
  total: number; // how many matched in all
  milliseconds: number; // how long the search took
};

export type Engine = {
  search: (query: string) => SearchResponse;
};

export function createEngine(slim: SlimIndex): Engine {
  const { professors, slugs } = expandSlimIndex(slim);
  const index = buildSearchIndex(professors);
  const remembered = new Map<string, SearchResponse>();

  // For a course's line in the results: how many professors have taught it, and what they call it.
  const titlesPerCourse = new Map<string, string[]>();
  for (const professor of Object.values(professors)) {
    for (const course of professor.courses) {
      if (!titlesPerCourse.has(course.code)) titlesPerCourse.set(course.code, []);
      titlesPerCourse.get(course.code)!.push(course.title);
    }
  }

  // "MAT 1213 · Calculus I" when most of its professors call it that. A topics course, where each
  // professor has their own title, is only its code.
  function courseLabel(code: string): string {
    const titles = titlesPerCourse.get(code) ?? [];
    const uses = new Map<string, number>();
    for (const title of titles) uses.set(title, (uses.get(title) ?? 0) + 1);
    const [mostUsed, times] = [...uses].sort(([, first], [, second]) => second - first)[0] ?? ["", 0];
    return times * 2 > titles.length ? `${code} · ${mostUsed}` : code;
  }

  // "1 class", "6 classes"
  const count = (number: number, one: string, many = `${one}s`) => `${number.toLocaleString("en-US")} ${number === 1 ? one : many}`;

  function targetFor(page: NonNullable<ReturnType<typeof pageForSearch>>): SearchTarget {
    if (page.type === "professor") {
      const professor = professors[page.professorName];
      return {
        kind: "professor",
        label: professor.name,
        detail: `Professor · ${count(professor.courses.length, "class", "classes")}`,
        url: professorPath(slugs.get(professor.name)!),
      };
    }
    if (page.type === "class") {
      const course = findCourse(professors[page.professorName], page.courseCode)!;
      return {
        kind: "class",
        label: `${course.code} · ${course.title}`,
        detail: `with ${page.professorName}`,
        url: classPath(slugs.get(page.professorName)!, course.code),
      };
    }
    return {
      kind: "course",
      label: courseLabel(page.courseCode),
      detail: `Course · ${count(titlesPerCourse.get(page.courseCode)?.length ?? 0, "professor")}`,
      url: coursePath(page.courseCode),
    };
  }

  function run(query: string): SearchResponse {
    const started = performance.now();
    const matches = search(index, query);
    const page = pageForSearch(query, matches, professors);
    const best = withPageFirst(matches, page).slice(0, MAX_RESULTS);

    return {
      query,
      target: page === null ? null : targetFor(page),
      results: best.map((match) => {
        const course = findCourse(professors[match.professor], match.course)!;
        return {
          professor: match.professor,
          code: course.code,
          title: course.title,
          lastTaught: course.offerings[0].semester,
          url: classPath(slugs.get(match.professor)!, course.code),
        };
      }),
      total: matches.length,
      milliseconds: performance.now() - started,
    };
  }

  return {
    search(query) {
      const known = remembered.get(query);
      if (known !== undefined) return known;

      const response = run(query);
      remembered.set(query, response);
      if (remembered.size > REMEMBERED_SEARCHES) remembered.delete(remembered.keys().next().value!);
      return response;
    },
  };
}
