import type { SidebarMessage } from "../page.ts";

// The sidebar is an iframe sitting on top of a web page (content/sidebar.ts made it).
// These ask that page to change the iframe. When the sidebar is opened on its own
// (like with npm run dev), there's no page to ask, so they do nothing.
const isOnAPage = window.parent !== window;

// Stretch the sidebar across the whole screen for Analytical Mode, or shrink it back.
export function setFullScreen(isFullScreen: boolean): Promise<void> {
  if (!isOnAPage) return Promise.resolve();

  return new Promise((resolve) => {
    // The iframe changing size is the sign that the page did it. Don't wait forever if it doesn't.
    window.addEventListener("resize", () => resolve(), { once: true });
    setTimeout(resolve, 500);
    tellPage({ rowdySearch: "fullScreen", isFullScreen });
  });
}

export function closeSidebar() {
  if (isOnAPage) tellPage({ rowdySearch: "close" });
}

function tellPage(message: SidebarMessage) {
  window.parent.postMessage(message, "*");
}
