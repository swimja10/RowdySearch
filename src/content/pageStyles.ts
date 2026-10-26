// The few styles RowdySearch adds to the pages it runs on, which can't use the sidebar's Tailwind classes.
export const SEARCH_BUTTON_CLASS = "rowdysearch-search-button";
export const TAB_CLASS = "rowdysearch-tab";

// Hovering one of our buttons brightens it, and pressing it brightens it all the way. (!important wins
// over the buttons' own inline colors.) Banner shows a tooltip copy of whatever is in a table cell you
// hover, which in a Search button's cell is just a second Search button, so those tooltips stay hidden.
const STYLES = `
  .${SEARCH_BUTTON_CLASS}:hover { background: #1b3a63 !important; }
  .${SEARCH_BUTTON_CLASS}:active { background: #2a5288 !important; }
  .${TAB_CLASS}:hover { background: #f97316 !important; }
  .${TAB_CLASS}:active { background: #fb923c !important; }
  [role="tooltip"]:has(.${SEARCH_BUTTON_CLASS}) { display: none !important; }
`;

export function addPageStyles() {
  const style = document.createElement("style");
  style.textContent = STYLES;
  document.head.append(style);
}
