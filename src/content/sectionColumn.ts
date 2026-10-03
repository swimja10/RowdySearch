// Adds a "RowdySearch" column after "Parts of Term" in Schedule Planner's section tables.
// Every row shows its professor's rating, their median grade in that class, and when they
// last taught it. Clicking a row's cell opens the full details in the sidebar.
import type { SectionRequest, SectionSummary } from "../messages.ts";
import type { Page } from "../page.ts";
import { showInSidebar } from "./sidebar.ts";

const COLUMN_TITLE = "RowdySearch";
const LAST_COLUMN = "Parts of Term";
const SITE_NAVY = "#0c2340"; // Schedule Planner's own button color

type CellText = { title: string; detail: string; page: Page };

// Sections that share a professor and course share one answer.
const summaries = new Map<string, Promise<SectionSummary | null>>();

export function watchForSectionTables() {
  addColumnToTables();
  // Schedule Planner builds its tables after the page loads, so look again whenever the page changes.
  new MutationObserver(addColumnToTables).observe(document.body, { childList: true, subtree: true });
}

function addColumnToTables() {
  for (const header of document.querySelectorAll("th")) {
    if (header.textContent?.trim() === LAST_COLUMN) addColumn(header.closest("table")!);
  }
}

function addColumn(table: HTMLTableElement) {
  const headerRow = table.tHead!.rows[0];
  const columns = [...headerRow.cells].map((cell) => cell.textContent!.trim()).filter((title) => title !== COLUMN_TITLE);
  const lastColumn = columns.indexOf(LAST_COLUMN);

  if (headerRow.cells.length === columns.length) {
    headerRow.append(cellLike(headerRow.cells[lastColumn], COLUMN_TITLE));
  }

  for (const body of table.tBodies) {
    for (const row of body.rows) {
      // Section rows have one cell per column. Rows that already have our cell have one extra.
      if (row.cells.length === columns.length) addSectionCell(row, columns);
    }
  }
}

function addSectionCell(row: HTMLTableRowElement, columns: string[]) {
  const cellIn = (column: string) => row.cells[columns.indexOf(column)];
  const request: SectionRequest = {
    instructor: cellIn("Instructor").querySelector("span")?.textContent?.trim() ?? "",
    courseCode: `${cellIn("Subject").textContent!.trim()} ${cellIn("Course").textContent!.trim()}`,
  };

  const cell = cellLike(cellIn(LAST_COLUMN), "Loading...");
  row.append(cell);
  lookUpSection(request).then((summary) => fillCell(cell, describeSection(summary, request)));
}

// A new empty cell with the same look as `template`, so our column looks like it was always there.
function cellLike(template: HTMLTableCellElement, text: string) {
  const cell = template.cloneNode(false) as HTMLTableCellElement;
  cell.textContent = text;
  return cell;
}

function lookUpSection(request: SectionRequest): Promise<SectionSummary | null> {
  const key = `${request.instructor} ${request.courseCode}`;
  if (!summaries.has(key)) summaries.set(key, chrome.runtime.sendMessage(request));
  return summaries.get(key)!;
}

function describeSection(summary: SectionSummary | null, request: SectionRequest): CellText {
  if (summary === null) {
    return {
      title: "No data",
      detail: `Who teaches ${request.courseCode}?`,
      page: { type: "course", courseCode: request.courseCode },
    };
  }

  const rating = summary.rating === null ? "No RMP" : `RMP ${summary.rating.toFixed(1)}`;
  if (summary.courseCode === null) {
    return {
      title: rating,
      detail: "No history for this class",
      page: { type: "professor", professorName: summary.professorName },
    };
  }

  const median = summary.median === null ? "" : ` · Median ${summary.median}`;
  return {
    title: `${rating}${median}`,
    detail: `Last taught ${summary.lastTaught}`,
    page: { type: "class", professorName: summary.professorName, courseCode: summary.courseCode },
  };
}

function fillCell(cell: HTMLTableCellElement, text: CellText) {
  const button = document.createElement("button");
  Object.assign(button.style, {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "0",
    border: "none",
    background: "none",
    font: "inherit",
    textAlign: "left",
    whiteSpace: "nowrap",
    cursor: "pointer",
  });

  const title = document.createElement("span");
  title.textContent = text.title;
  Object.assign(title.style, { color: SITE_NAVY, fontWeight: "600", textDecoration: "underline" });

  const detail = document.createElement("span");
  detail.textContent = text.detail;
  Object.assign(detail.style, { color: "#555", fontSize: "0.9em" });

  button.append(title, detail);
  button.addEventListener("click", () => showInSidebar(text.page));
  cell.replaceChildren(button);
}
