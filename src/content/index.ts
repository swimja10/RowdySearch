// Runs on the registration sites listed under "content_scripts" in manifest.json.
import { watchForSectionTables } from "./sectionColumn.ts";
import { addLookupTab } from "./sidebar.ts";

addLookupTab();
watchForSectionTables();
