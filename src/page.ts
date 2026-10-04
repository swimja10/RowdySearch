// Every page the sidebar can show.
export type Page =
  | { type: "search"; query: string }
  | { type: "professor"; professorName: string }
  | { type: "class"; professorName: string; courseCode: string }
  | { type: "course"; courseCode: string };

// What analytical mode can compare: a professor, a course, or one professor's class.
// These are the same things the sidebar has pages for, so it's every Page except search.
export type Subject = Exclude<Page, { type: "search" }>;

// Analytical mode sends this to the registration page (content/sidebar.ts) to cover the
// whole screen, or to shrink back to a sidebar.
export type FullScreenMessage = { rowdySearch: "fullScreen"; isFullScreen: boolean };

// One row of Schedule Planner's section table, sent to the sidebar by its Search button.
export type Section = {
  instructor: string; // "Beatty, Sean Padraic", the way Schedule Planner shows it
  courseCode: string; // "MAT 1213"
};
