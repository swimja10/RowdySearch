import type { Professor } from "./utils/gradeData.ts";
import { semesterRank } from "./utils/semesters.ts";

// Typing the start of a word ("calc" for "calculus") needs at least this many letters,
// and a name needs one more ("beat" for Beatty), so "web" doesn't find Professor Weber.
const MIN_PREFIX = 3;
const MIN_NAME_PREFIX = 4;
// A shorter word in a title than this is too common to count as abbreviating what you typed
// ("Cal" isn't "calculus"). Subject codes are the exception: MAT is short for "math".
const MIN_ABBREVIATION = 4;
// Little words a search doesn't need to find, so "intro to programming" finds "Intro Programming".
const LITTLE_WORDS = new Set(["a", "an", "and", "at", "for", "in", "of", "on", "the", "to", "with"]);
// Titles say both "Calculus I" and "Class Piano 1", so roman numerals count as numbers.
const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
// Shorthand students type that isn't the start of the words it stands for. Each also finds titles
// that spell it out: "us history" finds "United States History".
const SHORTHAND = new Map([
  ["us", ["united", "states"]],
  ["ai", ["artificial", "intelligence"]],
  ["ml", ["machine", "learning"]],
  ["oop", ["object", "oriented", "programming"]],
  ["os", ["operating", "systems"]],
  ["stats", ["statistics"]],
  ["orgo", ["organic", "chemistry"]],
  ["govt", ["government"]],
  ["eq", ["equations"]],
]);

// The kinds of words an entry has. Each matches what you typed a little differently.
type WordKind = "name" | "title" | "subject code";

// How an entry's word matches a word of the search: how well (0 to 1), and whether it's only a guess
// (an abbreviation or a typo) rather than the word itself or its start.
type WordMatch = { quality: number; isGuess: boolean };
const NO_MATCH: WordMatch = { quality: 0, isGuess: true };
const FOUND: WordMatch = { quality: 1, isGuess: false };
// A word of the search found only through guesses is probably misspelled or in no title at all
// ("appreciation" only abbreviates to "Appr", which is "Approaches"), so it counts for this much.
const GUESSED_WORD_WEIGHT = 0.25;

// One course a professor has taught, found by the words of their name or of the course (its code and titles).
type Entry = {
  professor: string;
  course: string;
  title: string;
  nameWords: string[];
  courseWords: string[];
  lastTaught: number;
};
export type Match = { professor: string; course: string; score: number };
export type SearchIndex = {
  entriesByNameWord: Map<string, Entry[]>;
  entriesByCourseWord: Map<string, Entry[]>;
  subjectCodes: Set<string>; // "mat", "cs", ...
  entryCount: number;
};

export function buildSearchIndex(professors: Record<string, Professor>): SearchIndex {
  const entries = buildEntries(professors);
  return {
    entriesByNameWord: indexByWord(entries, (entry) => entry.nameWords),
    entriesByCourseWord: indexByWord(entries, (entry) => entry.courseWords),
    subjectCodes: new Set(entries.map((entry) => wordsOf(entry.course)[0])),
    entryCount: entries.length,
  };
}

