import type { GradeData } from "../hooks/useGradeData.ts";
import type { Page, Subject } from "../page.ts";
import { findCourse, gradesOf, teachersOf } from "./courses.ts";
import type { GradeCounts } from "./grades.ts";

// How many of a course's professors to compare when analytical mode opens on that course.
const PROFESSORS_TO_START_WITH = 3;

export function subjectLabel(subject: Subject): string {
  switch (subject.type) {
    case "professor":
      return `${subject.professorName} (all classes)`;
    case "course":
      return `${subject.courseCode} (every professor)`;
    case "class":
      return `${subject.professorName} · ${subject.courseCode}`;

    default:
      throw new Error(`Invalid subject: ${subject satisfies never}`);
  }
}

// The same text for the same subject, so it can be a React key or checked for duplicates.
export function subjectKey(subject: Subject): string {
  return JSON.stringify(subject);
}

// The professor a subject is about, or null when it's a whole course.
export function professorNameOf(subject: Subject): string | null {
  return subject.type === "course" ? null : subject.professorName;
}

export function gradesForSubject(subject: Subject, { professors, searchIndex }: GradeData): GradeCounts {
  switch (subject.type) {
    case "professor":
      return gradesOf(professors[subject.professorName].classes);
    case "course": {
      const teachers = teachersOf(subject.courseCode, professors, searchIndex);
      return gradesOf(teachers.flatMap((teacher) => teacher.course.offerings));
    }
    case "class":
      return gradesOf(findCourse(professors[subject.professorName], subject.courseCode)?.offerings ?? []);

    default:
      throw new Error(`Invalid subject: ${subject satisfies never}`);
  }
}

// What analytical mode compares first, based on the page it was opened from.
//   class page     -> that class, the whole course, and the professor's other classes
//   professor page -> that professor
//   course page    -> the whole course and the professors who taught it most recently
export function subjectsToStartWith(page: Page, { professors, searchIndex }: GradeData): Subject[] {
  switch (page.type) {
    case "search":
      return [];
    case "professor":
      return [page];
    case "class":
      return [
        page,
        { type: "course", courseCode: page.courseCode },
        { type: "professor", professorName: page.professorName },
      ];
    case "course": {
      const teachers = teachersOf(page.courseCode, professors, searchIndex).slice(0, PROFESSORS_TO_START_WITH);
      const classes = teachers.map((teacher): Subject => (
        { type: "class", professorName: teacher.professor.name, courseCode: page.courseCode }
      ));
      return [page, ...classes];
    }

    default:
      throw new Error(`Invalid page: ${page satisfies never}`);
  }
}
