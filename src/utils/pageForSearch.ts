import type { Subject } from "../page.ts";
import { sharesAWord, sharesEveryWord, wordsMissingFrom, type Match } from "../searcher.ts";
import { findCourse } from "./courses.ts";
import type { Professor } from "./gradeData.ts";

// Where pressing Enter takes you, based on what the search names:
//   "Sean Beatty"                    -> his professor page
//   "Beatty MAT 1213"                -> his MAT 1213 class page
//   "linear algebra" or "MAT 1213"   -> the course page, with everyone who teaches it
// Analytical Mode uses the same rule to pick what Enter adds. Returns null when nothing matched.
export function pageForSearch(query: string, results: Match[], professors: Record<string, Professor>): Subject | null {
  if (results.length === 0) return null;

  const bestMatches = results.filter((match) => match.score === results[0].score);

  // A course code ("HUM 4433") means that course, even when a professor's name shares a word (Sue Hum).
  if (bestMatches.some((match) => sharesEveryWord(query, match.course))) {
    return { type: "course", courseCode: closestCourse(bestMatches, query, professors) };
  }

  const bestMatch = closestName(bestMatches, query);
  const professor = professors[bestMatch.professor];
  const course = findCourse(professor, bestMatch.course)!;
  const courseWords = [course.code, ...course.offerings.map((offering) => offering.title)].join(" ");

  const namesProfessor = sharesAWord(query, professor.name);
  // Words that are part of the name don't count toward the course too ("Chen" isn't "Chem").
  const namesCourse = sharesAWord(wordsMissingFrom(query, professor.name).join(" "), courseWords);

  if (namesProfessor && namesCourse) {
    return { type: "class", professorName: professor.name, courseCode: course.code };
  }
  if (namesProfessor) {
    return { type: "professor", professorName: professor.name };
  }
  return { type: "course", courseCode: closestCourse(bestMatches, query, professors) };
}

// Several names can match equally well ("Carlos Rodriguez" is also in "Carlos Montoya Rodriguez"),
// so take the one with the fewest name words you didn't type.
function closestName(matches: Match[], query: string): Match {
  const extraNameWords = (match: Match) => wordsMissingFrom(match.professor, query).length;
  return [...matches].sort((first, second) => extraNameWords(first) - extraNameWords(second))[0];
}

// Several courses can match equally well. In order, prefer:
//   1. the course whose code has everything you typed ("AST 4953", not PHY 4953)
//   2. the shortest title ("Data Structures", not "C++ and Data Structures")
//   3. the course the most professors teach
function closestCourse(matches: Match[], query: string, professors: Record<string, Professor>): string {
  const courses = new Map<string, { codeMatches: number; titleWords: number; teachers: number }>();
  for (const match of matches) {
    const title = findCourse(professors[match.professor], match.course)!.title;
    const teachers = (courses.get(match.course)?.teachers ?? 0) + 1;
    const codeMatches = sharesEveryWord(query, match.course) ? 1 : 0;
    courses.set(match.course, { codeMatches, titleWords: title.split(" ").length, teachers });
  }

  const ranked = [...courses].sort(([, first], [, second]) =>
    second.codeMatches - first.codeMatches
    || first.titleWords - second.titleWords
    || second.teachers - first.teachers);
  return ranked[0][0];
}
