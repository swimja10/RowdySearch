// Checks that the website's search gives the same answers as the extension's.
//
//   cd site && npm run test:search
//
// The site searches a slim copy of the data (site/src/search/slimIndex.ts) with the extension's own
// engine. This runs about 2,000 searches both ways, on the full data and on the slim copy after a
// trip through JSON, and fails if any search opens a different page or lists different results.
// The searches are made from the real data: names, course codes, titles, pieces of them, and typos.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildSlimIndex, expandSlimIndex, semesterOf, type SlimIndex } from "../site/src/search/slimIndex.ts";
import { buildSearchIndex, search } from "../src/searcher.ts";
import { readProfessors } from "../src/utils/gradeData.ts";
import { pageForSearch, withPageFirst } from "../src/utils/pageForSearch.ts";
import { semesterRank } from "../src/utils/semesters.ts";

const professors = readProfessors(JSON.parse(readFileSync(new URL("../data/professors.json", import.meta.url), "utf8")));
const fullIndex = buildSearchIndex(professors);

// What the browser gets: the slim index as JSON text, read back.
const slimText = JSON.stringify(buildSlimIndex(professors, (name) => name.toLowerCase().replaceAll(" ", "-")));
const slim = expandSlimIndex(JSON.parse(slimText) as SlimIndex);
const slimIndex = buildSearchIndex(slim.professors);

// Every search's answer, as plain data that's easy to compare: where Enter goes, how many matched,
// and the first 20 results in order with their scores.
function answer(query: string, index: typeof fullIndex, from: typeof professors) {
  const matches = search(index, query);
  const page = pageForSearch(query, matches, from);
  return { page, total: matches.length, best: withPageFirst(matches, page).slice(0, 20) };
}

const everyNth = <Item>(items: Item[], step: number) => items.filter((_, number) => number % step === 0);
const withoutLetter = (word: string) => word.slice(0, 2) + word.slice(3); // a typo: "beatty" -> "betty"

function searchesToTry(): string[] {
  const queries = new Set<string>();

  for (const professor of everyNth(Object.values(professors), 9)) {
    const words = professor.name.split(" ");
    const last = words.at(-1)!;
    const course = professor.courses[0];
    queries.add(professor.name);
    queries.add(last);
    queries.add(last.slice(0, 4));
    queries.add(`${last} ${course.code}`);
    queries.add(`${course.code.replace(" ", "")} ${last}`);
    queries.add(`${last} ${course.title.split(" ")[0]}`);
    if (last.length >= 5) queries.add(`${words[0]} ${withoutLetter(last)}`);
  }

  const courses = new Map(Object.values(professors).flatMap((professor) => professor.courses.map((course) => [course.code, course])));
  for (const course of everyNth([...courses.values()], 7)) {
    const titleWords = course.title.split(" ");
    queries.add(course.code);
    queries.add(course.code.replace(" ", "").toLowerCase());
    queries.add(course.title);
    queries.add(titleWords.slice(0, 2).join(" "));
    queries.add(titleWords[0].slice(0, 4));
    queries.add(course.code.split(" ")[0]);
    if (titleWords[0].length >= 6) queries.add(`${withoutLetter(titleWords[0])} ${titleWords.slice(1).join(" ")}`);
  }

  // What students type, from the extension's own search test and its README.
  for (const typed of [
    "Calculus 1", "calc 2", "precalc", "pre calc", "linear alg", "gen chem 1", "organic chem", "programming 1",
    "MAT1213", "math 1214", "cs2123", "HUM 4433", "linear algebra", "data structures", "discrete math",
    "intro to programming", "american politics", "physics 1", "economics", "databases", "ecology", "statics",
    "machine learning", "us history", "diff eq", "ai", "orgo", "calclus 1", "linaer algebra", "Darrn Meritz",
    "beaty", "Beatty Sean", "Shaun Beatty", "gomez morales", "Beatty calculus 1", "almaawi cs1083",
    "Vaello accounting 2", "Temple phenomenology", "marketing", "web development", "arabic 1", "trigonometry",
    "a", "ma", "cs", "the", "1", "  ", "xyzzyq", "smith", "freshman composition", "Darrn Meritz WRC",
  ]) queries.add(typed);

  return [...queries];
}

const queries = searchesToTry();

test(`the site's search matches the extension's on ${queries.length.toLocaleString()} searches`, () => {
  const different: string[] = [];
  for (const query of queries) {
    const full = answer(query, fullIndex, professors);
    const fromSlim = answer(query, slimIndex, slim.professors);
    try {
      assert.deepEqual(fromSlim, full);
    } catch {
      different.push(query);
    }
  }
  assert.deepEqual(different, [], `${different.length} searches gave different answers on the slim index`);
});

test("the slim index keeps every professor and course, in the same order", () => {
  assert.deepEqual(Object.keys(slim.professors), Object.keys(professors));
  for (const professor of Object.values(professors)) {
    const slimCourses = slim.professors[professor.name].courses;
    assert.deepEqual(slimCourses.map((course) => [course.code, course.title]), professor.courses.map((course) => [course.code, course.title]));
  }
});

test("a semester survives being stored as a number", () => {
  for (const semester of ["Spring 2023", "Summer 2024", "Fall 2026"]) assert.equal(semesterOf(semesterRank(semester)), semester);
});

test("the slim index is a small fraction of the full data", () => {
  const fullSize = readFileSync(new URL("../data/professors.json", import.meta.url)).length;
  assert.ok(slimText.length < fullSize / 8, `the slim index is ${slimText.length} bytes, the full data ${fullSize}`);
});
