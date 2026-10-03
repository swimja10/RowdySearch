import { createContext, useContext } from "react";
import type { Page } from "../page.ts";
import type { SearchIndex } from "../searcher.ts";
import type { Professor } from "../utils/gradeData.ts";

export const LookupContext = createContext<null | Context>(null);

type Context = {
  page: Page;
  canGoBack: boolean;
  professors: Record<string, Professor>;
  searchIndex: SearchIndex;
  goBack: () => void;
  openPage: (page: Page) => void;
  updateSearch: (query: string) => void;
  openSearch: (query: string) => void;
  openProfessor: (professorName: string) => void;
  openClass: (professorName: string, courseCode: string) => void;
  openCourse: (courseCode: string) => void;
};

export function useLookup() {
  const lookupContext = useContext(LookupContext);
  if (lookupContext == null) throw new Error("useLookup must be used inside LookupProvider");

  return lookupContext;
}
