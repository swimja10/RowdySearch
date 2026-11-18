import { gradesOf } from "../../../src/utils/courses.ts";
import type { Course, Professor } from "../../../src/utils/gradeData.ts";
import { countStudents, emptyGradeCounts } from "../../../src/utils/grades.ts";
import { semesterRank } from "../../../src/utils/semesters.ts";
import { defaultSlug } from "./urls.ts";

// The search-only copy of the data. The extension loads all of data/professors.json (11 MB) to
// search it. The site's search loads this instead: only what the search engine reads, which is
// about a hundredth of the size. The engine itself is the extension's, unchanged.
//
// It keeps the professors, their courses, and each course's titles in exactly the order the full
// data has them. The engine breaks ties by that order, so keeping it is what makes a search here
// give the same results, in the same order, as the same search in the extension.

export const SLIM_INDEX_VERSION = 1;

// One course a professor has taught. Arrays instead of named fields keep the file small.
export type SlimCourse = [
  code: string, // "MAT 1213"
  lastTaught: number, // the newest semester's rank: 20263 is Fall 2026
  students: number, // everyone who has taken it with them, for choosing between courses
  titles: string[], // every title its sections have had, in the order the full data has them
  title?: string, // the course's name, when it isn't the first of `titles`
];

export type SlimProfessor = [
  name: string,
  courses: SlimCourse[],
  slug?: string, // their address, when it isn't the one their name makes by itself
];

export type SlimIndex = {
  version: number;
  professors: SlimProfessor[];
};

export function buildSlimIndex(professors: Record<string, Professor>, slugOf: (professorName: string) => string): SlimIndex {
  return {
    version: SLIM_INDEX_VERSION,
    professors: Object.values(professors).map((professor) => {
      const slim: SlimProfessor = [professor.name, professor.courses.map(slimCourse)];
      const slug = slugOf(professor.name);
      if (slug !== defaultSlug(professor.name)) slim.push(slug);
      return slim;
    }),
  };
}

function slimCourse(course: Course): SlimCourse {
  const titles = [...new Set(course.offerings.flatMap((offering) => offering.titles))];
  const slim: SlimCourse = [
    course.code,
    semesterRank(course.offerings[0].semester),
    countStudents(gradesOf(course.offerings)),
    titles,
  ];
  if (titles[0] !== course.title) slim.push(course.title);
  return slim;
}

export type ExpandedIndex = {
  professors: Record<string, Professor>; // in the shape the engine reads, with only what it reads
  slugs: Map<string, string>; // professor's name -> their address
};

// Turns the slim index back into professors the extension's search engine can read. Each course
// gets one stand-in semester holding its last semester, all of its titles, and its student count,
// which is everything the engine looks at.
export function expandSlimIndex(slim: SlimIndex): ExpandedIndex {
  if (slim?.version !== SLIM_INDEX_VERSION || !Array.isArray(slim.professors)) {
    throw new Error("The search index isn't in the shape this version of the site expects.");
  }

  const professors: Record<string, Professor> = {};
  const slugs = new Map<string, string>();
  for (const [name, courses, slug] of slim.professors) {
    slugs.set(name, slug ?? defaultSlug(name));
    professors[name] = {
      name,
      department: null,
      rmp: { rating: null, difficulty: null, wouldTakeAgainPercent: null, profiles: [], reviews: [] },
      courses: courses.map(([code, lastTaught, students, titles, title]) => ({
        code,
        title: title ?? titles[0],
        offerings: [
          {
            semester: semesterOf(lastTaught),
            titles,
            syllabi: [],
            evaluations: [],
            grades: { ...emptyGradeCounts(), A: students },
          },
        ],
      })),
    };
  }
  return { professors, slugs };
}

const SEASONS = ["", "Spring", "Summer", "Fall"];

// 20263 -> "Fall 2026", the opposite of semesterRank().
export function semesterOf(rank: number): string {
  return `${SEASONS[rank % 10]} ${Math.floor(rank / 10)}`;
}
