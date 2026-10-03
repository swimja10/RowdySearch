// Every page the sidebar can show.
export type Page =
  | { type: "search"; query: string }
  | { type: "professor"; professorName: string }
  | { type: "class"; professorName: string; courseCode: string }
  | { type: "course"; courseCode: string };

// One row of Schedule Planner's section table, sent to the sidebar by its Search button.
export type Section = {
  instructor: string; // "Beatty, Sean Padraic", the way Schedule Planner shows it
  courseCode: string; // "MAT 1213"
};
