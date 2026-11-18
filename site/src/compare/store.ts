import type { Subject } from "../../../src/page.ts";
import { buildSearchIndex, type SearchIndex } from "../../../src/searcher.ts";
import { readProfessors, type Professor, type RawData } from "../../../src/utils/gradeData.ts";
import { expandSlimIndex, type SlimIndex } from "../search/slimIndex.ts";

// The data behind Analytical Mode on the site.
//
// The extension hands its Analytical Mode every professor's full record. The site can't send
// 11 MB to a phone, so it starts with the search's slim index, which knows every professor and
// course but none of their grades, and fills in the real records as they're needed: adding a
// professor or course downloads the file for its subject (see groups.ts) and swaps the real
// courses in. The extension's own code then reads `professors` exactly as it does in the sidebar.

export type CompareStore = {
  professors: Record<string, Professor>; // everyone; a course has its real numbers once it's loaded
  searchIndex: SearchIndex;
  slugOf: (professorName: string) => string;
  nameOfSlug: (slug: string) => string | undefined;
  exists: (subject: Subject) => boolean; // a link can name a professor or course that isn't in the data
  isLoaded: (subject: Subject) => boolean; // its real numbers are here
  load: (subject: Subject) => Promise<void>; // downloads what it needs; fails if a download does
};

const subjectOf = (courseCode: string) => courseCode.split(" ")[0];

// A failed download tries again by itself twice, after 1 and then 3 seconds, before saying so.
const RETRY_DELAYS = [1000, 3000];

async function download<Data>(url: string): Promise<Data> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${url} answered ${response.status}`);
      return await response.json();
    } catch (error) {
      if (attempt === RETRY_DELAYS.length) throw error;
      console.warn(`RowdySearch: ${url} didn't load, trying again (${attempt + 1} of ${RETRY_DELAYS.length}).`, error);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
    }
  }
}

export async function createStore(indexUrl: string, fileOfSubject: Record<string, string>): Promise<CompareStore> {
  const { professors, slugs } = expandSlimIndex(await download<SlimIndex>(indexUrl));
  const searchIndex = buildSearchIndex(professors);
  const names = new Map([...slugs].map(([name, slug]) => [slug, name]));

  const courseCodes = new Set<string>();
  for (const professor of Object.values(professors)) for (const course of professor.courses) courseCodes.add(course.code);

  const loaded = new Set<string>(); // the files that have arrived
  const downloads = new Map<string, Promise<void>>(); // the ones on their way

  // Swaps each professor's stand-in courses for the real ones in a downloaded file.
  function fillIn(data: RawData) {
    for (const real of Object.values(readProfessors(data))) {
      const professor = professors[real.name];
      if (professor === undefined) continue;
      professor.rmp = real.rmp;
      professor.department = real.department;
      for (const course of real.courses) {
        const place = professor.courses.findIndex((standIn) => standIn.code === course.code);
        if (place !== -1) professor.courses[place] = course;
      }
    }
  }

  function loadFile(url: string): Promise<void> {
    if (!downloads.has(url)) {
      const arriving = download<RawData>(url).then((data) => {
        fillIn(data);
        loaded.add(url);
      });
      // Forget a download that failed, so trying again downloads it again.
      arriving.catch(() => downloads.delete(url));
      downloads.set(url, arriving);
    }
    return downloads.get(url)!;
  }

  // A professor needs every subject they've taught in. A course or a class needs only its own:
  // everyone who teaches the course is in that one file.
  function filesFor(subject: Subject): string[] {
    const subjects =
      subject.type === "professor"
        ? professors[subject.professorName].courses.map((course) => subjectOf(course.code))
        : [subjectOf(subject.courseCode)];
    return [...new Set(subjects.map((each) => fileOfSubject[each]))];
  }

  function exists(subject: Subject): boolean {
    if (subject.type === "course") return courseCodes.has(subject.courseCode);
    const professor = professors[subject.professorName];
    if (professor === undefined) return false;
    return subject.type === "professor" || professor.courses.some((course) => course.code === subject.courseCode);
  }

  return {
    professors,
    searchIndex,
    slugOf: (professorName) => slugs.get(professorName)!,
    nameOfSlug: (slug) => names.get(slug),
    exists,
    isLoaded: (subject) => filesFor(subject).every((url) => loaded.has(url)),
    load: (subject) => Promise.all(filesFor(subject).map(loadFile)).then(() => undefined),
  };
}