// Every entry that matches the search, best first. Entries that match every word of the search
// come first and alone. Only when none do are near misses shown, so "Shaun Beatty" still finds
// Beatty. Then a rare word counts for more than a common one, and a small number ("Calculus 7")
// for less than a word, since it only narrows down which course. A search finds nothing rather than
// only matching its numbers ("arabic 1" isn't everything with a 1). Among equally good matches, the
// ones that have your words (rather than abbreviations or typos of them) come first, then whoever taught
// most recently, then the closest title ("Organic Chemistry I" before "Organic Chem I Lab Lecture").
export function search(index: SearchIndex, query: string): Match[] {
  const queryWords = searchWordsOf(query);
  const matches = matchesPerEntry(index, queryWords);

  const matchesAWord = (entryMatches: WordMatch[]) =>
    entryMatches.some((match, wordNumber) => match.quality > 0 && !isSmallNumber(queryWords[wordNumber]));
  if (!queryWords.every(isSmallNumber) && ![...matches.values()].some(matchesAWord)) return [];

  const weights = queryWords.map((queryWord, wordNumber) =>
    rarity(index, matches, wordNumber) * (isSmallNumber(queryWord) ? 0.5 : 1));
  const wordsMatched = (entryMatches: WordMatch[]) => entryMatches.filter((match) => match.quality > 0).length;
  const mostWordsMatched = Math.max(0, ...[...matches.values()].map(wordsMatched));

  return [...matches]
    .filter(([, entryMatches]) => wordsMatched(entryMatches) === mostWordsMatched)
    .map(([entry, entryMatches]) => ({
      entry,
      score: weightedAverage(entryMatches.map((match) => match.quality), weights),
      wordsFound: entryMatches.filter((match) => match.quality > 0 && !match.isGuess).length,
      titleDistance: titleDistance(entry.title, query),
    }))
    .sort((first, second) =>
      second.score - first.score
      || second.wordsFound - first.wordsFound
      || second.entry.lastTaught - first.entry.lastTaught
      || first.titleDistance - second.titleDistance)
    .map(({ entry, score }) => ({ professor: entry.professor, course: entry.course, score }));
}

// True when any word of the search is in a course's text (its code or a title).
export function sharesAWord(query: string, courseText: string): boolean {
  return searchWordsOf(query).some((queryWord) => isInCourseText(queryWord, courseText));
}

// True when every word of the search is in a course's text, like "math 1213" in "MAT 1213".
export function sharesEveryWord(query: string, courseText: string): boolean {
  return searchWordsOf(query).every((queryWord) => isInCourseText(queryWord, courseText));
}

// How far a course title is from the search: 1 for each title word the search doesn't mention,
// less for one that abbreviates a word of it (by how much of the word it's missing: "Database"
// is closer to "databases" than "Data" is), and half for a misspelling. When the search doesn't
// say which part of a sequence, earlier parts are a little closer ("calculus" is Calculus I first).
// A title that is what you typed plus only its part number is that course, so the number counts
// for half as much: "introduction to computer programming" is "Introduction to Computer
// Programming I" before the different class "Introduction to Computer Programming for Engineers".
export function titleDistance(title: string, query: string): number {
  const queryWords = searchWordsOf(query).flatMap((queryWord) => [queryWord, ...(SHORTHAND.get(queryWord) ?? [])]);
  const wordDistance = (titleWord: string) => {
    if (queryWords.some((queryWord) => queryWord === titleWord || isStartOf(queryWord, titleWord, MIN_PREFIX))) return 0;
    const abbreviated = queryWords.find((queryWord) => titleWord.length >= MIN_PREFIX && queryWord.startsWith(titleWord));
    if (abbreviated !== undefined) return 1 - titleWord.length / abbreviated.length;
    if (queryWords.some((queryWord) => isTypoOf(queryWord, titleWord))) return 0.5;
    return isSmallNumber(titleWord) ? 1 + (Number(titleWord) - 1) / 10 : 1;
  };
  const titleWords = searchWordsOf(title);
  const distances = titleWords.map(wordDistance);
  const isPartLeftOut = (wordNumber: number) => isSmallNumber(titleWords[wordNumber]) && distances[wordNumber] > 0;
  const hasEveryOtherWord = distances.every((distance, wordNumber) => distance === 0 || isPartLeftOut(wordNumber));
  return distances.reduce((total, distance, wordNumber) =>
    total + (hasEveryOtherWord && isPartLeftOut(wordNumber) ? distance - 0.5 : distance), 0);
}

// True when the search names the person: one of its words is a word of their name, the start of one
// ("beat" for Beatty), or a typo of one. Names aren't abbreviated, so "marketing" doesn't name Mark.
export function namesPerson(query: string, name: string): boolean {
  return searchWordsOf(query).some((queryWord) => isInName(queryWord, name));
}

// The words of the search that aren't part of the name.
export function wordsBesidesName(query: string, name: string): string[] {
  return searchWordsOf(query).filter((queryWord) => !isInName(queryWord, name));
}

// The words of the name the search left out.
export function nameWordsNotSearched(name: string, query: string): string[] {
  const queryWords = searchWordsOf(query);
  return wordsOf(name).filter((nameWord) => !queryWords.some((queryWord) => wordMatch(queryWord, nameWord, "name").quality > 0));
}

