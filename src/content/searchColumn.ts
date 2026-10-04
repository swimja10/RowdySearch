// Adds a "RowdySearch" column with a Search button on every row of a registration table.
// Each button opens that row's professor and class in the sidebar.
import type { Section } from "../page.ts";
import { showInSidebar } from "./sidebar.ts";

const COLUMN_TITLE = "RowdySearch";
const SITE_NAVY = "#0c2340"; // The registration sites' own button color

// Gets one of a row's cells by its column's title, like cellUnder("Instructor").
export type CellFinder = (columnTitle: string) => HTMLTableCellElement;

// Works out which section a row is from its cells. Each site's table needs its own.
export type SectionReader = (cellUnder: CellFinder) => Promise<Section>;

// Every table on the page whose header has all of these column titles.
export function tablesWithColumns(neededTitles: string[]): HTMLTableElement[] {
  return [...document.querySelectorAll("table")].filter((table) => {
    const titles = columnTitles(table);
    return neededTitles.every((title) => titles.includes(title));
  });
}

export function addSearchColumn(table: HTMLTableElement, readSection: SectionReader) {
  const headerRow = table.tHead!.rows[0];
  const titles = columnTitles(table);
  // Our cells copy the look of the last column that has a title.
  const styleColumn = titles.findLastIndex((title) => title !== "");

  if (headerRow.cells.length === titles.length) {
    headerRow.append(cellLike(headerRow.cells[styleColumn], COLUMN_TITLE));
  }

  for (const body of table.tBodies) {
    for (const row of body.rows) {
      // Course rows have one cell per column. Once they get our cell, they have one extra.
      if (row.cells.length === titles.length) addSearchButton(row, titles, styleColumn, readSection);
      else stretchAcrossTable(row, titles.length + 1);
    }
  }
}

// The table's column titles, not counting our own column.
function columnTitles(table: HTMLTableElement): string[] {
  const headerRow = table.tHead?.rows[0];
  if (!headerRow) return [];

  return [...headerRow.cells]
    .map((cell) => cell.textContent!.trim())
    .filter((title) => title !== COLUMN_TITLE);
}

function addSearchButton(row: HTMLTableRowElement, titles: string[], styleColumn: number, readSection: SectionReader) {
  const cellUnder: CellFinder = (columnTitle) => row.cells[titles.indexOf(columnTitle)];

  const button = createSearchButton();
  button.addEventListener("click", async () => showInSidebar(await readSection(cellUnder)));

  const cell = cellLike(row.cells[styleColumn], "");
  cell.append(button);
  row.append(cell);
}

// Rows like "Title: Calculus I" span the whole table. Widen them to cover our column too.
function stretchAcrossTable(row: HTMLTableRowElement, columnCount: number) {
  let columnsCovered = 0;
  for (const cell of row.cells) columnsCovered += cell.colSpan;

  const lastCell = row.cells[row.cells.length - 1];
  if (lastCell && columnsCovered < columnCount) lastCell.colSpan += columnCount - columnsCovered;
}

// A new cell with the same CSS classes as `template`, so our column fits in with the site's.
function cellLike(template: HTMLTableCellElement, text: string) {
  const cell = document.createElement(template.tagName.toLowerCase()) as HTMLTableCellElement;
  cell.className = template.className;
  cell.textContent = text;
  return cell;
}

function createSearchButton() {
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
  return button;
}
