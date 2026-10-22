import { search, type SearchIndex } from "../searcher.ts";
import type { ClassOffering, Course, Professor } from "./gradeData.ts";
import { addGrades, type GradeCounts } from "./grades.ts";
import { semesterRank } from "./semesters.ts";
import { average } from "./statistics.ts";

export type Teacher = {
  professor: Professor;
  course: Course;
};

// Bluebook (UTSA's end-of-semester course evaluations) averaged over every section that has results.
export type Bluebook = {
  instructor: number | null; // out of 5, null when no section has results
  course: number | null;
  sectionCount: number;
};

export function findCourse(professor: Professor, courseCode: string): Course | undefined {
  return professor.courses.find((course) => course.code === courseCode);
}

// Every semester of every course a professor has taught.
export function allOfferings(professor: Professor): ClassOffering[] {
  return professor.courses.flatMap((course) => course.offerings);
}

// Everyone who has taught a course, whoever taught it most recently first.
export function teachersOf(courseCode: string, professors: Record<string, Professor>, searchIndex: SearchIndex): Teacher[] {
  const teachers = search(searchIndex, courseCode)
    .filter((match) => match.course === courseCode)
    .map((match) => {
      const professor = professors[match.professor];
      return { professor, course: findCourse(professor, courseCode)! };
    });

  return teachers.sort((first, second) => lastTaughtRank(second) - lastTaughtRank(first));
}

// What a course's page calls it: the name most of the professors who taught it most recently use.
// A topics course (like ARC 3433) has none, since each of them teaches their own topic.
export function courseName(teachers: Teacher[]): string | null {
  const newestSemester = teachers[0].course.offerings[0].semester;
  const titles = teachers
    .filter((teacher) => teacher.course.offerings[0].semester === newestSemester)
    .map((teacher) => teacher.course.title);

  const uses = new Map<string, number>();
  for (const title of titles) uses.set(title, (uses.get(title) ?? 0) + 1);
  const [mostUsed, count] = [...uses].sort(([, first], [, second]) => second - first)[0];

  const isTopicsCourse = titles.length >= 3 && count * 2 <= titles.length;
  return isTopicsCourse ? null : mostUsed;
}

export function gradesOf(offerings: ClassOffering[]): GradeCounts {
  return addGrades(offerings.map((offering) => offering.grades));
}

export function bluebookOf(offerings: ClassOffering[]): Bluebook {
  const evaluations = offerings.flatMap((offering) => offering.evaluations);

  return {
    instructor: average(evaluations.map((evaluation) => evaluation.instructor)),
    course: average(evaluations.map((evaluation) => evaluation.course)),
    sectionCount: evaluations.length,
  };
}

function lastTaughtRank(teacher: Teacher): number {
  return semesterRank(teacher.course.offerings[0].semester);
}
