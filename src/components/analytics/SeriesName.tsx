import Button from "../Button.tsx";
import type { Subject } from "../../page.ts";
import type { SeriesData } from "../../utils/series.ts";

type SeriesNameProps = {
  series: SeriesData;
  onOpen: (subject: Subject) => void;
};

// A series' name with a dot in its chart color, so tables and lists match the charts.
// The name is a link to that professor's, course's, or class's page in the sidebar.
export function SeriesName({ series, onOpen }: SeriesNameProps) {
  return (
    <span className="flex items-center gap-2">
      <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: series.color }} />
      <Button variant="link" onClick={() => onOpen(series.subject)}>{series.label}</Button>
    </span>
  );
}
