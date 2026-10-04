import { SeriesName } from "./SeriesName.tsx";
import { formatGpa, formatGpaDifference, formatOutOfFive, formatShare } from "../../utils/format.ts";
import { countStudents, LETTER_GRADES, medianGrade } from "../../utils/grades.ts";
import type { SeriesData } from "../../utils/series.ts";
import { A_GRADES, averageGpa, D_AND_F_GRADES, percentWhoGot, WITHDREW } from "../../utils/statistics.ts";

const COLUMNS = ["Comparing", "Median", "Avg GPA", "vs. whole course", "A's", "D or F", "Withdrew", "Grades", "RMP"];

type ComparisonTableProps = {
  seriesData: SeriesData[];
};

// Every number side by side: the charts' data as a table, plus a few extra stats.
export function ComparisonTable({ seriesData }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            {COLUMNS.map(column => (
              <th key={column} className="whitespace-nowrap px-3 py-2 font-semibold">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {seriesData.map(series => <ComparisonRow key={series.key} series={series} />)}
        </tbody>
      </table>
    </div>
  );
}

type ComparisonRowProps = {
  series: SeriesData;
};

function ComparisonRow({ series }: ComparisonRowProps) {
  const { grades } = series;
  const gpa = averageGpa(grades);

  return (
    <tr className="border-t border-zinc-700 tabular-nums">
      <td className="px-3 py-2"><SeriesName series={series} /></td>
      <td className="px-3 py-2 font-semibold">{medianGrade(grades) ?? "—"}</td>
      <td className="px-3 py-2">{formatGpa(gpa)}</td>
      <td className="whitespace-nowrap px-3 py-2">{formatGpaDifference(gpa, series.courseGpa)}</td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, A_GRADES))}</td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, D_AND_F_GRADES))}</td>
      <td className="px-3 py-2">{formatShare(percentWhoGot(grades, WITHDREW))}</td>
      <td className="px-3 py-2">{countStudents(grades, LETTER_GRADES).toLocaleString()}</td>
      <td className="whitespace-nowrap px-3 py-2">{series.professorName === null ? "—" : formatOutOfFive(series.rating)}</td>
    </tr>
  );
}
