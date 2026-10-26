// Adds a "RowdySearch" column with a Search button on every row of a registration table.
// Each button opens that row's professor and class in the sidebar.
import type { Section } from "../page.ts";
import { SEARCH_BUTTON_CLASS } from "./pageStyles.ts";
import { showInSidebar } from "./sidebar.ts";

const COLUMN_TITLE = "RowdySearch";
const SITE_NAVY = "#0c2340"; // The registration sites' own button color

// Gets one of a row's cells by its column's title, like cellUnder("Instructor").
export type CellFinder = (columnTitle: string) => HTMLTableCellElement;

// Works out which section a row is from its cells. Each site's table needs its own.
export type SectionReader = (cellUnder: CellFinder) => Promise<Section>;

// A kind of table that gets Search buttons.
export type SearchableTable = {
  columns: string[]; // column titles that tell this kind of table apart from the rest
  readSection: SectionReader;
  // One of the site's own columns to put the buttons in, renamed RowdySearch, for tables with no
  // room for another column. Without one, the buttons get a new column at the end of the table.
  takeOverColumn?: string;
};

// Every table on the page whose header has all of these column titles.
export function tablesWithColumns(neededTitles: string[]): HTMLTableElement[] {
  return [...document.querySelectorAll("table")].filter((table) => {
    const titles = columnTitles(table);
    return neededTitles.every((title) => titles.includes(title));
  });
}

export function addSearchButtons(table: HTMLTableElement, { readSection, takeOverColumn }: SearchableTable) {
  if (takeOverColumn === undefined) addColumn(table, readSection);
  else fillColumn(table, takeOverColumn, readSection);
}

// Adds a RowdySearch column at the end of the table.
function addColumn(table: HTMLTableElement, readSection: SectionReader) {
  const headerRow = table.tHead!.rows[0];
  const titles = columnTitles(table).filter((title) => title !== COLUMN_TITLE);
  // Our cells copy the look of the last column that has a title.
  const styleColumn = titles.findLastIndex((title) => title !== "");

  if (headerRow.cells.length === titles.length) {
    headerRow.append(cellLike(headerRow.cells[styleColumn], COLUMN_TITLE));
  }

  for (const body of table.tBodies) {
    for (const row of body.rows) {
      // Course rows have one cell per column. Once they get our cell, they have one extra.
      if (row.cells.length === titles.length) {
        const cell = cellLike(row.cells[styleColumn], "");
        cell.append(searchButton(row, titles, readSection));
        row.append(cell);
      } else {
        stretchAcrossTable(row, titles.length + 1);
      }
    }
  }
}

// Puts the buttons in one of the site's own columns and renames it RowdySearch. Whatever the site
// keeps in that column stays there, under the button.
function fillColumn(table: HTMLTableElement, takenTitle: string, readSection: SectionReader) {
  const titles = columnTitles(table);
  const column = titles.findIndex((title) => title === takenTitle || title === COLUMN_TITLE);
  if (column === -1) return;

  retitle(table.tHead!.rows[0].cells[column], takenTitle, COLUMN_TITLE);

  for (const body of table.tBodies) {
    for (const row of body.rows) {
      const cell = row.cells[column];
      if (row.cells.length === titles.length && !cell.querySelector(`.${SEARCH_BUTTON_CLASS}`)) {
        cell.prepend(searchButton(row, titles, readSection));
      }
    }
  }
}

// The table's column titles, in order.
function columnTitles(table: HTMLTableElement): string[] {
  const headerRow = table.tHead?.rows[0];
  if (!headerRow) return [];

  return [...headerRow.cells].map((cell) => cell.textContent!.trim());
}

function searchButton(row: HTMLTableRowElement, titles: string[], readSection: SectionReader) {
  const cellUnder: CellFinder = (columnTitle) => row.cells[titles.indexOf(columnTitle)];

  const button = createSearchButton();
  button.addEventListener("click", async () => showInSidebar(await readSection(cellUnder)));
  return button;
}

// Changes a header cell's title, leaving the rest of the cell (like Banner's resize handle) alone.
function retitle(headerCell: HTMLTableCellElement, from: string, to: string) {
  const texts = document.createTreeWalker(headerCell, NodeFilter.SHOW_TEXT);
  while (texts.nextNode()) {
    const text = texts.currentNode;
    if (text.textContent!.trim() !== from) continue;

    text.textContent = to;
    // Banner shows the title as a tooltip too.
    if (text.parentElement?.title === from) text.parentElement.title = to;
  }
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
  button.className = SEARCH_BUTTON_CLASS;
  Object.assign(button.style, {
    padding: "4px 12px",
    border: "none",
    borderRadius: "4px",
    background: SITE_NAVY,
    color: "white",
    font: "inherit",
    cursor: "pointer",
    transition: "background-color 0.15s",
  });
  return button;
}
