import type { Subject } from "../../../src/page.ts";
import { classPath, coursePath, courseSlug, professorPath } from "../search/urls.ts";

// What Analytical Mode is comparing lives in its address, so a comparison can be bookmarked or
// sent to a friend:
//
//   /compare/?s=c.cs-2123,k.john-heaps.cs-2123,p.john-heaps
//
// Each piece is one thing on the charts, in order: "p." a professor, "c." a whole course, and
// "k." one professor's class. The names are the same slugs the pages' own addresses use.

export const COMPARE_PATH = "/compare/";

// "mat-1213" -> "MAT 1213"
export function courseCodeOf(slug: string): string {
  return slug.toUpperCase().replace("-", " ");
}

export function encodeSubjects(subjects: Subject[], slugOf: (professorName: string) => string): string {
  return subjects
    .map((subject) => {
      if (subject.type === "professor") return `p.${slugOf(subject.professorName)}`;
      if (subject.type === "course") return `c.${courseSlug(subject.courseCode)}`;
      return `k.${slugOf(subject.professorName)}.${courseSlug(subject.courseCode)}`;
    })
    .join(",");
}

// Reads the "s" part of the address back. Anything it doesn't recognize is skipped, so an old or
// mistyped link still opens with whatever in it is real.
export function decodeSubjects(
  text: string,
  nameOfSlug: (slug: string) => string | undefined,
  exists: (subject: Subject) => boolean,
): Subject[] {
  const subjects: Subject[] = [];
  for (const piece of text.split(",")) {
    const [kind, first, second] = piece.split(".");
    let subject: Subject | null = null;

    if (kind === "c" && first) {
      subject = { type: "course", courseCode: courseCodeOf(first) };
    } else if ((kind === "p" || kind === "k") && first) {
      const professorName = nameOfSlug(first);
      if (professorName === undefined) continue;
      if (kind === "p") subject = { type: "professor", professorName };
      else if (second) subject = { type: "class", professorName, courseCode: courseCodeOf(second) };
    }

    if (subject !== null && exists(subject)) subjects.push(subject);
  }
  return subjects;
}

// The address of Analytical Mode comparing `subjects`.
export function compareUrl(subjects: Subject[], slugOf: (professorName: string) => string): string {
  return subjects.length === 0 ? COMPARE_PATH : `${COMPARE_PATH}?s=${encodeSubjects(subjects, slugOf)}`;
}

// The address of a subject's own page.
export function pageUrl(subject: Subject, slugOf: (professorName: string) => string): string {
  if (subject.type === "professor") return professorPath(slugOf(subject.professorName));
  if (subject.type === "course") return coursePath(subject.courseCode);
  return classPath(slugOf(subject.professorName), subject.courseCode);
}
