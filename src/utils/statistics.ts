import { LETTER_GRADES, countStudents, type Grade, type GradeCounts, type LetterGrade } from "./grades.ts";

// Grades from worst to best: the order analytical mode's charts use along the bottom.
export const GRADES_WORST_FIRST: LetterGrade[] = [...LETTER_GRADES].reverse();

export const A_GRADES: Grade[] = ["A+", "A", "A-"];
export const D_AND_F_GRADES: Grade[] = ["D+", "D", "D-", "F"];
export const WITHDREW: Grade[] = ["W"];

// UTSA's grade points for each letter grade.
const GRADE_POINTS: Record<LetterGrade, number> = {
  "A+": 4, "A": 4, "A-": 3.67,
  "B+": 3.33, "B": 3, "B-": 2.67,
  "C+": 2.33, "C": 2, "C-": 1.67,
  "D+": 1.33, "D": 1, "D-": 0.67,
  "F": 0,
};

// Everyone who finished with a letter grade, plus everyone who withdrew.
const FINISHED_OR_WITHDREW: Grade[] = [...LETTER_GRADES, "W"];

type DistributionOptions = {
  inPercent: boolean; // percent of students instead of number of students
  atOrAbove: boolean; // students who got that grade or better, instead of exactly that grade
};

// Average grade points of everyone who got a letter grade, or null when nobody has yet.
export function averageGpa(counts: GradeCounts): number | null {
  const students = countStudents(counts, LETTER_GRADES);
  if (students === 0) return null;

  let totalPoints = 0;
  for (const grade of LETTER_GRADES) totalPoints += counts[grade] * GRADE_POINTS[grade];
  return totalPoints / students;
}

// Percent of students who got one of `grades`, out of everyone who got a grade or withdrew.
export function percentWhoGot(counts: GradeCounts, grades: Grade[]): number | null {
  const students = countStudents(counts, FINISHED_OR_WITHDREW);
  if (students === 0) return null;

  return (countStudents(counts, grades) / students) * 100;
}

// F is 1 and A+ is 13, so a letter grade can be drawn as the height of a bar.
export function gradePosition(grade: LetterGrade): number {
  return GRADES_WORST_FIRST.indexOf(grade) + 1;
}

// One value per grade from F to A+, for the grade distribution chart.
export function gradeDistribution(counts: GradeCounts, { inPercent, atOrAbove }: DistributionOptions): number[] {
  const studentsPerGrade = GRADES_WORST_FIRST.map((grade) => counts[grade]);
  const values = atOrAbove ? countAtOrAbove(studentsPerGrade) : studentsPerGrade;
  if (!inPercent) return values;

  const totalStudents = countStudents(counts, LETTER_GRADES);
  return values.map((value) => (totalStudents === 0 ? 0 : (value / totalStudents) * 100));
}

// For each grade, how many students got that grade or a better one.
function countAtOrAbove(studentsWorstFirst: number[]): number[] {
  const atOrAbove: number[] = [];
  let studentsSoFar = 0;
  for (let i = studentsWorstFirst.length - 1; i >= 0; i--) {
    studentsSoFar += studentsWorstFirst[i];
    atOrAbove[i] = studentsSoFar;
  }
  return atOrAbove;
}
