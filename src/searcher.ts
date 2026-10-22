import type { Professor } from "./utils/gradeData.ts";

const ALLOWED_WRONG_WORDS = 1;

type Entry = { professor: string; course: string; words: string[] };
export type Match = { professor: string; course: string; score: number };
export type SearchIndex = Map<string, Entry[]>;

export function buildSearchIndex(professors: Record<string, Professor>): SearchIndex {
  return indexByWord(buildEntries(professors));
}

export function search(index: SearchIndex, query: string): Match[] {
  const queryWords = [...new Set(wordsOf(query))];
  const neededWords = Math.max(1, queryWords.length - ALLOWED_WRONG_WORDS);
  const matchedWords = new Map<Entry, number>();

  for (const queryWord of queryWords) {
    for (const entry of entriesMatching(index, queryWord)) {
      matchedWords.set(entry, (matchedWords.get(entry) ?? 0) + 1);
    }
  }

  return [...matchedWords]
    .filter(([, count]) => count >= neededWords)
    .map(([entry]) => ({
      professor: entry.professor,
      course: entry.course,
      score: closeness(queryWords, entry.words),
    }))
    .sort((first, second) => second.score - first.score);
}

// True when any word of the query is in the text. Typos count the same way they do in search().
export function sharesAWord(query: string, text: string): boolean {
  const textWords = wordsOf(text);
  return wordsOf(query).some((queryWord) => isAnyOf(queryWord, textWords));
}

// True when every word of the query is in the text.
export function sharesEveryWord(query: string, text: string): boolean {
  const textWords = wordsOf(text);
  return wordsOf(query).every((queryWord) => isAnyOf(queryWord, textWords));
}

// The words of `text` that aren't in `other`, like the name words you didn't type.
export function wordsMissingFrom(text: string, other: string): string[] {
  const otherWords = wordsOf(other);
  return wordsOf(text).filter((word) => !isAnyOf(word, otherWords));
}

function isAnyOf(queryWord: string, words: string[]): boolean {
  return words.some((word) => isSameWord(queryWord, word));
}

// One entry for each course a professor has taught, found by their name, the course code, or any title
// its sections have had (older names, and each topic in a topics course).
function buildEntries(professors: Record<string, Professor>): Entry[] {
  const built: Entry[] = [];
  for (const professor of Object.values(professors)) {
    for (const course of professor.courses) {
      const titles = course.offerings.flatMap((offering) => offering.titles);
      const words = wordsOf([professor.name, course.code, ...titles].join(" "));
      built.push({ professor: professor.name, course: course.code, words: [...new Set(words)] });
    }
  }
  return built;
}

function wordsOf(text: string): string[] {
  const plain = text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // A course code typed without its space ("MAT1213") is the same two words as "MAT 1213".
  const spacedOut = plain.replace(/([a-z])(\d)/g, "$1 $2");
  return spacedOut.match(/[a-z0-9]+/g) ?? [];
}

function indexByWord(allEntries: Entry[]): SearchIndex {
  const index: SearchIndex = new Map();
  for (const entry of allEntries) {
    for (const word of entry.words) {
      if (!index.has(word)) index.set(word, []);
      index.get(word)!.push(entry);
    }
  }
  return index;
}

function entriesMatching(index: SearchIndex, queryWord: string): Set<Entry> {
  const matching = new Set<Entry>();
  for (const [word, wordEntries] of index) {
    if (isSameWord(queryWord, word)) {
      for (const entry of wordEntries) matching.add(entry);
    }
  }
  return matching;
}

function isSameWord(queryWord: string, word: string): boolean {
  if (queryWord === word) return true;
  const typos = typosAllowed(queryWord);
  if (Math.abs(queryWord.length - word.length) > typos) return false;
  return editDistance(queryWord, word) <= typos;
}

function typosAllowed(word: string): number {
  if (/\d/.test(word) || word.length < 4) return 0;
  return word.length < 8 ? 1 : 2;
}

function closeness(queryWords: string[], entryWords: string[]): number {
  let total = 0;
  for (const queryWord of queryWords) {
    total += Math.max(...entryWords.map((word) => similarity(queryWord, word)));
  }
  return total / queryWords.length;
}

function similarity(first: string, second: string): number {
  return 1 - editDistance(first, second) / Math.max(first.length, second.length);
}

function editDistance(first: string, second: string): number {
  let twoRowsUp: number[] = [];
  let rowAbove = Array.from({ length: second.length + 1 }, (_, column) => column);

  for (let i = 1; i <= first.length; i++) {
    const row = [i];
    for (let j = 1; j <= second.length; j++) {
      const substitution = rowAbove[j - 1] + (first[i - 1] === second[j - 1] ? 0 : 1);
      row[j] = Math.min(rowAbove[j] + 1, row[j - 1] + 1, substitution);
      if (isSwap(first, second, i, j)) row[j] = Math.min(row[j], twoRowsUp[j - 2] + 1);
    }
    twoRowsUp = rowAbove;
    rowAbove = row;
  }
  return rowAbove[second.length];
}

function isSwap(first: string, second: string, i: number, j: number): boolean {
  return i > 1 && j > 1 && first[i - 1] === second[j - 2] && first[i - 2] === second[j - 1];
}
