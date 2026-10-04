import { useEffect, useState, type ReactNode } from "react";
import { LookupContext } from "./useLookup.ts";
import type { GradeData } from "../hooks/useGradeData.ts";
import type { Page, Section } from "../page.ts";
import { pageForSection } from "../utils/pageForSection.ts";

type LookupProviderProps = {
  gradeData: GradeData;
  children: ReactNode;
};

// The page the sidebar starts on: an empty search.
const HOME_PAGE: Page = { type: "search", query: "" };

// Remembers every page you opened, so Back works like it does in a browser.
export function LookupProvider({ gradeData, children }: LookupProviderProps) {
  const [pages, setPages] = useState<Page[]>([HOME_PAGE]);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // A Search button in Schedule Planner's RowdySearch column puts its section after "#".
  useEffect(() => {
    function openSectionFromAddress() {
      if (window.location.hash === "") return;

      const section: Section = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
      const page = pageForSection(section, gradeData.searchIndex);
      setPages(curr => [...curr, page]);
      // Clear the "#" part (and only that part) so clicking the same Search button again still works.
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    openSectionFromAddress();
    window.addEventListener("hashchange", openSectionFromAddress);
    return () => window.removeEventListener("hashchange", openSectionFromAddress);
  }, [gradeData.searchIndex]);

  function openPage(page: Page) {
    setPages(curr => [...curr, page]);
  }

  function replaceCurrentPage(page: Page) {
    setPages(curr => [...curr.slice(0, -1), page]);
  }

  function goBack() {
    setPages(curr => (curr.length > 1 ? curr.slice(0, -1) : curr));
  }

  // Start over from the home page, like opening the sidebar fresh.
  function goHome() {
    setPages([HOME_PAGE]);
  }

  return (
    <LookupContext
      value={{
        page: pages.at(-1)!,
        canGoBack: pages.length > 1,
        isAnalyticsOpen,
        openAnalytics: () => setIsAnalyticsOpen(true),
        closeAnalytics: () => setIsAnalyticsOpen(false),
        professors: gradeData.professors,
        searchIndex: gradeData.searchIndex,
        goBack,
        goHome,
        openPage,
        updateSearch: query => replaceCurrentPage({ type: "search", query }),
        openProfessor: professorName => openPage({ type: "professor", professorName }),
        openClass: (professorName, courseCode) => openPage({ type: "class", professorName, courseCode }),
        openCourse: courseCode => openPage({ type: "course", courseCode }),
      }}>
      {children}
    </LookupContext>
  );
}
