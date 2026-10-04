import { Reviews } from "../Reviews.tsx";
import { useLookup } from "../../context/useLookup.ts";
import { formatRmpRating } from "../../utils/format.ts";
import type { SeriesData } from "../../utils/series.ts";

type ProfessorReviewsProps = {
  seriesData: SeriesData[];
};

// Rate My Professors reviews for every professor being compared, each in a box you can fold up.
export function ProfessorReviews({ seriesData }: ProfessorReviewsProps) {
  const { professors } = useLookup();
  const professorNames = [...new Set(seriesData.map(series => series.professorName).filter(name => name !== null))];

  if (professorNames.length === 0) {
    return <p className="text-sm text-zinc-500">Add a professor to see what students say about them.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {professorNames.map(name => {
        const { rmp } = professors[name];
        return (
          <details key={name} open className="rounded-xl border border-zinc-800 p-3">
            <summary className="cursor-pointer font-medium">
              {name} <span className="text-zinc-400">· {formatRmpRating(rmp.rating)} · {rmp.ratingCount} ratings</span>
            </summary>
            <div className="mt-3">
              <Reviews reviews={rmp.reviews} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
