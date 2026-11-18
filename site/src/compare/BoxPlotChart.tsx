import type { Data, Layout } from "plotly.js";
import { PlotlyChart } from "../../../src/components/analytics/PlotlyChart.tsx";
import type { SeriesData } from "../../../src/utils/series.ts";
import { GRADES_WORST_FIRST, gradePosition } from "../../../src/utils/statistics.ts";
import { gradeSpread } from "./spread.ts";

type BoxPlotChartProps = {
  seriesData: SeriesData[];
};

// One box per series, showing how spread out its grades are: the box covers the middle half of
// students, the line across it is the median, and the whiskers reach the lowest and highest
// grades. The same five grades are in the table underneath, as letters.
export function BoxPlotChart({ seriesData }: BoxPlotChartProps) {
  const spreads = seriesData.flatMap((series) => {
    const spread = gradeSpread(series.grades);
    return spread === null ? [] : [{ series, spread }];
  });

  if (spreads.length === 0) {
    return <p className="text-sm text-zinc-500">None of these have grades released yet.</p>;
  }

  // Plotly draws a box from the five numbers when they're given to it, instead of from every grade.
  const data = spreads.map(({ series, spread }) => ({
    type: "box",
    name: series.label,
    x: [series.label],
    lowerfence: [gradePosition(spread.lowest)],
    q1: [gradePosition(spread.lowerQuarter)],
    median: [gradePosition(spread.median)],
    q3: [gradePosition(spread.upperQuarter)],
    upperfence: [gradePosition(spread.highest)],
    line: { color: series.color, width: 2 },
    fillcolor: `${series.color}55`,
    // The letters are in the table. Hovering would show the grades as numbers from 1 to 13.
    hoverinfo: "skip",
  })) as unknown as Data[];

  const layout: Partial<Layout> = {
    showlegend: false,
    margin: { l: 48, r: 16, t: 16, b: 56 },
    xaxis: { showgrid: false },
    // The F-to-A+ scale (F = 1, A+ = 13), with the letters written on it.
    yaxis: {
      tickvals: GRADES_WORST_FIRST.map(gradePosition),
      ticktext: GRADES_WORST_FIRST,
      range: [0.5, GRADES_WORST_FIRST.length + 0.5],
    },
  };

  return (
    <div className="flex flex-col gap-3">
      <PlotlyChart data={data} layout={layout} className="h-96" />
      <div className="overflow-x-auto rounded-xl bg-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              {["Comparing", "Lowest", "Lower quarter", "Median", "Upper quarter", "Highest"].map((column) => (
                <th key={column} className="whitespace-nowrap px-3 py-2 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spreads.map(({ series, spread }) => (
              <tr key={series.key} className="border-t border-zinc-700">
                <td className="min-w-44 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: series.color }} />
                    {series.label}
                  </span>
                </td>
                <td className="px-3 py-2">{spread.lowest}</td>
                <td className="px-3 py-2">{spread.lowerQuarter}</td>
                <td className="px-3 py-2 font-semibold">{spread.median}</td>
                <td className="px-3 py-2">{spread.upperQuarter}</td>
                <td className="px-3 py-2">{spread.highest}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-zinc-700 px-3 py-2 text-xs text-zinc-500">
          The box covers the middle half of students: a quarter got the lower quarter's grade or worse, and a quarter got
          the upper quarter's grade or better. Withdrawals aren't counted.
        </p>
      </div>
    </div>
  );
}
