// Checks that searches students actually type open the right page when they press Enter, using
// the real data in data/professors.json. Run it with: npm run test:search
// New data can change the right answer (UTSA renumbers courses), so update a case when that happens.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { buildSearchIndex, search } from "../src/searcher.ts";
import { findCourse } from "../src/utils/courses.ts";
import { readProfessors } from "../src/utils/gradeData.ts";
import { pageForSearch } from "../src/utils/pageForSearch.ts";

const professors = readProfessors(JSON.parse(readFileSync(new URL("../data/professors.json", import.meta.url), "utf8")));
const index = buildSearchIndex(professors);

// Where Enter goes: a course code, a professor's name, or "Name · CODE" for one professor's class.
function enterOpens(query: string): string {
  const page = pageForSearch(query, search(index, query), professors);
  if (page === null) return "nothing";
  if (page.type === "course") return page.courseCode;
  if (page.type === "professor") return page.professorName;
  return `${page.professorName} · ${page.courseCode}`;
}

// Each search, and every page that's a right answer for it.
const SEARCHES: Record<string, Record<string, string[]>> = {
  "numbers, written either way": {
    "Calculus 1": ["MAT 1213"], "calculus I": ["MAT 1213"], "Calculus": ["MAT 1213"], "calculus 2": ["MAT 1223"],
    "calculus ii": ["MAT 1223"], "calculus 3": ["MAT 2213"], "spanish 1": ["SPN 1014"], "spanish I": ["SPN 1014"],
    "spanish 2": ["SPN 1024"], "general chemistry 2": ["CHE 1113"], "accounting 1": ["ACC 2013"], "accounting 2": ["ACC 2033"],
    "piano 1": ["MUS 1521"], "class piano I": ["MUS 1521"], "korean 1": ["KOR 1014"], "composition 1": ["WRC 1013"],
  },
  "the start of words, and abbreviated titles": {
    "calc 1": ["MAT 1213"], "calc I": ["MAT 1213"], "calc 2": ["MAT 1223"], "calc iii": ["MAT 2213"], "precalc": ["MAT 1093"],
    "pre calc": ["MAT 1093"], "linear alg": ["MAT 2233"], "gen chem 1": ["CHE 1103"], "organic chem": ["CHE 2603"],
    "intro macro": ["ECO 2013"], "chem 2": ["CHE 1113"], "bio chem": ["BIO 3513"], "programming 1": ["IS 2053", "CS 1083", "CS 1063"],
    "programming for computer scientists": ["CS 1083"], "introduction to computer programming": ["CS 1063"],
  },
  "course codes, written any way": {
    "MAT1213": ["MAT 1213"], "mat 1214": ["MAT 1214"], "math 1214": ["MAT 1214"], "MATH1214": ["MAT 1214"],
    "CS1083": ["CS 1083"], "cs 1083": ["CS 1083"], "cs2123": ["CS 2123"], "HUM 4433": ["HUM 4433"],
  },
  "course names": {
    "linear algebra": ["MAT 2233"], "data structures": ["CS 2123"], "discrete math": ["CS 2233", "MAT 3003"],
    "analysis of algorithms": ["CS 3343", "CS 5633"], "object oriented programming": ["CS 2113"],
    "computer programming in c": ["CS 2713"], "intro to programming": ["CS 1063", "CME 2403", "CPE 2073"],
    "intro to psychology": ["PSY 1013"], "american politics": ["POL 1013"], "texas politics": ["POL 1133"],
    "physics 1": ["PHY 1603", "PHY 1943"], "macroeconomics": ["ECO 2013"], "microeconomics": ["ECO 2023"],
    "economics": ["ECO 2013", "ECO 2023"], "principles of marketing": ["MKT 3013"], "business finance": ["FIN 3013"],
    "databases": ["CS 3743"], "ecology": ["BIO 3283", "ES 3033"], "statics": ["EGR 2103"], "dynamics": ["EGR 2513"],
    "public speaking": ["COM 2113"], "machine learning": ["CS 4253", "CS 6243"], "artificial intelligence": ["CS 3793"],
    "intro to literature": ["ENG 2013"], "biological anthropology": ["ANT 2033"],
  },
  "shorthand": {
    "us history": ["HIS 1043", "HIS 1053"], "diff eq": ["EGR 3423"], "ai": ["CS 3793"], "orgo": ["CHE 2603"],
  },
  "typos": {
    "calclus 1": ["MAT 1213"], "linaer algebra": ["MAT 2233"], "Darrn Meritz": ["Darren Meritz"], "beaty": ["Sean Beatty"],
  },
  "professors": {
    "Sean Beatty": ["Sean Beatty"], "Beatty Sean": ["Sean Beatty"], "beatty": ["Sean Beatty"], "beat": ["Sean Beatty"],
    "Shaun Beatty": ["Sean Beatty"], "gomez morales": ["Mauricio Alejandro Gomez Morales"],
    "mauricio gomez": ["Mauricio Alejandro Gomez Morales"], "almaa": ["Alyas Almaawi"], "Kevin Desai": ["Kevin Desai"],
  },
  "one professor's class": {
    "Beatty calculus 1": ["Sean Beatty · MAT 1213"], "Beatty MAT1214": ["Sean Beatty · MAT 1214"],
    "almaawi cs1083": ["Alyas Almaawi · CS 1083"], "CS1083 almaawi": ["Alyas Almaawi · CS 1083"],
    "Vaello accounting 2": ["Linda Vaello · ACC 2033"], "Temple phenomenology": ["Stephen Temple · ARC 3433"],
  },
  "names that look like course words": {
    "marketing": ["MKT 3013"], "web development": ["CS 4413"],
  },
  "nothing to find": {
    "arabic 1": ["nothing"], "trigonometry": ["nothing"],
  },
};

for (const [group, searches] of Object.entries(SEARCHES)) {
  for (const [query, rightAnswers] of Object.entries(searches)) {
    test(`${group}: "${query}"`, () => {
      const opened = enterOpens(query);
      assert.ok(rightAnswers.includes(opened), `"${query}" opened ${opened}, not ${rightAnswers.join(" or ")}`);
    });
  }
}

test('the results for "Calculus 1" are all Calculus I', () => {
  const titles = search(index, "Calculus 1").map((match) => findCourse(professors[match.professor], match.course)!.title);
  assert.ok(titles.length > 0);
  assert.deepEqual([...new Set(titles)], ["Calculus I"]);
});
