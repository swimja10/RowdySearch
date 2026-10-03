// Every page the sidebar can show.
export type Page =
  | { type: "search"; query: string }
  | { type: "professor"; professorName: string }
  | { type: "class"; professorName: string; courseCode: string }
  | { type: "course"; courseCode: string };
