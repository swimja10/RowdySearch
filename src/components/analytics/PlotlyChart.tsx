import { useEffect, useRef } from "react";
import Plotly from "plotly.js-basic-dist";
import type { Config, Data, Layout, LayoutAxis } from "plotly.js";

// Matches the sidebar: see-through background, light text, faint grid lines.
const DARK_LAYOUT: Partial<Layout> = {
  paper_bgcolor: "rgba(0, 0, 0, 0)",
  plot_bgcolor: "rgba(0, 0, 0, 0)",
  font: { color: "#d4d4d8", family: "system-ui, sans-serif", size: 13 },
  margin: { l: 64, r: 16, t: 40, b: 56 },
  // A row along the top, so it never covers the axis titles.
  legend: { orientation: "h", x: 0, y: 1.02, yanchor: "bottom" },
  hoverlabel: { bgcolor: "#27272a", bordercolor: "#3f3f46", font: { color: "#f4f4f5" } },
  // Dragging on the chart does nothing (no zooming, selecting, or sliding the chart away).
  dragmode: false,
};

const AXIS_STYLE: Partial<LayoutAxis> = {
  gridcolor: "#27272a",
  linecolor: "#3f3f46",
  zerolinecolor: "#3f3f46",
  automargin: true,
  // The axes stay put, so the whole chart is always in view.
  fixedrange: true,
};

const CONFIG: Partial<Config> = {
  displaylogo: false,
  responsive: true,
  doubleClick: false,
  // No "Share chart" button: it would upload the chart's data to Plotly's website.
  showSendToCloud: false,
  // Only keep Plotly's "download as a picture" button. The others zoom, slide, or select.
  modeBarButtonsToRemove: ["zoom2d", "pan2d", "select2d", "lasso2d", "zoomIn2d", "zoomOut2d", "autoScale2d", "resetScale2d"],
};

type PlotlyChartProps = {
  data: Data[];
  layout: Partial<Layout>;
  className?: string;
};

// Plotly isn't a React library: it draws into a plain <div>. So we hand it one with useRef,
// and redraw with useEffect whenever the data or layout change.
export function PlotlyChart({ data, layout, className = "h-80" }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const darkLayout = {
      ...DARK_LAYOUT,
      ...layout,
      xaxis: { ...AXIS_STYLE, ...layout.xaxis },
      yaxis: { ...AXIS_STYLE, ...layout.yaxis },
    };
    Plotly.react(chartRef.current!, data, darkLayout, CONFIG);
  }, [data, layout]);

  // Let Plotly clean up after itself when the chart goes away.
  useEffect(() => {
    const chart = chartRef.current!;
    return () => Plotly.purge(chart);
  }, []);

  return <div ref={chartRef} className={`w-full ${className}`} />;
}
