import type { Page, Section } from "../page.ts";
import { search, sharesEveryWord, type SearchIndex } from "../searcher.ts";

// Which page a Schedule Planner Search button opens:
//   the professor's class page, if they've taught this course before
//   their professor page, if they haven't
//   the course page with everyone who teaches it, if the instructor isn't in our data ("Staff")
export function pageForSection(section: Section, searchIndex: SearchIndex): Page {
  const name = firstAndLastName(section.instructor);
  const professorMatches = search(searchIndex, name).filter((match) => sharesEveryWord(name, match.professor));
  const classMatch = professorMatches.find((match) => sharesEveryWord(section.courseCode, match.course));

  if (classMatch) {
    return { type: "class", professorName: classMatch.professor, courseCode: classMatch.course };
  }
  if (professorMatches.length > 0) {
    return { type: "professor", professorName: professorMatches[0].professor };
  }
  return { type: "course", courseCode: section.courseCode };
}

// "Beatty, Sean Padraic" -> "Sean Beatty". The grade data leaves out middle names.
function firstAndLastName(instructor: string): string {
  const [lastName, givenNames = ""] = instructor.split(",");
  const firstName = givenNames.trim().split(" ")[0];
  return `${firstName} ${lastName}`;
}
