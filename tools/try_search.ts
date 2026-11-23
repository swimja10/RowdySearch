// Try the searcher from the terminal:  node searcher.ts "Darrn Meritz WRC"
import { readFileSync } from "node:fs";
import { buildSearchIndex, search } from "./src/searcher.ts";
import { findCourse } from "./src/utils/courses.ts";
import { readProfessors } from "./src/utils/gradeData.ts";

const professors = readProfessors(JSON.parse(readFileSync("./data/professors.json", "utf8")));
const index = buildSearchIndex(professors);

const input = process.argv.slice(2).join(" ") || "Darrn Meritz WRC";
const [best] = search(index, input);

if (!best) {
  console.log(`No match for "${input}"`);
} else {
  console.log(best.professor, "|", best.course, "| score", best.score.toFixed(2));
  for (const offering of findCourse(professors[best.professor], best.course)!.offerings) {
    console.log(offering.semester, "A:", offering.grades["A"]);
  }
}
