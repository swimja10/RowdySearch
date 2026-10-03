import { useEffect, useState, type ReactNode } from "react";
import { LookupContext } from "./useLookup.ts";
import type { Page } from "../page.ts";
import type { GradeData } from "../utils/loadGradeData.ts";

type LookupProviderProps = {
  gradeData: GradeData;
  children: ReactNode;
};

// Remembers every page you opened, so Back works like it does in a browser.
export function LookupProvider({ gradeData, children }: LookupProviderProps) {
  const [pages, setPages] = useState<Page[]>([{ type: "search", query: "" }]);

  // Clicking a cell in Schedule Planner's RowdySearch column puts the page to open after "#".
  useEffect(() => {
    function openPageFromAddress() {
      if (window.location.hash === "") return;

      const page: Page = JSON.parse(decodeURIComponent(window.location.hash.slice(1)));
      setPages(curr => [...curr, page]);
      // Clear the "#" part so clicking the same cell again still works.
      window.history.replaceState(null, "", window.location.pathname);
    }

    openPageFromAddress();
    window.addEventListener("hashchange", openPageFromAddress);
    return () => window.removeEventListener("hashchange", openPageFromAddress);
  }, []);

  function openPage(page: Page) {
    setPages(curr => [...curr, page]);
  }

  function replaceCurrentPage(page: Page) {
    setPages(curr => [...curr.slice(0, -1), page]);
  }

  function goBack() {
    setPages(curr => (curr.length > 1 ? curr.slice(0, -1) : curr));
  }

  return (
    <LookupContext
      value={{
        page: pages.at(-1)!,
        canGoBack: pages.length > 1,
        professors: gradeData.professors,
        searchIndex: gradeData.searchIndex,
        goBack,
        openPage,
        updateSearch: query => replaceCurrentPage({ type: "search", query }),
        openSearch: query => openPage({ type: "search", query }),
        openProfessor: professorName => openPage({ type: "professor", professorName }),
        openClass: (professorName, courseCode) => openPage({ type: "class", professorName, courseCode }),
        openCourse: courseCode => openPage({ type: "course", courseCode }),
      }}>
      {children}
    </LookupContext>
  );
}
