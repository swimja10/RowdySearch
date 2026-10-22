import { GRADES, addGrades, emptyGradeCounts, type Grade, type GradeCounts } from "./grades.ts";
import { rmpLink, syllabusLink } from "./links.ts";
import { semesterRank } from "./semesters.ts";
import { average } from "./statistics.ts";

// The shape of data/professors.json, exactly as combine_data.py writes it.
export type RawData = Record<string, RawProfessor>;

type RawProfessor = {
  courses: Record<string, RawCourse>; // "MAT 1213" -> that course
  rmp: RawRmpProfile[]; // usually one, none when they aren't on RMP, two when RMP has a duplicate
};

type RawCourse = {
  courseName: string; // its name in the newest semester they taught it
  semesters: Record<string, RawSection[]>; // "Fall 2025" -> the sections they taught that semester
};

type RawSection = {
  section: string;
  title: string; // what this section was listed as: an older name, or its topic in a topics course
  syllabusCode: string | null;
  grades: Partial<Record<Grade, number>> | null; // grades nobody got are left out
  instructorEvaluation: number | null; // Bluebook, out of 5
  courseEvaluation: number | null; // Bluebook, out of 5
};

type RawRmpProfile = {
  rmpId: number;
  department: string;
  avgRating: number;
  avgDifficulty: number;
  wouldTakeAgainPercent: number | null;
  recentReviews: Review[];
};

// The easier-to-use shape the sidebar works with.
export type Professor = {
  name: string;
  department: string | null; // from Rate My Professors, so null when they aren't on it
  rmp: Rmp;
  courses: Course[]; // the course they taught most recently first
};

// Every semester a professor taught one course, newest semester first.
export type Course = {
  code: string;
  title: string; // its name the last time this professor taught it
  offerings: ClassOffering[];
};

export type ClassOffering = {
  semester: string;
  titles: string[]; // what its sections were listed as, usually just the course's name
  syllabi: Syllabus[];
  evaluations: Evaluation[]; // one for each section Bluebook has results for
  grades: GradeCounts; // every section's grades added up
};

export type Syllabus = { section: string; link: string };

// One section's results on Bluebook, UTSA's end-of-semester course evaluations. Each is out of 5.
export type Evaluation = { instructor: number; course: number };

export type Rmp = {
  rating: number | null;
  difficulty: number | null;
  wouldTakeAgainPercent: number | null;
  profiles: RmpProfile[];
  reviews: Review[];
};

export type RmpProfile = { department: string; link: string };

export type Review = {
  course: string; // the way RMP writes it, like "MAT1213"
  comment: string;
};

export function readProfessors(rawData: RawData): Record<string, Professor> {
  const professors: Record<string, Professor> = {};
  for (const [name, rawProfessor] of Object.entries(rawData)) {
    professors[name] = readProfessor(name, rawProfessor);
  }
  return professors;
}

function readProfessor(name: string, rawProfessor: RawProfessor): Professor {
  const courses = Object.entries(rawProfessor.courses).map(([code, rawCourse]) => readCourse(code, rawCourse));

  return {
    name,
    department: rawProfessor.rmp[0]?.department ?? null,
    rmp: readRmp(rawProfessor.rmp),
    courses: courses.sort((first, second) => lastTaughtRank(second) - lastTaughtRank(first)),
  };
}

function readCourse(code: string, rawCourse: RawCourse): Course {
  const offerings = Object.entries(rawCourse.semesters).map(([semester, sections]) => readOffering(semester, sections));

  return {
    code,
    title: rawCourse.courseName,
    offerings: offerings.sort((first, second) => semesterRank(second.semester) - semesterRank(first.semester)),
  };
}

function lastTaughtRank(course: Course): number {
  return semesterRank(course.offerings[0].semester);
}

function readOffering(semester: string, sections: RawSection[]): ClassOffering {
  return {
    semester,
    titles: [...new Set(sections.map((section) => section.title))],
    syllabi: sections.flatMap(readSyllabus),
    evaluations: sections.flatMap(readEvaluation),
    grades: addGrades(sections.map(readGradeCounts)),
  };
}

function readSyllabus({ section, syllabusCode }: RawSection): Syllabus[] {
  return syllabusCode === null ? [] : [{ section, link: syllabusLink(syllabusCode) }];
}

function readEvaluation({ instructorEvaluation, courseEvaluation }: RawSection): Evaluation[] {
  if (instructorEvaluation === null || courseEvaluation === null) return [];
  return [{ instructor: instructorEvaluation, course: courseEvaluation }];
}

// Sections that only have a syllabus (no grades yet) count as zero students.
function readGradeCounts(section: RawSection): GradeCounts {
  const counts = emptyGradeCounts();
  for (const grade of GRADES) counts[grade] = section.grades?.[grade] ?? 0;
  return counts;
}

// A professor with two RMP profiles gets both profiles' reviews and the average of their numbers.
// RMP doesn't say how many ratings each profile has, so they count the same.
function readRmp(profiles: RawRmpProfile[]): Rmp {
  const wouldTakeAgainPercents = profiles.map((profile) => profile.wouldTakeAgainPercent).filter((percent) => percent !== null);

  return {
    rating: average(profiles.map((profile) => profile.avgRating)),
    difficulty: average(profiles.map((profile) => profile.avgDifficulty)),
    wouldTakeAgainPercent: average(wouldTakeAgainPercents),
    profiles: profiles.map((profile) => ({ department: profile.department, link: rmpLink(profile.rmpId) })),
    reviews: profiles.flatMap((profile) => profile.recentReviews),
  };
}
