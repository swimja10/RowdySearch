// Checks that Analytical Mode on the website shows the same numbers as in the extension.
//
//   cd site && npm run build && npm run test:compare
//
// The extension gives Analytical Mode every professor's full record. The site gives it the search's
// slim index and fills in real records from the data files it downloads (site/src/compare/store.ts).
// This runs the site's store against the built files, and for hundreds of professors, courses, and
// classes compares everything Analytical Mode would draw with what the extension would draw.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { compareUrl, decodeItems, encodeItems } from "../../site/src/compare/address.ts";
import { gradeSpread } from "../../site/src/compare/spread.ts";
import { createStore } from "../../site/src/compare/store.ts";
import type { ComparedItem } from "../../src/page.ts";
import { buildSearchIndex } from "../../src/searcher.ts";
import { gradesOf } from "../../src/utils/courses.ts";
import { readProfessors, type RawData } from "../../src/utils/gradeData.ts";
import { LETTER_GRADES, emptyGradeCounts, medianGrade } from "../../src/utils/grades.ts";
import { describeSeries, SERIES_COLORS } from "../../src/utils/series.ts";
import { gradePosition } from "../../src/utils/statistics.ts";
import { itemsToStartWith } from "../../src/utils/comparedItems.ts";

const builtSite = new URL("../../site/dist/", import.meta.url);
const raw: RawData = JSON.parse(
  readFileSync(new URL("../../data/professors.json", import.meta.url), "utf8"),
);
const professors = readProfessors(raw);
const gradeData = { professors, searchIndex: buildSearchIndex(professors) };

const everyNth = <Item>(items: Item[], step: number) =>
  items.filter((_, number) => number % step === 0);
const classes = Object.values(professors).flatMap((professor) =>
  professor.courses.map((course) => ({ professor, course })),
);

test("the box plot's median is the median everywhere else, and its five grades are in order", () => {
  for (const { course } of classes) {
    const grades = gradesOf(course.offerings);
    const spread = gradeSpread(grades);
    assert.equal(spread?.median ?? null, medianGrade(grades));
    if (spread === null) continue;
    const places = [
      spread.lowest,
      spread.lowerQuarter,
      spread.median,
      spread.upperQuarter,
      spread.highest,
    ].map(gradePosition);
    assert.deepEqual(
      places,
      [...places].sort((first, second) => first - second),
      `${course.code}: ${JSON.stringify(spread)}`,
    );
  }
});

test("the box plot's quarters are right for grades worked out by hand", () => {
  // Four students with A, B, C, D: from the top, the 1st is the upper quarter, the 2nd the median, the 3rd the lower quarter.
  const four = { ...emptyGradeCounts(), A: 1, B: 1, C: 1, D: 1, W: 5 };
  assert.deepEqual(gradeSpread(four), {
    lowest: "D",
    lowerQuarter: "C",
    median: "B",
    upperQuarter: "A",
    highest: "A",
  });
  // Everyone got the same grade.
  assert.deepEqual(gradeSpread({ ...emptyGradeCounts(), "B+": 30 }), {
    lowest: "B+",
    lowerQuarter: "B+",
    median: "B+",
    upperQuarter: "B+",
    highest: "B+",
  });
  // Only withdrawals: nothing to draw.
  assert.equal(gradeSpread({ ...emptyGradeCounts(), W: 12 }), null);
  assert.equal(LETTER_GRADES.length, 13);
});

test("a comparison survives being written into an address and read back", () => {
  const slugOf = (name: string) => name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
  const names = new Map(Object.keys(professors).map((name) => [slugOf(name), name]));
  const items: ComparedItem[] = [
    { type: "course", courseCode: "CS 2123" },
    { type: "class", professorName: "John Heaps", courseCode: "CS 2123" },
    { type: "professor", professorName: "Sean Beatty" },
  ];
  const text = encodeItems(items, slugOf);
  assert.equal(text, "c.cs-2123,k.john-heaps.cs-2123,p.sean-beatty");
  assert.deepEqual(
    decodeItems(
      text,
      (slug) => names.get(slug),
      () => true,
    ),
    items,
  );
  assert.equal(compareUrl([], slugOf), "/compare/");

  // A link with things that aren't real opens with whatever in it is.
  const mixed = "p.nobody-at-all,c.cs-2123,k.sean-beatty,x.what,,p.sean-beatty";
  const real = (item: ComparedItem) => item.type !== "course" || item.courseCode === "CS 2123";
  assert.deepEqual(
    decodeItems(mixed, (slug) => names.get(slug), real),
    [items[0], items[2]],
  );
});

