// Schedule Planner's section tables and Shopping Cart. Both have these columns:
//   ... | Subject ("MAT") | Course ("1213") | Instructor ("Beatty, Sean Padraic") | ...
import type { Section } from "../page.ts";
import type { CellFinder } from "./searchColumn.ts";

export const SCHEDULE_PLANNER_COLUMNS = ["Subject", "Course", "Instructor"];

export async function readSchedulePlannerSection(cellUnder: CellFinder): Promise<Section> {
  const instructorCell = cellUnder("Instructor");
  // A section with two instructors lists each in its own <span>. Use the first one.
  const firstInstructor = instructorCell.querySelector("span") ?? instructorCell;

  return {
    instructor: firstInstructor.textContent!.trim(),
    courseCode: `${cellUnder("Subject").textContent!.trim()} ${cellUnder("Course").textContent!.trim()}`,
  };
}
