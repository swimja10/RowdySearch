// What the Schedule Planner column asks the background script about each section.
export type SectionRequest = {
  instructor: string; // "Beatty, Sean Padraic", the way Schedule Planner shows it
  courseCode: string; // "MAT 1213"
};

// The answer, or null when the instructor isn't in our data.
export type SectionSummary = {
  professorName: string;
  rating: number | null;
  courseCode: string | null; // null when they've never taught this course before
  median: string | null;
  lastTaught: string | null;
};
