const SEASON_ORDER: Record<string, number> = { Spring: 1, Summer: 2, Fall: 3 };

// "Fall 2025" -> 20253, so later semesters always have bigger numbers.
export function semesterRank(semester: string): number {
  const [season, year] = semester.split(" ");
  return Number(year) * 10 + SEASON_ORDER[season];
}
