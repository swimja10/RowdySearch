import type { Subject } from "../page.ts";
import {
  nameWordsNotSearched,
  namesPerson,
  sharesAWord,
  sharesEveryWord,
  titleDistance,
  wordsBesidesName,
  type Match,
} from "../searcher.ts";
import { findCourse, gradesOf } from "./courses.ts";
import type { Professor } from "./gradeData.ts";
import { countStudents } from "./grades.ts";
import { semesterRank } from "./semesters.ts";

// Where pressing Enter takes you, based on what the search names:
//   "Sean Beatty"                    -> his professor page
//   "Beatty MAT 1213"                -> his MAT 1213 class page
//   "linear algebra" or "MAT1213"    -> the course page, with everyone who teaches it
// Analytical Mode uses the same rule to pick what Enter adds. Returns null when nothing matched.
export function pageForSearch(query: string, results: Match[], professors: Record<string, Professor>): Subject | null {
  if (results.length === 0) return null;

  const bestMatches = results.filter((match) => match.score === results[0].score);

  // A course code ("HUM 4433") means that course, even when a professor's name shares a word (Sue Hum).
  if (bestMatches.some((match) => namesCourseCode(query, match.course))) {
    return { type: "course", courseCode: closestCourse(bestMatches, query, professors) };
  }

  const bestMatch = closestName(bestMatches, query);
  const professor = professors[bestMatch.professor];
  const course = findCourse(professor, bestMatch.course)!;
  const courseWords = [course.code, ...course.offerings.flatMap((offering) => offering.titles)].join(" ");

  const namesProfessor = namesPerson(query, professor.name);
  // Words that are part of the name don't count toward the course too ("Chen" isn't "Chem").
  const namesCourse = sharesAWord(wordsBesidesName(query, professor.name).join(" "), courseWords);

  if (namesProfessor && namesCourse) {
    return { type: "class", professorName: professor.name, courseCode: course.code };
  }
  if (namesProfessor) {
    return { type: "professor", professorName: professor.name };
  }
  return { type: "course", courseCode: closestCourse(bestMatches, query, professors) };
}

// The results with the ones on the page Enter opens moved to the top, so the list starts where Enter goes.
export function withPageFirst(results: Match[], page: Subject | null): Match[] {
  if (page === null) return results;
  const isOnPage = (match: Match) =>
    (page.type === "professor" || match.course === page.courseCode)
    && (page.type === "course" || match.professor === page.professorName);
  return [...results.filter(isOnPage), ...results.filter((match) => !isOnPage(match))];
}

// Several names can match equally well ("Carlos Rodriguez" is also in "Carlos Montoya Rodriguez"),
// so take the one with the fewest name words you didn't type.
function closestName(matches: Match[], query: string): Match {
  const extraNameWords = (match: Match) => nameWordsNotSearched(match.professor, query).length;
  return [...matches].sort((first, second) => extraNameWords(first) - extraNameWords(second))[0];
}

// True when the search is the course's code, written any way: "HUM 4433", "math 1213", "CS1083".
// It has to have the course number, or "databases" would be a DA course and "statics" an STA one.
function namesCourseCode(query: string, courseCode: string): boolean {
  return /\d{3}/.test(query) && sharesEveryWord(query, courseCode);
}

type CourseChoice = {
  code: string;
  titles: Set<string>;
  codeMatches: boolean;
  titleDistance: number;
  students: number;
  lastTaught: number;
};

// Several courses can match equally well. In order, prefer:
//   1. the course whose code has everything you typed ("AST 4953", not PHY 4953)
//   2. a title close to what you typed that many students take: each extra title word
//      ("Data Structures", not "C++ and Data Structures") counts as much as 8 times the students,
//      so "physics 1" is Algebra-based Physics I, not the far smaller Mathematical Physics I
//   3. the course taught most recently
function closestCourse(matches: Match[], query: string, professors: Record<string, Professor>): string {
  const choices = new Map<string, CourseChoice>();
  for (const match of matches) {
    const course = findCourse(professors[match.professor], match.course)!;
    const choice = choices.get(match.course) ?? {
      code: course.code,
      titles: new Set<string>(),
      codeMatches: namesCourseCode(query, course.code),
      titleDistance: Infinity,
      students: 0,
      lastTaught: 0,
    };
    choice.titles.add(course.title);
    choice.titleDistance = Math.min(choice.titleDistance, titleDistance(course.title, query));
    choice.students += countStudents(gradesOf(course.offerings));
    choice.lastTaught = Math.max(choice.lastTaught, semesterRank(course.offerings[0].semester));
    choices.set(match.course, choice);
  }

  const distance = (choice: CourseChoice) => choice.titleDistance - Math.log2(1 + choice.students) / 3;
  const ranked = withRenumberedCoursesMerged([...choices.values()]).sort((first, second) =>
    Number(second.codeMatches) - Number(first.codeMatches)
    || distance(first) - distance(second)
    || second.lastTaught - first.lastTaught);
  return ranked[0].code;
}

// UTSA renumbers courses and keeps their titles (Calculus I went from MAT 1214 to MAT 1213).
// Courses that share a title are one choice, under the newest number, with all of their students.
// A course cross-listed under two numbers at once (Ecology is BIO 3283 and ES 3033) goes under
// the one more students have taken, rather than whichever was found first.
function withRenumberedCoursesMerged(choices: CourseChoice[]): CourseChoice[] {
  const merged: CourseChoice[] = [];
  const newestFirst = [...choices].sort((first, second) =>
    second.lastTaught - first.lastTaught || second.students - first.students);
  for (const choice of newestFirst) {
    const newer = merged.find((kept) => [...choice.titles].some((title) => kept.titles.has(title)));
    if (newer === undefined) {
      merged.push({ ...choice, titles: new Set(choice.titles) });
      continue;
    }
    newer.codeMatches ||= choice.codeMatches;
    newer.titleDistance = Math.min(newer.titleDistance, choice.titleDistance);
    newer.students += choice.students;
  }
  return merged;
}
