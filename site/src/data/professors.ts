import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { readProfessors, semesterRank, type Professor, type RawData } from "./shared.ts";

// The build runs from site/, so the data file is one folder up. It's the same file the extension reads.
const DATA_FILE = path.resolve(process.cwd(), "../data/professors.json");

// What the home page and the data page say about the whole data set.
export type Totals = {
  professors: number;
  courses: number;
  sections: number;
  gradedSections: number;
  gradesCounted: number; // every letter grade and withdrawal in every section
  gradedSemesters: string[]; // oldest first
  newestSemester: string; // the newest one with anything at all (a syllabus or an evaluation)
};

// How many sections one professor has taught of one course. The extension adds a semester's
// sections together, so this count is read from the file itself.
export type SectionCount = {
  sections: number;
  graded: number; // the ones with grades released
};

type SiteData = {
  raw: RawData; // the file as it is, for the pieces of it Analytical Mode downloads
  professors: Record<string, Professor>;
  totals: Totals;
  sectionCounts: Map<string, SectionCount>; // by classKey()
};

let loaded: SiteData | undefined;

// Reads data/professors.json once per build, however many pages ask for it.
export function loadData(): SiteData {
  if (loaded === undefined) {
    const raw: RawData = JSON.parse(readFileSync(DATA_FILE, "utf8"));
    loaded = { raw, professors: readProfessors(raw), ...countSections(raw) };
  }
  return loaded;
}

// The day the data was built, as "2026-11-17": when data/professors.json was last written. The
// sitemap dates every page made from the data with it.
export function dataDate(): string {
  return statSync(DATA_FILE).mtime.toISOString().slice(0, 10);
}

// One professor's course, as a key: "Sean Beatty|MAT 1213".
export function classKey(professorName: string, courseCode: string): string {
  return `${professorName}|${courseCode}`;
}

function countSections(raw: RawData): Pick<SiteData, "totals" | "sectionCounts"> {
  const sectionCounts = new Map<string, SectionCount>();
  const courses = new Set<string>();
  const gradedSemesters = new Set<string>();
  const allSemesters = new Set<string>();
  let sections = 0;
  let gradedSections = 0;
  let gradesCounted = 0;

  for (const [name, professor] of Object.entries(raw)) {
    for (const [code, course] of Object.entries(professor.courses)) {
      courses.add(code);
      const count: SectionCount = { sections: 0, graded: 0 };
      sectionCounts.set(classKey(name, code), count);

      for (const [semester, semesterSections] of Object.entries(course.semesters)) {
        allSemesters.add(semester);
        for (const section of semesterSections) {
          sections++;
          count.sections++;
          const grades = Object.values(section.grades ?? {});
          if (grades.length === 0) continue;
          gradedSections++;
          count.graded++;
          gradedSemesters.add(semester);
          for (const students of grades) gradesCounted += students ?? 0;
        }
      }
    }
  }

  const oldestFirst = (semesters: Set<string>) =>
    [...semesters].sort((first, second) => semesterRank(first) - semesterRank(second));

  return {
    sectionCounts,
    totals: {
      professors: Object.keys(raw).length,
      courses: courses.size,
      sections,
      gradedSections,
      gradesCounted,
      gradedSemesters: oldestFirst(gradedSemesters),
      newestSemester: oldestFirst(allSemesters).at(-1)!,
    },
  };
}
