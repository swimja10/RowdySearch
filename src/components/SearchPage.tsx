import { type SubmitEvent } from "react";
import { ClassCard } from "./ClassCard.tsx";
import { useLookup } from "../context/useLookup.ts";
import { search, type Match } from "../searcher.ts";
import { findCourse } from "../utils/courses.ts";
import { pageForSearch } from "../utils/pageForSearch.ts";

// No course has more than 38 professors, so a course search always shows all of them.
const MAX_RESULTS = 50;

type SearchPageProps = {
  query: string;
};

export function SearchPage({ query }: SearchPageProps) {
  const { professors, searchIndex, updateSearch, openPage } = useLookup();
  const results = search(searchIndex, query);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const page = pageForSearch(query, results, professors);
    if (page !== null) openPage(page);
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit}>
        <input
          autoFocus
          value={query}
          onChange={e => updateSearch(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          placeholder="Professor, class, or subject"
        />
      </form>
      <SearchResults query={query} results={results} />
    </div>
  );
}

type SearchResultsProps = {
  query: string;
  results: Match[];
};

function SearchResults({ query, results }: SearchResultsProps) {
  const { professors } = useLookup();

  if (query.trim() === "") {
    return (
      <p className="py-12 text-center text-zinc-500">
        Type a professor, a class, or a subject like "linear algebra", then press Enter.
      </p>
    );
  }

  if (results.length === 0) {
    return <p className="py-12 text-center text-zinc-500">No matches for "{query}".</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-zinc-400">
        Press Enter to open the best match
        {results.length > MAX_RESULTS && ` · showing the best ${MAX_RESULTS} of ${results.length}`}
      </span>
      {results.slice(0, MAX_RESULTS).map(match => {
        const professor = professors[match.professor];
        const course = findCourse(professor, match.course)!;
        return (
          <ClassCard
            key={`${match.professor} ${match.course}`}
            professor={professor}
            course={course}
            detail={`${course.code} · ${course.title}`}
          />
        );
      })}
    </div>
  );
}
