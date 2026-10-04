// Banner's Register for Classes "Summary" table:
//   Title | Details ("CS 2113, 901") | Hours | CRN ("26006") | Schedule Type | Status | Action
// It doesn't show the instructor, so we ask Banner for it the same way Banner's own
// "Instructor/Meeting Times" tab does.
import type { Section } from "../page.ts";
import type { CellFinder } from "./searchColumn.ts";

export const BANNER_SUMMARY_COLUMNS = ["Title", "Details", "CRN"];

const FACULTY_URL = "/StudentRegistrationSsb/ssb/searchResults/getFacultyMeetingTimes";

// The part of Banner's answer we use.
type FacultyMeetingTimes = {
  fmt: { faculty: { displayName: string; primaryIndicator: boolean }[] }[];
};

export async function readBannerSection(cellUnder: CellFinder): Promise<Section> {
  // "CS 2113, 901" -> "CS 2113"
  const courseCode = cellUnder("Details").textContent!.split(",")[0].trim();
  const crn = cellUnder("CRN").textContent!.trim();
  // The title is a link that holds "term,CRN", like "202710,26006".
  const term = cellUnder("Title").querySelector("a")?.dataset.attributes?.split(",")[0] ?? "";

  return { instructor: await instructorOf(term, crn), courseCode };
}

// "Last, First" for the section's main instructor, or "" if Banner doesn't say.
async function instructorOf(term: string, crn: string): Promise<string> {
  try {
    const response = await fetch(`${FACULTY_URL}?term=${term}&courseReferenceNumber=${crn}`, {
      headers: { "X-Synchronizer-Token": synchronizerToken() },
    });
    const meetings: FacultyMeetingTimes = await response.json();

    const faculty = meetings.fmt.flatMap((meeting) => meeting.faculty);
    const mainInstructor = faculty.find((teacher) => teacher.primaryIndicator) ?? faculty[0];
    return mainInstructor?.displayName ?? "";
  } catch {
    // Without a name, the sidebar shows everyone who teaches the course instead.
    return "";
  }
}

// Banner puts this security token on the page and sends it with all of its own requests.
function synchronizerToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="synchronizerToken"]')?.content ?? "";
}
