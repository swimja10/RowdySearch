// Adds a "RowdySearch" column after "Parts of Term" in Schedule Planner's section tables.
// Each section gets a Search button that opens its professor's class in the sidebar.
import type { Section } from "../page.ts";
import { showInSidebar } from "./sidebar.ts";

const COLUMN_TITLE = "RowdySearch";
const LAST_COLUMN = "Parts of Term";
const SITE_NAVY = "#0c2340"; // Schedule Planner's own button color

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

  if (headerRow.cells.length === columns.length) {
    headerRow.append(cellLike(headerRow.cells[columns.indexOf(LAST_COLUMN)], COLUMN_TITLE));
  }

  for (const body of table.tBodies) {
    for (const row of body.rows) {
      // Section rows have one cell per column. Once they get our cell, they have one extra.
      if (row.cells.length === columns.length) addSearchButton(row, columns);
      else stretchAcrossTable(row, columns.length + 1);
    }
  }
}

function addSearchButton(row: HTMLTableRowElement, columns: string[]) {
  const cellIn = (column: string) => row.cells[columns.indexOf(column)];
  const section: Section = {
    instructor: cellIn("Instructor").querySelector("span")?.textContent?.trim() ?? "",
    courseCode: `${cellIn("Subject").textContent!.trim()} ${cellIn("Course").textContent!.trim()}`,
  };

  const cell = cellLike(cellIn(LAST_COLUMN), "");
  cell.append(createSearchButton(section));
  row.append(cell);
}

// Rows like "Title: Calculus I" span the whole table. Widen them to cover our column too.
function stretchAcrossTable(row: HTMLTableRowElement, columnCount: number) {
  let columnsCovered = 0;
  for (const cell of row.cells) columnsCovered += cell.colSpan;

  const lastCell = row.cells[row.cells.length - 1];
  if (lastCell && columnsCovered < columnCount) lastCell.colSpan += columnCount - columnsCovered;
}

// A new cell with the same look as `template`, so our column looks like it was always there.
function cellLike(template: HTMLTableCellElement, text: string) {
  const cell = template.cloneNode(false) as HTMLTableCellElement;
  cell.textContent = text;
  return cell;
}

function createSearchButton(section: Section) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Search";
  Object.assign(button.style, {
    padding: "4px 12px",
    border: "none",
    borderRadius: "4px",
    background: SITE_NAVY,
    color: "white",
    font: "inherit",
    cursor: "pointer",
  });
  button.addEventListener("click", () => showInSidebar(section));
  return button;
}
