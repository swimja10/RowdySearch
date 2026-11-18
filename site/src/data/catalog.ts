import { buildSearchIndex, type SearchIndex } from "../../../src/searcher.ts";
import { subjectOf } from "./addresses.ts";
import { classKey, loadData, type SectionCount } from "./professors.ts";
import {
  FINISHED_OR_WITHDREW,
  A_GRADES,
  D_AND_F_GRADES,
  WITHDREW,
  averageGpa,
  countStudents,
  courseName,
  gradesOf,
  medianGrade,
  percentWhoGot,
  semesterRank,
  teachersOf,
  type GradeCounts,
  type LetterGrade,
  type Professor,
  type Teacher,
} from "./shared.ts";

// A course, with everyone who has taught it.
export type CourseEntry = {
  code: string;
  subject: string;
  name: string | null; // null for a topics course, where every professor teaches their own topic
  teachers: Teacher[]; // whoever taught it most recently first, in the same order as the extension
  grades: GradeCounts; // everyone's grades added up
  median: LetterGrade | null;
  sections: SectionCount; // every professor's sections added up
  lastTaught: string; // "Fall 2026"
};

// A subject like MAT, with its courses and everyone who has taught one of them.
export type SubjectEntry = {
  subject: string;
  courses: CourseEntry[]; // by course number
  professors: Professor[]; // by last name
};

type Catalog = {
  searchIndex: SearchIndex; // the extension's search index, over every professor
  courses: Map<string, CourseEntry>; // by course code
  subjects: Map<string, SubjectEntry>; // by subject, in alphabetical order
};

let built: Catalog | undefined;

// Works out every course and subject once per build.
export function loadCatalog(): Catalog {
  if (built !== undefined) return built;

  const { professors, sectionCounts } = loadData();
  const searchIndex = buildSearchIndex(professors);

  const codes = new Set<string>();
  for (const professor of Object.values(professors)) {
    for (const course of professor.courses) codes.add(course.code);
  }

  const courses = new Map<string, CourseEntry>();
  for (const code of [...codes].sort()) {
    const teachers = teachersOf(code, professors, searchIndex);
    const grades = gradesOf(teachers.flatMap((teacher) => teacher.course.offerings));
    const sections: SectionCount = { sections: 0, graded: 0 };
    for (const teacher of teachers) {
      const count = sectionCounts.get(classKey(teacher.professor.name, code))!;
      sections.sections += count.sections;
      sections.graded += count.graded;
    }

    courses.set(code, {
      code,
      subject: subjectOf(code),
      name: courseName(teachers),
      teachers,
      grades,
      median: medianGrade(grades),
      sections,
      lastTaught: teachers[0].course.offerings[0].semester,
    });
  }

  const subjects = new Map<string, SubjectEntry>();
  for (const course of courses.values()) {
    if (!subjects.has(course.subject)) subjects.set(course.subject, { subject: course.subject, courses: [], professors: [] });
    const subject = subjects.get(course.subject)!;
    subject.courses.push(course);
    for (const teacher of course.teachers) {
      if (!subject.professors.includes(teacher.professor)) subject.professors.push(teacher.professor);
    }
  }
  for (const subject of subjects.values()) subject.professors.sort(byLastName);

  built = { searchIndex, courses, subjects };
  return built;
}

// "Sean Beatty" sorts under B.
export function lastNameOf(professorName: string): string {
  return professorName.split(" ").at(-1)!;
}

export function byLastName(first: Professor, second: Professor): number {
  return lastNameOf(first.name).localeCompare(lastNameOf(second.name)) || first.name.localeCompare(second.name);
}

// The numbers shown under the headline ones, each out of everyone who got a letter grade or withdrew.
export type Rates = {
  grades: number; // how many grades they're out of
  gpa: number | null;
  aPercent: number | null;
  dAndFPercent: number | null;
  withdrewPercent: number | null;
};

export function ratesOf(grades: GradeCounts): Rates {
  return {
    grades: countStudents(grades, FINISHED_OR_WITHDREW),
    gpa: averageGpa(grades),
    aPercent: percentWhoGot(grades, A_GRADES),
    dAndFPercent: percentWhoGot(grades, D_AND_F_GRADES),
    withdrewPercent: percentWhoGot(grades, WITHDREW),
  };
}

// Newest semester first, the way every list of semesters is shown.
export function newestFirst(semesters: string[]): string[] {
  return [...semesters].sort((first, second) => semesterRank(second) - semesterRank(first));
}
