import { AnalyticsButton } from "./AnalyticsButton.tsx";
import Button from "./Button.tsx";
import { useLookup } from "../context/useLookup.ts";

export function Header() {
  const { canGoBack, goBack, openSearch } = useLookup();

  return (
    <header className="flex items-center justify-between gap-2">
      <Button variant="secondary" className="whitespace-nowrap text-sm" onClick={goBack} disabled={!canGoBack}>
        ← Back
      </Button>
      <h1 className="flex items-center gap-2 text-lg font-bold">
        <img src="icons/icon-48.png" alt="" className="size-6 rounded-md" />
        {/* In a very narrow side panel, the logo alone leaves room for the buttons. */}
        <span className="hidden min-[380px]:inline">RowdySearch</span>
      </h1>
      <div className="flex items-center gap-1">
        <Button variant="secondary" className="whitespace-nowrap text-sm" onClick={() => openSearch("")}>
          Search
        </Button>
        <AnalyticsButton />
      </div>
    </header>
  );
}
