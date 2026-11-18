import { useEffect, useState } from "react";
import { ComparingList } from "../../../src/components/analytics/ComparingList.tsx";
import { ComparisonTable } from "../../../src/components/analytics/ComparisonTable.tsx";
import { GradeDistributionChart } from "../../../src/components/analytics/GradeDistributionChart.tsx";
import { MedianChart } from "../../../src/components/analytics/MedianChart.tsx";
import { ProfessorReviews } from "../../../src/components/analytics/ProfessorReviews.tsx";
import { SubjectPicker } from "../../../src/components/analytics/SubjectPicker.tsx";
import Button from "../../../src/components/Button.tsx";
import { Section } from "../../../src/components/Section.tsx";
import { Problem } from "../../../src/components/StatusScreen.tsx";
import { LookupContext } from "../../../src/context/useLookup.ts";
import type { Subject } from "../../../src/page.ts";
import { copyText } from "../../../src/utils/clipboard.ts";
import { emptyGradeCounts } from "../../../src/utils/grades.ts";
import { describeSeries, isAdded, SERIES_COLORS, seriesFor, withSubjectAdded, type Series, type SeriesData } from "../../../src/utils/series.ts";
import { professorNameOf, subjectKey, subjectLabel } from "../../../src/utils/subjects.ts";
import { compareUrl, decodeSubjects, pageUrl } from "./address.ts";
import { BoxPlotChart } from "./BoxPlotChart.tsx";
import { createStore, type CompareStore } from "./store.ts";

type CompareAppProps = {
  indexUrl: string; // the search's slim index
  fileOfSubject: Record<string, string>; // "MAT" -> the data file MAT is in
};

const COPIED_LABEL_MS = 2000;

// Analytical Mode on the site: the extension's charts, table, and picker, on their own page.
// First it loads the list of every professor and course (the search's index), then the real
// numbers for whatever is being compared.
export default function CompareApp({ indexUrl, fileOfSubject }: CompareAppProps) {
  const [store, setStore] = useState<CompareStore | null>(null);
  const [failed, setFailed] = useState(false);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    createStore(indexUrl, fileOfSubject)
      .then((made) => isCurrent && setStore(made))
      .catch((error) => {
        console.error("RowdySearch: Analytical Mode couldn't load its list of professors.", error);
        if (isCurrent) setFailed(true);
      });
    return () => {
      isCurrent = false;
    };
  }, [indexUrl, fileOfSubject, tries]);

  function tryAgain() {
    setFailed(false);
    setTries((count) => count + 1);
  }

  if (store !== null) return <Comparison store={store} />;
  if (failed) return <Problem message="Analytical Mode couldn't load. Check your connection and try again." onRetry={tryAgain} />;
  return <p className="py-12 text-center text-zinc-500">Loading Analytical Mode…</p>;
}

type ComparisonProps = {
  store: CompareStore;
};

