//#region src/background.ts
var TOGGLE_SIDEBAR = "toggleSidebar";
chrome.action.onClicked.addListener((tab) => {
	if (tab.id !== void 0) toggleSidebarIn(tab.id);
});
async function toggleSidebarIn(tabId) {
	try {
		await chrome.tabs.sendMessage(tabId, TOGGLE_SIDEBAR);
	} catch {
		await chrome.scripting.executeScript({
			target: { tabId },
			files: ["dist/content.js"]
		});
		await chrome.tabs.sendMessage(tabId, TOGGLE_SIDEBAR);
	}
}
//#endregion
