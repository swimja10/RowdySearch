import { useState } from "react";
import type { Data, Layout } from "plotly.js";
import { PlotlyChart } from "./PlotlyChart.tsx";
import { Toggle } from "./Toggle.tsx";
import type { SeriesData } from "../../utils/series.ts";
import { GRADES_WORST_FIRST, gradeDistribution } from "../../utils/statistics.ts";

type GradeDistributionChartProps = {
  seriesData: SeriesData[];
};

// How many students got each grade from F to A+, one line (or set of bars) per series.
export function GradeDistributionChart({ seriesData }: GradeDistributionChartProps) {
  const [inPercent, setInPercent] = useState(true);
  const [asLines, setAsLines] = useState(true);
  const [eachGrade, setEachGrade] = useState(true);
  const options = { inPercent, atOrAbove: !eachGrade };

  const data: Data[] = seriesData.map(series => ({
    type: asLines ? "scatter" : "bar",
    mode: "lines+markers",
    name: series.label,
    x: GRADES_WORST_FIRST,
    y: gradeDistribution(series.grades, options),
    line: { color: series.color, width: 2 },
    marker: { color: series.color, size: 8 },
    hovertemplate: inPercent ? "%{y:.1f}%" : "%{y} students",
  }));

  const layout: Partial<Layout> = {
    barmode: "group",
    hovermode: "x unified",
    xaxis: { title: { text: "Grade" }, type: "category" },
    yaxis: { title: { text: yAxisTitle(inPercent, !eachGrade) }, ticksuffix: inPercent ? "%" : "", rangemode: "tozero" },
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Toggle choices={["Percent", "Students"]} firstIsOn={inPercent} onChange={setInPercent} />
        <Toggle choices={["Lines", "Bars"]} firstIsOn={asLines} onChange={setAsLines} />
        <Toggle choices={["Each grade", "At or above"]} firstIsOn={eachGrade} onChange={setEachGrade} />
      </div>
      <PlotlyChart data={data} layout={layout} className="h-96" />
      <span className="text-xs text-zinc-500">
        Out of students who got a letter grade. Withdrawals (W) are in the table below.
      </span>
    </div>
  );
}

function yAxisTitle(inPercent: boolean, atOrAbove: boolean) {
  const measure = inPercent ? "% of students" : "Students";
  return atOrAbove ? `${measure} at or above` : measure;
}
