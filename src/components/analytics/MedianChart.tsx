import type { Data, Layout } from "plotly.js";
import { PlotlyChart } from "./PlotlyChart.tsx";
import { medianGrade, type LetterGrade } from "../../utils/grades.ts";
import type { SeriesData } from "../../utils/series.ts";
import { GRADES_WORST_FIRST, gradePosition } from "../../utils/statistics.ts";

type MedianChartProps = {
  seriesData: SeriesData[];
};

// One bar per series, as tall as its median grade, so medians are easy to compare.
export function MedianChart({ seriesData }: MedianChartProps) {
  const withGrades = seriesData.filter(series => medianGrade(series.grades) !== null);
  const medians = withGrades.map(series => medianGrade(series.grades) as LetterGrade);

  const data: Data[] = [{
    type: "bar",
    x: withGrades.map(series => series.label),
    y: medians.map(gradePosition),
    text: medians,
    textposition: "outside",
    textfont: { color: "#f4f4f5" },
    marker: { color: withGrades.map(series => series.color) },
    hovertemplate: "%{x}<br>Median grade %{text}<extra></extra>",
  }];

  const layout: Partial<Layout> = {
    showlegend: false,
    hovermode: "closest",
    yaxis: {
      title: { text: "Median grade" },
      tickvals: GRADES_WORST_FIRST.map(gradePosition),
      ticktext: GRADES_WORST_FIRST,
      range: [0, GRADES_WORST_FIRST.length + 1],
    },
  };

  return <PlotlyChart data={data} layout={layout} className="h-80" />;
}
