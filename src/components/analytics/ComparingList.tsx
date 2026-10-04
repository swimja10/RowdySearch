import Button from "../Button.tsx";
import { SeriesName } from "./SeriesName.tsx";
import type { Subject } from "../../page.ts";
import { SERIES_COLORS, type SeriesData } from "../../utils/series.ts";

type ComparingListProps = {
  seriesData: SeriesData[];
  onRemove: (key: string) => void;
  onClear: () => void;
  onOpen: (subject: Subject) => void;
};

// Everything on the charts right now, each with a button to take it off.
export function ComparingList({ seriesData, onRemove, onClear, onOpen }: ComparingListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Comparing {seriesData.length} of {SERIES_COLORS.length}
        </span>
        {seriesData.length > 0 && <Button variant="link" className="text-xs" onClick={onClear}>Clear all</Button>}
      </div>
      <ul className="flex flex-col gap-1">
        {seriesData.map(series => (
          <li key={series.key} className="flex items-center justify-between gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm">
            <SeriesName series={series} onOpen={onOpen} />
            <Button
              variant="secondary"
              className="px-2 text-xs"
              aria-label={`Remove ${series.label}`}
              onClick={() => onRemove(series.key)}>
              ✕
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
