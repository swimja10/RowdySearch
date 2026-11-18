import { twMerge } from "tailwind-merge";
import { SeriesName } from "./SeriesName.tsx";
import type { Subject } from "../../page.ts";
import { formatGpa, formatOutOfFive, formatShare, roundHalfUp } from "../../utils/format.ts";
import { countStudents, FINISHED_OR_WITHDREW, medianGrade } from "../../utils/grades.ts";
import type { SeriesData } from "../../utils/series.ts";
import { A_GRADES, averageGpa, D_AND_F_GRADES, percentDifference, percentWhoGot, WITHDREW } from "../../utils/statistics.ts";

const COLUMNS = ["Comparing", "Median", "Avg GPA", "vs. course average", "A's", "D or F", "Withdrew", "Grades", "Bluebook instructor", "Bluebook course", "RMP"];
// These short columns read better with the value centered under the title.
const CENTERED_COLUMNS = ["Median", "Avg GPA"];
// These long titles take two lines, which leaves room for the names in the first column.
const TWO_LINE_COLUMNS = ["vs. course average", "Bluebook instructor", "Bluebook course"];

type ComparisonTableProps = {
  seriesData: SeriesData[];
  onOpen: (subject: Subject) => void;
};

// Every number side by side: the charts' data as a table, plus a few extra stats.
export function ComparisonTable({ seriesData, onOpen }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            {COLUMNS.map(column => (
              <th key={column} className={headerStyle(column)}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seriesData.map(series => <ComparisonRow key={series.key} series={series} onOpen={onOpen} />)}
        </tbody>
      </table>
      <p className="border-t border-zinc-700 px-3 py-2 text-xs text-zinc-500">
        Percents are out of everyone who got a grade or withdrew, the same as the sidebar. A whole course's
        Bluebook and RMP are the median section and the median professor, the same as on its course page.
      </p>
    </div>
  );
}

function headerStyle(column: string) {
  return twMerge(
    "whitespace-nowrap px-3 py-2 font-semibold",
    CENTERED_COLUMNS.includes(column) && "text-center",
    TWO_LINE_COLUMNS.includes(column) && "w-24 whitespace-normal",
  );
}

type ComparisonRowProps = {
  series: SeriesData;
  onOpen: (subject: Subject) => void;
};

function ComparisonRow({ series, onOpen }: ComparisonRowProps) {
  const { grades } = series;
  const gpa = averageGpa(grades);

  return (
    <tr className="border-t border-zinc-700 tabular-nums">
      <td className="min-w-44 px-3 py-2"><SeriesName series={series} onOpen={onOpen} /></td>
      <td className="px-3 py-2 text-center font-semibold">{medianGrade(grades) ?? "—"}</td>
      <td className="px-3 py-2 text-center">{formatGpa(gpa)}</td>
      <td className="whitespace-nowrap px-3 py-2"><CourseComparison gpa={gpa} courseGpa={series.courseGpa} /></td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, A_GRADES))}</td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, D_AND_F_GRADES))}</td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, WITHDREW))}</td>
      {/* The same count as "Based on N grades" under the sidebar's grade bars. */}
      <td className="px-3 py-2">{countStudents(grades, FINISHED_OR_WITHDREW).toLocaleString()}</td>
      <td className="whitespace-nowrap px-3 py-2">{formatOutOfFive(series.bluebook.instructor)}</td>
      <td className="whitespace-nowrap px-3 py-2">{formatOutOfFive(series.bluebook.course)}</td>
      <td className="whitespace-nowrap px-3 py-2">{series.rating === null ? "—" : formatOutOfFive(series.rating)}</td>
    </tr>
  );
}

type CourseComparisonProps = {
  gpa: number | null;
  courseGpa: number | null; // only set for one professor's class
};

// How a professor's class compares with the whole course's average GPA:
// green with ▲ when it's higher, red with ▼ when it's lower.
function CourseComparison({ gpa, courseGpa }: CourseComparisonProps) {
  if (gpa === null || courseGpa === null) return <span className="text-zinc-500">—</span>;

  const difference = roundHalfUp(percentDifference(gpa, courseGpa), 0);
  if (difference === 0) return <span>Same as average</span>;

  if (difference > 0) return <span className="font-medium text-green-400">▲ {difference}% higher</span>;
  return <span className="font-medium text-red-400">▼ {Math.abs(difference)}% lower</span>;
}
