// How a page's address is made from a professor's slug and a course code. It's separate from
// data/addresses.ts so the search can use it in the browser without loading every professor's slug.

// The address a professor gets when nothing else has it: "Bülent Temel" -> "bulent-temel".
// scripts/update-slugs.mjs makes them the same way, and adds "-2" when two professors share a name.
export function defaultSlug(professorName: string): string {
  return professorName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "MAT 1213" -> "mat-1213"
export function courseSlug(courseCode: string): string {
  return courseCode.toLowerCase().replace(/\s+/g, "-");
}

export function professorPath(professorSlug: string): string {
  return `/professors/${professorSlug}/`;
}

// One professor's version of one course.
export function classPath(professorSlug: string, courseCode: string): string {
  return `/professors/${professorSlug}/${courseSlug(courseCode)}/`;
}

export function coursePath(courseCode: string): string {
  return `/courses/${courseSlug(courseCode)}/`;
}
