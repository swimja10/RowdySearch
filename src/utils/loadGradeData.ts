import gradeDataUrl from "../../data/cleaned_grade_data.json?url";
import { buildSearchIndex, type SearchIndex } from "../searcher.ts";
import { readProfessors, type Professor, type RawGradeData } from "./gradeData.ts";

export type GradeData = {
  professors: Record<string, Professor>;
  searchIndex: SearchIndex;
};

// Used by both the sidebar and the background script.
export async function loadGradeData(): Promise<GradeData> {
  const response = await fetch(gradeDataUrl);
  const rawData: RawGradeData = await response.json();

  return {
    professors: readProfessors(rawData),
    searchIndex: buildSearchIndex(rawData),
  };
}
