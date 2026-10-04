// The RowdySearch sidebar on top of a web page, and the "Lookup" tab that opens it.
//
// The sidebar lives in an iframe so the site's CSS can't break our Tailwind styles,
// and our styles can't break the site. Tailwind classes don't exist on these pages,
// so the tab is styled by hand here.
import type { Section, SidebarMessage, ToolbarMessage } from "../page.ts";

const SIDEBAR_URL = chrome.runtime.getURL("dist/index.html");
const SIDEBAR_WIDTH = "420px";
const SIDEBAR_SHADOW = "-4px 0 16px rgba(0, 0, 0, 0.4)";
const ON_TOP_OF_EVERYTHING = "2147483647";

const sidebar = createSidebar();
const lookupTab = createLookupTab();

export function addSidebar() {
  lookupTab.addEventListener("click", toggleSidebar);
  window.addEventListener("message", handleSidebarMessage);
  chrome.runtime.onMessage.addListener(handleToolbarMessage);
  document.body.append(sidebar, lookupTab);
}

// Opens the sidebar straight to one section's professor and class.
export function showInSidebar(section: Section) {
  // The sidebar reads the section from the part of its address after "#".
  sidebar.src = `${SIDEBAR_URL}#${encodeURIComponent(JSON.stringify(section))}`;
  setSidebarOpen(true);
}

function toggleSidebar() {
  // The sidebar loads every professor's data, so it isn't loaded until it's first opened.
  if (sidebar.src === "") sidebar.src = SIDEBAR_URL;
  setSidebarOpen(sidebar.style.display === "none");
}

function setSidebarOpen(isOpen: boolean) {
  sidebar.style.display = isOpen ? "block" : "none";
  lookupTab.style.right = isOpen ? SIDEBAR_WIDTH : "0";
  lookupTab.textContent = isOpen ? "Close" : "Lookup";
}

// The sidebar asks to cover the whole screen for Analytical Mode, to shrink back, or to close
// (see utils/hostPage.ts). Only messages from our own sidebar count.
function handleSidebarMessage(event: MessageEvent<SidebarMessage>) {
  if (event.source !== sidebar.contentWindow) return;

  const message = event.data;
  if (message?.rowdySearch === "fullScreen") setFullScreen(message.isFullScreen);
  if (message?.rowdySearch === "close") setSidebarOpen(false);
}

// Clicking RowdySearch's icon in Chrome's toolbar opens or closes the sidebar (see background.ts).
function handleToolbarMessage(message: ToolbarMessage, _sender: unknown, sendResponse: (reply: string) => void) {
  if (message !== "toggleSidebar") return;

  toggleSidebar();
  // Answering tells the toolbar this page already has the sidebar, so it doesn't add another.
  sendResponse("done");
}

function setFullScreen(isFullScreen: boolean) {
  sidebar.style.width = isFullScreen ? "100vw" : SIDEBAR_WIDTH;
  // Analytical Mode draws its own panel, and the page shows through around it while it grows.
  sidebar.style.boxShadow = isFullScreen ? "none" : SIDEBAR_SHADOW;
  lookupTab.style.display = isFullScreen ? "none" : "block";
}

function createSidebar() {
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    display: "none",
    position: "fixed",
    top: "0",
    right: "0",
    width: SIDEBAR_WIDTH,
    height: "100vh",
    border: "none",
    boxShadow: SIDEBAR_SHADOW,
    zIndex: ON_TOP_OF_EVERYTHING,
  });
  return iframe;
}

function createLookupTab() {
  const button = document.createElement("button");
  button.textContent = "Lookup";
  Object.assign(button.style, {
    position: "fixed",
    top: "50%",
    right: "0",
    transform: "translateY(-50%)",
    writingMode: "vertical-rl",
    padding: "16px 8px",
    border: "none",
    borderRadius: "8px 0 0 8px",
    background: "#ea580c", // Tailwind's orange-600, same as the sidebar's buttons
    color: "white",
    font: "600 14px system-ui, sans-serif",
    letterSpacing: "1px",
    cursor: "pointer",
    zIndex: ON_TOP_OF_EVERYTHING,
  });
  return button;
}
