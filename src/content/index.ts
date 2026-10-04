// Runs on the registration sites listed under "content_scripts" in manifest.json.
import { BANNER_SUMMARY_COLUMNS, readBannerSection } from "./bannerSummary.ts";
import { SCHEDULE_PLANNER_COLUMNS, readSchedulePlannerSection } from "./schedulePlanner.ts";
import { addSearchColumn, tablesWithColumns } from "./searchColumn.ts";
import { addLookupTab } from "./sidebar.ts";

// Tables that get a RowdySearch column, found by their column titles.
const SEARCHABLE_TABLES = [
  { columns: SCHEDULE_PLANNER_COLUMNS, readSection: readSchedulePlannerSection },
  { columns: BANNER_SUMMARY_COLUMNS, readSection: readBannerSection },
];

addLookupTab();
addSearchColumns();
// The sites build their tables after the page loads, so look again whenever the page changes.
new MutationObserver(addSearchColumns).observe(document.body, { childList: true, subtree: true });

function addSearchColumns() {
  for (const { columns, readSection } of SEARCHABLE_TABLES) {
    for (const table of tablesWithColumns(columns)) addSearchColumn(table, readSection);
  }
}
