import { useEffect, useState } from "react";
import { loadGradeData, type GradeData } from "../utils/loadGradeData.ts";

// Returns null until the grade data file has loaded.
export function useGradeData() {
  const [gradeData, setGradeData] = useState<GradeData | null>(null);

  useEffect(() => {
    loadGradeData().then(setGradeData);
  }, []);

  return gradeData;
}
