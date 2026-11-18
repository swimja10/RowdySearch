import { LETTER_GRADES, countStudents, type GradeCounts, type LetterGrade } from "../../../src/utils/grades.ts";

// The five numbers a box plot draws, as letter grades.
export type GradeSpread = {
  lowest: LetterGrade; // the worst grade anyone got
  lowerQuarter: LetterGrade; // a quarter of students got this or worse
  median: LetterGrade; // the middle student's grade
  upperQuarter: LetterGrade; // a quarter of students got this or better
  highest: LetterGrade; // the best grade anyone got
};

// How spread out the letter grades are, or null when nobody has one yet. Withdrawals and
// incompletes aren't counted, the same as for the median.
//
// Each number is found the way the extension finds the median (medianGrade): line the students up
// from the best grade to the worst and take the one a quarter, half, or three quarters of the way
// down. So the median here is always the median everywhere else.
export function gradeSpread(counts: GradeCounts): GradeSpread | null {
  const students = countStudents(counts, LETTER_GRADES);
  if (students === 0) return null;

  // The grade of the student `fraction` of the way down the line from the best grade.
  function gradeAt(fraction: number): LetterGrade {
    const place = Math.max(1, Math.ceil(students * fraction));
    let counted = 0;
    for (const grade of LETTER_GRADES) {
      counted += counts[grade];
      if (counted >= place) return grade;
    }
    return LETTER_GRADES.at(-1)!;
  }

  const given = LETTER_GRADES.filter((grade) => counts[grade] > 0);
  return {
    lowest: given.at(-1)!,
    lowerQuarter: gradeAt(0.75),
    median: gradeAt(0.5),
    upperQuarter: gradeAt(0.25),
    highest: given[0],
  };
}
