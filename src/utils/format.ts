export function formatOutOfFive(value: number | null) {
  return value === null ? "No ratings" : `${value.toFixed(1)} / 5`;
}

export function formatPercent(value: number | null) {
  return value === null ? "No ratings" : `${value}%`;
}

export function formatRmpRating(rating: number | null) {
  return rating === null ? "No RMP ratings" : `RMP ${formatOutOfFive(rating)}`;
}

export function formatGpa(gpa: number | null) {
  return gpa === null ? "—" : gpa.toFixed(2);
}

export function formatShare(percent: number | null) {
  return percent === null ? "—" : `${Math.round(percent)}%`;
}

// "▲ 0.32" when a class's average GPA is higher than its whole course's, "▼ 0.15" when lower.
export function formatGpaDifference(gpa: number | null, courseGpa: number | null) {
  if (gpa === null || courseGpa === null) return "—";

  const difference = gpa - courseGpa;
  if (Math.abs(difference) < 0.005) return "Same";
  return `${difference > 0 ? "▲" : "▼"} ${Math.abs(difference).toFixed(2)}`;
}
