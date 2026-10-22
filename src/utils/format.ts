export function formatOutOfFive(value: number | null) {
  return value === null ? "No ratings" : `${value.toFixed(1)} / 5`;
}

export function formatPercent(value: number | null) {
  return value === null ? "No ratings" : `${Math.round(value)}%`;
}

// A rating with where it's from, like "RMP 4.2 / 5" or "Bluebook 4.6 / 5".
export function formatRating(source: string, rating: number | null) {
  return rating === null ? `No ${source} ratings` : `${source} ${formatOutOfFive(rating)}`;
}

export function formatGpa(gpa: number | null) {
  return gpa === null ? "—" : gpa.toFixed(2);
}

export function formatShare(percent: number | null) {
  return percent === null ? "—" : `${Math.round(percent)}%`;
}

// "1 section", "12 sections"
export function formatCount(count: number, noun: string) {
  return `${count.toLocaleString()} ${count === 1 ? noun : `${noun}s`}`;
}
