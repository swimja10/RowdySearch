// The search engine behind RowdySearch!
// buildSearchIndex makes one "entry" for each course a professor has taught.
// search() finds the entries that match what was typed, best first. For "beatty calc":
//   1. The search becomes its words: "beatty", "calc".
//   2. Each entry gets one WordMatch for each word (matchesPerEntry):
//        Sean Beatty's MAT 1213, Calculus I        [FOUND, FOUND]
//        another professor's MAT 1213              [NO_MATCH, FOUND]
//        Sean Beatty's MAT 2233, Linear Algebra    [FOUND, NO_MATCH]
//   3. Only the entries that match the most words are kept: here, Beatty's calculus courses.
//   4. Each gets a score from 0 to 1, and the best score comes first. search() has the rules.
// tests/extension/search.test.ts has real searches and what each one should find.
import { lastTaughtRank, type Professor } from "./utils/gradeData.ts";

// MIN_PREFIX: Typing the start of a word ("calc" for "calculus") needs at least MIN_PREFIX many letters,
// and a name needs MIN_NAME_PREFIX ("beat" for Beatty), so "web" doesn't find Professor Weber.
const MIN_PREFIX = 3;
const MIN_NAME_PREFIX = 4;
// The other way round, a title's shortened word ("Prog") finds the longer word you typed
// ("programming"), but only from MIN_TITLE_ABBREVIATION many letters: "Cal" isn't "calculus". Subject codes are the
// exception: MAT is short for "math".
const MIN_TITLE_ABBREVIATION = 4;
// LITTLE_WORDS are words a search doesn't need to find, so "intro to programming" finds "Intro Programming".
const LITTLE_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "for",
  "in",
  "of",
  "on",
  "the",
  "to",
  "with",
]);
const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
// SHORTHAND are shorthands that students type that isn't the start of the words it stands for. Each also finds titles
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

// WordKind is what kind of word an entry's word is. The kind decides how loosely it may match (see wordMatch):
//   name          a word of a professor's name. Typing its start needs 4 letters. Never
//                 abbreviated.
//   title         a word of a course title. Typing its start needs 3 letters. A title's word of 4
//                 letters or more may also be short for what was typed ("Prog" for "programming").
//   subject code  "mat", "cs". Like a title's word, and short for what was typed at any length.
type WordKind = "name" | "title" | "subject code";

// WordMatch is how one word of the search matches one entry.
//   quality  1 when the entry has the word, less for a typo (the share of it that is right),
//            0 for no match
//   isGuess  false when the entry has the word as typed, or a word that starts with it.
//            true when we only think it's what was meant: an abbreviation or a typo.
type WordMatch = { quality: number; isGuess: boolean };
// NO_MATCH counts as a guess, so that better(NO_MATCH, a real match) is still a real match.
const NO_MATCH: WordMatch = { quality: 0, isGuess: true };
const FOUND: WordMatch = { quality: 1, isGuess: false };
// GUESSED_WORD_WEIGHT is a word of the search found only through guesses is probably misspelled or in no title at all
// ("appreciation" only abbreviates to "Appr", which is "Approaches"), so it counts for this much.
const GUESSED_WORD_WEIGHT = 0.25;
// A small number ("Calculus 2") only narrows down which course, so it counts for SMALL_NUMBER_WEIGHT (half) of a word.
const SMALL_NUMBER_WEIGHT = 0.5;
// Careful: no test checks these two weights. `npm run test:search` still passes if they change.

// Entry is one course a professor has taught. It's found by the words of their name, of the course code,
// and of any title its sections have had (older names, and each topic in a topics course).
type Entry = {
  professorName: string;
  courseCode: string;
  title: string;
  nameWords: string[];
  courseWords: string[];
  lastTaught: number; // a semesterRank
};
// Match is one result of a search, and how well it matches (0 to 1). `professor` is the professor's name and
// `course` the course's code, not the Professor and Course of gradeData.ts.
export type Match = { professor: string; course: string; score: number };
// SearchIndex is what search() looks words up in: for each word, the entries with it in their name or their
// course.
export type SearchIndex = {
  entriesByNameWord: Map<string, Entry[]>;
  entriesByCourseWord: Map<string, Entry[]>;
  subjectCodes: Set<string>; // "mat", "cs", ...
  entryCount: number;
};

// RankedEntry is a match on its way to becoming a result, with what the results are sorted by.
type RankedEntry = {
  entry: Entry;
  score: number;
  wordsFound: number; // words of the search it has as typed, not as a guess
  distanceToTitle: number;
};

