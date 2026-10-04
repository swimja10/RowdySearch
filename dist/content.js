//#region src/content/bannerSummary.ts
var BANNER_SUMMARY_COLUMNS = [
	"Title",
	"Details",
	"CRN"
];
var FACULTY_URL = "/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes";
async function readBannerSection(cellUnder) {
	const courseCode = cellUnder("Details").textContent.split(",")[0].trim();
	const crn = cellUnder("CRN").textContent.trim();
	return {
		instructor: await instructorOf(cellUnder("Title").querySelector("a")?.dataset.attributes?.split(",")[0] ?? "", crn),
		courseCode
	};
}
async function instructorOf(term, crn) {
	try {
		const faculty = (await (await fetch(`${FACULTY_URL}?term=${term}&courseReferenceNumber=${crn}`, { headers: { "X-Synchronizer-Token": synchronizerToken() } })).json()).fmt.flatMap((meeting) => meeting.faculty);
		return (faculty.find((teacher) => teacher.primaryIndicator) ?? faculty[0])?.displayName ?? "";
	} catch {
		return "";
	}
}
function synchronizerToken() {
	return document.querySelector("meta[name=\"synchronizerToken\"]")?.content ?? "";
}
//#endregion
//#region src/content/schedulePlanner.ts
var SCHEDULE_PLANNER_COLUMNS = [
	"Subject",
	"Course",
	"Instructor"
];
async function readSchedulePlannerSection(cellUnder) {
	const instructorCell = cellUnder("Instructor");
	return {
		instructor: (instructorCell.querySelector("span") ?? instructorCell).textContent.trim(),
		courseCode: `${cellUnder("Subject").textContent.trim()} ${cellUnder("Course").textContent.trim()}`
	};
}
//#endregion
//#region src/content/sidebar.ts
var SIDEBAR_URL = chrome.runtime.getURL("dist/index.html");
var SIDEBAR_WIDTH = "420px";
var SIDEBAR_SHADOW = "-4px 0 16px rgba(0, 0, 0, 0.4)";
var ON_TOP_OF_EVERYTHING = "2147483647";
var sidebar = createSidebar();
var lookupTab = createLookupTab();
function addSidebar() {
	lookupTab.addEventListener("click", toggleSidebar);
	window.addEventListener("message", handleSidebarMessage);
	chrome.runtime.onMessage.addListener(handleToolbarMessage);
	document.body.append(sidebar, lookupTab);
}
function showInSidebar(section) {
	sidebar.src = `${SIDEBAR_URL}#${encodeURIComponent(JSON.stringify(section))}`;
	setSidebarOpen(true);
}
function toggleSidebar() {
	if (sidebar.src === "") sidebar.src = SIDEBAR_URL;
	setSidebarOpen(sidebar.style.display === "none");
}
function setSidebarOpen(isOpen) {
	sidebar.style.display = isOpen ? "block" : "none";
	lookupTab.style.right = isOpen ? SIDEBAR_WIDTH : "0";
	lookupTab.textContent = isOpen ? "Close" : "Lookup";
}
function handleSidebarMessage(event) {
	if (event.source !== sidebar.contentWindow) return;
	const message = event.data;
	if (message?.rowdySearch === "fullScreen") setFullScreen(message.isFullScreen);
	if (message?.rowdySearch === "close") setSidebarOpen(false);
}
function handleToolbarMessage(message, _sender, sendResponse) {
	if (message !== "toggleSidebar") return;
	toggleSidebar();
	sendResponse("done");
}
function setFullScreen(isFullScreen) {
	sidebar.style.width = isFullScreen ? "100vw" : SIDEBAR_WIDTH;
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
		zIndex: ON_TOP_OF_EVERYTHING
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
		background: "#ea580c",
		color: "white",
		font: "600 14px system-ui, sans-serif",
		letterSpacing: "1px",
		cursor: "pointer",
		zIndex: ON_TOP_OF_EVERYTHING
	});
	return button;
}
//#endregion
//#region src/content/searchColumn.ts
var COLUMN_TITLE = "RowdySearch";
var SITE_NAVY = "#0c2340";
function tablesWithColumns(neededTitles) {
	return [...document.querySelectorAll("table")].filter((table) => {
		const titles = columnTitles(table);
		return neededTitles.every((title) => titles.includes(title));
	});
}
function addSearchColumn(table, readSection) {
	const headerRow = table.tHead.rows[0];
	const titles = columnTitles(table);
	const styleColumn = titles.findLastIndex((title) => title !== "");
	if (headerRow.cells.length === titles.length) headerRow.append(cellLike(headerRow.cells[styleColumn], COLUMN_TITLE));
	for (const body of table.tBodies) for (const row of body.rows) if (row.cells.length === titles.length) addSearchButton(row, titles, styleColumn, readSection);
	else stretchAcrossTable(row, titles.length + 1);
}
function columnTitles(table) {
	const headerRow = table.tHead?.rows[0];
	if (!headerRow) return [];
	return [...headerRow.cells].map((cell) => cell.textContent.trim()).filter((title) => title !== COLUMN_TITLE);
}
function addSearchButton(row, titles, styleColumn, readSection) {
	const cellUnder = (columnTitle) => row.cells[titles.indexOf(columnTitle)];
	const button = createSearchButton();
	button.addEventListener("click", async () => showInSidebar(await readSection(cellUnder)));
	const cell = cellLike(row.cells[styleColumn], "");
	cell.append(button);
	row.append(cell);
}
function stretchAcrossTable(row, columnCount) {
	let columnsCovered = 0;
	for (const cell of row.cells) columnsCovered += cell.colSpan;
	const lastCell = row.cells[row.cells.length - 1];
	if (lastCell && columnsCovered < columnCount) lastCell.colSpan += columnCount - columnsCovered;
}
function cellLike(template, text) {
	const cell = document.createElement(template.tagName.toLowerCase());
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
		cursor: "pointer"
	});
	return button;
}
//#endregion
//#region src/content/index.ts
var SEARCHABLE_TABLES = [{
	columns: SCHEDULE_PLANNER_COLUMNS,
	readSection: readSchedulePlannerSection
}, {
	columns: BANNER_SUMMARY_COLUMNS,
	readSection: readBannerSection
}];
addSidebar();
addSearchColumns();
new MutationObserver(addSearchColumns).observe(document.body, {
	childList: true,
	subtree: true
});
function addSearchColumns() {
	for (const { columns, readSection } of SEARCHABLE_TABLES) for (const table of tablesWithColumns(columns)) addSearchColumn(table, readSection);
}
//#endregion
