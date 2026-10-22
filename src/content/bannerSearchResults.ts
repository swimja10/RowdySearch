// Banner's class search results, in Browse Classes and in Register for Classes' Find Classes tab:
//   Subj ("CS") | Crse ("1083") | ... | Instructor ("Almaawi, Alyas (Primary)") | ... | Linked Sections | ...
import type { Section } from "../page.ts";
import type { CellFinder } from "./searchColumn.ts";

export const BANNER_RESULTS_COLUMNS = ["Subj", "Crse", "Instructor"];

// The table's columns already fill its whole width, so a new column would get no room. The Search
// buttons go in Linked Sections instead, which is empty except for courses with a lab or recitation.
// Those keep their "View Linked" button under ours, since it's how you add the lecture and lab together.
export const BANNER_RESULTS_BUTTON_COLUMN = "Linked Sections";

export async function readBannerResultsSection(cellUnder: CellFinder): Promise<Section> {
  return {
    instructor: primaryInstructor(cellUnder("Instructor")),
    courseCode: `${cellUnder("Subj").textContent!.trim()} ${cellUnder("Crse").textContent!.trim()}`,
  };
}

// Each instructor's name is a link, and the main instructor's is followed by "(Primary)".
// "" when the section has no instructor yet.
function primaryInstructor(instructorCell: HTMLTableCellElement): string {
  const names = [...instructorCell.querySelectorAll("a")];
  const primary = names.find((name) => name.nextSibling?.textContent?.includes("Primary")) ?? names[0];
  return primary?.textContent?.trim() ?? "";
}
