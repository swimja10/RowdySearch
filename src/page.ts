// Every page the sidebar can show.
export type Page =
  | { type: "search"; query: string }
  | { type: "professor"; professorName: string }
  | { type: "class"; professorName: string; courseCode: string }
  | { type: "course"; courseCode: string };

// What analytical mode can compare: a professor, a course, or one professor's class.
// These are the same things the sidebar has pages for, so it's every Page except search.
export type Subject = Exclude<Page, { type: "search" }>;

// What the sidebar asks the web page it sits on (content/sidebar.ts) to do:
// cover the whole screen for Analytical Mode (or shrink back), or close the sidebar.
export type SidebarMessage =
  | { rowdySearch: "fullScreen"; isFullScreen: boolean }
  | { rowdySearch: "close" };

// What clicking RowdySearch's icon in Chrome's toolbar (background.ts) tells the page.
export type ToolbarMessage = "toggleSidebar";

// One row of Schedule Planner's section table, sent to the sidebar by its Search button.
export type Section = {
  instructor: string; // "Beatty, Sean Padraic", the way Schedule Planner shows it
  courseCode: string; // "MAT 1213"
};
