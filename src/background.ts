// Runs in the background for the whole extension (see "background" in manifest.json).
import type { SectionRequest } from "./messages.ts";
import { loadGradeData, type GradeData } from "./utils/loadGradeData.ts";
import { summarizeSection } from "./utils/sectionSummary.ts";

// Clicking the RowdySearch icon in Chrome's toolbar opens the sidebar on any website.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Loaded the first time a Schedule Planner row asks, then shared by every row after that.
let gradeData: Promise<GradeData> | null = null;

// Each row of the RowdySearch column in Schedule Planner asks about its section here.
chrome.runtime.onMessage.addListener((request: SectionRequest, _sender, sendResponse) => {
  if (gradeData === null) gradeData = loadGradeData();

  gradeData.then((data) => sendResponse(summarizeSection(data, request)));
  return true; // tells Chrome the answer comes later, once the data has loaded
});