export function buildSearchIndex(professors: Record<string, Professor>): SearchIndex {
  const entries = buildEntries(professors);
  return {
    entriesByNameWord: indexByWord(entries, (entry) => entry.nameWords),
    entriesByCourseWord: indexByWord(entries, (entry) => entry.courseWords),
    subjectCodes: new Set(entries.map((entry) => wordsOf(entry.courseCode)[0])),
    entryCount: entries.length,
  };
}

function buildEntries(professors: Record<string, Professor>): Entry[] {
  const built: Entry[] = [];
  for (const professor of Object.values(professors)) {
    for (const course of professor.courses) {
      const titles = course.offerings.flatMap((offering) => offering.titles);
      built.push({
        professorName: professor.name,
        courseCode: course.code,
        title: course.title,
        nameWords: [...new Set(wordsOf(professor.name))], // each word once
        courseWords: [...new Set(wordsOf([course.code, ...titles].join(" ")))],
        lastTaught: lastTaughtRank(course),
      });
    }
  }
  return built;
}

// For each word, the entries that have it. `wordsOfEntry` picks which of an entry's words to use.
function indexByWord(
  allEntries: Entry[],
  wordsOfEntry: (entry: Entry) => string[],
): Map<string, Entry[]> {
  const index = new Map<string, Entry[]>();
  for (const entry of allEntries) {
    for (const word of wordsOfEntry(entry)) {
      const entriesWithWord = index.get(word) ?? [];
      entriesWithWord.push(entry);
      index.set(word, entriesWithWord);
    }
  }
  return index;
}

// The words of some text, in and without accents:
// "José's MAT1213" -> "jose", "s", "mat", "1213".
function wordsOf(text: string): string[] {
  // normalize("NFKD") splits an accented letter into the letter and its accent mark. The marks
  // (characters U+0300 to U+036F) are then removed, so "é" is left as "e".
  const plain = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  // A course code typed without its space ("MAT1213") is the same two words as "MAT 1213".
  // $1 is the letter, $2 the digit.
  const spacedOut = plain.replace(/([a-z])(\d)/g, "$1 $2");
  const words = spacedOut.match(/[a-z0-9]+/g) ?? [];
  // A roman numeral becomes its number: "ii" -> "2".
  return words.map((word) => {
    const romanPosition = ROMAN_NUMERALS.indexOf(word);
    return romanPosition === -1 ? word : String(romanPosition + 1);
  });
}

// ---- Searching. The functions after search() are in the order it uses them. ----

// Every entry that matches the search, in the order of best to worst.
//   1. A search finds nothing rather than only matching its numbers ("arabic 1" isn't
//      everything with a 1).
//   2. Entries that match every word of the search come first and alone. Only when none do are
//      near misses shown (the entries that match the most words), so "Shaun Beatty" still
//      finds Beatty.
//   3. The score is the average of how well each word matches (0 to 1), where a rare word counts
//      for more than a common one, a small number ("Calculus 7") for half, and a word that no
//      entry has as typed (a typo) for a quarter. "beaty mat 1213" and Sean Beatty's MAT 1213:
//        word     how well it matches   what it counts for (wordWeights)
//        beaty    0.83 (one typo)       1.55  no entry has "beaty" and 26 are guessed: a quarter
//        mat      1                     3.21  540 of the 12,883 entries have it
//        1213     1                     5.04  only 84 entries have it
//      score = (0.83 x 1.55 + 1 x 3.21 + 1 x 5.04) / (1.55 + 3.21 + 5.04) = 0.97
//   4. Among equally good matches, the ones that have your words (rather than abbreviations or
//      typos of them) come first, then whoever taught most recently, then the closest title
//      ("Organic Chemistry I" before "Organic Chem I Lab Lecture").
export function search(index: SearchIndex, query: string): Match[] {
  const queryWords = searchWordsOf(query);
  const matchesByEntry = matchesPerEntry(index, queryWords);
  if (onlyNumbersMatch(queryWords, matchesByEntry)) return []; // rule 1

  // Rule 2: only the entries that match the most words are kept.
  let mostWordsMatched = 0;
  for (const wordMatches of matchesByEntry.values()) {
    mostWordsMatched = Math.max(mostWordsMatched, countMatched(wordMatches));
  }

  const weights = wordWeights(index, queryWords, matchesByEntry); // rule 3
  const ranked: RankedEntry[] = [];
  for (const [entry, wordMatches] of matchesByEntry) {
    if (countMatched(wordMatches) !== mostWordsMatched) continue;
    const qualities = wordMatches.map((match) => match.quality);
    ranked.push({
      entry,
      score: weightedAverage(qualities, weights),
      wordsFound: wordMatches.filter((match) => match.quality > 0 && !match.isGuess).length,
      distanceToTitle: titleDistance(entry.title, query),
    });
  }

  ranked.sort(bestFirst); // rule 4
  return ranked.map(({ entry, score }) => ({
    professor: entry.professorName,
    course: entry.courseCode,
    score,
  }));
}

