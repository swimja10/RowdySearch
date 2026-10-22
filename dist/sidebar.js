import { n as __toESM } from "./rolldown-runtime.js";
import { a as animate, c as require_react, i as set, n as twMerge, o as require_compiler_runtime, r as stagger, s as require_client, t as require_jsx_runtime } from "./libraries.js";
import { t as require_plotly_basic } from "./plotly.js";
//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/components/Button.tsx
var import_client = require_client();
var import_compiler_runtime = require_compiler_runtime();
var import_react = require_react();
var import_jsx_runtime = require_jsx_runtime();
function Button(t0) {
	const $ = (0, import_compiler_runtime.c)(10);
	let className;
	let props;
	let t1;
	if ($[0] !== t0) {
		({variant: t1, className, ...props} = t0);
		$[0] = t0;
		$[1] = className;
		$[2] = props;
		$[3] = t1;
	} else {
		className = $[1];
		props = $[2];
		t1 = $[3];
	}
	const variant = t1 === void 0 ? "primary" : t1;
	let t2;
	if ($[4] !== className || $[5] !== variant) {
		t2 = twMerge("transition-colors rounded px-2 py-1 disabled:opacity-30 disabled:cursor-not-allowed", getVariantStyles(variant), className);
		$[4] = className;
		$[5] = variant;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== props || $[8] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			...props,
			className: t2
		});
		$[7] = props;
		$[8] = t2;
		$[9] = t3;
	} else t3 = $[9];
	return t3;
}
function getVariantStyles(variant) {
	switch (variant) {
		case "primary": return "bg-orange-600 hover:bg-orange-500";
		case "secondary": return "bg-zinc-700 hover:bg-zinc-600 text-zinc-200";
		case "link": return "p-0 text-left text-orange-400 hover:text-orange-300 hover:underline";
		default: throw new Error(`Invalid variant: ${variant}`);
	}
}
//#endregion
//#region src/components/Footer.tsx
function Footer() {
	const $ = (0, import_compiler_runtime.c)(1);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "mt-auto pt-2 text-center text-xs text-zinc-500",
			children: "Created by Jacob Swim"
		});
		$[0] = t0;
	} else t0 = $[0];
	return t0;
}
//#endregion
//#region src/components/Section.tsx
function Section(t0) {
	const $ = (0, import_compiler_runtime.c)(5);
	const { title, children } = t0;
	let t1;
	if ($[0] !== title) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs font-semibold uppercase tracking-wide text-zinc-400",
			children: title
		});
		$[0] = title;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== children || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col gap-2",
			children: [t1, children]
		});
		$[2] = children;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
}
//#endregion
//#region src/components/VennIcon.tsx
var RIGHT_CIRCLE = {
	cx: 31,
	cy: 16,
	r: 12.5
};
var STRIPE_HEIGHTS = [
	8,
	12,
	16,
	20,
	24
];
function VennIcon(t0) {
	const $ = (0, import_compiler_runtime.c)(21);
	const { className } = t0;
	const id = (0, import_react.useId)();
	const maskId = `${id}-mask`;
	const overlapId = `${id}-overlap`;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { ...RIGHT_CIRCLE });
		$[0] = t1;
	} else t1 = $[0];
	let t2;
	if ($[1] !== overlapId) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
			id: overlapId,
			children: t1
		});
		$[1] = overlapId;
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	let t4;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "48",
			height: "32",
			fill: "white"
		});
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...RIGHT_CIRCLE,
			fill: "none",
			stroke: "black",
			strokeWidth: "5.5"
		});
		$[3] = t3;
		$[4] = t4;
	} else {
		t3 = $[3];
		t4 = $[4];
	}
	const t5 = `url(#${overlapId})`;
	let t6;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = STRIPE_HEIGHTS.map(_temp$13);
		$[5] = t6;
	} else t6 = $[5];
	let t7;
	if ($[6] !== t5) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
			clipPath: t5,
			children: t6
		});
		$[6] = t5;
		$[7] = t7;
	} else t7 = $[7];
	let t8;
	if ($[8] !== maskId || $[9] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mask", {
			id: maskId,
			children: [
				t3,
				t4,
				t7
			]
		});
		$[8] = maskId;
		$[9] = t7;
		$[10] = t8;
	} else t8 = $[10];
	let t9;
	if ($[11] !== t2 || $[12] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [t2, t8] });
		$[11] = t2;
		$[12] = t8;
		$[13] = t9;
	} else t9 = $[13];
	const t10 = `url(#${maskId})`;
	let t11;
	if ($[14] !== t10) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "16",
			cy: "16",
			r: "14",
			fill: "currentColor",
			mask: t10
		});
		$[14] = t10;
		$[15] = t11;
	} else t11 = $[15];
	let t12;
	if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			...RIGHT_CIRCLE,
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "2.5"
		});
		$[16] = t12;
	} else t12 = $[16];
	let t13;
	if ($[17] !== className || $[18] !== t11 || $[19] !== t9) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 48 32",
			className,
			"aria-hidden": "true",
			children: [
				t9,
				t11,
				t12
			]
		});
		$[17] = className;
		$[18] = t11;
		$[19] = t9;
		$[20] = t13;
	} else t13 = $[20];
	return t13;
}
function _temp$13(y) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "0",
		y: y - 1,
		width: "48",
		height: "2",
		fill: "black"
	}, y);
}
//#endregion
//#region src/components/analytics/SeriesName.tsx
function SeriesName(t0) {
	const $ = (0, import_compiler_runtime.c)(11);
	const { series, onOpen } = t0;
	let t1;
	if ($[0] !== series.color) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-3 shrink-0 rounded-full",
			style: { backgroundColor: series.color }
		});
		$[0] = series.color;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== onOpen || $[3] !== series.subject) {
		t2 = () => onOpen(series.subject);
		$[2] = onOpen;
		$[3] = series.subject;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== series.label || $[6] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			onClick: t2,
			children: series.label
		});
		$[5] = series.label;
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] !== t1 || $[9] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [t1, t3]
		});
		$[8] = t1;
		$[9] = t3;
		$[10] = t4;
	} else t4 = $[10];
	return t4;
}
//#endregion
//#region src/searcher.ts
var ALLOWED_WRONG_WORDS = 1;
function buildSearchIndex(professors) {
	return indexByWord(buildEntries(professors));
}
function search(index, query) {
	const queryWords = [...new Set(wordsOf(query))];
	const neededWords = Math.max(1, queryWords.length - ALLOWED_WRONG_WORDS);
	const matchedWords = /* @__PURE__ */ new Map();
	for (const queryWord of queryWords) for (const entry of entriesMatching(index, queryWord)) matchedWords.set(entry, (matchedWords.get(entry) ?? 0) + 1);
	return [...matchedWords].filter(([, count]) => count >= neededWords).map(([entry]) => ({
		professor: entry.professor,
		course: entry.course,
		score: closeness(queryWords, entry.words)
	})).sort((first, second) => second.score - first.score);
}
function sharesAWord(query, text) {
	const textWords = wordsOf(text);
	return wordsOf(query).some((queryWord) => isAnyOf(queryWord, textWords));
}
function sharesEveryWord(query, text) {
	const textWords = wordsOf(text);
	return wordsOf(query).every((queryWord) => isAnyOf(queryWord, textWords));
}
function wordsMissingFrom(text, other) {
	const otherWords = wordsOf(other);
	return wordsOf(text).filter((word) => !isAnyOf(word, otherWords));
}
function isAnyOf(queryWord, words) {
	return words.some((word) => isSameWord(queryWord, word));
}
function buildEntries(professors) {
	const built = [];
	for (const professor of Object.values(professors)) for (const course of professor.courses) {
		const titles = course.offerings.flatMap((offering) => offering.titles);
		const words = wordsOf([
			professor.name,
			course.code,
			...titles
		].join(" "));
		built.push({
			professor: professor.name,
			course: course.code,
			words: [...new Set(words)]
		});
	}
	return built;
}
function wordsOf(text) {
	return text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/([a-z])(\d)/g, "$1 $2").match(/[a-z0-9]+/g) ?? [];
}
function indexByWord(allEntries) {
	const index = /* @__PURE__ */ new Map();
	for (const entry of allEntries) for (const word of entry.words) {
		if (!index.has(word)) index.set(word, []);
		index.get(word).push(entry);
	}
	return index;
}
function entriesMatching(index, queryWord) {
	const matching = /* @__PURE__ */ new Set();
	for (const [word, wordEntries] of index) if (isSameWord(queryWord, word)) for (const entry of wordEntries) matching.add(entry);
	return matching;
}
function isSameWord(queryWord, word) {
	if (queryWord === word) return true;
	const typos = typosAllowed(queryWord);
	if (Math.abs(queryWord.length - word.length) > typos) return false;
	return editDistance(queryWord, word) <= typos;
}
function typosAllowed(word) {
	if (/\d/.test(word) || word.length < 4) return 0;
	return word.length < 8 ? 1 : 2;
}
function closeness(queryWords, entryWords) {
	let total = 0;
	for (const queryWord of queryWords) total += Math.max(...entryWords.map((word) => similarity(queryWord, word)));
	return total / queryWords.length;
}
function similarity(first, second) {
	return 1 - editDistance(first, second) / Math.max(first.length, second.length);
}
function editDistance(first, second) {
	let twoRowsUp = [];
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
function isSwap(first, second, i, j) {
	return i > 1 && j > 1 && first[i - 1] === second[j - 2] && first[i - 2] === second[j - 1];
}
//#endregion
//#region src/utils/grades.ts
var LETTER_GRADES = [
	"A+",
	"A",
	"A-",
	"B+",
	"B",
	"B-",
	"C+",
	"C",
	"C-",
	"D+",
	"D",
	"D-",
	"F"
];
var GRADES = [
	...LETTER_GRADES,
	"W",
	"IN",
	"IW",
	"IF"
];
var GRADE_GROUPS = [
	{
		label: "A",
		grades: [
			"A+",
			"A",
			"A-"
		]
	},
	{
		label: "B",
		grades: [
			"B+",
			"B",
			"B-"
		]
	},
	{
		label: "C",
		grades: [
			"C+",
			"C",
			"C-"
		]
	},
	{
		label: "D",
		grades: [
			"D+",
			"D",
			"D-"
		]
	},
	{
		label: "F",
		grades: ["F"]
	},
	{
		label: "W",
		grades: ["W"]
	}
];
function emptyGradeCounts() {
	const counts = {};
	for (const grade of GRADES) counts[grade] = 0;
	return counts;
}
function addGrades(gradeCountsList) {
	const total = emptyGradeCounts();
	for (const counts of gradeCountsList) for (const grade of GRADES) total[grade] += counts[grade];
	return total;
}
function medianGrade(counts) {
	const middleStudent = Math.ceil(countStudents(counts, LETTER_GRADES) / 2);
	if (middleStudent === 0) return null;
	let studentsCounted = 0;
	for (const grade of LETTER_GRADES) {
		studentsCounted += counts[grade];
		if (studentsCounted >= middleStudent) return grade;
	}
	return null;
}
function gradeShares(counts) {
	const total = countStudents(counts, GRADE_GROUPS.flatMap((group) => group.grades));
	return GRADE_GROUPS.map((group) => ({
		label: group.label,
		percent: total === 0 ? 0 : countStudents(counts, group.grades) / total * 100
	}));
}
function countStudents(counts, grades = GRADES) {
	let students = 0;
	for (const grade of grades) students += counts[grade];
	return students;
}
//#endregion
//#region src/utils/semesters.ts
var SEASON_ORDER = {
	Spring: 1,
	Summer: 2,
	Fall: 3
};
function semesterRank(semester) {
	const [season, year] = semester.split(" ");
	return Number(year) * 10 + SEASON_ORDER[season];
}
//#endregion
//#region src/utils/statistics.ts
var GRADES_WORST_FIRST = [...LETTER_GRADES].reverse();
var A_GRADES = [
	"A+",
	"A",
	"A-"
];
var D_AND_F_GRADES = [
	"D+",
	"D",
	"D-",
	"F"
];
var WITHDREW = ["W"];
var GRADE_POINTS = {
	"A+": 4,
	"A": 4,
	"A-": 3.67,
	"B+": 3.33,
	"B": 3,
	"B-": 2.67,
	"C+": 2.33,
	"C": 2,
	"C-": 1.67,
	"D+": 1.33,
	"D": 1,
	"D-": .67,
	"F": 0
};
var FINISHED_OR_WITHDREW = [...LETTER_GRADES, "W"];
function average(values) {
	if (values.length === 0) return null;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function averageGpa(counts) {
	const students = countStudents(counts, LETTER_GRADES);
	if (students === 0) return null;
	let totalPoints = 0;
	for (const grade of LETTER_GRADES) totalPoints += counts[grade] * GRADE_POINTS[grade];
	return totalPoints / students;
}
function percentWhoGot(counts, grades) {
	const students = countStudents(counts, FINISHED_OR_WITHDREW);
	if (students === 0) return null;
	return countStudents(counts, grades) / students * 100;
}
function percentDifference(value, average) {
	return (value - average) / average * 100;
}
function gradePosition(grade) {
	return GRADES_WORST_FIRST.indexOf(grade) + 1;
}
function gradeDistribution(counts, { inPercent, atOrAbove }) {
	const studentsPerGrade = GRADES_WORST_FIRST.map((grade) => counts[grade]);
	const values = atOrAbove ? countAtOrAbove(studentsPerGrade) : studentsPerGrade;
	if (!inPercent) return values;
	const totalStudents = countStudents(counts, LETTER_GRADES);
	return values.map((value) => totalStudents === 0 ? 0 : value / totalStudents * 100);
}
function countAtOrAbove(studentsWorstFirst) {
	const atOrAbove = [];
	let studentsSoFar = 0;
	for (let i = studentsWorstFirst.length - 1; i >= 0; i--) {
		studentsSoFar += studentsWorstFirst[i];
		atOrAbove[i] = studentsSoFar;
	}
	return atOrAbove;
}
//#endregion
//#region src/utils/courses.ts
function findCourse(professor, courseCode) {
	return professor.courses.find((course) => course.code === courseCode);
}
function allOfferings(professor) {
	return professor.courses.flatMap((course) => course.offerings);
}
function teachersOf(courseCode, professors, searchIndex) {
	return search(searchIndex, courseCode).filter((match) => match.course === courseCode).map((match) => {
		const professor = professors[match.professor];
		return {
			professor,
			course: findCourse(professor, courseCode)
		};
	}).sort((first, second) => lastTaughtRank$1(second) - lastTaughtRank$1(first));
}
function courseName(teachers) {
	const newestSemester = teachers[0].course.offerings[0].semester;
	const titles = teachers.filter((teacher) => teacher.course.offerings[0].semester === newestSemester).map((teacher) => teacher.course.title);
	const uses = /* @__PURE__ */ new Map();
	for (const title of titles) uses.set(title, (uses.get(title) ?? 0) + 1);
	const [mostUsed, count] = [...uses].sort(([, first], [, second]) => second - first)[0];
	return titles.length >= 3 && count * 2 <= titles.length ? null : mostUsed;
}
function gradesOf(offerings) {
	return addGrades(offerings.map((offering) => offering.grades));
}
function bluebookOf(offerings) {
	const evaluations = offerings.flatMap((offering) => offering.evaluations);
	return {
		instructor: average(evaluations.map((evaluation) => evaluation.instructor)),
		course: average(evaluations.map((evaluation) => evaluation.course)),
		sectionCount: evaluations.length
	};
}
function lastTaughtRank$1(teacher) {
	return semesterRank(teacher.course.offerings[0].semester);
}
//#endregion
//#region src/utils/subjects.ts
var PROFESSORS_TO_START_WITH = 3;
function subjectLabel(subject) {
	switch (subject.type) {
		case "professor": return `${subject.professorName} (all classes)`;
		case "course": return `${subject.courseCode} (every professor)`;
		case "class": return `${subject.professorName} · ${subject.courseCode}`;
		default: throw new Error(`Invalid subject: ${subject}`);
	}
}
function subjectKey(subject) {
	return JSON.stringify(subject);
}
function professorNameOf(subject) {
	return subject.type === "course" ? null : subject.professorName;
}
function offeringsForSubject(subject, { professors, searchIndex }) {
	switch (subject.type) {
		case "professor": return allOfferings(professors[subject.professorName]);
		case "course": return teachersOf(subject.courseCode, professors, searchIndex).flatMap((teacher) => teacher.course.offerings);
		case "class": return findCourse(professors[subject.professorName], subject.courseCode)?.offerings ?? [];
		default: throw new Error(`Invalid subject: ${subject}`);
	}
}
function subjectsToStartWith(page, { professors, searchIndex }) {
	switch (page.type) {
		case "search": return [];
		case "professor": return [page];
		case "class": return [
			page,
			{
				type: "course",
				courseCode: page.courseCode
			},
			{
				type: "professor",
				professorName: page.professorName
			}
		];
		case "course": return [page, ...teachersOf(page.courseCode, professors, searchIndex).filter((teacher) => countStudents(gradesOf(teacher.course.offerings)) > 0).slice(0, PROFESSORS_TO_START_WITH).map((teacher) => ({
			type: "class",
			professorName: teacher.professor.name,
			courseCode: page.courseCode
		}))];
		default: throw new Error(`Invalid page: ${page}`);
	}
}
//#endregion
//#region src/utils/series.ts
var SERIES_COLORS = [
	"#3987e5",
	"#d95926",
	"#199e70",
	"#c98500",
	"#d55181",
	"#008300",
	"#9085e9",
	"#e66767"
];
function seriesFor(subjects) {
	return subjects.map((subject, index) => ({
		subject,
		color: SERIES_COLORS[index]
	}));
}
function isAdded(seriesList, subject) {
	return seriesList.some((series) => subjectKey(series.subject) === subjectKey(subject));
}
function withSubjectAdded(seriesList, subject) {
	const unusedColor = SERIES_COLORS.find((color) => !seriesList.some((series) => series.color === color));
	if (isAdded(seriesList, subject) || unusedColor === void 0) return seriesList;
	return [...seriesList, {
		subject,
		color: unusedColor
	}];
}
function describeSeries({ subject, color }, gradeData) {
	const professorName = professorNameOf(subject);
	const offerings = offeringsForSubject(subject, gradeData);
	return {
		subject,
		key: subjectKey(subject),
		label: subjectLabel(subject),
		color,
		grades: gradesOf(offerings),
		bluebook: bluebookOf(offerings),
		professorName,
		rating: professorName === null ? null : gradeData.professors[professorName].rmp.rating,
		courseGpa: subject.type === "class" ? wholeCourseGpa(subject.courseCode, gradeData) : null
	};
}
function wholeCourseGpa(courseCode, gradeData) {
	return averageGpa(gradesOf(offeringsForSubject({
		type: "course",
		courseCode
	}, gradeData)));
}
//#endregion
//#region src/components/analytics/ComparingList.tsx
function ComparingList(t0) {
	const $ = (0, import_compiler_runtime.c)(20);
	const { seriesData, onRemove, onClear, onOpen } = t0;
	let t1;
	if ($[0] !== seriesData.length) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs font-semibold uppercase tracking-wide text-zinc-400",
			children: [
				"Comparing ",
				seriesData.length,
				" of ",
				SERIES_COLORS.length
			]
		});
		$[0] = seriesData.length;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== onClear || $[3] !== seriesData.length) {
		t2 = seriesData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			className: "text-xs",
			onClick: onClear,
			children: "Clear all"
		});
		$[2] = onClear;
		$[3] = seriesData.length;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== t1 || $[6] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [t1, t2]
		});
		$[5] = t1;
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] !== onOpen || $[9] !== onRemove || $[10] !== seriesData) {
		let t5;
		if ($[12] !== onOpen || $[13] !== onRemove) {
			t5 = (series) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesName, {
					series,
					onOpen
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "px-2 text-xs",
					"aria-label": `Remove ${series.label}`,
					onClick: () => onRemove(series.key),
					children: "✕"
				})]
			}, series.key);
			$[12] = onOpen;
			$[13] = onRemove;
			$[14] = t5;
		} else t5 = $[14];
		t4 = seriesData.map(t5);
		$[8] = onOpen;
		$[9] = onRemove;
		$[10] = seriesData;
		$[11] = t4;
	} else t4 = $[11];
	let t5;
	if ($[15] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-1",
			children: t4
		});
		$[15] = t4;
		$[16] = t5;
	} else t5 = $[16];
	let t6;
	if ($[17] !== t3 || $[18] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [t3, t5]
		});
		$[17] = t3;
		$[18] = t5;
		$[19] = t6;
	} else t6 = $[19];
	return t6;
}
//#endregion
//#region src/utils/format.ts
function formatOutOfFive(value) {
	return value === null ? "No ratings" : `${value.toFixed(1)} / 5`;
}
function formatPercent(value) {
	return value === null ? "No ratings" : `${Math.round(value)}%`;
}
function formatRating(source, rating) {
	return rating === null ? `No ${source} ratings` : `${source} ${formatOutOfFive(rating)}`;
}
function formatGpa(gpa) {
	return gpa === null ? "—" : gpa.toFixed(2);
}
function formatShare(percent) {
	return percent === null ? "—" : `${Math.round(percent)}%`;
}
function formatCount(count, noun) {
	return `${count.toLocaleString()} ${count === 1 ? noun : `${noun}s`}`;
}
//#endregion
//#region src/components/analytics/ComparisonTable.tsx
var COLUMNS = [
	"Comparing",
	"Median",
	"Avg GPA",
	"vs. course average",
	"A's",
	"D or F",
	"Withdrew",
	"Grades",
	"Bluebook instructor",
	"Bluebook course",
	"RMP"
];
var CENTERED_COLUMNS = ["Median", "Avg GPA"];
var TWO_LINE_COLUMNS = [
	"vs. course average",
	"Bluebook instructor",
	"Bluebook course"
];
function ComparisonTable(t0) {
	const $ = (0, import_compiler_runtime.c)(8);
	const { seriesData, onOpen } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
			className: "text-xs uppercase tracking-wide text-zinc-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: COLUMNS.map(_temp$12) })
		});
		$[0] = t1;
	} else t1 = $[0];
	let t2;
	if ($[1] !== onOpen || $[2] !== seriesData) {
		let t3;
		if ($[4] !== onOpen) {
			t3 = (series) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonRow, {
				series,
				onOpen
			}, series.key);
			$[4] = onOpen;
			$[5] = t3;
		} else t3 = $[5];
		t2 = seriesData.map(t3);
		$[1] = onOpen;
		$[2] = seriesData;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[6] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-zinc-800",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [t1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: t2 })]
			})
		});
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	return t3;
}
function _temp$12(column) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: headerStyle(column),
		children: column
	}, column);
}
function headerStyle(column) {
	return twMerge("whitespace-nowrap px-3 py-2 font-semibold", CENTERED_COLUMNS.includes(column) && "text-center", TWO_LINE_COLUMNS.includes(column) && "w-24 whitespace-normal");
}
function ComparisonRow(t0) {
	const $ = (0, import_compiler_runtime.c)(64);
	const { series, onOpen } = t0;
	const { grades } = series;
	let gpa;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	if ($[0] !== grades || $[1] !== onOpen || $[2] !== series) {
		gpa = averageGpa(grades);
		t3 = "border-t border-zinc-700 tabular-nums";
		if ($[9] !== onOpen || $[10] !== series) {
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "min-w-44 px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesName, {
					series,
					onOpen
				})
			});
			$[9] = onOpen;
			$[10] = series;
			$[11] = t4;
		} else t4 = $[11];
		let t6;
		if ($[12] !== grades) {
			t6 = medianGrade(grades) ?? "—";
			$[12] = grades;
			$[13] = t6;
		} else t6 = $[13];
		if ($[14] !== t6) {
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-2 text-center font-semibold",
				children: t6
			});
			$[14] = t6;
			$[15] = t5;
		} else t5 = $[15];
		t1 = "px-3 py-2 text-center";
		t2 = formatGpa(gpa);
		$[0] = grades;
		$[1] = onOpen;
		$[2] = series;
		$[3] = gpa;
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
		$[7] = t4;
		$[8] = t5;
	} else {
		gpa = $[3];
		t1 = $[4];
		t2 = $[5];
		t3 = $[6];
		t4 = $[7];
		t5 = $[8];
	}
	let t6;
	if ($[16] !== t1 || $[17] !== t2) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: t1,
			children: t2
		});
		$[16] = t1;
		$[17] = t2;
		$[18] = t6;
	} else t6 = $[18];
	let t7;
	if ($[19] !== gpa || $[20] !== series.courseGpa) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseComparison, {
				gpa,
				courseGpa: series.courseGpa
			})
		});
		$[19] = gpa;
		$[20] = series.courseGpa;
		$[21] = t7;
	} else t7 = $[21];
	let t8;
	if ($[22] !== grades) {
		t8 = formatShare(percentWhoGot(grades, A_GRADES));
		$[22] = grades;
		$[23] = t8;
	} else t8 = $[23];
	let t9;
	if ($[24] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t8
		});
		$[24] = t8;
		$[25] = t9;
	} else t9 = $[25];
	let t10;
	if ($[26] !== grades) {
		t10 = formatShare(percentWhoGot(grades, D_AND_F_GRADES));
		$[26] = grades;
		$[27] = t10;
	} else t10 = $[27];
	let t11;
	if ($[28] !== t10) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t10
		});
		$[28] = t10;
		$[29] = t11;
	} else t11 = $[29];
	let t12;
	if ($[30] !== grades) {
		t12 = formatShare(percentWhoGot(grades, WITHDREW));
		$[30] = grades;
		$[31] = t12;
	} else t12 = $[31];
	let t13;
	if ($[32] !== t12) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t12
		});
		$[32] = t12;
		$[33] = t13;
	} else t13 = $[33];
	let t14;
	if ($[34] !== grades) {
		t14 = countStudents(grades, LETTER_GRADES).toLocaleString();
		$[34] = grades;
		$[35] = t14;
	} else t14 = $[35];
	let t15;
	if ($[36] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t14
		});
		$[36] = t14;
		$[37] = t15;
	} else t15 = $[37];
	let t16;
	if ($[38] !== series.bluebook.instructor) {
		t16 = formatOutOfFive(series.bluebook.instructor);
		$[38] = series.bluebook.instructor;
		$[39] = t16;
	} else t16 = $[39];
	let t17;
	if ($[40] !== t16) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: t16
		});
		$[40] = t16;
		$[41] = t17;
	} else t17 = $[41];
	let t18;
	if ($[42] !== series.bluebook.course) {
		t18 = formatOutOfFive(series.bluebook.course);
		$[42] = series.bluebook.course;
		$[43] = t18;
	} else t18 = $[43];
	let t19;
	if ($[44] !== t18) {
		t19 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: t18
		});
		$[44] = t18;
		$[45] = t19;
	} else t19 = $[45];
	let t20;
	if ($[46] !== series.professorName || $[47] !== series.rating) {
		t20 = series.professorName === null ? "—" : formatOutOfFive(series.rating);
		$[46] = series.professorName;
		$[47] = series.rating;
		$[48] = t20;
	} else t20 = $[48];
	let t21;
	if ($[49] !== t20) {
		t21 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: t20
		});
		$[49] = t20;
		$[50] = t21;
	} else t21 = $[50];
	let t22;
	if ($[51] !== t11 || $[52] !== t13 || $[53] !== t15 || $[54] !== t17 || $[55] !== t19 || $[56] !== t21 || $[57] !== t3 || $[58] !== t4 || $[59] !== t5 || $[60] !== t6 || $[61] !== t7 || $[62] !== t9) {
		t22 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: t3,
			children: [
				t4,
				t5,
				t6,
				t7,
				t9,
				t11,
				t13,
				t15,
				t17,
				t19,
				t21
			]
		});
		$[51] = t11;
		$[52] = t13;
		$[53] = t15;
		$[54] = t17;
		$[55] = t19;
		$[56] = t21;
		$[57] = t3;
		$[58] = t4;
		$[59] = t5;
		$[60] = t6;
		$[61] = t7;
		$[62] = t9;
		$[63] = t22;
	} else t22 = $[63];
	return t22;
}
function CourseComparison(t0) {
	const $ = (0, import_compiler_runtime.c)(12);
	const { gpa, courseGpa } = t0;
	if (gpa === null || courseGpa === null) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-zinc-500",
				children: "—"
			});
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	let t2;
	let t3;
	let t4;
	if ($[1] !== courseGpa || $[2] !== gpa) {
		t4 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const difference = Math.round(percentDifference(gpa, courseGpa));
			if (difference === 0) {
				let t5;
				if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
					t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Same as average" });
					$[7] = t5;
				} else t5 = $[7];
				t4 = t5;
				break bb0;
			}
			if (difference > 0) {
				t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium text-green-400",
					children: [
						"▲ ",
						difference,
						"% higher"
					]
				});
				break bb0;
			}
			t1 = "font-medium text-red-400";
			t2 = "▼ ";
			t3 = Math.abs(difference);
		}
		$[1] = courseGpa;
		$[2] = gpa;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
		$[6] = t4;
	} else {
		t1 = $[3];
		t2 = $[4];
		t3 = $[5];
		t4 = $[6];
	}
	if (t4 !== Symbol.for("react.early_return_sentinel")) return t4;
	let t5;
	if ($[8] !== t1 || $[9] !== t2 || $[10] !== t3) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: t1,
			children: [
				t2,
				t3,
				"% lower"
			]
		});
		$[8] = t1;
		$[9] = t2;
		$[10] = t3;
		$[11] = t5;
	} else t5 = $[11];
	return t5;
}
//#endregion
//#region src/components/analytics/PlotlyChart.tsx
var import_plotly_basic = /* @__PURE__ */ __toESM(require_plotly_basic(), 1);
var DARK_LAYOUT = {
	paper_bgcolor: "rgba(0, 0, 0, 0)",
	plot_bgcolor: "rgba(0, 0, 0, 0)",
	font: {
		color: "#d4d4d8",
		family: "system-ui, sans-serif",
		size: 13
	},
	margin: {
		l: 64,
		r: 16,
		t: 40,
		b: 56
	},
	legend: {
		orientation: "h",
		x: 0,
		y: 1.02,
		yanchor: "bottom"
	},
	hoverlabel: {
		bgcolor: "#27272a",
		bordercolor: "#3f3f46",
		font: { color: "#f4f4f5" }
	},
	dragmode: false
};
var AXIS_STYLE = {
	gridcolor: "#27272a",
	linecolor: "#3f3f46",
	zerolinecolor: "#3f3f46",
	automargin: true,
	fixedrange: true
};
var CONFIG = {
	displaylogo: false,
	responsive: true,
	doubleClick: false,
	showSendToCloud: false,
	modeBarButtonsToRemove: [
		"zoom2d",
		"pan2d",
		"select2d",
		"lasso2d",
		"zoomIn2d",
		"zoomOut2d",
		"autoScale2d",
		"resetScale2d"
	]
};
function PlotlyChart(t0) {
	const $ = (0, import_compiler_runtime.c)(8);
	const { data, layout, className: t1 } = t0;
	const className = t1 === void 0 ? "h-80" : t1;
	const chartRef = (0, import_react.useRef)(null);
	let t2;
	let t3;
	if ($[0] !== data || $[1] !== layout) {
		t2 = () => {
			const darkLayout = {
				...DARK_LAYOUT,
				...layout,
				xaxis: {
					...AXIS_STYLE,
					...layout.xaxis
				},
				yaxis: {
					...AXIS_STYLE,
					...layout.yaxis
				}
			};
			import_plotly_basic.default.react(chartRef.current, data, darkLayout, CONFIG);
		};
		t3 = [data, layout];
		$[0] = data;
		$[1] = layout;
		$[2] = t2;
		$[3] = t3;
	} else {
		t2 = $[2];
		t3 = $[3];
	}
	(0, import_react.useEffect)(t2, t3);
	let t4;
	let t5;
	if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = () => {
			const chart = chartRef.current;
			return () => import_plotly_basic.default.purge(chart);
		};
		t5 = [];
		$[4] = t4;
		$[5] = t5;
	} else {
		t4 = $[4];
		t5 = $[5];
	}
	(0, import_react.useEffect)(t4, t5);
	const t6 = `w-full ${className}`;
	let t7;
	if ($[6] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: chartRef,
			className: t6
		});
		$[6] = t6;
		$[7] = t7;
	} else t7 = $[7];
	return t7;
}
//#endregion
//#region src/components/analytics/Toggle.tsx
function Toggle(t0) {
	const $ = (0, import_compiler_runtime.c)(15);
	const { choices, firstIsOn, onChange } = t0;
	const t1 = firstIsOn ? "primary" : "secondary";
	let t2;
	if ($[0] !== onChange) {
		t2 = () => onChange(true);
		$[0] = onChange;
		$[1] = t2;
	} else t2 = $[1];
	let t3;
	if ($[2] !== choices[0] || $[3] !== t1 || $[4] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: t1,
			onClick: t2,
			children: choices[0]
		});
		$[2] = choices[0];
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
	} else t3 = $[5];
	const t4 = firstIsOn ? "secondary" : "primary";
	let t5;
	if ($[6] !== onChange) {
		t5 = () => onChange(false);
		$[6] = onChange;
		$[7] = t5;
	} else t5 = $[7];
	let t6;
	if ($[8] !== choices[1] || $[9] !== t4 || $[10] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: t4,
			onClick: t5,
			children: choices[1]
		});
		$[8] = choices[1];
		$[9] = t4;
		$[10] = t5;
		$[11] = t6;
	} else t6 = $[11];
	let t7;
	if ($[12] !== t3 || $[13] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-1 rounded-lg bg-zinc-800 p-1 text-sm",
			children: [t3, t6]
		});
		$[12] = t3;
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	return t7;
}
//#endregion
//#region src/components/analytics/GradeDistributionChart.tsx
function GradeDistributionChart(t0) {
	const $ = (0, import_compiler_runtime.c)(44);
	const { seriesData } = t0;
	const [inPercent, setInPercent] = (0, import_react.useState)(true);
	const [asLines, setAsLines] = (0, import_react.useState)(true);
	const [eachGrade, setEachGrade] = (0, import_react.useState)(true);
	const t1 = !eachGrade;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	let t8;
	if ($[0] !== asLines || $[1] !== eachGrade || $[2] !== inPercent || $[3] !== seriesData || $[4] !== t1) {
		t8 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const options = {
				inPercent,
				atOrAbove: t1
			};
			const withGrades = seriesData.filter(_temp$11);
			const withoutGrades = seriesData.filter((series_0) => !withGrades.includes(series_0));
			const data = withGrades.map((series_1) => ({
				type: asLines ? "scatter" : "bar",
				mode: "lines+markers",
				name: series_1.label,
				x: GRADES_WORST_FIRST,
				y: gradeDistribution(series_1.grades, options),
				line: {
					color: series_1.color,
					width: 2
				},
				marker: {
					color: series_1.color,
					size: 8
				},
				hovertemplate: inPercent ? "%{y:.1f}%" : "%{y} students"
			}));
			let t9;
			if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
				t9 = {
					title: { text: "Grade" },
					type: "category"
				};
				$[12] = t9;
			} else t9 = $[12];
			const t10 = !eachGrade;
			let t11;
			if ($[13] !== inPercent || $[14] !== t10) {
				t11 = yAxisTitle(inPercent, t10);
				$[13] = inPercent;
				$[14] = t10;
				$[15] = t11;
			} else t11 = $[15];
			let t12;
			if ($[16] !== t11) {
				t12 = { text: t11 };
				$[16] = t11;
				$[17] = t12;
			} else t12 = $[17];
			const t13 = inPercent ? "%" : "";
			let t14;
			if ($[18] !== t12 || $[19] !== t13) {
				t14 = {
					barmode: "group",
					hovermode: "x unified",
					xaxis: t9,
					yaxis: {
						title: t12,
						ticksuffix: t13,
						rangemode: "tozero"
					}
				};
				$[18] = t12;
				$[19] = t13;
				$[20] = t14;
			} else t14 = $[20];
			const layout = t14;
			if (withGrades.length === 0) {
				let t15;
				if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
					t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-zinc-500",
						children: "None of these have grades released yet."
					});
					$[21] = t15;
				} else t15 = $[21];
				t8 = t15;
				break bb0;
			}
			t5 = "flex flex-col gap-3";
			let t15;
			if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
				t15 = ["Percent", "Students"];
				$[22] = t15;
			} else t15 = $[22];
			let t16;
			if ($[23] !== inPercent) {
				t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					choices: t15,
					firstIsOn: inPercent,
					onChange: setInPercent
				});
				$[23] = inPercent;
				$[24] = t16;
			} else t16 = $[24];
			let t17;
			if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
				t17 = ["Lines", "Bars"];
				$[25] = t17;
			} else t17 = $[25];
			let t18;
			if ($[26] !== asLines) {
				t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					choices: t17,
					firstIsOn: asLines,
					onChange: setAsLines
				});
				$[26] = asLines;
				$[27] = t18;
			} else t18 = $[27];
			let t19;
			if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
				t19 = ["Each grade", "At or above"];
				$[28] = t19;
			} else t19 = $[28];
			let t20;
			if ($[29] !== eachGrade) {
				t20 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
					choices: t19,
					firstIsOn: eachGrade,
					onChange: setEachGrade
				});
				$[29] = eachGrade;
				$[30] = t20;
			} else t20 = $[30];
			if ($[31] !== t16 || $[32] !== t18 || $[33] !== t20) {
				t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						t16,
						t18,
						t20
					]
				});
				$[31] = t16;
				$[32] = t18;
				$[33] = t20;
				$[34] = t6;
			} else t6 = $[34];
			t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotlyChart, {
				data,
				layout,
				className: "h-96"
			});
			t2 = "text-xs text-zinc-500";
			t3 = "Out of students who got a letter grade. Withdrawals (W) are in the table below.";
			t4 = withoutGrades.length > 0 && ` Not shown (no grades yet): ${withoutGrades.map(_temp2$3).join(", ")}.`;
		}
		$[0] = asLines;
		$[1] = eachGrade;
		$[2] = inPercent;
		$[3] = seriesData;
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
		$[10] = t7;
		$[11] = t8;
	} else {
		t2 = $[5];
		t3 = $[6];
		t4 = $[7];
		t5 = $[8];
		t6 = $[9];
		t7 = $[10];
		t8 = $[11];
	}
	if (t8 !== Symbol.for("react.early_return_sentinel")) return t8;
	let t9;
	if ($[35] !== t2 || $[36] !== t3 || $[37] !== t4) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: t2,
			children: [t3, t4]
		});
		$[35] = t2;
		$[36] = t3;
		$[37] = t4;
		$[38] = t9;
	} else t9 = $[38];
	let t10;
	if ($[39] !== t5 || $[40] !== t6 || $[41] !== t7 || $[42] !== t9) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t5,
			children: [
				t6,
				t7,
				t9
			]
		});
		$[39] = t5;
		$[40] = t6;
		$[41] = t7;
		$[42] = t9;
		$[43] = t10;
	} else t10 = $[43];
	return t10;
}
function _temp2$3(series_2) {
	return series_2.label;
}
function _temp$11(series) {
	return countStudents(series.grades, LETTER_GRADES) > 0;
}
function yAxisTitle(inPercent, atOrAbove) {
	const measure = inPercent ? "% of students" : "Students";
	return atOrAbove ? `${measure} at or above` : measure;
}
//#endregion
//#region src/components/analytics/MedianChart.tsx
function MedianChart(t0) {
	const $ = (0, import_compiler_runtime.c)(26);
	const { seriesData } = t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	let t8;
	if ($[0] !== seriesData) {
		t8 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const withGrades = seriesData.filter(_temp$10);
			const medians = withGrades.map(_temp2$2);
			if (withGrades.length === 0) {
				let t9;
				if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
					t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-zinc-500",
						children: "None of these have grades released yet."
					});
					$[9] = t9;
				} else t9 = $[9];
				t8 = t9;
				break bb0;
			}
			t2 = "bar";
			t3 = withGrades.map(_temp3);
			t4 = medians.map(gradePosition);
			t5 = medians;
			t6 = "outside";
			if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
				t7 = {
					color: "#f4f4f5",
					size: 15
				};
				$[10] = t7;
			} else t7 = $[10];
			t1 = withGrades.map(_temp4);
		}
		$[0] = seriesData;
		$[1] = t1;
		$[2] = t2;
		$[3] = t3;
		$[4] = t4;
		$[5] = t5;
		$[6] = t6;
		$[7] = t7;
		$[8] = t8;
	} else {
		t1 = $[1];
		t2 = $[2];
		t3 = $[3];
		t4 = $[4];
		t5 = $[5];
		t6 = $[6];
		t7 = $[7];
		t8 = $[8];
	}
	if (t8 !== Symbol.for("react.early_return_sentinel")) return t8;
	let t9;
	if ($[11] !== t1) {
		t9 = { color: t1 };
		$[11] = t1;
		$[12] = t9;
	} else t9 = $[12];
	let t10;
	if ($[13] !== t2 || $[14] !== t3 || $[15] !== t4 || $[16] !== t5 || $[17] !== t6 || $[18] !== t7 || $[19] !== t9) {
		t10 = [{
			type: t2,
			x: t3,
			y: t4,
			text: t5,
			textposition: t6,
			textfont: t7,
			marker: t9,
			hovertemplate: "%{x}<br>Median Grade %{text}<extra></extra>"
		}];
		$[13] = t2;
		$[14] = t3;
		$[15] = t4;
		$[16] = t5;
		$[17] = t6;
		$[18] = t7;
		$[19] = t9;
		$[20] = t10;
	} else t10 = $[20];
	const data = t10;
	let t11;
	let t12;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = {
			l: 16,
			r: 16,
			t: 32,
			b: 56
		};
		t12 = { showgrid: false };
		$[21] = t11;
		$[22] = t12;
	} else {
		t11 = $[21];
		t12 = $[22];
	}
	let t13;
	if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
		t13 = {
			showlegend: false,
			hovermode: "closest",
			margin: t11,
			xaxis: t12,
			yaxis: {
				visible: false,
				range: [0, GRADES_WORST_FIRST.length + 1]
			}
		};
		$[23] = t13;
	} else t13 = $[23];
	const layout = t13;
	let t14;
	if ($[24] !== data) {
		t14 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotlyChart, {
			data,
			layout,
			className: "h-80"
		});
		$[24] = data;
		$[25] = t14;
	} else t14 = $[25];
	return t14;
}
function _temp4(series_2) {
	return series_2.color;
}
function _temp3(series_1) {
	return series_1.label;
}
function _temp2$2(series_0) {
	return medianGrade(series_0.grades);
}
function _temp$10(series) {
	return medianGrade(series.grades) !== null;
}
//#endregion
//#region src/components/Reviews.tsx
function Reviews(t0) {
	const $ = (0, import_compiler_runtime.c)(5);
	const { reviews } = t0;
	if (reviews.length === 0) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500",
				children: "No reviews on Rate My Professors yet."
			});
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	if ($[1] !== reviews) {
		t1 = reviews.map(_temp$9);
		$[1] = reviews;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: t1
		});
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
}
function _temp$9(review, index) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-col gap-1 rounded-xl bg-zinc-800 p-3 text-sm text-zinc-300",
		children: [review.course !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs font-medium text-zinc-500",
			children: review.course
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			"“",
			review.comment,
			"”"
		] })]
	}, index);
}
//#endregion
//#region src/context/useLookup.ts
var LookupContext = (0, import_react.createContext)(null);
function useLookup() {
	const lookupContext = (0, import_react.useContext)(LookupContext);
	if (lookupContext == null) throw new Error("useLookup must be used inside LookupProvider");
	return lookupContext;
}
//#endregion
//#region src/components/analytics/ProfessorReviews.tsx
function ProfessorReviews(t0) {
	const $ = (0, import_compiler_runtime.c)(9);
	const { seriesData, onOpen } = t0;
	const { professors } = useLookup();
	let t1;
	if ($[0] !== seriesData) {
		t1 = new Set(seriesData.map(_temp$8).filter(_temp2$1));
		$[0] = seriesData;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== t1) {
		t2 = [...t1];
		$[2] = t1;
		$[3] = t2;
	} else t2 = $[3];
	const professorNames = t2;
	if (professorNames.length === 0) {
		let t3;
		if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
			t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-500",
				children: "Add a professor to see what students say about them."
			});
			$[4] = t3;
		} else t3 = $[4];
		return t3;
	}
	let t3;
	if ($[5] !== onOpen || $[6] !== professorNames || $[7] !== professors) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: professorNames.map((name_0) => {
				const { rmp } = professors[name_0];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					open: true,
					className: "rounded-xl border border-zinc-800 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "link",
							onClick: () => onOpen({
								type: "professor",
								professorName: name_0
							}),
							children: name_0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-zinc-400",
							children: [" · ", formatRating("RMP", rmp.rating)]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: rmp.reviews })
					})]
				}, name_0);
			})
		});
		$[5] = onOpen;
		$[6] = professorNames;
		$[7] = professors;
		$[8] = t3;
	} else t3 = $[8];
	return t3;
}
function _temp2$1(name) {
	return name !== null;
}
function _temp$8(series) {
	return series.professorName;
}
//#endregion
//#region src/utils/pageForSearch.ts
function pageForSearch(query, results, professors) {
	if (results.length === 0) return null;
	const bestMatches = results.filter((match) => match.score === results[0].score);
	if (bestMatches.some((match) => sharesEveryWord(query, match.course))) return {
		type: "course",
		courseCode: closestCourse(bestMatches, query, professors)
	};
	const bestMatch = closestName(bestMatches, query);
	const professor = professors[bestMatch.professor];
	const course = findCourse(professor, bestMatch.course);
	const courseWords = [course.code, ...course.offerings.flatMap((offering) => offering.titles)].join(" ");
	const namesProfessor = sharesAWord(query, professor.name);
	const namesCourse = sharesAWord(wordsMissingFrom(query, professor.name).join(" "), courseWords);
	if (namesProfessor && namesCourse) return {
		type: "class",
		professorName: professor.name,
		courseCode: course.code
	};
	if (namesProfessor) return {
		type: "professor",
		professorName: professor.name
	};
	return {
		type: "course",
		courseCode: closestCourse(bestMatches, query, professors)
	};
}
function closestName(matches, query) {
	const extraNameWords = (match) => wordsMissingFrom(match.professor, query).length;
	return [...matches].sort((first, second) => extraNameWords(first) - extraNameWords(second))[0];
}
function closestCourse(matches, query, professors) {
	const courses = /* @__PURE__ */ new Map();
	for (const match of matches) {
		const title = findCourse(professors[match.professor], match.course).title;
		const teachers = (courses.get(match.course)?.teachers ?? 0) + 1;
		const codeMatches = sharesEveryWord(query, match.course) ? 1 : 0;
		courses.set(match.course, {
			codeMatches,
			titleWords: title.split(" ").length,
			teachers
		});
	}
	return [...courses].sort(([, first], [, second]) => second.codeMatches - first.codeMatches || first.titleWords - second.titleWords || second.teachers - first.teachers)[0][0];
}
//#endregion
//#region src/components/analytics/SubjectPicker.tsx
function SubjectPicker(t0) {
	const $ = (0, import_compiler_runtime.c)(36);
	const { canAddMore, isAdded, onAdd } = t0;
	const { professors, searchIndex } = useLookup();
	const [query, setQuery] = (0, import_react.useState)("");
	let t1;
	if ($[0] !== query || $[1] !== searchIndex) {
		t1 = search(searchIndex, query);
		$[0] = query;
		$[1] = searchIndex;
		$[2] = t1;
	} else t1 = $[2];
	const results = t1;
	let t2;
	if ($[3] !== canAddMore || $[4] !== isAdded || $[5] !== onAdd || $[6] !== professors || $[7] !== query || $[8] !== results) {
		t2 = function handleSubmit(e) {
			e.preventDefault();
			const bestSubject = pageForSearch(query, results, professors);
			if (bestSubject === null || !canAddMore || isAdded(bestSubject)) return;
			onAdd(bestSubject);
			setQuery("");
		};
		$[3] = canAddMore;
		$[4] = isAdded;
		$[5] = onAdd;
		$[6] = professors;
		$[7] = query;
		$[8] = results;
		$[9] = t2;
	} else t2 = $[9];
	const handleSubmit = t2;
	let t3;
	if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = (e_0) => setQuery(e_0.target.value);
		$[10] = t3;
	} else t3 = $[10];
	let t4;
	if ($[11] !== query) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: query,
			onChange: t3,
			className: "w-full rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
			placeholder: "Add a professor, class, or subject"
		});
		$[11] = query;
		$[12] = t4;
	} else t4 = $[12];
	let t5;
	if ($[13] !== handleSubmit || $[14] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
			onSubmit: handleSubmit,
			children: t4
		});
		$[13] = handleSubmit;
		$[14] = t4;
		$[15] = t5;
	} else t5 = $[15];
	let t6;
	if ($[16] !== canAddMore) {
		t6 = !canAddMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-zinc-400",
			children: "That's 8, the most the charts can show. Remove one to add more."
		});
		$[16] = canAddMore;
		$[17] = t6;
	} else t6 = $[17];
	let t7;
	if ($[18] !== results.length) {
		t7 = results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs text-zinc-400",
			children: [
				results.length,
				" ",
				results.length === 1 ? "match" : "matches",
				", best first"
			]
		});
		$[18] = results.length;
		$[19] = t7;
	} else t7 = $[19];
	let t8;
	if ($[20] !== canAddMore || $[21] !== isAdded || $[22] !== onAdd || $[23] !== results) {
		let t9;
		if ($[25] !== canAddMore || $[26] !== isAdded || $[27] !== onAdd) {
			t9 = (match) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchChoices, {
				match,
				canAddMore,
				isAdded,
				onAdd
			}, `${match.professor} ${match.course}`);
			$[25] = canAddMore;
			$[26] = isAdded;
			$[27] = onAdd;
			$[28] = t9;
		} else t9 = $[28];
		t8 = results.map(t9);
		$[20] = canAddMore;
		$[21] = isAdded;
		$[22] = onAdd;
		$[23] = results;
		$[24] = t8;
	} else t8 = $[24];
	let t9;
	if ($[29] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex max-h-[32rem] flex-col gap-2 overflow-y-auto",
			children: t8
		});
		$[29] = t8;
		$[30] = t9;
	} else t9 = $[30];
	let t10;
	if ($[31] !== t5 || $[32] !== t6 || $[33] !== t7 || $[34] !== t9) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				t5,
				t6,
				t7,
				t9
			]
		});
		$[31] = t5;
		$[32] = t6;
		$[33] = t7;
		$[34] = t9;
		$[35] = t10;
	} else t10 = $[35];
	return t10;
}
function MatchChoices(t0) {
	const $ = (0, import_compiler_runtime.c)(27);
	const { match, canAddMore, isAdded, onAdd } = t0;
	const { professors } = useLookup();
	const t1 = professors[match.professor];
	let t2;
	if ($[0] !== match.course || $[1] !== t1) {
		t2 = findCourse(t1, match.course);
		$[0] = match.course;
		$[1] = t1;
		$[2] = t2;
	} else t2 = $[2];
	const course = t2;
	let t3;
	let t4;
	let t5;
	let t6;
	if ($[3] !== canAddMore || $[4] !== course.code || $[5] !== course.title || $[6] !== isAdded || $[7] !== match.course || $[8] !== match.professor || $[9] !== onAdd) {
		const choices = [
			{
				label: "Professor",
				subject: {
					type: "professor",
					professorName: match.professor
				}
			},
			{
				label: "Whole course",
				subject: {
					type: "course",
					courseCode: match.course
				}
			},
			{
				label: "This class",
				subject: {
					type: "class",
					professorName: match.professor,
					courseCode: match.course
				}
			}
		];
		t5 = "flex flex-col gap-2 rounded-xl bg-zinc-800 p-3";
		let t7;
		if ($[14] !== course.code || $[15] !== course.title) {
			t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-zinc-400",
				children: [
					"· ",
					course.code,
					" ",
					course.title
				]
			});
			$[14] = course.code;
			$[15] = course.title;
			$[16] = t7;
		} else t7 = $[16];
		if ($[17] !== match.professor || $[18] !== t7) {
			t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm",
				children: [
					match.professor,
					" ",
					t7
				]
			});
			$[17] = match.professor;
			$[18] = t7;
			$[19] = t6;
		} else t6 = $[19];
		t3 = "flex flex-wrap gap-1";
		t4 = choices.map((choice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "secondary",
			className: "text-xs",
			disabled: !canAddMore || isAdded(choice.subject),
			onClick: () => onAdd(choice.subject),
			children: ["+ ", choice.label]
		}, choice.label));
		$[3] = canAddMore;
		$[4] = course.code;
		$[5] = course.title;
		$[6] = isAdded;
		$[7] = match.course;
		$[8] = match.professor;
		$[9] = onAdd;
		$[10] = t3;
		$[11] = t4;
		$[12] = t5;
		$[13] = t6;
	} else {
		t3 = $[10];
		t4 = $[11];
		t5 = $[12];
		t6 = $[13];
	}
	let t7;
	if ($[20] !== t3 || $[21] !== t4) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: t3,
			children: t4
		});
		$[20] = t3;
		$[21] = t4;
		$[22] = t7;
	} else t7 = $[22];
	let t8;
	if ($[23] !== t5 || $[24] !== t6 || $[25] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t5,
			children: [t6, t7]
		});
		$[23] = t5;
		$[24] = t6;
		$[25] = t7;
		$[26] = t8;
	} else t8 = $[26];
	return t8;
}
//#endregion
//#region src/utils/hostPage.ts
var isOnAPage = window.parent !== window;
function setFullScreen(isFullScreen) {
	if (!isOnAPage) return Promise.resolve();
	return new Promise((resolve) => {
		window.addEventListener("resize", () => resolve(), { once: true });
		setTimeout(resolve, 500);
		tellPage({
			rowdySearch: "fullScreen",
			isFullScreen
		});
	});
}
function closeSidebar() {
	if (isOnAPage) tellPage({ rowdySearch: "close" });
}
function tellPage(message) {
	window.parent.postMessage(message, "*");
}
//#endregion
//#region src/components/analytics/AnalyticsMode.tsx
function AnalyticsMode() {
	const $ = (0, import_compiler_runtime.c)(51);
	const { page, professors, searchIndex, openPage, closeAnalytics } = useLookup();
	let t0;
	if ($[0] !== professors || $[1] !== searchIndex) {
		t0 = {
			professors,
			searchIndex
		};
		$[0] = professors;
		$[1] = searchIndex;
		$[2] = t0;
	} else t0 = $[2];
	const gradeData = t0;
	let t1;
	if ($[3] !== gradeData || $[4] !== page) {
		t1 = () => seriesFor(subjectsToStartWith(page, gradeData));
		$[3] = gradeData;
		$[4] = page;
		$[5] = t1;
	} else t1 = $[5];
	const [seriesList, setSeriesList] = (0, import_react.useState)(t1);
	const [sidebarWidth] = (0, import_react.useState)(_temp$7);
	const panelRef = (0, import_react.useRef)(null);
	let t2;
	if ($[6] !== gradeData || $[7] !== seriesList) {
		let t3;
		if ($[9] !== gradeData) {
			t3 = (series) => describeSeries(series, gradeData);
			$[9] = gradeData;
			$[10] = t3;
		} else t3 = $[10];
		t2 = seriesList.map(t3);
		$[6] = gradeData;
		$[7] = seriesList;
		$[8] = t2;
	} else t2 = $[8];
	const seriesData = t2;
	let t3;
	let t4;
	if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = () => {
			slideIn(panelRef.current);
		};
		t4 = [];
		$[11] = t3;
		$[12] = t4;
	} else {
		t3 = $[11];
		t4 = $[12];
	}
	(0, import_react.useEffect)(t3, t4);
	let t5;
	if ($[13] !== closeAnalytics || $[14] !== sidebarWidth) {
		t5 = async function handleClose() {
			await slideOut(panelRef.current, sidebarWidth);
			closeAnalytics();
		};
		$[13] = closeAnalytics;
		$[14] = sidebarWidth;
		$[15] = t5;
	} else t5 = $[15];
	const handleClose = t5;
	let t6;
	if ($[16] !== handleClose || $[17] !== openPage) {
		t6 = function openInSidebar(subject) {
			openPage(subject);
			handleClose();
		};
		$[16] = handleClose;
		$[17] = openPage;
		$[18] = t6;
	} else t6 = $[18];
	const openInSidebar = t6;
	let t7;
	if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
		t7 = function addSubject(subject_0) {
			setSeriesList((curr) => withSubjectAdded(curr, subject_0));
		};
		$[19] = t7;
	} else t7 = $[19];
	const addSubject = t7;
	let t8;
	if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
		t8 = function removeSeries(key) {
			setSeriesList((curr_0) => curr_0.filter((series_0) => subjectKey(series_0.subject) !== key));
		};
		$[20] = t8;
	} else t8 = $[20];
	const removeSeries = t8;
	let t9;
	if ($[21] !== sidebarWidth) {
		t9 = { width: sidebarWidth };
		$[21] = sidebarWidth;
		$[22] = t9;
	} else t9 = $[22];
	let t10;
	if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "flex items-center gap-3 text-2xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VennIcon, { className: "h-8 w-12 text-orange-500" }), "Analytical Mode"]
		});
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] !== handleClose) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			"data-reveal": true,
			className: "flex items-center justify-between gap-4 opacity-0",
			children: [t10, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: handleClose,
				children: "✕ Close"
			})]
		});
		$[24] = handleClose;
		$[25] = t11;
	} else t11 = $[25];
	let t12;
	if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
		t12 = () => setSeriesList([]);
		$[26] = t12;
	} else t12 = $[26];
	let t13;
	if ($[27] !== openInSidebar || $[28] !== seriesData) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparingList, {
			seriesData,
			onRemove: removeSeries,
			onClear: t12,
			onOpen: openInSidebar
		});
		$[27] = openInSidebar;
		$[28] = seriesData;
		$[29] = t13;
	} else t13 = $[29];
	const t14 = seriesList.length < SERIES_COLORS.length;
	let t15;
	if ($[30] !== seriesList) {
		t15 = (subject_1) => isAdded(seriesList, subject_1);
		$[30] = seriesList;
		$[31] = t15;
	} else t15 = $[31];
	let t16;
	if ($[32] !== t14 || $[33] !== t15) {
		t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPicker, {
			canAddMore: t14,
			isAdded: t15,
			onAdd: addSubject
		});
		$[32] = t14;
		$[33] = t15;
		$[34] = t16;
	} else t16 = $[34];
	let t17;
	if ($[35] !== t13 || $[36] !== t16) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			"data-reveal": true,
			className: "flex flex-col gap-6 opacity-0",
			children: [t13, t16]
		});
		$[35] = t13;
		$[36] = t16;
		$[37] = t17;
	} else t17 = $[37];
	let t18;
	if ($[38] !== openInSidebar || $[39] !== seriesData) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			"data-reveal": true,
			className: "flex min-w-0 flex-col gap-8 opacity-0",
			children: seriesData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-24 text-center text-zinc-500",
				children: "Search on the left to add professors, courses, or one professor's class to compare."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Grade distribution",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeDistributionChart, { seriesData })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Median Grade",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedianChart, { seriesData })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Side by side",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonTable, {
						seriesData,
						onOpen: openInSidebar
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "What students say",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorReviews, {
						seriesData,
						onOpen: openInSidebar
					})
				})
			] })
		});
		$[38] = openInSidebar;
		$[39] = seriesData;
		$[40] = t18;
	} else t18 = $[40];
	let t19;
	if ($[41] !== t17 || $[42] !== t18) {
		t19 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
			children: [t17, t18]
		});
		$[41] = t17;
		$[42] = t18;
		$[43] = t19;
	} else t19 = $[43];
	let t20;
	if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
		t20 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"data-reveal": true,
			className: "mt-auto opacity-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		});
		$[44] = t20;
	} else t20 = $[44];
	let t21;
	if ($[45] !== t11 || $[46] !== t19) {
		t21 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-full flex-col gap-6 p-6",
			children: [
				t11,
				t19,
				t20
			]
		});
		$[45] = t11;
		$[46] = t19;
		$[47] = t21;
	} else t21 = $[47];
	let t22;
	if ($[48] !== t21 || $[49] !== t9) {
		t22 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: panelRef,
			className: "fixed inset-y-0 right-0 overflow-y-auto bg-zinc-900 text-zinc-100",
			style: t9,
			children: t21
		});
		$[48] = t21;
		$[49] = t9;
		$[50] = t22;
	} else t22 = $[50];
	return t22;
}
function _temp$7() {
	return window.innerWidth;
}
async function slideIn(panel) {
	const parts = panel.querySelectorAll("[data-reveal]");
	set(parts, { translateY: 24 });
	const startWidth = panel.offsetWidth;
	await setFullScreen(true);
	await animate(panel, {
		width: [`${startWidth}px`, `${window.innerWidth}px`],
		duration: 500,
		ease: "outQuart"
	});
	panel.style.width = "100%";
	window.dispatchEvent(new Event("resize"));
	animate(parts, {
		opacity: 1,
		translateY: 0,
		delay: stagger(80),
		duration: 400,
		ease: "outQuad"
	});
}
async function slideOut(panel, sidebarWidth) {
	await animate(panel.querySelectorAll("[data-reveal]"), {
		opacity: 0,
		duration: 150
	});
	await animate(panel, {
		width: [`${panel.offsetWidth}px`, `${sidebarWidth}px`],
		duration: 400,
		ease: "inQuart"
	});
	await setFullScreen(false);
}
//#endregion
//#region src/components/GradeBars.tsx
function GradeBars(t0) {
	const $ = (0, import_compiler_runtime.c)(19);
	const { grades } = t0;
	let t1;
	let t2;
	let t3;
	let t4;
	if ($[0] !== grades) {
		t4 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const shares = gradeShares(grades);
			const tallestPercent = Math.max(...shares.map(_temp$6));
			if (tallestPercent === 0) {
				let t5;
				if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
					t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-zinc-500",
						children: "No grades have been released yet."
					});
					$[5] = t5;
				} else t5 = $[5];
				t4 = t5;
				break bb0;
			}
			t3 = "flex flex-col gap-2 rounded-xl bg-zinc-800 p-3";
			t1 = "flex gap-2";
			let t5;
			if ($[6] !== tallestPercent) {
				t5 = (share_0) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-zinc-400",
							children: [Math.round(share_0.percent), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-16 w-full items-end rounded bg-zinc-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded bg-orange-500",
								style: { height: `${share_0.percent / tallestPercent * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: share_0.label
						})
					]
				}, share_0.label);
				$[6] = tallestPercent;
				$[7] = t5;
			} else t5 = $[7];
			t2 = shares.map(t5);
		}
		$[0] = grades;
		$[1] = t1;
		$[2] = t2;
		$[3] = t3;
		$[4] = t4;
	} else {
		t1 = $[1];
		t2 = $[2];
		t3 = $[3];
		t4 = $[4];
	}
	if (t4 !== Symbol.for("react.early_return_sentinel")) return t4;
	let t5;
	if ($[8] !== t1 || $[9] !== t2) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: t1,
			children: t2
		});
		$[8] = t1;
		$[9] = t2;
		$[10] = t5;
	} else t5 = $[10];
	let t6;
	if ($[11] !== grades) {
		t6 = countStudents(grades).toLocaleString();
		$[11] = grades;
		$[12] = t6;
	} else t6 = $[12];
	let t7;
	if ($[13] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs text-zinc-400",
			children: [
				"Based on ",
				t6,
				" grades"
			]
		});
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	let t8;
	if ($[15] !== t3 || $[16] !== t5 || $[17] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t3,
			children: [t5, t7]
		});
		$[15] = t3;
		$[16] = t5;
		$[17] = t7;
		$[18] = t8;
	} else t8 = $[18];
	return t8;
}
function _temp$6(share) {
	return share.percent;
}
//#endregion
//#region src/components/ExternalLink.tsx
function ExternalLink(t0) {
	const $ = (0, import_compiler_runtime.c)(3);
	const { href, children } = t0;
	let t1;
	if ($[0] !== children || $[1] !== href) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href,
			target: "_blank",
			rel: "noreferrer",
			className: "text-orange-400 hover:text-orange-300 hover:underline",
			children: [children, " ↗"]
		});
		$[0] = children;
		$[1] = href;
		$[2] = t1;
	} else t1 = $[2];
	return t1;
}
//#endregion
//#region src/components/ProfessorStats.tsx
function ProfessorStats(t0) {
	const $ = (0, import_compiler_runtime.c)(15);
	const { rmp, offerings, medianLabel } = t0;
	let t1;
	if ($[0] !== offerings) {
		t1 = medianGrade(gradesOf(offerings)) ?? "No grades yet";
		$[0] = offerings;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== medianLabel || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: medianLabel,
			value: t1
		});
		$[2] = medianLabel;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== offerings) {
		t3 = bluebookOf(offerings);
		$[5] = offerings;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BluebookStats, { bluebook: t3 });
		$[7] = t3;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== rmp) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RmpStats, { rmp });
		$[9] = rmp;
		$[10] = t5;
	} else t5 = $[10];
	let t6;
	if ($[11] !== t2 || $[12] !== t4 || $[13] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				t2,
				t4,
				t5
			]
		});
		$[11] = t2;
		$[12] = t4;
		$[13] = t5;
		$[14] = t6;
	} else t6 = $[14];
	return t6;
}
function BluebookStats(t0) {
	const $ = (0, import_compiler_runtime.c)(15);
	const { bluebook } = t0;
	if (bluebook.sectionCount === 0) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unavailable, { children: "No Bluebook evaluations yet" });
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	if ($[1] !== bluebook.sectionCount) {
		t1 = formatCount(bluebook.sectionCount, "section");
		$[1] = bluebook.sectionCount;
		$[2] = t1;
	} else t1 = $[2];
	const t2 = `UTSA course evaluations · ${t1}`;
	let t3;
	if ($[3] !== bluebook.instructor) {
		t3 = formatOutOfFive(bluebook.instructor);
		$[3] = bluebook.instructor;
		$[4] = t3;
	} else t3 = $[4];
	let t4;
	if ($[5] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Instructor",
			value: t3
		});
		$[5] = t3;
		$[6] = t4;
	} else t4 = $[6];
	let t5;
	if ($[7] !== bluebook.course) {
		t5 = formatOutOfFive(bluebook.course);
		$[7] = bluebook.course;
		$[8] = t5;
	} else t5 = $[8];
	let t6;
	if ($[9] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Course",
			value: t5
		});
		$[9] = t5;
		$[10] = t6;
	} else t6 = $[10];
	let t7;
	if ($[11] !== t2 || $[12] !== t4 || $[13] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatGroup, {
			title: "Bluebook",
			detail: t2,
			children: [t4, t6]
		});
		$[11] = t2;
		$[12] = t4;
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	return t7;
}
function RmpStats(t0) {
	const $ = (0, import_compiler_runtime.c)(20);
	const { rmp } = t0;
	if (rmp.profiles.length === 0) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unavailable, { children: "Not found on Rate My Professors" });
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	if ($[1] !== rmp.profiles) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RmpLinks, { profiles: rmp.profiles });
		$[1] = rmp.profiles;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] !== rmp.rating) {
		t2 = formatOutOfFive(rmp.rating);
		$[3] = rmp.rating;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Rating",
			value: t2
		});
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== rmp.difficulty) {
		t4 = formatOutOfFive(rmp.difficulty);
		$[7] = rmp.difficulty;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Difficulty",
			value: t4
		});
		$[9] = t4;
		$[10] = t5;
	} else t5 = $[10];
	let t6;
	if ($[11] !== rmp.wouldTakeAgainPercent) {
		t6 = formatPercent(rmp.wouldTakeAgainPercent);
		$[11] = rmp.wouldTakeAgainPercent;
		$[12] = t6;
	} else t6 = $[12];
	let t7;
	if ($[13] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Would take again",
			value: t6
		});
		$[13] = t6;
		$[14] = t7;
	} else t7 = $[14];
	let t8;
	if ($[15] !== t1 || $[16] !== t3 || $[17] !== t5 || $[18] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatGroup, {
			title: "Rate My Professors",
			detail: t1,
			children: [
				t3,
				t5,
				t7
			]
		});
		$[15] = t1;
		$[16] = t3;
		$[17] = t5;
		$[18] = t7;
		$[19] = t8;
	} else t8 = $[19];
	return t8;
}
function RmpLinks(t0) {
	const $ = (0, import_compiler_runtime.c)(6);
	const { profiles } = t0;
	if (profiles.length === 1) {
		let t1;
		if ($[0] !== profiles[0].link) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
				href: profiles[0].link,
				children: "See all ratings"
			});
			$[0] = profiles[0].link;
			$[1] = t1;
		} else t1 = $[1];
		return t1;
	}
	let t1;
	if ($[2] !== profiles) {
		t1 = profiles.map(_temp$5);
		$[2] = profiles;
		$[3] = t1;
	} else t1 = $[3];
	let t2;
	if ($[4] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex gap-2",
			children: t1
		});
		$[4] = t1;
		$[5] = t2;
	} else t2 = $[5];
	return t2;
}
function _temp$5(profile) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
		href: profile.link,
		children: profile.department
	}, profile.link);
}
function StatGroup(t0) {
	const $ = (0, import_compiler_runtime.c)(12);
	const { title, detail, children } = t0;
	let t1;
	if ($[0] !== title) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-semibold uppercase tracking-wide text-zinc-400",
			children: title
		});
		$[0] = title;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== detail) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right text-zinc-500",
			children: detail
		});
		$[2] = detail;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== t1 || $[5] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2 text-xs",
			children: [t1, t2]
		});
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== children) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid auto-cols-fr grid-flow-col gap-2",
			children
		});
		$[7] = children;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== t3 || $[10] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [t3, t4]
		});
		$[9] = t3;
		$[10] = t4;
		$[11] = t5;
	} else t5 = $[11];
	return t5;
}
function Stat(t0) {
	const $ = (0, import_compiler_runtime.c)(7);
	const { label, value } = t0;
	let t1;
	if ($[0] !== label) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-zinc-400",
			children: label
		});
		$[0] = label;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== value) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-lg font-semibold",
			children: value
		});
		$[2] = value;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== t1 || $[5] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col rounded-xl bg-zinc-800 p-3",
			children: [t1, t2]
		});
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	return t3;
}
function Unavailable(t0) {
	const $ = (0, import_compiler_runtime.c)(2);
	const { children } = t0;
	let t1;
	if ($[0] !== children) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-zinc-500",
			children
		});
		$[0] = children;
		$[1] = t1;
	} else t1 = $[1];
	return t1;
}
//#endregion
//#region src/components/SyllabusLinks.tsx
function SyllabusLinks(t0) {
	const $ = (0, import_compiler_runtime.c)(5);
	const { syllabi } = t0;
	if (syllabi.length === 0) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-zinc-500",
				children: "No syllabus on Simple Syllabus"
			});
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	if ($[1] !== syllabi) {
		t1 = syllabi.map(_temp$4);
		$[1] = syllabi;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-x-3 gap-y-1 text-sm",
			children: t1
		});
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
}
function _temp$4(syllabus) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ExternalLink, {
		href: syllabus.link,
		children: [
			"Section ",
			syllabus.section,
			" syllabus"
		]
	}, syllabus.section);
}
//#endregion
//#region src/components/ClassPage.tsx
function ClassPage(t0) {
	const $ = (0, import_compiler_runtime.c)(69);
	const { professorName, courseCode } = t0;
	const { professors, openProfessor, openCourse } = useLookup();
	const professor = professors[professorName];
	let t1;
	if ($[0] !== courseCode || $[1] !== professor) {
		t1 = findCourse(professor, courseCode);
		$[0] = courseCode;
		$[1] = professor;
		$[2] = t1;
	} else t1 = $[2];
	const course = t1;
	let t2;
	if ($[3] !== course.code || $[4] !== openCourse) {
		t2 = () => openCourse(course.code);
		$[3] = course.code;
		$[4] = openCourse;
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== course.code || $[7] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			onClick: t2,
			children: course.code
		});
		$[6] = course.code;
		$[7] = t2;
		$[8] = t3;
	} else t3 = $[8];
	let t4;
	if ($[9] !== course.title || $[10] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold",
			children: [
				t3,
				" · ",
				course.title
			]
		});
		$[9] = course.title;
		$[10] = t3;
		$[11] = t4;
	} else t4 = $[11];
	let t5;
	if ($[12] !== openProfessor || $[13] !== professor.name) {
		t5 = () => openProfessor(professor.name);
		$[12] = openProfessor;
		$[13] = professor.name;
		$[14] = t5;
	} else t5 = $[14];
	let t6;
	if ($[15] !== professor.name || $[16] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-zinc-400",
			children: [
				"with",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					onClick: t5,
					children: professor.name
				})
			]
		});
		$[15] = professor.name;
		$[16] = t5;
		$[17] = t6;
	} else t6 = $[17];
	let t7;
	if ($[18] !== t4 || $[19] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start",
			children: [t4, t6]
		});
		$[18] = t4;
		$[19] = t6;
		$[20] = t7;
	} else t7 = $[20];
	const t8 = `Median Grade in ${course.code}`;
	let t9;
	if ($[21] !== course.offerings || $[22] !== professor.rmp || $[23] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorStats, {
			rmp: professor.rmp,
			offerings: course.offerings,
			medianLabel: t8
		});
		$[21] = course.offerings;
		$[22] = professor.rmp;
		$[23] = t8;
		$[24] = t9;
	} else t9 = $[24];
	let t10;
	if ($[25] !== course) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Latest syllabus",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LatestSyllabus, { course })
		});
		$[25] = course;
		$[26] = t10;
	} else t10 = $[26];
	const t11 = `Grades in ${course.code}`;
	let t12;
	if ($[27] !== course.offerings) {
		t12 = gradesOf(course.offerings);
		$[27] = course.offerings;
		$[28] = t12;
	} else t12 = $[28];
	let t13;
	if ($[29] !== t12) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades: t12 });
		$[29] = t12;
		$[30] = t13;
	} else t13 = $[30];
	let t14;
	if ($[31] !== t11 || $[32] !== t13) {
		t14 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: t11,
			children: t13
		});
		$[31] = t11;
		$[32] = t13;
		$[33] = t14;
	} else t14 = $[33];
	let t15;
	if ($[34] !== course.code || $[35] !== professor.rmp.reviews) {
		t15 = thisCourseFirst(professor.rmp.reviews, course.code);
		$[34] = course.code;
		$[35] = professor.rmp.reviews;
		$[36] = t15;
	} else t15 = $[36];
	let t16;
	if ($[37] !== t15) {
		t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "What students say",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: t15 })
		});
		$[37] = t15;
		$[38] = t16;
	} else t16 = $[38];
	let t17;
	if ($[39] !== course.offerings || $[40] !== course.title) {
		let t18;
		if ($[42] !== course.title) {
			t18 = (offering) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SemesterRow, {
				offering,
				courseTitle: course.title
			}, offering.semester);
			$[42] = course.title;
			$[43] = t18;
		} else t18 = $[43];
		t17 = course.offerings.map(t18);
		$[39] = course.offerings;
		$[40] = course.title;
		$[41] = t17;
	} else t17 = $[41];
	let t18;
	if ($[44] !== t17) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Every semester",
			children: t17
		});
		$[44] = t17;
		$[45] = t18;
	} else t18 = $[45];
	let t19;
	if ($[46] !== course.code || $[47] !== openCourse) {
		t19 = () => openCourse(course.code);
		$[46] = course.code;
		$[47] = openCourse;
		$[48] = t19;
	} else t19 = $[48];
	let t20;
	if ($[49] !== course.code || $[50] !== t19) {
		t20 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t19,
			children: ["Compare every professor who teaches ", course.code]
		});
		$[49] = course.code;
		$[50] = t19;
		$[51] = t20;
	} else t20 = $[51];
	let t21;
	if ($[52] !== openProfessor || $[53] !== professor.name) {
		t21 = () => openProfessor(professor.name);
		$[52] = openProfessor;
		$[53] = professor.name;
		$[54] = t21;
	} else t21 = $[54];
	let t22;
	if ($[55] !== professor.name || $[56] !== t21) {
		t22 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t21,
			children: [
				"See all of ",
				professor.name,
				"'s classes"
			]
		});
		$[55] = professor.name;
		$[56] = t21;
		$[57] = t22;
	} else t22 = $[57];
	let t23;
	if ($[58] !== t20 || $[59] !== t22) {
		t23 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-1",
			children: [t20, t22]
		});
		$[58] = t20;
		$[59] = t22;
		$[60] = t23;
	} else t23 = $[60];
	let t24;
	if ($[61] !== t10 || $[62] !== t14 || $[63] !== t16 || $[64] !== t18 || $[65] !== t23 || $[66] !== t7 || $[67] !== t9) {
		t24 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				t7,
				t9,
				t10,
				t14,
				t16,
				t18,
				t23
			]
		});
		$[61] = t10;
		$[62] = t14;
		$[63] = t16;
		$[64] = t18;
		$[65] = t23;
		$[66] = t7;
		$[67] = t9;
		$[68] = t24;
	} else t24 = $[68];
	return t24;
}
function thisCourseFirst(reviews, courseCode) {
	const courseNumber = courseCode.split(" ")[1];
	const isThisCourse = (review) => review.course.match(/\d{4}/)?.[0] === courseNumber;
	return [...reviews].sort((first, second) => Number(isThisCourse(second)) - Number(isThisCourse(first)));
}
function LatestSyllabus(t0) {
	const $ = (0, import_compiler_runtime.c)(10);
	const { course } = t0;
	let t1;
	if ($[0] !== course.offerings) {
		t1 = course.offerings.find(_temp$3);
		$[0] = course.offerings;
		$[1] = t1;
	} else t1 = $[1];
	const latest = t1;
	if (latest === void 0) {
		let t2;
		if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
			t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-zinc-500",
				children: "No syllabus on Simple Syllabus"
			});
			$[2] = t2;
		} else t2 = $[2];
		return t2;
	}
	let t2;
	if ($[3] !== latest.semester) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: latest.semester
		});
		$[3] = latest.semester;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== latest.syllabi) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyllabusLinks, { syllabi: latest.syllabi });
		$[5] = latest.syllabi;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== t2 || $[8] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1 rounded-xl bg-zinc-800 p-3",
			children: [t2, t3]
		});
		$[7] = t2;
		$[8] = t3;
		$[9] = t4;
	} else t4 = $[9];
	return t4;
}
function _temp$3(offering) {
	return offering.syllabi.length > 0;
}
function SemesterRow(t0) {
	const $ = (0, import_compiler_runtime.c)(43);
	const { offering, courseTitle } = t0;
	let t1;
	if ($[0] !== offering.grades) {
		t1 = medianGrade(offering.grades);
		$[0] = offering.grades;
		$[1] = t1;
	} else t1 = $[1];
	const median = t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	if ($[2] !== courseTitle || $[3] !== median || $[4] !== offering) {
		const bluebook = bluebookOf([offering]);
		let t10;
		let t8;
		let t9;
		if ($[11] !== courseTitle || $[12] !== offering.semester || $[13] !== offering.titles) {
			let t11;
			if ($[19] !== courseTitle) {
				t11 = (title) => title !== courseTitle;
				$[19] = courseTitle;
				$[20] = t11;
			} else t11 = $[20];
			const otherTitles = offering.titles.filter(t11);
			t7 = "flex flex-col gap-1 rounded-xl bg-zinc-800 p-3";
			t5 = "flex items-start justify-between gap-3";
			t8 = "flex flex-col";
			if ($[21] !== offering.semester) {
				t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: offering.semester
				});
				$[21] = offering.semester;
				$[22] = t9;
			} else t9 = $[22];
			t10 = otherTitles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-zinc-400",
				children: otherTitles.join(" · ")
			});
			$[11] = courseTitle;
			$[12] = offering.semester;
			$[13] = offering.titles;
			$[14] = t10;
			$[15] = t5;
			$[16] = t7;
			$[17] = t8;
			$[18] = t9;
		} else {
			t10 = $[14];
			t5 = $[15];
			t7 = $[16];
			t8 = $[17];
			t9 = $[18];
		}
		if ($[23] !== t10 || $[24] !== t8 || $[25] !== t9) {
			t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: t8,
				children: [t9, t10]
			});
			$[23] = t10;
			$[24] = t8;
			$[25] = t9;
			$[26] = t6;
		} else t6 = $[26];
		t2 = "flex flex-col items-end text-sm";
		const t11 = median === null ? "No grades yet" : `Median ${median}`;
		if ($[27] !== t11) {
			t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t11 });
			$[27] = t11;
			$[28] = t3;
		} else t3 = $[28];
		t4 = bluebook.sectionCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-zinc-400",
			children: formatRating("Bluebook", bluebook.instructor)
		});
		$[2] = courseTitle;
		$[3] = median;
		$[4] = offering;
		$[5] = t2;
		$[6] = t3;
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
		$[10] = t7;
	} else {
		t2 = $[5];
		t3 = $[6];
		t4 = $[7];
		t5 = $[8];
		t6 = $[9];
		t7 = $[10];
	}
	let t8;
	if ($[29] !== t2 || $[30] !== t3 || $[31] !== t4) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t2,
			children: [t3, t4]
		});
		$[29] = t2;
		$[30] = t3;
		$[31] = t4;
		$[32] = t8;
	} else t8 = $[32];
	let t9;
	if ($[33] !== t5 || $[34] !== t6 || $[35] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t5,
			children: [t6, t8]
		});
		$[33] = t5;
		$[34] = t6;
		$[35] = t8;
		$[36] = t9;
	} else t9 = $[36];
	let t10;
	if ($[37] !== offering.syllabi) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyllabusLinks, { syllabi: offering.syllabi });
		$[37] = offering.syllabi;
		$[38] = t10;
	} else t10 = $[38];
	let t11;
	if ($[39] !== t10 || $[40] !== t7 || $[41] !== t9) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t7,
			children: [t9, t10]
		});
		$[39] = t10;
		$[40] = t7;
		$[41] = t9;
		$[42] = t11;
	} else t11 = $[42];
	return t11;
}
//#endregion
//#region src/components/ClassCard.tsx
function ClassCard(t0) {
	const $ = (0, import_compiler_runtime.c)(35);
	const { professor, course, detail } = t0;
	const { openProfessor, openClass } = useLookup();
	let t1;
	if ($[0] !== course.offerings) {
		t1 = medianGrade(gradesOf(course.offerings));
		$[0] = course.offerings;
		$[1] = t1;
	} else t1 = $[1];
	const median = t1;
	let t2;
	if ($[2] !== openProfessor || $[3] !== professor.name) {
		t2 = () => openProfessor(professor.name);
		$[2] = openProfessor;
		$[3] = professor.name;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== professor.name || $[6] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			className: "font-medium",
			onClick: t2,
			children: professor.name
		});
		$[5] = professor.name;
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[8] !== course.code || $[9] !== openClass || $[10] !== professor.name) {
		t4 = () => openClass(professor.name, course.code);
		$[8] = course.code;
		$[9] = openClass;
		$[10] = professor.name;
		$[11] = t4;
	} else t4 = $[11];
	let t5;
	if ($[12] !== detail || $[13] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "link",
			className: "text-sm",
			onClick: t4,
			children: detail
		});
		$[12] = detail;
		$[13] = t4;
		$[14] = t5;
	} else t5 = $[14];
	let t6;
	if ($[15] !== t3 || $[16] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-0.5",
			children: [t3, t5]
		});
		$[15] = t3;
		$[16] = t5;
		$[17] = t6;
	} else t6 = $[17];
	const t7 = median ?? "—";
	let t8;
	if ($[18] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Median ", t7] });
		$[18] = t7;
		$[19] = t8;
	} else t8 = $[19];
	let t9;
	if ($[20] !== course.offerings) {
		t9 = formatRating("Bluebook", bluebookOf(course.offerings).instructor);
		$[20] = course.offerings;
		$[21] = t9;
	} else t9 = $[21];
	let t10;
	if ($[22] !== t9) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-zinc-400",
			children: t9
		});
		$[22] = t9;
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] !== professor.rmp.rating) {
		t11 = formatRating("RMP", professor.rmp.rating);
		$[24] = professor.rmp.rating;
		$[25] = t11;
	} else t11 = $[25];
	let t12;
	if ($[26] !== t11) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-zinc-400",
			children: t11
		});
		$[26] = t11;
		$[27] = t12;
	} else t12 = $[27];
	let t13;
	if ($[28] !== t10 || $[29] !== t12 || $[30] !== t8) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 flex-col items-end text-sm",
			children: [
				t8,
				t10,
				t12
			]
		});
		$[28] = t10;
		$[29] = t12;
		$[30] = t8;
		$[31] = t13;
	} else t13 = $[31];
	let t14;
	if ($[32] !== t13 || $[33] !== t6) {
		t14 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3",
			children: [t6, t13]
		});
		$[32] = t13;
		$[33] = t6;
		$[34] = t14;
	} else t14 = $[34];
	return t14;
}
//#endregion
//#region src/components/CoursePage.tsx
function CoursePage(t0) {
	const $ = (0, import_compiler_runtime.c)(24);
	const { courseCode } = t0;
	const { professors, searchIndex } = useLookup();
	let T0;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	if ($[0] !== courseCode || $[1] !== professors || $[2] !== searchIndex) {
		t6 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const teachers = teachersOf(courseCode, professors, searchIndex);
			if (teachers.length === 0) {
				let t7;
				if ($[10] !== courseCode) {
					t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "py-12 text-center text-zinc-500",
						children: [
							"No one has taught ",
							courseCode,
							" yet."
						]
					});
					$[10] = courseCode;
					$[11] = t7;
				} else t7 = $[11];
				t6 = t7;
				break bb0;
			}
			const everyonesGrades = gradesOf(teachers.flatMap(_temp$2));
			const name = courseName(teachers);
			t3 = "flex flex-col gap-5";
			const t7 = name !== null && ` · ${name}`;
			let t8;
			if ($[12] !== courseCode || $[13] !== t7) {
				t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold",
					children: [courseCode, t7]
				});
				$[12] = courseCode;
				$[13] = t7;
				$[14] = t8;
			} else t8 = $[14];
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [t8, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-zinc-400",
					children: [
						teachers.length,
						" ",
						teachers.length === 1 ? "professor has" : "professors have",
						" taught this class",
						name === null && ", each with their own topic"
					]
				})]
			});
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: `Grades in ${courseCode} (every professor)`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades: everyonesGrades })
			});
			T0 = Section;
			t1 = "Professors, most recent first";
			t2 = teachers.map((teacher_0) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassCard, {
				professor: teacher_0.professor,
				course: teacher_0.course,
				detail: classDetail(teacher_0, name)
			}, teacher_0.professor.name));
		}
		$[0] = courseCode;
		$[1] = professors;
		$[2] = searchIndex;
		$[3] = T0;
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
	} else {
		T0 = $[3];
		t1 = $[4];
		t2 = $[5];
		t3 = $[6];
		t4 = $[7];
		t5 = $[8];
		t6 = $[9];
	}
	if (t6 !== Symbol.for("react.early_return_sentinel")) return t6;
	let t7;
	if ($[15] !== T0 || $[16] !== t1 || $[17] !== t2) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T0, {
			title: t1,
			children: t2
		});
		$[15] = T0;
		$[16] = t1;
		$[17] = t2;
		$[18] = t7;
	} else t7 = $[18];
	let t8;
	if ($[19] !== t3 || $[20] !== t4 || $[21] !== t5 || $[22] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t3,
			children: [
				t4,
				t5,
				t7
			]
		});
		$[19] = t3;
		$[20] = t4;
		$[21] = t5;
		$[22] = t7;
		$[23] = t8;
	} else t8 = $[23];
	return t8;
}
function _temp$2(teacher) {
	return teacher.course.offerings;
}
function classDetail({ course }, name) {
	const lastTaught = `Last taught ${course.offerings[0].semester}`;
	return course.title === name ? lastTaught : `${course.title} · ${lastTaught}`;
}
//#endregion
//#region src/components/AnalyticsButton.tsx
function AnalyticsButton() {
	const $ = (0, import_compiler_runtime.c)(6);
	const { openAnalytics } = useLookup();
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VennIcon, { className: "h-6 w-9" });
		$[0] = t0;
	} else t0 = $[0];
	let t1;
	if ($[1] !== openAnalytics) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: openAnalytics,
			"aria-label": "Analytical Mode",
			className: "rounded p-1 text-orange-600 transition-colors hover:text-orange-400 focus-visible:text-orange-400",
			children: t0
		});
		$[1] = openAnalytics;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-100 opacity-0 transition-opacity group-hover:opacity-100",
			children: "Analytical Mode"
		});
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== t1) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group relative flex",
			children: [t1, t2]
		});
		$[4] = t1;
		$[5] = t3;
	} else t3 = $[5];
	return t3;
}
//#endregion
//#region src/components/Header.tsx
function Header() {
	const $ = (0, import_compiler_runtime.c)(12);
	const { canGoBack, goBack, goHome } = useLookup();
	let t0;
	if ($[0] !== canGoBack || $[1] !== goBack) {
		t0 = canGoBack ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "whitespace-nowrap text-sm",
			onClick: goBack,
			children: "← Back"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "whitespace-nowrap text-sm",
			onClick: closeSidebar,
			children: "✕ Close"
		});
		$[0] = canGoBack;
		$[1] = goBack;
		$[2] = t0;
	} else t0 = $[2];
	let t1;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "flex items-center gap-2 text-lg font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "icons/icon-48.png",
				alt: "",
				className: "size-6 rounded-md"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden min-[380px]:inline",
				children: "RowdySearch"
			})]
		});
		$[3] = t1;
	} else t1 = $[3];
	let t2;
	if ($[4] !== goHome) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "whitespace-nowrap text-sm",
			onClick: goHome,
			children: "Home"
		});
		$[4] = goHome;
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsButton, {});
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== t2) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [t2, t3]
		});
		$[7] = t2;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== t0 || $[10] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-2",
			children: [
				t0,
				t1,
				t4
			]
		});
		$[9] = t0;
		$[10] = t4;
		$[11] = t5;
	} else t5 = $[11];
	return t5;
}
//#endregion
//#region src/components/ProfessorPage.tsx
function ProfessorPage(t0) {
	const $ = (0, import_compiler_runtime.c)(32);
	const { professorName } = t0;
	const { professors } = useLookup();
	const professor = professors[professorName];
	let t1;
	if ($[0] !== professor) {
		t1 = allOfferings(professor);
		$[0] = professor;
		$[1] = t1;
	} else t1 = $[1];
	const offerings = t1;
	let t2;
	if ($[2] !== professor.name) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-2xl font-bold",
			children: professor.name
		});
		$[2] = professor.name;
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== professor.department) {
		t3 = professor.department !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm text-zinc-400",
			children: [professor.department, " department"]
		});
		$[4] = professor.department;
		$[5] = t3;
	} else t3 = $[5];
	let t4;
	if ($[6] !== t2 || $[7] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [t2, t3]
		});
		$[6] = t2;
		$[7] = t3;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== offerings || $[10] !== professor.rmp) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorStats, {
			rmp: professor.rmp,
			offerings,
			medianLabel: "Median Grade (all classes)"
		});
		$[9] = offerings;
		$[10] = professor.rmp;
		$[11] = t5;
	} else t5 = $[11];
	let t6;
	if ($[12] !== offerings) {
		t6 = gradesOf(offerings);
		$[12] = offerings;
		$[13] = t6;
	} else t6 = $[13];
	let t7;
	if ($[14] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Grades in all classes",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades: t6 })
		});
		$[14] = t6;
		$[15] = t7;
	} else t7 = $[15];
	const t8 = `Classes (${professor.courses.length})`;
	let t9;
	if ($[16] !== professor.courses || $[17] !== professor.name) {
		let t10;
		if ($[19] !== professor.name) {
			t10 = (course) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseRow, {
				professorName: professor.name,
				course
			}, course.code);
			$[19] = professor.name;
			$[20] = t10;
		} else t10 = $[20];
		t9 = professor.courses.map(t10);
		$[16] = professor.courses;
		$[17] = professor.name;
		$[18] = t9;
	} else t9 = $[18];
	let t10;
	if ($[21] !== t8 || $[22] !== t9) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: t8,
			children: t9
		});
		$[21] = t8;
		$[22] = t9;
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] !== professor.rmp.reviews) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "What students say",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: professor.rmp.reviews })
		});
		$[24] = professor.rmp.reviews;
		$[25] = t11;
	} else t11 = $[25];
	let t12;
	if ($[26] !== t10 || $[27] !== t11 || $[28] !== t4 || $[29] !== t5 || $[30] !== t7) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				t4,
				t5,
				t7,
				t10,
				t11
			]
		});
		$[26] = t10;
		$[27] = t11;
		$[28] = t4;
		$[29] = t5;
		$[30] = t7;
		$[31] = t12;
	} else t12 = $[31];
	return t12;
}
function CourseRow(t0) {
	const $ = (0, import_compiler_runtime.c)(38);
	const { professorName, course } = t0;
	const { openClass } = useLookup();
	let t1;
	if ($[0] !== course.offerings) {
		t1 = medianGrade(gradesOf(course.offerings));
		$[0] = course.offerings;
		$[1] = t1;
	} else t1 = $[1];
	const median = t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	if ($[2] !== course.code || $[3] !== course.offerings || $[4] !== course.title || $[5] !== median || $[6] !== openClass || $[7] !== professorName) {
		const bluebook = bluebookOf(course.offerings);
		const semesterCount = course.offerings.length;
		t5 = "flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3";
		let t7;
		if ($[13] !== course.code || $[14] !== openClass || $[15] !== professorName) {
			t7 = () => openClass(professorName, course.code);
			$[13] = course.code;
			$[14] = openClass;
			$[15] = professorName;
			$[16] = t7;
		} else t7 = $[16];
		let t8;
		if ($[17] !== course.code || $[18] !== course.title || $[19] !== t7) {
			t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "link",
				className: "font-medium",
				onClick: t7,
				children: [
					course.code,
					" · ",
					course.title
				]
			});
			$[17] = course.code;
			$[18] = course.title;
			$[19] = t7;
			$[20] = t8;
		} else t8 = $[20];
		const t9 = semesterCount === 1 ? "semester" : "semesters";
		let t10;
		if ($[21] !== course.offerings[0].semester || $[22] !== semesterCount || $[23] !== t9) {
			t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-zinc-400",
				children: [
					"Latest ",
					course.offerings[0].semester,
					" · ",
					semesterCount,
					" ",
					t9
				]
			});
			$[21] = course.offerings[0].semester;
			$[22] = semesterCount;
			$[23] = t9;
			$[24] = t10;
		} else t10 = $[24];
		if ($[25] !== t10 || $[26] !== t8) {
			t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start gap-0.5",
				children: [t8, t10]
			});
			$[25] = t10;
			$[26] = t8;
			$[27] = t6;
		} else t6 = $[27];
		t2 = "flex shrink-0 flex-col items-end text-sm";
		const t11 = median ?? "—";
		if ($[28] !== t11) {
			t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Median ", t11] });
			$[28] = t11;
			$[29] = t3;
		} else t3 = $[29];
		t4 = bluebook.sectionCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-zinc-400",
			children: formatRating("Bluebook", bluebook.instructor)
		});
		$[2] = course.code;
		$[3] = course.offerings;
		$[4] = course.title;
		$[5] = median;
		$[6] = openClass;
		$[7] = professorName;
		$[8] = t2;
		$[9] = t3;
		$[10] = t4;
		$[11] = t5;
		$[12] = t6;
	} else {
		t2 = $[8];
		t3 = $[9];
		t4 = $[10];
		t5 = $[11];
		t6 = $[12];
	}
	let t7;
	if ($[30] !== t2 || $[31] !== t3 || $[32] !== t4) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t2,
			children: [t3, t4]
		});
		$[30] = t2;
		$[31] = t3;
		$[32] = t4;
		$[33] = t7;
	} else t7 = $[33];
	let t8;
	if ($[34] !== t5 || $[35] !== t6 || $[36] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t5,
			children: [t6, t7]
		});
		$[34] = t5;
		$[35] = t6;
		$[36] = t7;
		$[37] = t8;
	} else t8 = $[37];
	return t8;
}
//#endregion
//#region src/utils/links.ts
var STORE_LINK = "https://chromewebstore.google.com/detail/geiimkdngembhenfhcnbmlfgbclheoek?utm_source=item-share-cb";
var STORE_REVIEWS_LINK = "https://chromewebstore.google.com/detail/rowdysearch/geiimkdngembhenfhcnbmlfgbclheoek/reviews";
function syllabusLink(syllabusCode) {
	return `https://utsa.simplesyllabus.com/en-US/doc/${syllabusCode}`;
}
function rmpLink(rmpId) {
	return `https://www.ratemyprofessors.com/professor/${rmpId}`;
}
//#endregion
//#region src/components/home/ReviewCard.tsx
function ReviewCard() {
	const $ = (0, import_compiler_runtime.c)(2);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: "Enjoying RowdySearch?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "text-lg leading-none tracking-wider text-amber-400",
				children: "★★★★★"
			})]
		});
		$[0] = t0;
	} else t0 = $[0];
	let t1;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: STORE_REVIEWS_LINK,
			target: "_blank",
			rel: "noreferrer",
			className: "flex flex-col gap-1 rounded-xl bg-zinc-800 p-4 outline-none transition-colors hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-orange-500",
			children: [t0, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-zinc-400",
				children: [
					"A quick review on the Chrome Web Store helps other Roadrunners find it.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-orange-400",
						children: "Write a review ↗"
					})
				]
			})]
		});
		$[1] = t1;
	} else t1 = $[1];
	return t1;
}
//#endregion
//#region src/utils/clipboard.ts
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const scratch = document.createElement("textarea");
		scratch.value = text;
		document.body.append(scratch);
		scratch.select();
		const copied = document.execCommand("copy");
		scratch.remove();
		return copied;
	}
}
//#endregion
//#region src/components/home/shareTargets.ts
var SHARE_TITLE = "RowdySearch: grades and ratings for every UTSA professor";
var SHARE_MESSAGE = "Picking UTSA classes? RowdySearch shows every professor's grade distributions, Bluebook and Rate My Professors ratings, and syllabi right on the registration page. It's a free Chrome extension:";
var SHARE_TEXT = `${SHARE_MESSAGE} ${STORE_LINK}`;
var LIGHT_ICON_COLOR = "#d4d4d8";
var SHARE_TARGETS = [
	{
		name: "GroupMe",
		link: "https://web.groupme.com/chats",
		copiesMessage: true,
		icon: {
			color: "#00AFF0",
			path: "M11.1597 6.57419H12.8398V8.16898H11.1597V6.57419ZM18.1997 0H5.80011C3.14898 0 1 2.03979 1 4.55577V16.3243C1 18.8402 3.14898 20.88 5.80011 20.88H9.92715L11.9786 24L14.0306 20.88H18.1997C20.8506 20.88 23 18.8402 23 16.3243V4.55574C23 2.03976 20.8506 0 18.1997 0ZM7.56833 8.16895H9.34755V6.57416H7.56833V4.85447H9.34755V3.16587H11.1597V4.85447H12.8398V3.16587H14.6519V4.85447H16.4308V6.57416H14.6519V8.16895H16.4308V9.88852H14.6519V11.5772H12.8398V9.88852H11.1597V11.5772H9.34755V9.88852H7.56833V8.16895ZM20.3122 13.4321C20.3122 13.4321 17.9202 17.708 12.2406 17.708C12.1619 17.708 12.0843 17.707 12.007 17.7057C11.9299 17.707 11.8522 17.708 11.7737 17.708C6.09416 17.708 3.70211 13.4321 3.70211 13.4321C3.70211 13.4321 3.54729 13.1536 3.54729 12.8534C3.53754 12.6368 3.64915 12.3263 3.9421 12.1433C4.105 12.0417 4.259 11.9914 4.40179 11.9757C5.08566 11.9069 5.48202 12.3295 5.80794 12.8121C6.16788 13.3447 8.24445 15.678 12.007 15.7672C15.7698 15.678 17.8464 13.3447 18.2063 12.8121C18.5322 12.3295 18.9429 11.9062 19.6125 11.9757C19.7553 11.9914 19.9094 12.0417 20.0722 12.1433C20.3652 12.3263 20.4792 12.5839 20.469 12.8532C20.446 13.2494 20.3122 13.4321 20.3122 13.4321Z"
		}
	},
	{
		name: "X",
		link: withQuery("https://x.com/intent/tweet", {
			text: SHARE_MESSAGE,
			url: STORE_LINK
		}),
		icon: {
			color: "#ffffff",
			path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"
		}
	},
	{
		name: "Reddit",
		link: withQuery("https://www.reddit.com/submit", {
			url: STORE_LINK,
			title: SHARE_TITLE
		}),
		icon: {
			color: "#FF4500",
			path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"
		}
	},
	{
		name: "Instagram",
		link: "https://www.instagram.com/direct/inbox/",
		copiesMessage: true,
		icon: {
			color: "#FF0069",
			path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"
		}
	},
	{
		name: "Email",
		link: withQuery("mailto:", {
			subject: SHARE_TITLE,
			body: `${SHARE_MESSAGE}\n\n${STORE_LINK}`
		}),
		icon: {
			color: LIGHT_ICON_COLOR,
			path: "M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.4l-10 6.25L2 6.4V6Zm0 2.75V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.75l-9.47 5.92a1 1 0 0 1-1.06 0L2 8.75Z"
		}
	},
	{
		name: "WhatsApp",
		link: withQuery("https://wa.me/", { text: SHARE_TEXT }),
		icon: {
			color: "#25D366",
			path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
		}
	},
	{
		name: "Facebook",
		link: withQuery("https://www.facebook.com/sharer/sharer.php", { u: STORE_LINK }),
		icon: {
			color: "#0866FF",
			path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"
		}
	},
	{
		name: "Discord",
		link: "https://discord.com/channels/@me",
		copiesMessage: true,
		icon: {
			color: "#5865F2",
			path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
		}
	},
	{
		name: "Snapchat",
		link: "https://web.snapchat.com/",
		copiesMessage: true,
		icon: {
			color: "#FFFC00",
			path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"
		}
	},
	{
		name: "Telegram",
		link: withQuery("https://t.me/share/url", {
			url: STORE_LINK,
			text: SHARE_MESSAGE
		}),
		icon: {
			color: "#26A5E4",
			path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
		}
	}
];
var MORE_ICON = {
	color: LIGHT_ICON_COLOR,
	path: "M6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
};
function withQuery(base, params) {
	return `${base}?${Object.entries(params).map(([name, value]) => `${name}=${encodeURIComponent(value)}`).join("&")}`;
}
//#endregion
//#region src/components/home/ShareCard.tsx
var STATUS_MESSAGE_MS = 4e3;
var COPIED_LABEL_MS = 2e3;
var HAS_SHARE_MENU = "share" in navigator;
var SHARE_BUTTON_STYLE = "group flex shrink-0 basis-1/5 snap-start flex-col items-center gap-1 text-xs text-zinc-300 outline-none";
function ShareCard() {
	const $ = (0, import_compiler_runtime.c)(8);
	const [message, setMessage] = (0, import_react.useState)("");
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = function showMessage(text) {
			setMessage(text);
			setTimeout(() => setMessage(""), STATUS_MESSAGE_MS);
		};
		$[0] = t0;
	} else t0 = $[0];
	const showMessage = t0;
	let t1;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Share RowdySearch"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-zinc-400",
				children: "Know someone picking classes? Send it their way."
			})]
		});
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollingRow, { children: [SHARE_TARGETS.map((target) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareLink, {
			target,
			onMessage: showMessage
		}, target.name)), HAS_SHARE_MENU && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: openShareMenu,
			className: SHARE_BUTTON_STYLE,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareIcon, {
				icon: MORE_ICON,
				children: "More"
			})
		})] });
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	if ($[3] !== message) {
		t3 = message !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "status",
			className: "text-xs text-zinc-400",
			children: message
		});
		$[3] = message;
		$[4] = t3;
	} else t3 = $[4];
	let t4;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyLink, {});
		$[5] = t4;
	} else t4 = $[5];
	let t5;
	if ($[6] !== t3) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex flex-col gap-3 rounded-xl bg-zinc-800 p-4",
			children: [
				t1,
				t2,
				t3,
				t4
			]
		});
		$[6] = t3;
		$[7] = t5;
	} else t5 = $[7];
	return t5;
}
function ScrollingRow(t0) {
	const $ = (0, import_compiler_runtime.c)(14);
	const { children } = t0;
	const rowRef = (0, import_react.useRef)(null);
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = {
			back: false,
			forward: false
		};
		$[0] = t1;
	} else t1 = $[0];
	const [canScroll, setCanScroll] = (0, import_react.useState)(t1);
	let t2;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = function updateArrows() {
			const row = rowRef.current;
			setCanScroll({
				back: row.scrollLeft > 1,
				forward: row.scrollLeft + row.clientWidth < row.scrollWidth - 1
			});
		};
		$[1] = t2;
	} else t2 = $[1];
	const updateArrows = t2;
	let t3;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = function scrollPage(direction) {
			const row_0 = rowRef.current;
			row_0.scrollBy({
				left: direction * row_0.clientWidth,
				behavior: "smooth"
			});
		};
		$[2] = t3;
	} else t3 = $[2];
	const scrollPage = t3;
	let t4;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = [];
		$[3] = t4;
	} else t4 = $[3];
	(0, import_react.useEffect)(updateArrows, t4);
	let t5;
	if ($[4] !== children) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: rowRef,
			onScroll: updateArrows,
			className: "flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]",
			children
		});
		$[4] = children;
		$[5] = t5;
	} else t5 = $[5];
	let t6;
	if ($[6] !== canScroll.back) {
		t6 = canScroll.back && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowArrow, {
			label: "Fewer share options",
			side: "left",
			onClick: () => scrollPage(-1),
			children: "‹"
		});
		$[6] = canScroll.back;
		$[7] = t6;
	} else t6 = $[7];
	let t7;
	if ($[8] !== canScroll.forward) {
		t7 = canScroll.forward && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowArrow, {
			label: "More share options",
			side: "right",
			onClick: () => scrollPage(1),
			children: "›"
		});
		$[8] = canScroll.forward;
		$[9] = t7;
	} else t7 = $[9];
	let t8;
	if ($[10] !== t5 || $[11] !== t6 || $[12] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group/row relative",
			children: [
				t5,
				t6,
				t7
			]
		});
		$[10] = t5;
		$[11] = t6;
		$[12] = t7;
		$[13] = t8;
	} else t8 = $[13];
	return t8;
}
function RowArrow(t0) {
	const $ = (0, import_compiler_runtime.c)(5);
	const { label, side, onClick, children } = t0;
	const t1 = `absolute top-[22px] flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-600 pb-0.5 text-xl leading-none text-zinc-100 opacity-0 shadow-lg transition hover:bg-zinc-500 focus-visible:opacity-100 group-hover/row:opacity-100 ${side === "left" ? "-left-3" : "-right-3"}`;
	let t2;
	if ($[0] !== children || $[1] !== label || $[2] !== onClick || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": label,
			onClick,
			className: t1,
			children
		});
		$[0] = children;
		$[1] = label;
		$[2] = onClick;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
}
function ShareLink(t0) {
	const $ = (0, import_compiler_runtime.c)(11);
	const { target, onMessage } = t0;
	let t1;
	if ($[0] !== onMessage || $[1] !== target.name) {
		t1 = async function copyMessage() {
			const copied = await copyText(SHARE_TEXT);
			onMessage(copied ? `Message copied. Paste it in ${target.name}.` : `Copy the link below and paste it in ${target.name}.`);
		};
		$[0] = onMessage;
		$[1] = target.name;
		$[2] = t1;
	} else t1 = $[2];
	const copyMessage = t1;
	const t2 = target.copiesMessage ? `Copy a message about RowdySearch and open ${target.name}` : `Share on ${target.name}`;
	const t3 = target.copiesMessage ? copyMessage : void 0;
	let t4;
	if ($[3] !== target.icon || $[4] !== target.name) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareIcon, {
			icon: target.icon,
			children: target.name
		});
		$[3] = target.icon;
		$[4] = target.name;
		$[5] = t4;
	} else t4 = $[5];
	let t5;
	if ($[6] !== t2 || $[7] !== t3 || $[8] !== t4 || $[9] !== target.link) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: target.link,
			target: "_blank",
			rel: "noreferrer",
			title: t2,
			onClick: t3,
			className: SHARE_BUTTON_STYLE,
			children: t4
		});
		$[6] = t2;
		$[7] = t3;
		$[8] = t4;
		$[9] = target.link;
		$[10] = t5;
	} else t5 = $[10];
	return t5;
}
function ShareIcon(t0) {
	const $ = (0, import_compiler_runtime.c)(8);
	const { icon, children } = t0;
	let t1;
	if ($[0] !== icon.path) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: icon.path });
		$[0] = icon.path;
		$[1] = t1;
	} else t1 = $[1];
	let t2;
	if ($[2] !== icon.color || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-11 items-center justify-center rounded-full bg-zinc-900 transition-colors group-hover:bg-zinc-700 group-focus-visible:ring-2 group-focus-visible:ring-orange-500",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				viewBox: "0 0 24 24",
				className: "size-5",
				fill: icon.color,
				"aria-hidden": "true",
				children: t1
			})
		});
		$[2] = icon.color;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== children || $[6] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [t2, children] });
		$[5] = children;
		$[6] = t2;
		$[7] = t3;
	} else t3 = $[7];
	return t3;
}
async function openShareMenu() {
	try {
		await navigator.share({
			title: SHARE_TITLE,
			text: SHARE_MESSAGE,
			url: STORE_LINK
		});
	} catch {}
}
function CopyLink() {
	const $ = (0, import_compiler_runtime.c)(4);
	const [isCopied, setIsCopied] = (0, import_react.useState)(false);
	const linkRef = (0, import_react.useRef)(null);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = async function copyLink() {
			if (await copyText("https://chromewebstore.google.com/detail/geiimkdngembhenfhcnbmlfgbclheoek?utm_source=item-share-cb")) {
				setIsCopied(true);
				setTimeout(() => setIsCopied(false), COPIED_LABEL_MS);
			} else linkRef.current.select();
		};
		$[0] = t0;
	} else t0 = $[0];
	const copyLink = t0;
	let t1;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: linkRef,
			readOnly: true,
			value: STORE_LINK,
			"aria-label": "RowdySearch's link",
			onFocus: _temp$1,
			className: "min-w-0 flex-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
		});
		$[1] = t1;
	} else t1 = $[1];
	const t2 = isCopied ? "Copied!" : "Copy link";
	let t3;
	if ($[2] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [t1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "min-w-24 shrink-0 text-sm",
				onClick: copyLink,
				children: t2
			})]
		});
		$[2] = t2;
		$[3] = t3;
	} else t3 = $[3];
	return t3;
}
function _temp$1(e) {
	return e.target.select();
}
//#endregion
//#region src/components/home/Home.tsx
function Home() {
	const $ = (0, import_compiler_runtime.c)(1);
	let t0;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-4 text-center text-sm text-zinc-500",
					children: "Search any professor, class, or subject."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCard, {})
			]
		});
		$[0] = t0;
	} else t0 = $[0];
	return t0;
}
//#endregion
//#region src/components/SearchPage.tsx
function SearchPage(t0) {
	const $ = (0, import_compiler_runtime.c)(22);
	const { query } = t0;
	const { professors, searchIndex, updateSearch, openPage } = useLookup();
	let t1;
	if ($[0] !== query || $[1] !== searchIndex) {
		t1 = search(searchIndex, query);
		$[0] = query;
		$[1] = searchIndex;
		$[2] = t1;
	} else t1 = $[2];
	const results = t1;
	let t2;
	if ($[3] !== openPage || $[4] !== professors || $[5] !== query || $[6] !== results) {
		t2 = function handleSubmit(e) {
			e.preventDefault();
			const page = pageForSearch(query, results, professors);
			if (page !== null) openPage(page);
		};
		$[3] = openPage;
		$[4] = professors;
		$[5] = query;
		$[6] = results;
		$[7] = t2;
	} else t2 = $[7];
	const handleSubmit = t2;
	let t3;
	if ($[8] !== updateSearch) {
		t3 = (e_0) => updateSearch(e_0.target.value);
		$[8] = updateSearch;
		$[9] = t3;
	} else t3 = $[9];
	let t4;
	if ($[10] !== query || $[11] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			autoFocus: true,
			value: query,
			onChange: t3,
			className: "w-full rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
			placeholder: "Professor, class, or subject"
		});
		$[10] = query;
		$[11] = t3;
		$[12] = t4;
	} else t4 = $[12];
	let t5;
	if ($[13] !== handleSubmit || $[14] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
			onSubmit: handleSubmit,
			children: t4
		});
		$[13] = handleSubmit;
		$[14] = t4;
		$[15] = t5;
	} else t5 = $[15];
	let t6;
	if ($[16] !== query || $[17] !== results) {
		t6 = query.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchResults, {
			query,
			results
		});
		$[16] = query;
		$[17] = results;
		$[18] = t6;
	} else t6 = $[18];
	let t7;
	if ($[19] !== t5 || $[20] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [t5, t6]
		});
		$[19] = t5;
		$[20] = t6;
		$[21] = t7;
	} else t7 = $[21];
	return t7;
}
function SearchResults(t0) {
	const $ = (0, import_compiler_runtime.c)(13);
	const { query, results } = t0;
	const { professors } = useLookup();
	if (results.length === 0) {
		let t1;
		if ($[0] !== query) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "py-12 text-center text-zinc-500",
				children: [
					"No matches for \"",
					query,
					"\"."
				]
			});
			$[0] = query;
			$[1] = t1;
		} else t1 = $[1];
		return t1;
	}
	const t1 = results.length === 1 ? "match" : "matches";
	let t2;
	if ($[2] !== results.length || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm text-zinc-400",
			children: [
				results.length,
				" ",
				t1,
				" · press Enter to open the best one"
			]
		});
		$[2] = results.length;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	let t3;
	if ($[5] !== professors || $[6] !== results) {
		let t4;
		if ($[8] !== professors) {
			t4 = (match) => {
				const professor = professors[match.professor];
				const course = findCourse(professor, match.course);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassCard, {
					professor,
					course,
					detail: `${course.code} · ${course.title}`
				}, `${match.professor} ${match.course}`);
			};
			$[8] = professors;
			$[9] = t4;
		} else t4 = $[9];
		t3 = results.map(t4);
		$[5] = professors;
		$[6] = results;
		$[7] = t3;
	} else t3 = $[7];
	let t4;
	if ($[10] !== t2 || $[11] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [t2, t3]
		});
		$[10] = t2;
		$[11] = t3;
		$[12] = t4;
	} else t4 = $[12];
	return t4;
}
//#endregion
//#region src/utils/pageForSection.ts
function pageForSection(section, searchIndex) {
	const name = firstAndLastName(section.instructor);
	const professorMatches = search(searchIndex, name).filter((match) => sharesEveryWord(name, match.professor));
	const classMatch = professorMatches.find((match) => sharesEveryWord(section.courseCode, match.course));
	if (classMatch) return {
		type: "class",
		professorName: classMatch.professor,
		courseCode: classMatch.course
	};
	if (professorMatches.length > 0) return {
		type: "professor",
		professorName: professorMatches[0].professor
	};
	return {
		type: "course",
		courseCode: section.courseCode
	};
}
function firstAndLastName(instructor) {
	const [lastName, givenNames = ""] = instructor.split(",");
	return `${givenNames.trim().split(" ")[0]} ${lastName}`;
}
//#endregion
//#region src/context/LookupProvider.tsx
var HOME_PAGE = {
	type: "search",
	query: ""
};
function LookupProvider(t0) {
	const $ = (0, import_compiler_runtime.c)(26);
	const { gradeData, children } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = [HOME_PAGE];
		$[0] = t1;
	} else t1 = $[0];
	const [pages, setPages] = (0, import_react.useState)(t1);
	const [isAnalyticsOpen, setIsAnalyticsOpen] = (0, import_react.useState)(false);
	let t2;
	let t3;
	if ($[1] !== gradeData.searchIndex) {
		t2 = () => {
			const openSectionFromAddress = function openSectionFromAddress() {
				if (window.location.hash === "") return;
				const page = pageForSection(JSON.parse(decodeURIComponent(window.location.hash.slice(1))), gradeData.searchIndex);
				setPages((curr) => [...curr, page]);
				window.scrollTo(0, 0);
				window.history.replaceState(null, "", window.location.pathname + window.location.search);
			};
			openSectionFromAddress();
			window.addEventListener("hashchange", openSectionFromAddress);
			return () => window.removeEventListener("hashchange", openSectionFromAddress);
		};
		t3 = [gradeData.searchIndex];
		$[1] = gradeData.searchIndex;
		$[2] = t2;
		$[3] = t3;
	} else {
		t2 = $[2];
		t3 = $[3];
	}
	(0, import_react.useEffect)(t2, t3);
	let t4;
	if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
		t4 = function changePages(update) {
			setPages(update);
			window.scrollTo(0, 0);
		};
		$[4] = t4;
	} else t4 = $[4];
	const changePages = t4;
	let t5;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = function openPage(page_0) {
			changePages((curr_0) => [...curr_0, page_0]);
		};
		$[5] = t5;
	} else t5 = $[5];
	const openPage = t5;
	let t6;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = function replaceCurrentPage(page_1) {
			setPages((curr_1) => [...curr_1.slice(0, -1), page_1]);
		};
		$[6] = t6;
	} else t6 = $[6];
	const replaceCurrentPage = t6;
	let t7;
	if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
		t7 = function goBack() {
			changePages(_temp);
		};
		$[7] = t7;
	} else t7 = $[7];
	const goBack = t7;
	let t8;
	if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
		t8 = function goHome() {
			changePages(_temp2);
		};
		$[8] = t8;
	} else t8 = $[8];
	const goHome = t8;
	let t9;
	if ($[9] !== pages) {
		t9 = pages.at(-1);
		$[9] = pages;
		$[10] = t9;
	} else t9 = $[10];
	const t10 = pages.length > 1;
	let t11;
	let t12;
	if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = () => setIsAnalyticsOpen(true);
		t12 = () => setIsAnalyticsOpen(false);
		$[11] = t11;
		$[12] = t12;
	} else {
		t11 = $[11];
		t12 = $[12];
	}
	let t13;
	let t14;
	let t15;
	let t16;
	if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
		t13 = (query) => replaceCurrentPage({
			type: "search",
			query
		});
		t14 = (professorName) => openPage({
			type: "professor",
			professorName
		});
		t15 = (professorName_0, courseCode) => openPage({
			type: "class",
			professorName: professorName_0,
			courseCode
		});
		t16 = (courseCode_0) => openPage({
			type: "course",
			courseCode: courseCode_0
		});
		$[13] = t13;
		$[14] = t14;
		$[15] = t15;
		$[16] = t16;
	} else {
		t13 = $[13];
		t14 = $[14];
		t15 = $[15];
		t16 = $[16];
	}
	let t17;
	if ($[17] !== gradeData.professors || $[18] !== gradeData.searchIndex || $[19] !== isAnalyticsOpen || $[20] !== t10 || $[21] !== t9) {
		t17 = {
			page: t9,
			canGoBack: t10,
			isAnalyticsOpen,
			openAnalytics: t11,
			closeAnalytics: t12,
			professors: gradeData.professors,
			searchIndex: gradeData.searchIndex,
			goBack,
			goHome,
			openPage,
			updateSearch: t13,
			openProfessor: t14,
			openClass: t15,
			openCourse: t16
		};
		$[17] = gradeData.professors;
		$[18] = gradeData.searchIndex;
		$[19] = isAnalyticsOpen;
		$[20] = t10;
		$[21] = t9;
		$[22] = t17;
	} else t17 = $[22];
	let t18;
	if ($[23] !== children || $[24] !== t17) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupContext, {
			value: t17,
			children
		});
		$[23] = children;
		$[24] = t17;
		$[25] = t18;
	} else t18 = $[25];
	return t18;
}
function _temp2() {
	return [HOME_PAGE];
}
function _temp(curr_2) {
	return curr_2.length > 1 ? curr_2.slice(0, -1) : curr_2;
}
//#endregion
//#region src/utils/gradeData.ts
function readProfessors(rawData) {
	const professors = {};
	for (const [name, rawProfessor] of Object.entries(rawData)) professors[name] = readProfessor(name, rawProfessor);
	return professors;
}
function readProfessor(name, rawProfessor) {
	const courses = Object.entries(rawProfessor.courses).map(([code, rawCourse]) => readCourse(code, rawCourse));
	return {
		name,
		department: rawProfessor.rmp[0]?.department ?? null,
		rmp: readRmp(rawProfessor.rmp),
		courses: courses.sort((first, second) => lastTaughtRank(second) - lastTaughtRank(first))
	};
}
function readCourse(code, rawCourse) {
	const offerings = Object.entries(rawCourse.semesters).map(([semester, sections]) => readOffering(semester, sections));
	return {
		code,
		title: rawCourse.courseName,
		offerings: offerings.sort((first, second) => semesterRank(second.semester) - semesterRank(first.semester))
	};
}
function lastTaughtRank(course) {
	return semesterRank(course.offerings[0].semester);
}
function readOffering(semester, sections) {
	return {
		semester,
		titles: [...new Set(sections.map((section) => section.title))],
		syllabi: sections.flatMap(readSyllabus),
		evaluations: sections.flatMap(readEvaluation),
		grades: addGrades(sections.map(readGradeCounts))
	};
}
function readSyllabus({ section, syllabusCode }) {
	return syllabusCode === null ? [] : [{
		section,
		link: syllabusLink(syllabusCode)
	}];
}
function readEvaluation({ instructorEvaluation, courseEvaluation }) {
	if (instructorEvaluation === null || courseEvaluation === null) return [];
	return [{
		instructor: instructorEvaluation,
		course: courseEvaluation
	}];
}
function readGradeCounts(section) {
	const counts = emptyGradeCounts();
	for (const grade of GRADES) counts[grade] = section.grades?.[grade] ?? 0;
	return counts;
}
function readRmp(profiles) {
	const wouldTakeAgainPercents = profiles.map((profile) => profile.wouldTakeAgainPercent).filter((percent) => percent !== null);
	return {
		rating: average(profiles.map((profile) => profile.avgRating)),
		difficulty: average(profiles.map((profile) => profile.avgDifficulty)),
		wouldTakeAgainPercent: average(wouldTakeAgainPercents),
		profiles: profiles.map((profile) => ({
			department: profile.department,
			link: rmpLink(profile.rmpId)
		})),
		reviews: profiles.flatMap((profile) => profile.recentReviews)
	};
}
//#endregion
//#region src/hooks/useGradeData.ts
var PROFESSORS_URL = "../data/professors.json";
function useGradeData() {
	const $ = (0, import_compiler_runtime.c)(2);
	const [gradeData, setGradeData] = (0, import_react.useState)(null);
	let t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = () => {
			loadGradeData().then(setGradeData);
		};
		t1 = [];
		$[0] = t0;
		$[1] = t1;
	} else {
		t0 = $[0];
		t1 = $[1];
	}
	(0, import_react.useEffect)(t0, t1);
	return gradeData;
}
async function loadGradeData() {
	const professors = readProfessors(await (await fetch(PROFESSORS_URL)).json());
	return {
		professors,
		searchIndex: buildSearchIndex(professors)
	};
}
//#endregion
//#region src/App.tsx
function App() {
	const $ = (0, import_compiler_runtime.c)(4);
	const gradeData = useGradeData();
	if (gradeData === null) {
		let t0;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "min-h-screen bg-zinc-900 py-12 text-center text-zinc-500",
				children: "Loading professors..."
			});
			$[0] = t0;
		} else t0 = $[0];
		return t0;
	}
	let t0;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentScreen, {});
		$[1] = t0;
	} else t0 = $[1];
	let t1;
	if ($[2] !== gradeData) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupProvider, {
			gradeData,
			children: t0
		});
		$[2] = gradeData;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
}
function CurrentScreen() {
	const $ = (0, import_compiler_runtime.c)(2);
	const { isAnalyticsOpen } = useLookup();
	if (isAnalyticsOpen) {
		let t0;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsMode, {});
			$[0] = t0;
		} else t0 = $[0];
		return t0;
	}
	let t0;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col gap-4 bg-zinc-900 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentPage, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
			]
		});
		$[1] = t0;
	} else t0 = $[1];
	return t0;
}
function CurrentPage() {
	const $ = (0, import_compiler_runtime.c)(9);
	const { page } = useLookup();
	switch (page.type) {
		case "search": {
			let t0;
			if ($[0] !== page.query) {
				t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchPage, { query: page.query });
				$[0] = page.query;
				$[1] = t0;
			} else t0 = $[1];
			return t0;
		}
		case "professor": {
			let t0;
			if ($[2] !== page.professorName) {
				t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorPage, { professorName: page.professorName });
				$[2] = page.professorName;
				$[3] = t0;
			} else t0 = $[3];
			return t0;
		}
		case "class": {
			let t0;
			if ($[4] !== page.courseCode || $[5] !== page.professorName) {
				t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassPage, {
					professorName: page.professorName,
					courseCode: page.courseCode
				});
				$[4] = page.courseCode;
				$[5] = page.professorName;
				$[6] = t0;
			} else t0 = $[6];
			return t0;
		}
		case "course": {
			let t0;
			if ($[7] !== page.courseCode) {
				t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoursePage, { courseCode: page.courseCode });
				$[7] = page.courseCode;
				$[8] = t0;
			} else t0 = $[8];
			return t0;
		}
		default: throw new Error(`Invalid page: ${page}`);
	}
}
//#endregion
//#region src/main.tsx
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.StrictMode, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}) }));
//#endregion
