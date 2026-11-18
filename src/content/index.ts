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

// Tables that something went wrong in, so each one is only reported once (this runs on every change).
const brokenTables = new WeakSet<HTMLTableElement>();

function addAllSearchButtons() {
  for (const searchableTable of SEARCHABLE_TABLES) {
    for (const table of tablesWithColumns(searchableTable.columns)) {
      // A table laid out in a way we don't expect is skipped, and the other tables still get buttons.
      try {
        addSearchButtons(table, searchableTable);
      } catch (error) {
        if (!brokenTables.has(table)) console.warn("RowdySearch: couldn't add Search buttons to a table.", error);
        brokenTables.add(table);
      }
    }
  }
}
