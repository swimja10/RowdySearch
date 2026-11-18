import { useEffect } from "react";
import { AnalyticsMode } from "./components/analytics/AnalyticsMode.tsx";
import Button from "./components/Button.tsx";
import { ClassPage } from "./components/ClassPage.tsx";
import { CoursePage } from "./components/CoursePage.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header.tsx";
import { ProfessorPage } from "./components/ProfessorPage.tsx";
import { SearchPage } from "./components/SearchPage.tsx";
import { Problem, ReloadLink, StatusScreen } from "./components/StatusScreen.tsx";
import { LookupProvider } from "./context/LookupProvider.tsx";
import { useLookup } from "./context/useLookup.ts";
import { useGradeData } from "./hooks/useGradeData.ts";
import { setFullScreen } from "./utils/hostPage.ts";

export default function App() {
  const { state, retry } = useGradeData();

  if (state.status === "loading") {
    return (
      <StatusScreen>
        <h1>Loading professors...</h1>
        {state.isSlow && (
          <>
            <p className="text-sm">This is taking longer than usual.</p>
            <Button onClick={retry}>Try again</Button>
          </>
        )}
      </StatusScreen>
    );
  }

  if (state.status === "failed") {
    return (
      <StatusScreen>
        <Problem message="RowdySearch couldn't load its professor data." onRetry={retry} offerReload={state.triedByHand} />
      </StatusScreen>
    );
  }

  return (
    <LookupProvider gradeData={state.gradeData}>
      <CurrentScreen />
    </LookupProvider>
  );
}

// Analytical Mode covers everything. Otherwise it's the sidebar: the header, the current page, and the footer.
function CurrentScreen() {
  const { page, isAnalyticsOpen } = useLookup();

  if (isAnalyticsOpen) {
    return (
      <ErrorBoundary name="Analytical Mode" fallback={() => <AnalyticsCrashed />}>
        <AnalyticsMode />
      </ErrorBoundary>
    );
  }

  // If a page crashes, the header stays, so Back and Home still work. Going to another page clears the error.
  return (
    <div className="flex min-h-screen flex-col gap-4 bg-zinc-900 p-4">
      <Header />
      <ErrorBoundary
        name={`the ${page.type} page`}
        resetKey={page}
        fallback={retry => <Problem message="Something went wrong showing this page." onRetry={retry} />}>
        <CurrentPage />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

// Analytical Mode crashed, maybe while stretched across the page. Shrink back to the sidebar
// so the page underneath can be used again, and offer a way back.
function AnalyticsCrashed() {
  const { closeAnalytics } = useLookup();

  useEffect(() => {
    setFullScreen(false);
  }, []);

  return (
    <StatusScreen>
      <p>Something went wrong in Analytical Mode.</p>
      <Button onClick={closeAnalytics}>Back to the sidebar</Button>
      <ReloadLink />
    </StatusScreen>
  );
}

function CurrentPage() {
  const { page } = useLookup();

  switch (page.type) {
    case "search":
      return <SearchPage query={page.query} />;
    case "professor":
      return <ProfessorPage professorName={page.professorName} />;
    case "class":
      return <ClassPage professorName={page.professorName} courseCode={page.courseCode} />;
    case "course":
      return <CoursePage courseCode={page.courseCode} />;

    default:
      throw new Error(`Invalid page: ${page satisfies never}`);
  }
}
