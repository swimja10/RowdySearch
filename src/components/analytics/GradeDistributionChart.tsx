import { useState } from "react";
import type { Data, Layout } from "plotly.js";
import { PlotlyChart } from "./PlotlyChart.tsx";
import { Toggle } from "./Toggle.tsx";
import { formatShare } from "../../utils/format.ts";
import { countStudents, LETTER_GRADES } from "../../utils/grades.ts";
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

  // Something with no grades yet would be a flat line at 0, which looks like real data. Leave it off.
  const withGrades = seriesData.filter(series => countStudents(series.grades, LETTER_GRADES) > 0);
  const withoutGrades = seriesData.filter(series => !withGrades.includes(series));

  const data: Data[] = withGrades.map(series => {
    const values = gradeDistribution(series.grades, options);
    return {
      type: asLines ? "scatter" : "bar",
      mode: "lines+markers",
      name: series.label,
      x: GRADES_WORST_FIRST,
      y: values,
      // The hover text is rounded by RowdySearch, not Plotly, so it's the same number the sidebar shows.
      customdata: values.map(value => (inPercent ? formatShare(value) : `${value.toLocaleString()} students`)),
      hovertemplate: "%{customdata}",
      line: { color: series.color, width: 2 },
      marker: { color: series.color, size: 8 },
    };
  });

  const layout: Partial<Layout> = {
    barmode: "group",
    hovermode: "x unified",
    xaxis: { title: { text: "Grade" }, type: "category" },
    yaxis: { title: { text: yAxisTitle(inPercent, !eachGrade) }, ticksuffix: inPercent ? "%" : "", rangemode: "tozero" },
  };

  if (withGrades.length === 0) {
    return <p className="text-sm text-zinc-500">None of these have grades released yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Toggle choices={["Percent", "Students"]} firstIsOn={inPercent} onChange={setInPercent} />
        <Toggle choices={["Lines", "Bars"]} firstIsOn={asLines} onChange={setAsLines} />
        <Toggle choices={["Each grade", "At or above"]} firstIsOn={eachGrade} onChange={setEachGrade} />
      </div>
      <PlotlyChart data={data} layout={layout} className="h-96" />
      <span className="text-xs text-zinc-500">
        Out of everyone who got a letter grade or withdrew. Withdrawals (W) are in the table below.
        {withoutGrades.length > 0 && ` Not shown (no grades yet): ${withoutGrades.map(series => series.label).join(", ")}.`}
      </span>
    </div>
  );
}

function yAxisTitle(inPercent: boolean, atOrAbove: boolean) {
  const measure = inPercent ? "% of students" : "Students";
  return atOrAbove ? `${measure} at or above` : measure;
}
