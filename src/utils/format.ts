export function formatOutOfFive(value: number | null) {
  return value === null ? "No ratings" : `${value.toFixed(1)} / 5`;
}

export function formatPercent(value: number | null) {
  return value === null ? "No ratings" : `${value}%`;
}

export function formatRmpRating(rating: number | null) {
  return rating === null ? "No RMP ratings" : `RMP ${formatOutOfFive(rating)}`;
}
