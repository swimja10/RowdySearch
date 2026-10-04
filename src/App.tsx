import { AnalyticsMode } from "./components/analytics/AnalyticsMode.tsx";
import { ClassPage } from "./components/ClassPage.tsx";
import { CoursePage } from "./components/CoursePage.tsx";
import { Header } from "./components/Header.tsx";
import { ProfessorPage } from "./components/ProfessorPage.tsx";
import { SearchPage } from "./components/SearchPage.tsx";
import { LookupProvider } from "./context/LookupProvider.tsx";
import { useLookup } from "./context/useLookup.ts";
import { useGradeData } from "./hooks/useGradeData.ts";

export default function App() {
  const gradeData = useGradeData();

  if (gradeData === null) {
    return <h1 className="min-h-screen bg-zinc-900 py-12 text-center text-zinc-500">Loading professors...</h1>;
  }

  return (
    <LookupProvider gradeData={gradeData}>
      <CurrentScreen />
    </LookupProvider>
  );
}

// Analytical Mode covers everything. Otherwise it's the sidebar: the header and the current page.
function CurrentScreen() {
  const { isAnalyticsOpen } = useLookup();

  if (isAnalyticsOpen) return <AnalyticsMode />;

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-zinc-900 p-4">
      <Header />
      <CurrentPage />
    </div>
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
