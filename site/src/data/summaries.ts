import type { CourseEntry } from "./catalog.ts";
import type { SectionCount } from "./professors.ts";
import {
  FINISHED_OR_WITHDREW,
  WITHDREW,
  countStudents,
  formatCount,
  formatShare,
  medianGrade,
  percentWhoGot,
  type Course,
  type GradeCounts,
  type Professor,
} from "./shared.ts";

// The sentence at the top of each page that says its numbers in words. Search engines and AI
// assistants can't read a chart, so this is what they quote. It's also the page's description.

const NO_GRADES = "No grades have been released yet.";

// "Sean Beatty has taught 6 courses at UTSA. Across 41 sections and 2,310 grades, the median grade was B."
export function professorSummary(professor: Professor, sections: SectionCount, grades: GradeCounts): string {
  const taught = `${professor.name} has taught ${formatCount(professor.courses.length, "course")} at UTSA.`;
  const median = medianGrade(grades);
  if (median === null) return `${taught} ${NO_GRADES}`;

  const gradeCount = formatCount(countStudents(grades, FINISHED_OR_WITHDREW), "grade");
  return `${taught} Across ${formatCount(sections.graded, "section")} and ${gradeCount}, the median grade was ${median}.`;
}

// "Across 14 sections of MAT 1213, Sean Beatty's median grade was B-. The median for all 20 professors was C+."
export function classSummary(
  professor: Professor,
  course: Course,
  sections: SectionCount,
  grades: GradeCounts,
  wholeCourse: CourseEntry,
): string {
  const median = medianGrade(grades);
  if (median === null) return `${professor.name} has taught ${course.code} ${course.title} at UTSA. ${NO_GRADES}`;

  const theirs = `Across ${formatCount(sections.graded, "section")} of ${course.code}, ${professor.name}'s median grade was ${median}.`;
  const professorCount = wholeCourse.teachers.length;
  if (professorCount === 1) return `${theirs} No one else has taught it.`;
  return `${theirs} The median for all ${professorCount} professors was ${wholeCourse.median}.`;
}

// "MAT 1213 Calculus I has been taught by 20 professors at UTSA. Across 77 sections, the median
// grade was C+ and 11% of students withdrew."
export function courseSummary(course: CourseEntry): string {
  const professors = formatCount(course.teachers.length, "professor");
  const taught =
    course.name === null
      ? `${course.code} is a topics course at UTSA, taught by ${professors}, each with their own topic.`
      : `${course.code} ${course.name} has been taught by ${professors} at UTSA.`;
  if (course.median === null) return `${taught} ${NO_GRADES}`;

  const withdrew = formatShare(percentWhoGot(course.grades, WITHDREW));
  return `${taught} Across ${formatCount(course.sections.graded, "section")}, the median grade was ${course.median} and ${withdrew} of students withdrew.`;
}