function Comparison({ store }: ComparisonProps) {
  const [seriesList, setSeriesList] = useState(() => seriesFor(subjectsInAddress(store)));
  const [, setArrivals] = useState(0); // counts data files arriving, so the charts draw again
  const [couldNotLoad, setCouldNotLoad] = useState<string[]>([]); // the keys of series whose data failed
  const [tries, setTries] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const gradeData = { professors: store.professors, searchIndex: store.searchIndex };

  // The address always says what's being compared, so it can be bookmarked or shared as it is.
  useEffect(() => {
    window.history.replaceState(null, "", compareUrl(seriesList.map((series) => series.subject), store.slugOf));
  }, [seriesList, store]);

  // Download the real numbers for anything on the list that doesn't have them yet.
  useEffect(() => {
    let isCurrent = true;
    for (const { subject } of seriesList) {
      if (store.isLoaded(subject)) continue;
      const key = subjectKey(subject);
      store
        .load(subject)
        .then(() => {
          if (!isCurrent) return;
          setCouldNotLoad((keys) => keys.filter((each) => each !== key));
          setArrivals((count) => count + 1);
        })
        .catch((error) => {
          console.error(`RowdySearch: couldn't load the data for ${subjectLabel(subject)}.`, error);
          if (isCurrent) setCouldNotLoad((keys) => (keys.includes(key) ? keys : [...keys, key]));
        });
    }
    return () => {
      isCurrent = false;
    };
  }, [seriesList, store, tries]);

  // Everything on the list, for the list itself. Only what has its numbers goes on the charts.
  const everything = seriesList.map((series) => (store.isLoaded(series.subject) ? describeSeries(series, gradeData) : stillLoading(series)));
  const seriesData = everything.filter((series) => store.isLoaded(series.subject));
  const waitingFor = everything.filter((series) => !store.isLoaded(series.subject));
  const failedLabels = waitingFor.filter((series) => couldNotLoad.includes(series.key)).map((series) => series.label);

  // A name anywhere in Analytical Mode goes to that professor's, course's, or class's own page.
  function open(subject: Subject) {
    window.location.href = pageUrl(subject, store.slugOf);
  }

  async function copyLink() {
    if (!(await copyText(window.location.href))) return;
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPIED_LABEL_MS);
  }

  // The extension's components ask this for the data and for how to open a page. The rest is for
  // the sidebar's own pages and Back button, which the site doesn't have.
  const lookup = {
    page: { type: "search" as const, query: "" },
    canGoBack: false,
    isAnalyticsOpen: true,
    openAnalytics: () => {},
    closeAnalytics: () => {},
    professors: store.professors,
    searchIndex: store.searchIndex,
    goBack: () => {},
    goHome: () => {},
    updateSearch: () => {},
    openPage: (page: Subject | { type: "search"; query: string }) => page.type !== "search" && open(page),
    openProfessor: (professorName: string) => open({ type: "professor", professorName }),
    openClass: (professorName: string, courseCode: string) => open({ type: "class", professorName, courseCode }),
    openCourse: (courseCode: string) => open({ type: "course", courseCode }),
  };

  return (
    <LookupContext value={lookup}>
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="flex flex-col gap-6">
          <ComparingList
            seriesData={everything}
            onRemove={(key) => setSeriesList((curr) => curr.filter((series) => subjectKey(series.subject) !== key))}
            onClear={() => setSeriesList([])}
            onOpen={open}
          />
          {seriesList.length > 0 && (
            <Button variant="secondary" className="self-start text-sm" onClick={copyLink}>
              {isCopied ? "Copied!" : "Copy a link to this comparison"}
            </Button>
          )}
          <SubjectPicker
            canAddMore={seriesList.length < SERIES_COLORS.length}
            isAdded={(subject) => isAdded(seriesList, subject)}
            onAdd={(subject) => setSeriesList((curr) => withSubjectAdded(curr, subject))}
          />
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          {failedLabels.length > 0 && (
            <Problem message={`Couldn't load the data for ${failedLabels.join(", ")}.`} onRetry={() => setTries((count) => count + 1)} />
          )}
          {waitingFor.length > failedLabels.length && (
            <p className="text-sm text-zinc-500">Loading {waitingFor.length - failedLabels.length} more…</p>
          )}

          {seriesList.length === 0 ? (
            <p className="py-24 text-center text-zinc-500">
              Search to add professors, courses, or one professor's class to compare.
            </p>
          ) : (
            seriesData.length > 0 && (
              <>
                <Section title="Grade distribution">
                  <GradeDistributionChart seriesData={seriesData} />
                </Section>
                <Section title="Median Grade">
                  <MedianChart seriesData={seriesData} />
                </Section>
                <Section title="Grade spread">
                  <BoxPlotChart seriesData={seriesData} />
                </Section>
                <Section title="Side by side">
                  <ComparisonTable seriesData={seriesData} onOpen={open} />
                </Section>
                <Section title="What students say">
                  <ProfessorReviews seriesData={seriesData} onOpen={open} />
                </Section>
              </>
            )
          )}
        </div>
      </div>
    </LookupContext>
  );
}

// What the address says to compare, at most as many as there are chart colors.
function subjectsInAddress(store: CompareStore): Subject[] {
  const text = new URLSearchParams(window.location.search).get("s") ?? "";
  const subjects = decodeSubjects(text, store.nameOfSlug, store.exists);
  const once = subjects.filter((subject, place) => subjects.findIndex((other) => subjectKey(other) === subjectKey(subject)) === place);
  return once.slice(0, SERIES_COLORS.length);
}

// A series whose numbers haven't arrived: its name and color for the list, and nothing to chart.
function stillLoading({ subject, color }: Series): SeriesData {
  return {
    subject,
    key: subjectKey(subject),
    label: subjectLabel(subject),
    color,
    grades: emptyGradeCounts(),
    bluebook: { instructor: null, course: null, sectionCount: 0 },
    professorName: professorNameOf(subject),
    rating: null,
    courseGpa: null,
  };
}
