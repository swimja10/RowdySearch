import { useEffect, useState } from "react";
import { buildSearchIndex, type SearchIndex } from "../searcher.ts";
import { readProfessors, type Professor, type RawData } from "../utils/gradeData.ts";

// The sidebar page is dist/index.html, so this points at data/ in the project folder.
// Reading it from there means the 10 MB file isn't copied into dist/ as well.
const PROFESSORS_URL = "../data/professors.json";

export type GradeData = {
  professors: Record<string, Professor>;
  searchIndex: SearchIndex;
};

// Returns null until the professors file has loaded.
export function useGradeData() {
  const [gradeData, setGradeData] = useState<GradeData | null>(null);

  useEffect(() => {
    loadGradeData().then(setGradeData);
  }, []);

  return gradeData;
}

async function loadGradeData(): Promise<GradeData> {
  const response = await fetch(PROFESSORS_URL);
  const professors = readProfessors(await response.json() as RawData);

  return { professors, searchIndex: buildSearchIndex(professors) };
}
