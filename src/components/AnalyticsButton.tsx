import { VennIcon } from "./VennIcon.tsx";
import { useLookup } from "../context/useLookup.ts";

// The orange Venn diagram in the top right corner. Hovering brightens it and shows its name.
export function AnalyticsButton() {
  const { openAnalytics } = useLookup();

  return (
    <div className="group relative flex">
      <button
        onClick={openAnalytics}
        aria-label="Analytical Mode"
        className="rounded p-1 text-orange-600 transition-colors hover:text-orange-400 focus-visible:text-orange-400">
        <VennIcon className="h-6 w-9" />
      </button>
      <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-100 opacity-0 transition-opacity group-hover:opacity-100">
        Analytical Mode
      </span>
    </div>
  );
}
