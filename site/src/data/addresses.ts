import slugs from "../../slugs.json";
import { classPath, coursePath, courseSlug, professorPath } from "../search/urls.ts";

// Every page's address. Addresses are lowercase, guessable from a name or a course code, and
// never change once published.

export { courseSlug };

const professorSlugs: Record<string, string> = slugs;

// "Sean Beatty" -> "sean-beatty". Professors' addresses are kept in slugs.json (see
// scripts/update-slugs.mjs), so they stay the same even if the way they're made changes.
export function professorSlug(professorName: string): string {
  const slug = professorSlugs[professorName];
  if (slug === undefined) {
    throw new Error(`${professorName} has no address in slugs.json. Run "npm run slugs" in site/.`);
  }
  return slug;
}

// "MAT 1213" -> "MAT"
export function subjectOf(courseCode: string): string {
  return courseCode.split(" ")[0];
}

export function professorUrl(professorName: string): string {
  return professorPath(professorSlug(professorName));
}

// One professor's version of one course.
export function classUrl(professorName: string, courseCode: string): string {
  return classPath(professorSlug(professorName), courseCode);
}

export function courseUrl(courseCode: string): string {
  return coursePath(courseCode);
}

export function subjectUrl(subject: string): string {
  return `/subjects/${subject.toLowerCase()}/`;
}
