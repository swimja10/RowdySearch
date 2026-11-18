import { Stat, StatGroup, Unavailable } from "./ProfessorStats.tsx";
import { courseBluebook, courseRmp, gradesOf, type Teacher } from "../utils/courses.ts";
import { formatCount, formatOutOfFive, formatPercent } from "../utils/format.ts";
import { medianGrade } from "../utils/grades.ts";

type CourseStatsProps = {
  teachers: Teacher[];
};

// The numbers at the top of a course's page: the middle of everyone who teaches it, so one unusually
// easy or hard professor can't pull them far. Analytical Mode shows the same numbers for the course.
export function CourseStats({ teachers }: CourseStatsProps) {
  const median = medianGrade(gradesOf(teachers.flatMap(teacher => teacher.course.offerings)));
  const bluebook = courseBluebook(teachers);
  const rmp = courseRmp(teachers);

  return (
    <div className="flex flex-col gap-3">
      <Stat label="Median Grade (Every Professor)" value={median ?? "No grades yet"} />

      {bluebook.sectionCount === 0 ? (
        <Unavailable>No Bluebook evaluations yet</Unavailable>
      ) : (
        <StatGroup title="Bluebook" detail={`Median of ${formatCount(bluebook.sectionCount, "section")}`}>
          <Stat label="Instructor" value={formatOutOfFive(bluebook.instructor)} />
          <Stat label="Course" value={formatOutOfFive(bluebook.course)} />
        </StatGroup>
      )}

      {rmp.professorCount === 0 ? (
        <Unavailable>None of its professors are on Rate My Professors</Unavailable>
      ) : (
        <StatGroup title="Rate My Professors" detail={`Median of ${formatCount(rmp.professorCount, "professor")}`}>
          <Stat label="Rating" value={formatOutOfFive(rmp.rating)} />
          <Stat label="Difficulty" value={formatOutOfFive(rmp.difficulty)} />
          <Stat label="Would take again" value={formatPercent(rmp.wouldTakeAgainPercent)} />
        </StatGroup>
      )}
    </div>
  );
}