function isInCourseText(queryWord: string, courseText: string): boolean {
  return wordsOf(courseText).some((word) =>
    wordMatch(queryWord, word, word.length >= MIN_ABBREVIATION ? "title" : "subject code").quality > 0);
}

function isInName(queryWord: string, name: string): boolean {
  return wordsOf(name).some((nameWord) => wordMatch(queryWord, nameWord, "name").quality > 0);
}

// One entry for each course a professor has taught, found by their name, the course code, or any title
// its sections have had (older names, and each topic in a topics course).
function buildEntries(professors: Record<string, Professor>): Entry[] {
  const built: Entry[] = [];
  for (const professor of Object.values(professors)) {
    for (const course of professor.courses) {
      const titles = course.offerings.flatMap((offering) => offering.titles);
      built.push({
        professor: professor.name,
        course: course.code,
        title: course.title,
        nameWords: [...new Set(wordsOf(professor.name))],
        courseWords: [...new Set(wordsOf([course.code, ...titles].join(" ")))],
        lastTaught: semesterRank(course.offerings[0].semester),
      });
    }
  }
  return built;
}

function wordsOf(text: string): string[] {
  const plain = text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // A course code typed without its space ("MAT1213") is the same two words as "MAT 1213".
  const spacedOut = plain.replace(/([a-z])(\d)/g, "$1 $2");
  const words = spacedOut.match(/[a-z0-9]+/g) ?? [];
  return words.map((word) => (ROMAN_NUMERALS.includes(word) ? String(ROMAN_NUMERALS.indexOf(word) + 1) : word));
}

// The words a search looks for: each word once, leaving out little words (unless that's all there is).
function searchWordsOf(query: string): string[] {
  const words = [...new Set(wordsOf(query))];
  const meaningfulWords = words.filter((word) => !LITTLE_WORDS.has(word));
  return meaningfulWords.length > 0 ? meaningfulWords : words;
}

// A part number like the 1 in "Calculus 1", as opposed to a course number like 1213.
function isSmallNumber(word: string): boolean {
  return /^\d{1,2}$/.test(word);
}

function indexByWord(allEntries: Entry[], wordsOfEntry: (entry: Entry) => string[]): Map<string, Entry[]> {
  const index = new Map<string, Entry[]>();
  for (const entry of allEntries) {
    for (const word of wordsOfEntry(entry)) {
      if (!index.has(word)) index.set(word, []);
      index.get(word)!.push(entry);
    }
  }
  return index;
}

// For every entry that matches any word of the search: how it matches each word.
function matchesPerEntry(index: SearchIndex, queryWords: string[]): Map<Entry, WordMatch[]> {
  const matchesByEntry = new Map<Entry, WordMatch[]>();
  function record(wordNumber: number, matches: Map<Entry, WordMatch>) {
    for (const [entry, match] of matches) {
      if (!matchesByEntry.has(entry)) matchesByEntry.set(entry, queryWords.map(() => NO_MATCH));
      const entryMatches = matchesByEntry.get(entry)!;
      entryMatches[wordNumber] = better(entryMatches[wordNumber], match);
    }
  }

  const courseWordMatches = (queryWord: string) => entriesMatching(index.entriesByCourseWord, (word) =>
    wordMatch(queryWord, word, index.subjectCodes.has(word) ? "subject code" : "title"));

  queryWords.forEach((queryWord, wordNumber) => {
    record(wordNumber, entriesMatching(index.entriesByNameWord, (word) => wordMatch(queryWord, word, "name")));
    record(wordNumber, courseWordMatches(queryWord));

    // Shorthand also matches a course with every word it stands for.
    const spelledOut = SHORTHAND.get(queryWord)?.map(courseWordMatches);
    if (spelledOut !== undefined) record(wordNumber, entriesInAll(spelledOut));
  });

  // Two words typed apart can be one word in a title or name: "pre calc" for "Precalculus".
  for (let wordNumber = 0; wordNumber + 1 < queryWords.length; wordNumber++) {
    const joined = queryWords[wordNumber] + queryWords[wordNumber + 1];
    const startsWithJoined = (word: string) => (word.startsWith(joined) ? FOUND : NO_MATCH);
    for (const entriesByWord of [index.entriesByNameWord, index.entriesByCourseWord]) {
      const matches = entriesMatching(entriesByWord, startsWithJoined);
      record(wordNumber, matches);
      record(wordNumber + 1, matches);
    }
  }
  return matchesByEntry;
}

