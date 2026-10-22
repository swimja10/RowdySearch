import type { Review } from "../utils/gradeData.ts";

type ReviewsProps = {
  reviews: Review[];
};

export function Reviews({ reviews }: ReviewsProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-zinc-500">No reviews on Rate My Professors yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {reviews.map((review, index) => (
        <li key={index} className="flex flex-col gap-1 rounded-xl bg-zinc-800 p-3 text-sm text-zinc-300">
          {review.course !== "" && <span className="text-xs font-medium text-zinc-500">{review.course}</span>}
          <span>“{review.comment}”</span>
        </li>
      ))}
    </ul>
  );
}
