import { useEffect, useRef, useState } from "react";
import type { Config, Data, Layout, LayoutAxis } from "plotly.js";
import Button from "../Button.tsx";

type Plotly = typeof import("plotly.js-basic-dist").default;

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

// Plotly is 2.5 MB, so it's only downloaded when Analytical Mode first draws a chart, not every time
// the sidebar opens. Every chart waits on the same download.
let plotlyDownload: Promise<Plotly> | null = null;
const RETRY_EVENT = "rowdysearch:retry-charts";

function downloadPlotly(): Promise<Plotly> {
  plotlyDownload ??= import("plotly.js-basic-dist").then(module => module.default);
  // Forget a download that failed, so Try again downloads it again.
  plotlyDownload.catch(() => (plotlyDownload = null));
  return plotlyDownload;
}

// Try again on any chart tries again for all of them, since they all wait on the same download.
function retryAllCharts() {
  plotlyDownload = null;
  window.dispatchEvent(new Event(RETRY_EVENT));
}

type PlotlyChartProps = {
  data: Data[];
  layout: Partial<Layout>;
  className?: string;
};

// Plotly isn't a React library: it draws into a plain <div>. So we hand it one with useRef,
// and redraw with useEffect whenever the data or layout change.
export function PlotlyChart({ data, layout, className = "h-80" }: PlotlyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [plotly, setPlotly] = useState<Plotly | null>(null);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    const tryAgain = () => {
      setDownloadFailed(false);
      setTries(count => count + 1);
    };
    window.addEventListener(RETRY_EVENT, tryAgain);
    return () => window.removeEventListener(RETRY_EVENT, tryAgain);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    downloadPlotly()
      .then(loaded => isCurrent && setPlotly(() => loaded))
      .catch(error => {
        console.error("RowdySearch: couldn't load the chart library.", error);
        if (isCurrent) setDownloadFailed(true);
      });
    return () => {
      isCurrent = false;
    };
  }, [tries]);

  useEffect(() => {
    if (plotly === null || chartRef.current === null) return;
    const darkLayout = {
      ...DARK_LAYOUT,
      ...layout,
      xaxis: { ...AXIS_STYLE, ...layout.xaxis },
      yaxis: { ...AXIS_STYLE, ...layout.yaxis },
    };
    plotly.react(chartRef.current, data, darkLayout, CONFIG);
  }, [plotly, data, layout]);

  // Let Plotly clean up after itself when the chart goes away.
  useEffect(() => {
    const chart = chartRef.current;
    if (plotly === null || chart === null) return;
    return () => plotly.purge(chart);
  }, [plotly]);

  if (downloadFailed && plotly === null) {
    return (
      <div className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl bg-zinc-800 text-sm text-zinc-300 ${className}`}>
        <p>The charts couldn't load.</p>
        <Button onClick={retryAllCharts}>Try again</Button>
      </div>
    );
  }

  return (
    <div ref={chartRef} className={`w-full ${className}`}>
      {plotly === null && <p className="py-12 text-center text-sm text-zinc-500">Loading chart...</p>}
    </div>
  );
}
