// Runs in the background for the whole extension (see "background" in manifest.json).
import type { ToolbarMessage } from "./page.ts";

const TOGGLE_SIDEBAR: ToolbarMessage = "toggleSidebar";

// Clicking the RowdySearch icon in Chrome's toolbar opens (or closes) the sidebar on the
// current page: the same sidebar the registration sites have, on any website.
chrome.action.onClicked.addListener((tab) => {
  if (tab.id !== undefined) toggleSidebarIn(tab.id);
});

async function toggleSidebarIn(tabId: number) {
  try {
    // The registration sites already run the sidebar's script (content.js), so just ask it.
    await chrome.tabs.sendMessage(tabId, TOGGLE_SIDEBAR);
  } catch {
    // Any other page doesn't have it yet. Add it, then open it. ("activeTab" in manifest.json
    // allows this for the tab whose icon was clicked. Chrome's own chrome:// pages never allow it.)
    await chrome.scripting.executeScript({ target: { tabId }, files: ["dist/content.js"] });
    await chrome.tabs.sendMessage(tabId, TOGGLE_SIDEBAR);
  }
}
