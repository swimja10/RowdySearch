import { useEffect, useRef, useState } from "react";
import { animate, stagger, utils } from "animejs";
import Button from "../Button.tsx";
import { Section } from "../Section.tsx";
import { VennIcon } from "../VennIcon.tsx";
import { ComparingList } from "./ComparingList.tsx";
import { ComparisonTable } from "./ComparisonTable.tsx";
import { GradeDistributionChart } from "./GradeDistributionChart.tsx";
import { MedianChart } from "./MedianChart.tsx";
import { ProfessorReviews } from "./ProfessorReviews.tsx";
import { SubjectPicker } from "./SubjectPicker.tsx";
import { useLookup } from "../../context/useLookup.ts";
import type { Subject } from "../../page.ts";
import { setFullScreen } from "../../utils/hostPage.ts";
import { describeSeries, isAdded, SERIES_COLORS, seriesFor, withSubjectAdded } from "../../utils/series.ts";
import { subjectKey, subjectsToStartWith } from "../../utils/subjects.ts";

// The full screen view for comparing professors and courses with charts.
export function AnalyticsMode() {
  const { page, professors, searchIndex, openPage, closeAnalytics } = useLookup();
  const gradeData = { professors, searchIndex };

  const [seriesList, setSeriesList] = useState(() => seriesFor(subjectsToStartWith(page, gradeData)));
  // How wide the sidebar was, so the panel can grow out of it and shrink back into it.
  const [sidebarWidth] = useState(() => window.innerWidth);
  const panelRef = useRef<HTMLDivElement>(null);

  const seriesData = seriesList.map(series => describeSeries(series, gradeData));

  useEffect(() => {
    slideIn(panelRef.current!);
  }, []);

  async function handleClose() {
    await slideOut(panelRef.current!, sidebarWidth);
    closeAnalytics();
  }

  // Clicking a name: the sidebar switches to that page, then Analytical Mode closes to show it.
  function openInSidebar(subject: Subject) {
    openPage(subject);
    handleClose();
  }

  function addSubject(subject: Subject) {
    setSeriesList(curr => withSubjectAdded(curr, subject));
  }

  function removeSeries(key: string) {
    setSeriesList(curr => curr.filter(series => subjectKey(series.subject) !== key));
  }

  return (
    <div
      ref={panelRef}
      className="fixed inset-y-0 right-0 overflow-y-auto bg-zinc-900 text-zinc-100"
      style={{ width: sidebarWidth }}>
      <div className="flex flex-col gap-6 p-6">
        <header data-reveal className="flex items-center justify-between gap-4 opacity-0">
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <VennIcon className="h-8 w-12 text-orange-500" />
            Analytical Mode
          </h1>
          <Button variant="secondary" onClick={handleClose}>✕ Close</Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <aside data-reveal className="flex flex-col gap-6 opacity-0">
            <ComparingList
              seriesData={seriesData}
              onRemove={removeSeries}
              onClear={() => setSeriesList([])}
              onOpen={openInSidebar}
            />
            <SubjectPicker
              canAddMore={seriesList.length < SERIES_COLORS.length}
              isAdded={subject => isAdded(seriesList, subject)}
              onAdd={addSubject}
            />
          </aside>

          <main data-reveal className="flex min-w-0 flex-col gap-8 opacity-0">
            {seriesData.length === 0 ? (
              <p className="py-24 text-center text-zinc-500">
                Search on the left to add professors, courses, or one professor's class to compare.
              </p>
            ) : (
              <>
                <Section title="Grade distribution">
                  <GradeDistributionChart seriesData={seriesData} />
                </Section>
                <Section title="Median Grade">
                  <MedianChart seriesData={seriesData} />
                </Section>
                <Section title="Side by side">
                  <ComparisonTable seriesData={seriesData} onOpen={openInSidebar} />
                </Section>
                <Section title="What students say">
                  <ProfessorReviews seriesData={seriesData} onOpen={openInSidebar} />
                </Section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// The panel grows from the sidebar to cover the screen, then its parts (which start
// invisible with opacity-0) slide up and fade in one after another.
async function slideIn(panel: HTMLElement) {
  const parts = panel.querySelectorAll("[data-reveal]");
  utils.set(parts, { translateY: 24 });

  const startWidth = panel.offsetWidth;
  await setFullScreen(true);
  await animate(panel, { width: [`${startWidth}px`, `${window.innerWidth}px`], duration: 500, ease: "outQuart" });
  // Keep covering the screen if the window is resized later.
  panel.style.width = "100%";
  // The charts were drawn while the panel was still narrow. Plotly re-fits its charts when the
  // window resizes, so tell it the window "resized" now that the panel is full size.
  window.dispatchEvent(new Event("resize"));

  animate(parts, { opacity: 1, translateY: 0, delay: stagger(80), duration: 400, ease: "outQuad" });
}

// The reverse: fade the parts out, shrink back to the sidebar's width, then give the screen back.
// (Widths say "px" because the panel's width is "100%" by now, and plain numbers would be read as %.)
async function slideOut(panel: HTMLElement, sidebarWidth: number) {
  await animate(panel.querySelectorAll("[data-reveal]"), { opacity: 0, duration: 150 });
  await animate(panel, { width: [`${panel.offsetWidth}px`, `${sidebarWidth}px`], duration: 400, ease: "inQuart" });
  await setFullScreen(false);
}
