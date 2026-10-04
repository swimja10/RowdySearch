import type { Data, Layout } from "plotly.js";
import { PlotlyChart } from "./PlotlyChart.tsx";
import { medianGrade, type LetterGrade } from "../../utils/grades.ts";
import type { SeriesData } from "../../utils/series.ts";
import { GRADES_WORST_FIRST, gradePosition } from "../../utils/statistics.ts";

type MedianChartProps = {
  seriesData: SeriesData[];
};

// One bar per series, as tall as its median grade, so medians are easy to compare.
// Each bar has its grade written on top, so there's no grade axis on the side.
export function MedianChart({ seriesData }: MedianChartProps) {
  const withGrades = seriesData.filter(series => medianGrade(series.grades) !== null);
  const medians = withGrades.map(series => medianGrade(series.grades) as LetterGrade);

  if (withGrades.length === 0) {
    return <p className="text-sm text-zinc-500">None of these have grades released yet.</p>;
  }

  const data: Data[] = [{
    type: "bar",
    x: withGrades.map(series => series.label),
    y: medians.map(gradePosition),
    text: medians,
    textposition: "outside",
    textfont: { color: "#f4f4f5", size: 15 },
    marker: { color: withGrades.map(series => series.color) },
    hovertemplate: "%{x}<br>Median Grade %{text}<extra></extra>",
  }];

  const layout: Partial<Layout> = {
    showlegend: false,
    hovermode: "closest",
    margin: { l: 16, r: 16, t: 32, b: 56 },
    xaxis: { showgrid: false },
    // Bar heights still use the F-to-A+ scale (F = 1, A+ = 13), it just isn't drawn.
    yaxis: { visible: false, range: [0, GRADES_WORST_FIRST.length + 1] },
  };

  return <PlotlyChart data={data} layout={layout} className="h-80" />;
}
