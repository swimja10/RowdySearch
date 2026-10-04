import type { GradeData } from "../hooks/useGradeData.ts";
import type { Subject } from "../page.ts";
import type { GradeCounts } from "./grades.ts";
import { averageGpa } from "./statistics.ts";
import { gradesForSubject, professorNameOf, subjectKey, subjectLabel } from "./subjects.ts";

// Chart colors, checked with a colorblind-safety palette validator against the sidebar's
// dark background. Neighbors in this order are easy to tell apart, so keep the order.
// There are 8, so analytical mode compares at most 8 things at once.
export const SERIES_COLORS = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];

// One subject on the charts, with the color it keeps for as long as it's there.
export type Series = {
  subject: Subject;
  color: string;
};

// Everything the charts and the table need to draw one series.
export type SeriesData = {
  subject: Subject;
  key: string;
  label: string;
  color: string;
  grades: GradeCounts;
  professorName: string | null;
  rating: number | null;
  courseGpa: number | null; // for one professor's class: the whole course's average GPA
};

export function seriesFor(subjects: Subject[]): Series[] {
  return subjects.map((subject, index) => ({ subject, color: SERIES_COLORS[index] }));
}

export function isAdded(seriesList: Series[], subject: Subject): boolean {
  return seriesList.some((series) => subjectKey(series.subject) === subjectKey(subject));
}

// Adds a subject in the first color nobody is using, unless it's already there or all 8 colors are taken.
export function withSubjectAdded(seriesList: Series[], subject: Subject): Series[] {
  const unusedColor = SERIES_COLORS.find((color) => !seriesList.some((series) => series.color === color));
  if (isAdded(seriesList, subject) || unusedColor === undefined) return seriesList;

  return [...seriesList, { subject, color: unusedColor }];
}

export function describeSeries({ subject, color }: Series, gradeData: GradeData): SeriesData {
  const professorName = professorNameOf(subject);

  return {
    subject,
    key: subjectKey(subject),
    label: subjectLabel(subject),
    color,
    grades: gradesForSubject(subject, gradeData),
    professorName,
    rating: professorName === null ? null : gradeData.professors[professorName].rmp.rating,
    courseGpa: subject.type === "class" ? wholeCourseGpa(subject.courseCode, gradeData) : null,
  };
}

function wholeCourseGpa(courseCode: string, gradeData: GradeData): number | null {
  return averageGpa(gradesForSubject({ type: "course", courseCode }, gradeData));
}
