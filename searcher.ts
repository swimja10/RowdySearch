// Try the searcher from the terminal:  node searcher.ts "Darrn Meritz WRC"
import { readFileSync } from "node:fs";
import { buildSearchIndex, search } from "./src/searcher.ts";

const data = JSON.parse(readFileSync("./data/cleaned_grade_data.json", "utf8"));
const index = buildSearchIndex(data);

const input = process.argv.slice(2).join(" ") || "Darrn Meritz WRC";
const [best] = search(index, input);

if (!best) {
  console.log(`No match for "${input}"`);
} else {
  console.log(best.professor, "|", best.course, "| score", best.score.toFixed(2));
  for (const classKey of best.classes) {
    console.log(classKey, data[best.professor][classKey]["A"]);
  }
}
