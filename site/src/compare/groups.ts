import { createHash } from "node:crypto";
import { subjectOf } from "../data/addresses.ts";
import { loadData } from "../data/professors.ts";
import type { RawData } from "../data/shared.ts";

// The data Analytical Mode downloads. The full data is 11 MB, far too much to send to a phone to
// compare two professors. So it's cut into files by subject: comparing MAT 1213's professors only
// downloads the file MAT is in.
//
// Each file is a piece of data/professors.json in the same shape, holding only the courses in its
// subjects. A professor who teaches in two subjects is in both files, with their ratings in each.
// Subjects are packed in alphabetical order into files of about TARGET_SIZE, because Cloudflare's
// free plan limits how many files the site can have (see "File budget" in docs/website-plan.md).

const TARGET_SIZE = 300_000; // characters of JSON, before compression

export type CompareFile = {
  name: string; // "07.3f9a1c0b7e", the file's name without ".json"
  url: string; // "/compare-data/07.3f9a1c0b7e.json"
  subjects: string[];
  json: string;
};

type CompareFiles = {
  files: CompareFile[];
  fileOfSubject: Record<string, string>; // "MAT" -> the address of the file it's in
};

let built: CompareFiles | undefined;

export function compareFiles(): CompareFiles {
  if (built !== undefined) return built;

  // Every subject's piece of the data.
  const bySubject = new Map<string, RawData>();
  for (const [name, professor] of Object.entries(loadData().raw)) {
    for (const [code, course] of Object.entries(professor.courses)) {
      const subject = subjectOf(code);
      if (!bySubject.has(subject)) bySubject.set(subject, {});
      const piece = bySubject.get(subject)!;
      piece[name] ??= { department: professor.department, courses: {}, rmp: professor.rmp };
      piece[name].courses[code] = course;
    }
  }

  // Pack them, in alphabetical order, into files of about TARGET_SIZE.
  const packs: { subjects: string[]; size: number }[] = [];
  for (const subject of [...bySubject.keys()].sort()) {
    const size = JSON.stringify(bySubject.get(subject)).length;
    const current = packs.at(-1);
    if (current === undefined || current.size + size > TARGET_SIZE) packs.push({ subjects: [subject], size });
    else {
      current.subjects.push(subject);
      current.size += size;
    }
  }

  const files = packs.map(({ subjects }, number): CompareFile => {
    const data: RawData = {};
    for (const subject of subjects) {
      for (const [name, professor] of Object.entries(bySubject.get(subject)!)) {
        data[name] ??= { department: professor.department, courses: {}, rmp: professor.rmp };
        Object.assign(data[name].courses, professor.courses);
      }
    }
    const json = JSON.stringify(data);
    const fingerprint = createHash("sha256").update(json).digest("hex").slice(0, 10);
    const name = `${String(number + 1).padStart(2, "0")}.${fingerprint}`;
    return { name, url: `/compare-data/${name}.json`, subjects, json };
  });

  const fileOfSubject: Record<string, string> = {};
  for (const file of files) for (const subject of file.subjects) fileOfSubject[subject] = file.url;

  built = { files, fileOfSubject };
  return built;
}