// Rule 4 of search(), for sort(): a negative number puts `first` ahead, a positive one `second`.
// Each rule is only reached when the ones before it are a tie (0), which is what "||" does.
function bestFirst(first: RankedEntry, second: RankedEntry): number {
  const byScore = second.score - first.score; // the higher score first
  const byWordsFound = second.wordsFound - first.wordsFound; // then the most words found as typed
  const byLastTaught = second.entry.lastTaught - first.entry.lastTaught; // then most recent
  const byTitle = first.distanceToTitle - second.distanceToTitle; // then the closest title
  return byScore || byWordsFound || byLastTaught || byTitle;
}

// The words a search looks for: each word once, leaving out little words (unless that's all
// there is).
function searchWordsOf(query: string): string[] {
  const words = [...new Set(wordsOf(query))];
  const meaningfulWords = words.filter((word) => !LITTLE_WORDS.has(word));
  return meaningfulWords.length > 0 ? meaningfulWords : words;
}

// For every entry that matches any word of the search: how it matches each word, in the order the
// words were typed (the lists in step 2 at the top). The Map's keys are the entries themselves.
function matchesPerEntry(index: SearchIndex, queryWords: string[]): Map<Entry, WordMatch[]> {
  const matchesByEntry = new Map<Entry, WordMatch[]>();

  // Writes down how some entries match one word of the search (word number 0 is the first word).
  function record(wordNumber: number, matches: Map<Entry, WordMatch>) {
    for (const [entry, match] of matches) {
      // An entry seen for the first time starts with no match for any word.
      if (!matchesByEntry.has(entry)) {
        const noMatchForAnyWord = queryWords.map(() => NO_MATCH);
        matchesByEntry.set(entry, noMatchForAnyWord);
      }
      const wordMatches = matchesByEntry.get(entry)!;
      wordMatches[wordNumber] = better(wordMatches[wordNumber], match);
    }
  }

  queryWords.forEach((queryWord, wordNumber) => {
    record(wordNumber, nameMatches(index, queryWord));
    record(wordNumber, courseMatches(index, queryWord));
    record(wordNumber, shorthandMatches(index, queryWord));
  });

  // Two words typed apart can be one word in a title or name: "pre calc" for "Precalculus".
  // An entry with a word that starts with the two joined ("precalc") has found both of them, so
  // the match is written down for each of the two words.
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

function nameMatches(index: SearchIndex, queryWord: string): Map<Entry, WordMatch> {
  const matchName = (nameWord: string) => wordMatch(queryWord, nameWord, "name");
  return entriesMatching(index.entriesByNameWord, matchName);
}

function courseMatches(index: SearchIndex, queryWord: string): Map<Entry, WordMatch> {
  return entriesMatching(index.entriesByCourseWord, (courseWord) => {
    const kind = index.subjectCodes.has(courseWord) ? "subject code" : "title";
    return wordMatch(queryWord, courseWord, kind);
  });
}

// Shorthand also matches a course that has every word it stands for: "us" finds
// "United States History".
function shorthandMatches(index: SearchIndex, queryWord: string): Map<Entry, WordMatch> {
  const spelledOut = SHORTHAND.get(queryWord);
  if (spelledOut === undefined) return new Map<Entry, WordMatch>();
  return entriesInAll(spelledOut.map((word) => courseMatches(index, word)));
}

// The entries that are in every one of the maps, each matching as well as its worst word: "ai"
// needs both "artificial" and "intelligence", and is a guess if either of them is.
function entriesInAll(matchesPerWord: Map<Entry, WordMatch>[]): Map<Entry, WordMatch> {
  const inAll = new Map<Entry, WordMatch>();
  for (const entry of matchesPerWord[0].keys()) {
    const isInEveryMap = matchesPerWord.every((matches) => matches.has(entry));
    if (!isInEveryMap) continue;

    const matchOfEachWord = matchesPerWord.map((matches) => matches.get(entry)!);
    inAll.set(entry, {
      quality: Math.min(...matchOfEachWord.map((match) => match.quality)),
      isGuess: matchOfEachWord.some((match) => match.isGuess),
    });
  }
  return inAll;
}

// Every entry with a word that `matchWord` matches, and how its best word matches.
// It goes through the index's words, not its entries: there are far fewer different words than
// entries, and each word is only compared once however many entries have it.
function entriesMatching(
  entriesByWord: Map<string, Entry[]>,
  matchWord: (word: string) => WordMatch,
): Map<Entry, WordMatch> {
  const matching = new Map<Entry, WordMatch>();
  for (const [word, wordEntries] of entriesByWord) {
    const match = matchWord(word);
    if (match.quality === 0) continue;
    for (const entry of wordEntries) {
      matching.set(entry, better(matching.get(entry) ?? NO_MATCH, match));
    }
  }
  return matching;
}

// The better of two ways an entry matches a word: the higher quality, and a real match over a
// guess.
function better(first: WordMatch, second: WordMatch): WordMatch {
  return {
    quality: Math.max(first.quality, second.quality),
    isGuess: first.isGuess && second.isGuess,
  };
}

// Rule 1 of search(): true when the search has a real word, yet the entries only match its small
// numbers. A search that is nothing but small numbers ("2") is fine: it finds the entries with
// them.
function onlyNumbersMatch(queryWords: string[], matchesByEntry: Map<Entry, WordMatch[]>): boolean {
  const typedOnlyNumbers = queryWords.every(isSmallNumber);
  if (typedOnlyNumbers) return false;

  for (const wordMatches of matchesByEntry.values()) {
    const matchesARealWord = wordMatches.some((match, wordNumber) => {
      return match.quality > 0 && !isSmallNumber(queryWords[wordNumber]);
    });
    if (matchesARealWord) return false;
  }
  return true;
}

// A part number like the 1 in "Calculus 1", as opposed to a course number like 1213.
function isSmallNumber(word: string): boolean {
  return /^\d{1,2}$/.test(word);
}

// How many words of the search an entry matches at all, guesses included.
function countMatched(wordMatches: WordMatch[]): number {
  return wordMatches.filter((match) => match.quality > 0).length;
}

// Rule 3 of search(): how much each word of the search counts toward the score.
function wordWeights(
  index: SearchIndex,
  queryWords: string[],
  matchesByEntry: Map<Entry, WordMatch[]>,
): number[] {
  return queryWords.map((queryWord, wordNumber) => {
    const wordRarity = rarity(index, matchesByEntry, wordNumber);
    return isSmallNumber(queryWord) ? wordRarity * SMALL_NUMBER_WEIGHT : wordRarity;
  });
}

// How much a word of the search says: a word few entries have says a lot ("inverse document
// frequency"). Of 20,000 entries, a word in 10 of them gets about 7.6, a word in 5,000 about 1.6.
// The logarithm is what keeps the rare word at 5 times the common one, and not 500 times.
function rarity(
  index: SearchIndex,
  matchesByEntry: Map<Entry, WordMatch[]>,
  wordNumber: number,
): number {
  let found = 0;
  let guessed = 0;
  for (const wordMatches of matchesByEntry.values()) {
    const { quality, isGuess } = wordMatches[wordNumber];
    if (quality > 0 && isGuess) guessed++;
    else if (quality > 0) found++;
  }
  if (found > 0) return Math.log(1 + index.entryCount / found);
  // No entry has the word itself, so the guesses at it are counted, and it weighs less.
  // Math.max keeps a word that matched nothing at all from dividing by 0.
  return Math.log(1 + index.entryCount / Math.max(1, guessed)) * GUESSED_WORD_WEIGHT;
}

function weightedAverage(values: number[], weights: number[]): number {
  let total = 0;
  let totalWeight = 0;
  values.forEach((value, position) => {
    total += value * weights[position];
    totalWeight += weights[position];
  });
  return total / totalWeight;
}

// How far a course title is from the search: the sum of what each of its words adds
// (titleWordDistance).
// For "calculus": "Calculus I" is 0.5, "Calculus II" is 0.6, "Calculus for Business" is 1.
export function titleDistance(title: string, query: string): number {
  // Shorthand also counts as the words it stands for: "us" is "united" and "states" too.
  const queryWords: string[] = [];
  for (const queryWord of searchWordsOf(query)) {
    queryWords.push(queryWord, ...(SHORTHAND.get(queryWord) ?? []));
  }

  const titleWords = searchWordsOf(title);
  const distances = titleWords.map((titleWord) => titleWordDistance(titleWord, queryWords));

  // A title that is what you typed plus only its part number is that course, so there the number
  // adds half a word less: "Calculus I" is [0, 1] -> 0 + 0.5, but "Calculus for Business" is
  // [0, 1] -> 0 + 1.
  const isPartNotSearched = (wordNumber: number) => {
    return isSmallNumber(titleWords[wordNumber]) && distances[wordNumber] > 0;
  };
  const isOnlyMissingItsPart = distances.every((distance, wordNumber) => {
    return distance === 0 || isPartNotSearched(wordNumber);
  });

  let total = 0;
  distances.forEach((distance, wordNumber) => {
    const isDiscounted = isOnlyMissingItsPart && isPartNotSearched(wordNumber);
    total += isDiscounted ? distance - 0.5 : distance;
  });
  return total;
}

// What one word of a title adds to titleDistance: 0 when the search has it, 1 or a little more
// when it doesn't.
function titleWordDistance(titleWord: string, queryWords: string[]): number {
  const isInSearch = queryWords.some((queryWord) => {
    return queryWord === titleWord || isStartOf(queryWord, titleWord, MIN_PREFIX);
  });
  if (isInSearch) return 0;

  // The title shortens a word of the search ("Prog" for "programming"). It adds the share of that
  // word it leaves out ("Prog" leaves out 7 of the 11 letters: 0.64), so "Database" is closer to
  // "databases" than "Data" is. Three letters are enough here, where wordMatch asks for four:
  // this only orders courses that already matched.
  const abbreviated = queryWords.find((queryWord) => {
    return titleWord.length >= MIN_PREFIX && queryWord.startsWith(titleWord);
  });
  if (abbreviated !== undefined) return 1 - titleWord.length / abbreviated.length;

  const isMisspelled = queryWords.some((queryWord) => isTypoOf(queryWord, titleWord));
  if (isMisspelled) return 0.5;

  // The search doesn't mention the word. A part number adds a little more the later the part is
  // (1 for part I, 1.1 for part II), so "calculus" is Calculus I first.
  if (isSmallNumber(titleWord)) return 1 + (Number(titleWord) - 1) / 10;
  return 1;
}

// ---- How one word matches another ----

// How a word of the search matches a word of an entry:
//   found   the same word, or the start of it ("calc" for "calculus")
//   guesses an abbreviation of it in a title or subject code ("Prog" for "programming", MAT for
//           "math"), which matches fully, or a typo ("calclus"), which matches by how much is right
function wordMatch(queryWord: string, word: string, kind: WordKind): WordMatch {
  const minPrefix = kind === "name" ? MIN_NAME_PREFIX : MIN_PREFIX;
  if (queryWord === word || isStartOf(queryWord, word, minPrefix)) return FOUND;

  // The other way round: the entry's word is the short one, and what was typed starts with it.
  const isLongTitleWord = kind === "title" && word.length >= MIN_TITLE_ABBREVIATION;
  const canAbbreviate = kind === "subject code" || isLongTitleWord;
  if (canAbbreviate && queryWord.startsWith(word)) return { quality: 1, isGuess: true };

  if (isTypoOf(queryWord, word)) return { quality: similarity(queryWord, word), isGuess: true };
  return NO_MATCH;
}

function isStartOf(queryWord: string, word: string, minLength: number): boolean {
  return queryWord.length >= minLength && word.startsWith(queryWord);
}

function isTypoOf(queryWord: string, word: string): boolean {
  const typos = typosAllowed(queryWord);
  // Words whose lengths differ by more than that can't be that close, so they skip the slower
  // check.
  if (typos === 0 || Math.abs(queryWord.length - word.length) > typos) return false;
  return editDistance(queryWord, word) <= typos;
}

// A word of the search may have one typo from this many letters, and two from this many. In a
// shorter word a typo is too likely to be another word: "cat" and "car".
const ONE_TYPO_FROM = 4;
const TWO_TYPOS_FROM = 8;

// How many typos a word of the search may have. None in a course number: 1213 and 1214 are
// different courses.
function typosAllowed(word: string): number {
  const hasDigit = /\d/.test(word);
  if (hasDigit || word.length < ONE_TYPO_FROM) return 0;
  return word.length < TWO_TYPOS_FROM ? 1 : 2;
}

// 1 for the same word, and less for each typo between them: "calclus" and "calculus" are 0.875.
function similarity(first: string, second: string): number {
  return 1 - editDistance(first, second) / Math.max(first.length, second.length);
}

// How many typos turn one word into the other. A typo is a letter added, left out or replaced, or
// two neighbours swapped: "calclus" -> "calculus" is 1, and so is "claculus" -> "calculus".
// This is the textbook Damerau-Levenshtein distance. It fills a table one row at a time, where the
// number in row r, column c is the distance from the first r letters of `first` to the first c
// letters of `second`. Only the two rows above the current one are kept.
// The table for "cat" -> "cart" (the answer is the last number: 1 typo, the added "r"):
//          c  a  r  t
//       0  1  2  3  4
//    c  1  0  1  2  3
//    a  2  1  0  1  2
//    t  3  2  1  1  1
// Each number is the smallest of: the one above + 1 (a letter left out), the one to its left + 1
// (a letter added), and the one up and to the left, + 1 unless the two letters are the same.
function editDistance(first: string, second: string): number {
  let twoRowsUp: number[] = [];
  // Row 0: from no letters to the first c letters of `second` takes c added letters:
  // [0, 1, 2, ...].
  let rowAbove: number[] = [];
  for (let column = 0; column <= second.length; column++) rowAbove.push(column);

  for (let rowNumber = 1; rowNumber <= first.length; rowNumber++) {
    const row = [rowNumber];
    for (let column = 1; column <= second.length; column++) {
      const isSameLetter = first[rowNumber - 1] === second[column - 1];
      const replaced = rowAbove[column - 1] + (isSameLetter ? 0 : 1);
      const leftOut = rowAbove[column] + 1;
      const added = row[column - 1] + 1;
      row[column] = Math.min(leftOut, added, replaced);
      if (isSwap(first, second, rowNumber, column)) {
        row[column] = Math.min(row[column], twoRowsUp[column - 2] + 1);
      }
    }
    twoRowsUp = rowAbove;
    rowAbove = row;
  }
  return rowAbove[second.length];
}

// True when the last two of the first `rowNumber` letters of `first` are the last two of the first
// `column` letters of `second`, swapped.
function isSwap(first: string, second: string, rowNumber: number, column: number): boolean {
  if (rowNumber < 2 || column < 2) return false;
  return first[rowNumber - 1] === second[column - 2] && first[rowNumber - 2] === second[column - 1];
}

// ---- Questions pageForSearch.ts and pageForSection.ts ask about a search and some text ----

// True when any word of the search is in a course's text (its code or a title).
export function sharesAWord(query: string, courseText: string): boolean {
  return searchWordsOf(query).some((queryWord) => isInCourseText(queryWord, courseText));
}

// True when every word of the search is in `text`, like "math 1213" in "MAT 1213". `text` is a
// course code or, in pageForSection.ts, a professor's name, which is matched the way a code is.
export function sharesEveryWord(query: string, text: string): boolean {
  return searchWordsOf(query).every((queryWord) => isInCourseText(queryWord, text));
}

function isInCourseText(queryWord: string, courseText: string): boolean {
  return wordsOf(courseText).some((word) => {
    // There's no index here to say which words are subject codes, so every word too short to be a
    // title's abbreviation is taken for one. That lets "math" find MAT.
    const kind = word.length >= MIN_TITLE_ABBREVIATION ? "title" : "subject code";
    return wordMatch(queryWord, word, kind).quality > 0;
  });
}

// True when the search names the person: one of its words is a word of their name, the start of
// one ("beat" for Beatty), or a typo of one. Names aren't abbreviated, so "marketing" doesn't name
// Mark.
export function queryNamesPerson(query: string, name: string): boolean {
  return searchWordsOf(query).some((queryWord) => isInName(queryWord, name));
}

export function wordsBesidesName(query: string, name: string): string[] {
  return searchWordsOf(query).filter((queryWord) => !isInName(queryWord, name));
}

export function nameWordsNotSearched(name: string, query: string): string[] {
  const queryWords = searchWordsOf(query);
  const isSearched = (nameWord: string) => {
    return queryWords.some((queryWord) => wordMatch(queryWord, nameWord, "name").quality > 0);
  };
  return wordsOf(name).filter((nameWord) => !isSearched(nameWord));
}

function isInName(queryWord: string, name: string): boolean {
  return wordsOf(name).some((nameWord) => wordMatch(queryWord, nameWord, "name").quality > 0);
}
