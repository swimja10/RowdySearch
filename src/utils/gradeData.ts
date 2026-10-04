import { GRADES, emptyGradeCounts, type Grade, type GradeCounts } from "./grades.ts";

// "MAT 1213 - Calculus I (Fall 2025)" -> course "MAT 1213", title "Calculus I", semester "Fall 2025"
export const CLASS_KEY = /^(.+?) - (.+) \((\w+ \d{4})\)$/;

// The shape of data/cleaned_grade_data.json, exactly as combine_data.py writes it.
export type RawGradeData = Record<string, RawProfessor>;

export type RawProfessor = {
  Department: string;
  RMP: RawRmp;
  [classKey: string]: RawClass | RawRmp | string;
};

type RawClass = {
  Semester: string;
  Sections: string[];
  Syllabus: Record<string, string>;
} & Record<Grade, number | null>;

type RawRmp = {
  "Professor rating": number | null;
  "Difficulty level": number | null;
  "Number of ratings": number | null;
  "Would take again %": number | null;
  Link: string | null;
  "5 reviews": Record<string, string | null>;
};

// The easier-to-use shape the sidebar works with.
export type Professor = {
  name: string;
  department: string;
  rmp: Rmp;
  classes: ClassOffering[];
};

export type Rmp = {
  rating: number | null;
  difficulty: number | null;
  ratingCount: number;
  wouldTakeAgainPercent: number | null;
  link: string | null;
  reviews: string[];
};

export type ClassOffering = {
  courseCode: string;
  title: string;
  semester: string;
  syllabi: Syllabus[];
  grades: GradeCounts;
};

export type Syllabus = { section: string; link: string };

// Sections without a named instructor are filed under these names. They aren't real
// professors (and have no grades), so they're left out of search results and course pages.
const PLACEHOLDER_NAMES = ["(No instructor listed)", "Unknown"];

export function withoutPlaceholderNames(rawData: RawGradeData): RawGradeData {
  const realProfessors: RawGradeData = {};
  for (const [name, rawProfessor] of Object.entries(rawData)) {
    if (!PLACEHOLDER_NAMES.includes(name)) realProfessors[name] = rawProfessor;
  }
  return realProfessors;
}

export function readProfessors(rawData: RawGradeData): Record<string, Professor> {
  const professors: Record<string, Professor> = {};
  for (const [name, rawProfessor] of Object.entries(rawData)) {
    professors[name] = readProfessor(name, rawProfessor);
  }
  return professors;
}

function readProfessor(name: string, rawProfessor: RawProfessor): Professor {
  return {
    name,
    department: rawProfessor.Department,
    rmp: readRmp(rawProfessor.RMP),
    classes: readClasses(rawProfessor),
  };
}

function readRmp(rawRmp: RawRmp): Rmp {
  return {
    rating: rawRmp["Professor rating"],
    difficulty: rawRmp["Difficulty level"],
    ratingCount: rawRmp["Number of ratings"] ?? 0,
    wouldTakeAgainPercent: rawRmp["Would take again %"],
    link: rawRmp.Link,
    reviews: Object.values(rawRmp["5 reviews"]).filter((review) => review !== null),
  };
}

function readClasses(rawProfessor: RawProfessor): ClassOffering[] {
  const classes: ClassOffering[] = [];
  for (const [classKey, rawClass] of Object.entries(rawProfessor)) {
    if (CLASS_KEY.test(classKey)) classes.push(readClass(classKey, rawClass as RawClass));
  }
  return classes;
}

function readClass(classKey: string, rawClass: RawClass): ClassOffering {
  const [, courseCode, title, semester] = classKey.match(CLASS_KEY)!;
  return {
    courseCode,
    title,
    semester,
    syllabi: Object.entries(rawClass.Syllabus).map(([section, link]) => ({ section, link })),
    grades: readGradeCounts(rawClass),
  };
}

// Classes that only have a syllabus (no grades yet) count as zero students.
function readGradeCounts(rawClass: RawClass): GradeCounts {
  const counts = emptyGradeCounts();
  for (const grade of GRADES) counts[grade] = rawClass[grade] ?? 0;
  return counts;
}
