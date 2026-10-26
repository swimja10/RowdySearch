// Runs on the registration sites listed under "content_scripts" in manifest.json,
// and on any other page once you click RowdySearch's icon in Chrome's toolbar.
import { BANNER_RESULTS_BUTTON_COLUMN, BANNER_RESULTS_COLUMNS, readBannerResultsSection } from "./bannerSearchResults.ts";
import { BANNER_SUMMARY_COLUMNS, readBannerSection } from "./bannerSummary.ts";
import { addPageStyles } from "./pageStyles.ts";
import { SCHEDULE_PLANNER_COLUMNS, readSchedulePlannerSection } from "./schedulePlanner.ts";
import { addSearchButtons, tablesWithColumns, type SearchableTable } from "./searchColumn.ts";
import { addSidebar } from "./sidebar.ts";

// Tables that get Search buttons, found by their column titles.
const SEARCHABLE_TABLES: SearchableTable[] = [
  { columns: SCHEDULE_PLANNER_COLUMNS, readSection: readSchedulePlannerSection },
  { columns: BANNER_SUMMARY_COLUMNS, readSection: readBannerSection },
  { columns: BANNER_RESULTS_COLUMNS, readSection: readBannerResultsSection, takeOverColumn: BANNER_RESULTS_BUTTON_COLUMN },
];

addPageStyles();
addSidebar();
addAllSearchButtons();
// The sites build their tables after the page loads, so look again whenever the page changes.
new MutationObserver(addAllSearchButtons).observe(document.body, { childList: true, subtree: true });

function addAllSearchButtons() {
  for (const searchableTable of SEARCHABLE_TABLES) {
    for (const table of tablesWithColumns(searchableTable.columns)) addSearchButtons(table, searchableTable);
  }
}
