import type { Page } from "../page.ts";
import { sharesAWord, type Match } from "../searcher.ts";
import { findCourse } from "./courses.ts";
import type { Professor } from "./gradeData.ts";

// Where pressing Enter takes you, based on what the search names:
//   "Sean Beatty"                    -> his professor page
//   "Beatty MAT 1213"                -> his MAT 1213 class page
//   "linear algebra" or "MAT 1213"   -> the course page, with everyone who teaches it
// Returns null when the search found nothing.
export function pageForSearch(query: string, results: Match[], professors: Record<string, Professor>): Page | null {
  if (results.length === 0) return null;

  const [bestMatch] = results;
  const professor = professors[bestMatch.professor];
  const course = findCourse(professor, bestMatch.course)!;
  const courseWords = [course.code, ...course.offerings.map((offering) => offering.title)].join(" ");

  const namesProfessor = sharesAWord(query, professor.name);
  const namesCourse = sharesAWord(query, courseWords);

  if (namesProfessor && namesCourse) {
    return { type: "class", professorName: professor.name, courseCode: course.code };
  }
  if (namesProfessor) {
    return { type: "professor", professorName: professor.name };
  }
  const bestMatches = results.filter((match) => match.score === bestMatch.score);
  return { type: "course", courseCode: closestCourse(bestMatches, professors) };
}

// Several courses can match equally well. Prefer the shortest title ("Data Structures" over
// "C++ and Data Structures"), then the course the most professors teach.
function closestCourse(matches: Match[], professors: Record<string, Professor>): string {
  const courses = new Map<string, { titleWords: number; teachers: number }>();
  for (const match of matches) {
    const title = findCourse(professors[match.professor], match.course)!.title;
    const teachers = (courses.get(match.course)?.teachers ?? 0) + 1;
    courses.set(match.course, { titleWords: title.split(" ").length, teachers });
  }

  const ranked = [...courses].sort(([, first], [, second]) =>
    first.titleWords - second.titleWords || second.teachers - first.teachers);
  return ranked[0][0];
}
