import { useState, type SubmitEvent } from "react";
import Button from "../Button.tsx";
import { useLookup } from "../../context/useLookup.ts";
import type { Subject } from "../../page.ts";
import { search, type Match } from "../../searcher.ts";
import { findCourse } from "../../utils/courses.ts";
import { pageForSearch } from "../../utils/pageForSearch.ts";

type SubjectPickerProps = {
  canAddMore: boolean;
  isAdded: (subject: Subject) => boolean;
  onAdd: (subject: Subject) => void;
};

// Search for something to compare, then add the professor, the whole course, or that one class.
// Pressing Enter adds the best match, picked the same way Enter works on the sidebar's search.
export function SubjectPicker({ canAddMore, isAdded, onAdd }: SubjectPickerProps) {
  const { professors, searchIndex } = useLookup();
  const [query, setQuery] = useState("");
  const results = search(searchIndex, query);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    const bestSubject = pageForSearch(query, results, professors);
    if (bestSubject === null || !canAddMore || isAdded(bestSubject)) return;
    onAdd(bestSubject);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          placeholder="Add a professor, class, or subject"
        />
      </form>
      {!canAddMore && (
        <span className="text-xs text-zinc-400">That's 8, the most the charts can show. Remove one to add more.</span>
      )}
      {results.length > 0 && (
        <span className="text-xs text-zinc-400">{results.length} {results.length === 1 ? "match" : "matches"}, best first</span>
      )}
      {/* Every match, in a list that scrolls by itself so the charts stay in place. */}
      <div className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto">
        {results.map(match => (
          <MatchChoices
            key={`${match.professor} ${match.course}`}
            match={match}
            canAddMore={canAddMore}
            isAdded={isAdded}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  );
}

type MatchChoicesProps = SubjectPickerProps & {
  match: Match;
};

function MatchChoices({ match, canAddMore, isAdded, onAdd }: MatchChoicesProps) {
  const { professors } = useLookup();
  const course = findCourse(professors[match.professor], match.course)!;
  const choices: { label: string; subject: Subject }[] = [
    { label: "Professor", subject: { type: "professor", professorName: match.professor } },
    { label: "Whole course", subject: { type: "course", courseCode: match.course } },
    { label: "This class", subject: { type: "class", professorName: match.professor, courseCode: match.course } },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-zinc-800 p-3">
      <span className="text-sm">
        {match.professor} <span className="text-zinc-400">· {course.code} {course.title}</span>
      </span>
      <div className="flex flex-wrap gap-1">
        {choices.map(choice => (
          <Button
            key={choice.label}
            variant="secondary"
            className="text-xs"
            disabled={!canAddMore || isAdded(choice.subject)}
            onClick={() => onAdd(choice.subject)}>
            + {choice.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
