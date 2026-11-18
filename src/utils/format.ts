// Every number RowdySearch shows is rounded here, the same way everywhere, so the sidebar and
// Analytical Mode can never show the same thing as two different numbers.

// Rounds halves away from zero: 4.85 -> 4.9, 17.5 -> 18, -2.5 -> -3. Math.round and toFixed can't be
// trusted with halves, since computers store most decimals a hair off: 4.85 is really 4.8499999...,
// which toFixed(1) rounds down to 4.8. Snapping to 6 decimals first puts it back on the half.
export function roundHalfUp(value: number, decimals: number): number {
  const scale = 10 ** decimals;
  const scaled = Number((Math.abs(value) * scale).toFixed(6));
  return (Math.sign(value) * Math.round(scaled)) / scale;
}

export function formatOutOfFive(value: number | null) {
  return value === null ? "No ratings" : `${roundHalfUp(value, 1).toFixed(1)} / 5`;
}

export function formatPercent(value: number | null) {
  return value === null ? "No ratings" : `${roundHalfUp(value, 0)}%`;
}

// A rating with where it's from, like "RMP 4.2 / 5" or "Bluebook 4.6 / 5".
export function formatRating(source: string, rating: number | null) {
  return rating === null ? `No ${source} ratings` : `${source} ${formatOutOfFive(rating)}`;
}

export function formatGpa(gpa: number | null) {
  return gpa === null ? "—" : roundHalfUp(gpa, 2).toFixed(2);
}

// A percent of students, like "28%".
export function formatShare(percent: number | null) {
  return percent === null ? "—" : `${roundHalfUp(percent, 0)}%`;
}

// "Mathematics department". A few professors only teach somewhere that isn't a department, and its
// name already says what it is: "Honors College", "University College", "Army ROTC".
export function formatDepartment(department: string) {
  return /(College|ROTC)$/.test(department) ? department : `${department} department`;
}

// "1 section", "12 sections"
export function formatCount(count: number, noun: string) {
  return `${count.toLocaleString()} ${count === 1 ? noun : `${noun}s`}`;
}
