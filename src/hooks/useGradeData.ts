import { useEffect, useState } from "react";
import { buildSearchIndex, type SearchIndex } from "../searcher.ts";
import { readProfessors, withoutPlaceholderNames, type Professor, type RawGradeData } from "../utils/gradeData.ts";

// The sidebar page is dist/index.html, so this points at data/ in the project folder.
// Reading it from there means the 20 MB file isn't copied into dist/ as well.
const GRADE_DATA_URL = "../data/cleaned_grade_data.json";

export type GradeData = {
  professors: Record<string, Professor>;
  searchIndex: SearchIndex;
};

// Returns null until the grade data file has loaded.
export function useGradeData() {
  const [gradeData, setGradeData] = useState<GradeData | null>(null);

  useEffect(() => {
    loadGradeData().then(setGradeData);
  }, []);

  return gradeData;
}

async function loadGradeData(): Promise<GradeData> {
  const response = await fetch(GRADE_DATA_URL);
  const rawData = withoutPlaceholderNames(await response.json() as RawGradeData);

  return {
    professors: readProfessors(rawData),
    searchIndex: buildSearchIndex(rawData),
  };
}
