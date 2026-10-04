import type { SeriesData } from "../../utils/series.ts";

type SeriesNameProps = {
  series: SeriesData;
};

// A series' name with a dot in its chart color, so tables and lists match the charts.
export function SeriesName({ series }: SeriesNameProps) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: series.color }} />
      {series.label}
    </span>
  );
}