// The entries every one of `matchesPerWord` has, each matching as well as its worst word.
function entriesInAll(matchesPerWord: Map<Entry, WordMatch>[]): Map<Entry, WordMatch> {
  const [first, ...rest] = matchesPerWord;
  const inAll = new Map<Entry, WordMatch>();
  for (const [entry, match] of first) {
    if (!rest.every((matches) => matches.has(entry))) continue;
    const all = [match, ...rest.map((matches) => matches.get(entry)!)];
    inAll.set(entry, { quality: Math.min(...all.map((one) => one.quality)), isGuess: all.some((one) => one.isGuess) });
  }
  return inAll;
}

// Every entry with a word that `matchWord` matches, and how its best word matches.
function entriesMatching(entriesByWord: Map<string, Entry[]>, matchWord: (word: string) => WordMatch): Map<Entry, WordMatch> {
  const matching = new Map<Entry, WordMatch>();
  for (const [word, wordEntries] of entriesByWord) {
    const match = matchWord(word);
    if (match.quality === 0) continue;
    for (const entry of wordEntries) matching.set(entry, better(matching.get(entry) ?? NO_MATCH, match));
  }
  return matching;
}

// The better of two ways an entry matches a word: the higher quality, and a real match over a guess.
function better(first: WordMatch, second: WordMatch): WordMatch {
  return { quality: Math.max(first.quality, second.quality), isGuess: first.isGuess && second.isGuess };
}

// How a word of the search matches a word of an entry:
//   found   the same word, or the start of it ("calc" for "calculus")
//   guesses an abbreviation of it in a title or subject code ("Prog" for "programming", MAT for
//           "math"), which matches fully, or a typo ("calclus"), which matches by how much is right
function wordMatch(queryWord: string, word: string, kind: WordKind): WordMatch {
  if (queryWord === word || isStartOf(queryWord, word, kind === "name" ? MIN_NAME_PREFIX : MIN_PREFIX)) return FOUND;
  const canAbbreviate = kind === "subject code" || (kind === "title" && word.length >= MIN_ABBREVIATION);
  if (canAbbreviate && queryWord.startsWith(word)) return { quality: 1, isGuess: true };
  return isTypoOf(queryWord, word) ? { quality: similarity(queryWord, word), isGuess: true } : NO_MATCH;
}

function isStartOf(queryWord: string, word: string, minLength: number): boolean {
  return queryWord.length >= minLength && word.startsWith(queryWord);
}

// How much a word of the search says, by how rare it is among all the entries: a word few entries
// have says a lot. Only real matches count, unless the word has none and was only guessed at.
function rarity(index: SearchIndex, matches: Map<Entry, WordMatch[]>, wordNumber: number): number {
  let found = 0;
  let guessed = 0;
  for (const entryMatches of matches.values()) {
    const { quality, isGuess } = entryMatches[wordNumber];
    if (quality > 0 && isGuess) guessed++;
    else if (quality > 0) found++;
  }
  if (found > 0) return Math.log(1 + index.entryCount / found);
  return Math.log(1 + index.entryCount / Math.max(1, guessed)) * GUESSED_WORD_WEIGHT;
}

function weightedAverage(values: number[], weights: number[]): number {
  let total = 0;
  let totalWeight = 0;
  values.forEach((value, i) => {
    total += value * weights[i];
    totalWeight += weights[i];
  });
  return total / totalWeight;
}

function isTypoOf(queryWord: string, word: string): boolean {
  const typos = typosAllowed(queryWord);
  if (typos === 0 || Math.abs(queryWord.length - word.length) > typos) return false;
  return editDistance(queryWord, word) <= typos;
}

function typosAllowed(word: string): number {
  if (/\d/.test(word) || word.length < 4) return 0;
  return word.length < 8 ? 1 : 2;
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
