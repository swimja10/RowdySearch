import type { SectionRequest, SectionSummary } from "../messages.ts";
import { search, sharesEveryWord } from "../searcher.ts";
import { findCourse, gradesOf } from "./courses.ts";
import { medianGrade } from "./grades.ts";
import type { GradeData } from "./loadGradeData.ts";

// Finds the professor teaching one Schedule Planner section and sums up
// how they've done in that course before.
export function summarizeSection({ professors, searchIndex }: GradeData, request: SectionRequest): SectionSummary | null {
  const name = firstAndLastName(request.instructor);
  const professorMatches = search(searchIndex, name).filter((match) => sharesEveryWord(name, match.professor));
  if (professorMatches.length === 0) return null;

  const classMatch = professorMatches.find((match) => sharesEveryWord(request.courseCode, match.course));
  const professor = professors[(classMatch ?? professorMatches[0]).professor];
  const course = classMatch && findCourse(professor, classMatch.course);

  return {
    professorName: professor.name,
    rating: professor.rmp.rating,
    courseCode: course ? course.code : null,
    median: course ? medianGrade(gradesOf(course.offerings)) : null,
    lastTaught: course ? course.offerings[0].semester : null,
  };
}

// "Beatty, Sean Padraic" -> "Sean Beatty". The grade data leaves out middle names.
function firstAndLastName(instructor: string): string {
  const [lastName, givenNames = ""] = instructor.split(",");
  const firstName = givenNames.trim().split(" ")[0];
  return `${firstName} ${lastName}`;
}