const isBuilt = existsSync(new URL("compare-data/", builtSite));

test(
  "the built data files hold every course exactly once, unchanged",
  { skip: !isBuilt && "build the site first" },
  () => {
    const seen = new Set<string>();
    for (const file of readdirSync(new URL("compare-data/", builtSite))) {
      const data: RawData = JSON.parse(
        readFileSync(new URL(`compare-data/${file}`, builtSite), "utf8"),
      );
      for (const [name, professor] of Object.entries(data)) {
        assert.deepEqual(professor.rmp, raw[name].rmp, `${name}'s ratings in ${file}`);
        assert.equal(professor.department, raw[name].department, `${name}'s department in ${file}`);
        for (const [code, course] of Object.entries(professor.courses)) {
          assert.ok(!seen.has(`${name}|${code}`), `${name}'s ${code} is in two files`);
          seen.add(`${name}|${code}`);
          assert.deepEqual(course, raw[name].courses[code], `${name}'s ${code} in ${file}`);
        }
      }
    }
    const all = Object.entries(raw).flatMap(([name, professor]) =>
      Object.keys(professor.courses).map((code) => `${name}|${code}`),
    );
    assert.equal(seen.size, all.length);
  },
);

test(
  "Analytical Mode draws the same numbers on the site as in the extension",
  { skip: !isBuilt && "build the site first" },
  async () => {
    // The site's store downloads files. Here "downloading" reads them from the built site.
    const read = (address: string) =>
      JSON.parse(readFileSync(new URL(address.replace(/^\//, ""), builtSite), "utf8"));
    globalThis.fetch = (async (address: string) => ({
      ok: true,
      status: 200,
      json: async () => read(address),
    })) as unknown as typeof fetch;

    const indexFile = readdirSync(builtSite).find((file) => file.startsWith("search-index."))!;
    const fileOfSubject: Record<string, string> = {};
    for (const file of readdirSync(new URL("compare-data/", builtSite))) {
      for (const professor of Object.values(read(`/compare-data/${file}`) as RawData)) {
        for (const code of Object.keys(professor.courses))
          fileOfSubject[code.split(" ")[0]] = `/compare-data/${file}`;
      }
    }
    const store = await createStore(`/${indexFile}`, fileOfSubject);
    const siteData = { professors: store.professors, searchIndex: store.searchIndex };

    // Professors, whole courses, and single classes from all over the data, plus what each kind of
    // page opens Analytical Mode with.
    const items: ComparedItem[] = [
      ...everyNth(Object.keys(professors), 12).map((professorName): ComparedItem => ({
        type: "professor",
        professorName,
      })),
      ...everyNth([...new Set(classes.map(({ course }) => course.code))], 20).map(
        (courseCode): ComparedItem => ({ type: "course", courseCode }),
      ),
      ...everyNth(classes, 45).map(({ professor, course }): ComparedItem => ({
        type: "class",
        professorName: professor.name,
        courseCode: course.code,
      })),
      ...itemsToStartWith({ type: "course", courseCode: "CS 2123" }, gradeData),
      ...itemsToStartWith(
        { type: "class", professorName: "Sean Beatty", courseCode: "MAT 1213" },
        gradeData,
      ),
    ];

    for (const item of items) {
      assert.ok(store.exists(item), `the site doesn't know ${JSON.stringify(item)}`);
      await store.load(item);
      assert.ok(store.isLoaded(item));
      const series = { item, color: SERIES_COLORS[0] };
      assert.deepEqual(
        describeSeries(series, siteData),
        describeSeries(series, gradeData),
        JSON.stringify(item),
      );
    }

    // The reviews Analytical Mode lists come from the professor's record too.
    for (const item of items) {
      if (item.type === "course") continue;
      assert.deepEqual(
        store.professors[item.professorName].rmp,
        professors[item.professorName].rmp,
        item.professorName,
      );
    }
    assert.ok(items.length > 600, `only ${items.length} items were checked`);
  },
);
