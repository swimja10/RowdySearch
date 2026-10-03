// Letter grades from best to worst. The median walks down this list.
export const LETTER_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"] as const;
export const GRADES = [...LETTER_GRADES, "W", "IN", "IW", "IF"] as const;

export type LetterGrade = (typeof LETTER_GRADES)[number];
export type Grade = (typeof GRADES)[number];
export type GradeCounts = Record<Grade, number>;

const GRADE_GROUPS: { label: string; grades: Grade[] }[] = [
  { label: "A", grades: ["A+", "A", "A-"] },
  { label: "B", grades: ["B+", "B", "B-"] },
  { label: "C", grades: ["C+", "C", "C-"] },
  { label: "D", grades: ["D+", "D", "D-"] },
  { label: "F", grades: ["F"] },
  { label: "W", grades: ["W"] },
];

export function emptyGradeCounts(): GradeCounts {
  const counts = {} as GradeCounts;
  for (const grade of GRADES) counts[grade] = 0;
  return counts;
}

export function addGrades(gradeCountsList: GradeCounts[]): GradeCounts {
  const total = emptyGradeCounts();
  for (const counts of gradeCountsList) {
    for (const grade of GRADES) total[grade] += counts[grade];
  }
  return total;
}

// The letter grade the middle student got, or null when nobody has a letter grade yet.
export function medianGrade(counts: GradeCounts): LetterGrade | null {
  const middleStudent = Math.ceil(countStudents(counts, LETTER_GRADES) / 2);
  if (middleStudent === 0) return null;

  let studentsCounted = 0;
  for (const grade of LETTER_GRADES) {
    studentsCounted += counts[grade];
    if (studentsCounted >= middleStudent) return grade;
  }
  return null;
}

export function gradeShares(counts: GradeCounts) {
  const total = countStudents(counts, GRADE_GROUPS.flatMap((group) => group.grades));

  return GRADE_GROUPS.map((group) => ({
    label: group.label,
    percent: total === 0 ? 0 : (countStudents(counts, group.grades) / total) * 100,
  }));
}

export function countStudents(counts: GradeCounts, grades: readonly Grade[] = GRADES) {
  let students = 0;
  for (const grade of grades) students += counts[grade];
  return students;
}
