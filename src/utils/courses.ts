import { search, type SearchIndex } from "../searcher.ts";
import type { ClassOffering, Professor } from "./gradeData.ts";
import { addGrades, type GradeCounts } from "./grades.ts";

// Every semester a professor taught one course, newest semester first.
export type Course = {
  code: string;
  title: string;
  offerings: ClassOffering[];
};

export type Teacher = {
  professor: Professor;
  course: Course;
};

const SEASON_ORDER: Record<string, number> = { Spring: 1, Summer: 2, Fall: 3 };

// Courses come out in the order the professor most recently taught them.
export function coursesOf(professor: Professor): Course[] {
  const offeringsByCode = new Map<string, ClassOffering[]>();
  for (const offering of newestFirst(professor.classes)) {
    const offerings = offeringsByCode.get(offering.courseCode) ?? [];
    offeringsByCode.set(offering.courseCode, [...offerings, offering]);
  }

  return [...offeringsByCode].map(([code, offerings]) => ({
    code,
    title: offerings[0].title,
    offerings,
  }));
}

export function findCourse(professor: Professor, courseCode: string): Course | undefined {
  return coursesOf(professor).find((course) => course.code === courseCode);
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

export function gradesOf(offerings: ClassOffering[]): GradeCounts {
  return addGrades(offerings.map((offering) => offering.grades));
}

function lastTaughtRank(teacher: Teacher): number {
  return semesterRank(teacher.course.offerings[0].semester);
}

function newestFirst(classes: ClassOffering[]): ClassOffering[] {
  return [...classes].sort((first, second) => semesterRank(second.semester) - semesterRank(first.semester));
}

// "Fall 2025" -> 20253, so later semesters always have bigger numbers.
function semesterRank(semester: string): number {
  const [season, year] = semester.split(" ");
  return Number(year) * 10 + SEASON_ORDER[season];
}
