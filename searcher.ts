import { readFileSync } from "node:fs";

const ALLOWED_WRONG_WORDS = 1;
const CLASS_KEY = /^(.+?) - (.+) \((\w+ \d{4})\)$/;

type Entry = { professor: string; course: string; classes: string[]; words: string[] };
type Match = { professor: string; course: string; classes: string[]; score: number };

const data = JSON.parse(readFileSync("./data/cleaned_grade_data.json", "utf8"));
const entries = buildEntries(data);
const entriesByWord = indexByWord(entries);

export function search(query: string): Match[] {
  const queryWords = [...new Set(wordsOf(query))];
  const neededWords = Math.max(1, queryWords.length - ALLOWED_WRONG_WORDS);
  const matchedWords = new Map<Entry, number>();

  for (const queryWord of queryWords) {
    for (const entry of entriesMatching(queryWord)) {
      matchedWords.set(entry, (matchedWords.get(entry) ?? 0) + 1);
    }
  }

  return [...matchedWords]
    .filter(([, count]) => count >= neededWords)
    .map(([entry]) => ({
      professor: entry.professor,
      course: entry.course,
      classes: entry.classes,
      score: closeness(queryWords, entry.words),
    }))
    .sort((first, second) => second.score - first.score);
}

function buildEntries(professors: Record<string, any>): Entry[] {
  const built: Entry[] = [];
  for (const [professor, info] of Object.entries(professors)) {
    for (const [course, classes] of classesByCourse(info)) {
      const titles = classes.map((classKey) => classKey.match(CLASS_KEY)![2]);
      const words = wordsOf([professor, course, ...titles].join(" "));
      built.push({ professor, course, classes, words: [...new Set(words)] });
    }
  }
  return built;
}

function classesByCourse(info: Record<string, any>): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  for (const classKey of Object.keys(info)) {
    const course = classKey.match(CLASS_KEY)?.[1];
    if (!course) continue;
    grouped.set(course, [...(grouped.get(course) ?? []), classKey]);
  }
  return grouped;
}

function wordsOf(text: string): string[] {
  const plain = text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return plain.match(/[a-z0-9]+/g) ?? [];
}

function indexByWord(allEntries: Entry[]): Map<string, Entry[]> {
  const index = new Map<string, Entry[]>();
  for (const entry of allEntries) {
    for (const word of entry.words) {
      if (!index.has(word)) index.set(word, []);
      index.get(word)!.push(entry);
    }
  }
  return index;
}

function entriesMatching(queryWord: string): Set<Entry> {
  const matching = new Set<Entry>();
  for (const [word, wordEntries] of entriesByWord) {
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

const input = process.argv.slice(2).join(" ") || "Darrn Meritz WRC";
const [best] = search(input);

if (!best) {
  console.log(`No match for "${input}"`);
} else {
  console.log(best.professor, "|", best.course, "| score", best.score.toFixed(2));
  for (const classKey of best.classes) {
    console.log(classKey, data[best.professor][classKey]["A"]);
  }
}
