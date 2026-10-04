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
		t6 = STRIPE_HEIGHTS.map(_temp$10);
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
function _temp$10(y) {
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
	const $ = (0, import_compiler_runtime.c)(5);
	const { series } = t0;
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
	if ($[2] !== series.label || $[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [t1, series.label]
		});
		$[2] = series.label;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
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
//#region src/utils/gradeData.ts
var CLASS_KEY = /^(.+?) - (.+) \((\w+ \d{4})\)$/;
function readProfessors(rawData) {
	const professors = {};
	for (const [name, rawProfessor] of Object.entries(rawData)) professors[name] = readProfessor(name, rawProfessor);
	return professors;
}
function readProfessor(name, rawProfessor) {
	return {
		name,
		department: rawProfessor.Department,
		rmp: readRmp(rawProfessor.RMP),
		classes: readClasses(rawProfessor)
	};
}
function readRmp(rawRmp) {
	return {
		rating: rawRmp["Professor rating"],
		difficulty: rawRmp["Difficulty level"],
		ratingCount: rawRmp["Number of ratings"] ?? 0,
		wouldTakeAgainPercent: rawRmp["Would take again %"],
		link: rawRmp.Link,
		reviews: Object.values(rawRmp["5 reviews"]).filter((review) => review !== null)
	};
}
function readClasses(rawProfessor) {
	const classes = [];
	for (const [classKey, rawClass] of Object.entries(rawProfessor)) if (CLASS_KEY.test(classKey)) classes.push(readClass(classKey, rawClass));
	return classes;
}
function readClass(classKey, rawClass) {
	const [, courseCode, title, semester] = classKey.match(CLASS_KEY);
	return {
		courseCode,
		title,
		semester,
		syllabi: Object.entries(rawClass.Syllabus).map(([section, link]) => ({
			section,
			link
		})),
		grades: readGradeCounts(rawClass)
	};
}
function readGradeCounts(rawClass) {
	const counts = emptyGradeCounts();
	for (const grade of GRADES) counts[grade] = rawClass[grade] ?? 0;
	return counts;
}
//#endregion
//#region src/searcher.ts
var ALLOWED_WRONG_WORDS = 1;
function buildSearchIndex(data) {
	return indexByWord(buildEntries(data));
}
function search(index, query) {
	const queryWords = [...new Set(wordsOf(query))];
	const neededWords = Math.max(1, queryWords.length - ALLOWED_WRONG_WORDS);
	const matchedWords = /* @__PURE__ */ new Map();
	for (const queryWord of queryWords) for (const entry of entriesMatching(index, queryWord)) matchedWords.set(entry, (matchedWords.get(entry) ?? 0) + 1);
	return [...matchedWords].filter(([, count]) => count >= neededWords).map(([entry]) => ({
		professor: entry.professor,
		course: entry.course,
		classes: entry.classes,
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
function isAnyOf(queryWord, words) {
	return words.some((word) => isSameWord(queryWord, word));
}
function buildEntries(professors) {
	const built = [];
	for (const [professor, info] of Object.entries(professors)) for (const [course, classes] of classesByCourse(info)) {
		const words = wordsOf([
			professor,
			course,
			...classes.map((classKey) => classKey.match(CLASS_KEY)[2])
		].join(" "));
		built.push({
			professor,
			course,
			classes,
			words: [...new Set(words)]
		});
	}
	return built;
}
function classesByCourse(info) {
	const grouped = /* @__PURE__ */ new Map();
	for (const classKey of Object.keys(info)) {
		const course = classKey.match(CLASS_KEY)?.[1];
		if (!course) continue;
		grouped.set(course, [...grouped.get(course) ?? [], classKey]);
	}
	return grouped;
}
function wordsOf(text) {
	return text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().match(/[a-z0-9]+/g) ?? [];
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
//#region src/utils/courses.ts
var SEASON_ORDER = {
	Spring: 1,
	Summer: 2,
	Fall: 3
};
function coursesOf(professor) {
	const offeringsByCode = /* @__PURE__ */ new Map();
	for (const offering of newestFirst(professor.classes)) {
		const offerings = offeringsByCode.get(offering.courseCode) ?? [];
		offeringsByCode.set(offering.courseCode, [...offerings, offering]);
	}
	return [...offeringsByCode].map(([code, offerings]) => ({
		code,
		title: offerings[0].title,
		offerings
	}));
}
function findCourse(professor, courseCode) {
	return coursesOf(professor).find((course) => course.code === courseCode);
}
function teachersOf(courseCode, professors, searchIndex) {
	return search(searchIndex, courseCode).filter((match) => match.course === courseCode).map((match) => {
		const professor = professors[match.professor];
		return {
			professor,
			course: findCourse(professor, courseCode)
		};
	}).sort((first, second) => lastTaughtRank(second) - lastTaughtRank(first));
}
function gradesOf(offerings) {
	return addGrades(offerings.map((offering) => offering.grades));
}
function lastTaughtRank(teacher) {
	return semesterRank(teacher.course.offerings[0].semester);
}
function newestFirst(classes) {
	return [...classes].sort((first, second) => semesterRank(second.semester) - semesterRank(first.semester));
}
function semesterRank(semester) {
	const [season, year] = semester.split(" ");
	return Number(year) * 10 + SEASON_ORDER[season];
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
function gradesForSubject(subject, { professors, searchIndex }) {
	switch (subject.type) {
		case "professor": return gradesOf(professors[subject.professorName].classes);
		case "course": return gradesOf(teachersOf(subject.courseCode, professors, searchIndex).flatMap((teacher) => teacher.course.offerings));
		case "class": return gradesOf(findCourse(professors[subject.professorName], subject.courseCode)?.offerings ?? []);
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
		case "course": return [page, ...teachersOf(page.courseCode, professors, searchIndex).slice(0, PROFESSORS_TO_START_WITH).map((teacher) => ({
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
	return {
		key: subjectKey(subject),
		label: subjectLabel(subject),
		color,
		grades: gradesForSubject(subject, gradeData),
		professorName,
		rating: professorName === null ? null : gradeData.professors[professorName].rmp.rating,
		courseGpa: subject.type === "class" ? wholeCourseGpa(subject.courseCode, gradeData) : null
	};
}
function wholeCourseGpa(courseCode, gradeData) {
	return averageGpa(gradesForSubject({
		type: "course",
		courseCode
	}, gradeData));
}
//#endregion
//#region src/components/analytics/ComparingList.tsx
function ComparingList(t0) {
	const $ = (0, import_compiler_runtime.c)(18);
	const { seriesData, onRemove, onClear } = t0;
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
	if ($[8] !== onRemove || $[9] !== seriesData) {
		let t5;
		if ($[11] !== onRemove) {
			t5 = (series) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between gap-2 rounded-lg bg-zinc-800 px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesName, { series }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "px-2 text-xs",
					"aria-label": `Remove ${series.label}`,
					onClick: () => onRemove(series.key),
					children: "✕"
				})]
			}, series.key);
			$[11] = onRemove;
			$[12] = t5;
		} else t5 = $[12];
		t4 = seriesData.map(t5);
		$[8] = onRemove;
		$[9] = seriesData;
		$[10] = t4;
	} else t4 = $[10];
	let t5;
	if ($[13] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-1",
			children: t4
		});
		$[13] = t4;
		$[14] = t5;
	} else t5 = $[14];
	let t6;
	if ($[15] !== t3 || $[16] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [t3, t5]
		});
		$[15] = t3;
		$[16] = t5;
		$[17] = t6;
	} else t6 = $[17];
	return t6;
}
//#endregion
//#region src/utils/format.ts
function formatOutOfFive(value) {
	return value === null ? "No ratings" : `${value.toFixed(1)} / 5`;
}
function formatPercent(value) {
	return value === null ? "No ratings" : `${value}%`;
}
function formatRmpRating(rating) {
	return rating === null ? "No RMP ratings" : `RMP ${formatOutOfFive(rating)}`;
}
function formatGpa(gpa) {
	return gpa === null ? "—" : gpa.toFixed(2);
}
function formatShare(percent) {
	return percent === null ? "—" : `${Math.round(percent)}%`;
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
	"RMP"
];
function ComparisonTable(t0) {
	const $ = (0, import_compiler_runtime.c)(5);
	const { seriesData } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
			className: "text-xs uppercase tracking-wide text-zinc-400",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: COLUMNS.map(_temp$9) })
		});
		$[0] = t1;
	} else t1 = $[0];
	let t2;
	if ($[1] !== seriesData) {
		t2 = seriesData.map(_temp2$4);
		$[1] = seriesData;
		$[2] = t2;
	} else t2 = $[2];
	let t3;
	if ($[3] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl bg-zinc-800",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [t1, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: t2 })]
			})
		});
		$[3] = t2;
		$[4] = t3;
	} else t3 = $[4];
	return t3;
}
function _temp2$4(series) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonRow, { series }, series.key);
}
function _temp$9(column) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
		className: "whitespace-nowrap px-3 py-2 font-semibold",
		children: column
	}, column);
}
function ComparisonRow(t0) {
	const $ = (0, import_compiler_runtime.c)(52);
	const { series } = t0;
	const { grades } = series;
	let gpa;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	if ($[0] !== grades || $[1] !== series) {
		gpa = averageGpa(grades);
		t3 = "border-t border-zinc-700 tabular-nums";
		if ($[8] !== series) {
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeriesName, { series })
			});
			$[8] = series;
			$[9] = t4;
		} else t4 = $[9];
		let t6;
		if ($[10] !== grades) {
			t6 = medianGrade(grades) ?? "—";
			$[10] = grades;
			$[11] = t6;
		} else t6 = $[11];
		if ($[12] !== t6) {
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-3 py-2 font-semibold",
				children: t6
			});
			$[12] = t6;
			$[13] = t5;
		} else t5 = $[13];
		t1 = "px-3 py-2";
		t2 = formatGpa(gpa);
		$[0] = grades;
		$[1] = series;
		$[2] = gpa;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
		$[6] = t4;
		$[7] = t5;
	} else {
		gpa = $[2];
		t1 = $[3];
		t2 = $[4];
		t3 = $[5];
		t4 = $[6];
		t5 = $[7];
	}
	let t6;
	if ($[14] !== t1 || $[15] !== t2) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: t1,
			children: t2
		});
		$[14] = t1;
		$[15] = t2;
		$[16] = t6;
	} else t6 = $[16];
	let t7;
	if ($[17] !== gpa || $[18] !== series.courseGpa) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseComparison, {
				gpa,
				courseGpa: series.courseGpa
			})
		});
		$[17] = gpa;
		$[18] = series.courseGpa;
		$[19] = t7;
	} else t7 = $[19];
	let t8;
	if ($[20] !== grades) {
		t8 = formatShare(percentWhoGot(grades, A_GRADES));
		$[20] = grades;
		$[21] = t8;
	} else t8 = $[21];
	let t9;
	if ($[22] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t8
		});
		$[22] = t8;
		$[23] = t9;
	} else t9 = $[23];
	let t10;
	if ($[24] !== grades) {
		t10 = formatShare(percentWhoGot(grades, D_AND_F_GRADES));
		$[24] = grades;
		$[25] = t10;
	} else t10 = $[25];
	let t11;
	if ($[26] !== t10) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t10
		});
		$[26] = t10;
		$[27] = t11;
	} else t11 = $[27];
	let t12;
	if ($[28] !== grades) {
		t12 = formatShare(percentWhoGot(grades, WITHDREW));
		$[28] = grades;
		$[29] = t12;
	} else t12 = $[29];
	let t13;
	if ($[30] !== t12) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t12
		});
		$[30] = t12;
		$[31] = t13;
	} else t13 = $[31];
	let t14;
	if ($[32] !== grades) {
		t14 = countStudents(grades, LETTER_GRADES).toLocaleString();
		$[32] = grades;
		$[33] = t14;
	} else t14 = $[33];
	let t15;
	if ($[34] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "px-3 py-2",
			children: t14
		});
		$[34] = t14;
		$[35] = t15;
	} else t15 = $[35];
	let t16;
	if ($[36] !== series.professorName || $[37] !== series.rating) {
		t16 = series.professorName === null ? "—" : formatOutOfFive(series.rating);
		$[36] = series.professorName;
		$[37] = series.rating;
		$[38] = t16;
	} else t16 = $[38];
	let t17;
	if ($[39] !== t16) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
			className: "whitespace-nowrap px-3 py-2",
			children: t16
		});
		$[39] = t16;
		$[40] = t17;
	} else t17 = $[40];
	let t18;
	if ($[41] !== t11 || $[42] !== t13 || $[43] !== t15 || $[44] !== t17 || $[45] !== t3 || $[46] !== t4 || $[47] !== t5 || $[48] !== t6 || $[49] !== t7 || $[50] !== t9) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
				t17
			]
		});
		$[41] = t11;
		$[42] = t13;
		$[43] = t15;
		$[44] = t17;
		$[45] = t3;
		$[46] = t4;
		$[47] = t5;
		$[48] = t6;
		$[49] = t7;
		$[50] = t9;
		$[51] = t18;
	} else t18 = $[51];
	return t18;
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
	const $ = (0, import_compiler_runtime.c)(34);
	const { seriesData } = t0;
	const [inPercent, setInPercent] = (0, import_react.useState)(true);
	const [asLines, setAsLines] = (0, import_react.useState)(true);
	const [eachGrade, setEachGrade] = (0, import_react.useState)(true);
	const t1 = !eachGrade;
	let t2;
	if ($[0] !== asLines || $[1] !== inPercent || $[2] !== seriesData || $[3] !== t1) {
		const options = {
			inPercent,
			atOrAbove: t1
		};
		t2 = seriesData.map((series) => ({
			type: asLines ? "scatter" : "bar",
			mode: "lines+markers",
			name: series.label,
			x: GRADES_WORST_FIRST,
			y: gradeDistribution(series.grades, options),
			line: {
				color: series.color,
				width: 2
			},
			marker: {
				color: series.color,
				size: 8
			},
			hovertemplate: inPercent ? "%{y:.1f}%" : "%{y} students"
		}));
		$[0] = asLines;
		$[1] = inPercent;
		$[2] = seriesData;
		$[3] = t1;
		$[4] = t2;
	} else t2 = $[4];
	const data = t2;
	let t3;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = {
			title: { text: "Grade" },
			type: "category"
		};
		$[5] = t3;
	} else t3 = $[5];
	const t4 = !eachGrade;
	let t5;
	if ($[6] !== inPercent || $[7] !== t4) {
		t5 = yAxisTitle(inPercent, t4);
		$[6] = inPercent;
		$[7] = t4;
		$[8] = t5;
	} else t5 = $[8];
	let t6;
	if ($[9] !== t5) {
		t6 = { text: t5 };
		$[9] = t5;
		$[10] = t6;
	} else t6 = $[10];
	const t7 = inPercent ? "%" : "";
	let t8;
	if ($[11] !== t6 || $[12] !== t7) {
		t8 = {
			barmode: "group",
			hovermode: "x unified",
			xaxis: t3,
			yaxis: {
				title: t6,
				ticksuffix: t7,
				rangemode: "tozero"
			}
		};
		$[11] = t6;
		$[12] = t7;
		$[13] = t8;
	} else t8 = $[13];
	const layout = t8;
	let t9;
	if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = ["Percent", "Students"];
		$[14] = t9;
	} else t9 = $[14];
	let t10;
	if ($[15] !== inPercent) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			choices: t9,
			firstIsOn: inPercent,
			onChange: setInPercent
		});
		$[15] = inPercent;
		$[16] = t10;
	} else t10 = $[16];
	let t11;
	if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = ["Lines", "Bars"];
		$[17] = t11;
	} else t11 = $[17];
	let t12;
	if ($[18] !== asLines) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			choices: t11,
			firstIsOn: asLines,
			onChange: setAsLines
		});
		$[18] = asLines;
		$[19] = t12;
	} else t12 = $[19];
	let t13;
	if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
		t13 = ["Each grade", "At or above"];
		$[20] = t13;
	} else t13 = $[20];
	let t14;
	if ($[21] !== eachGrade) {
		t14 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
			choices: t13,
			firstIsOn: eachGrade,
			onChange: setEachGrade
		});
		$[21] = eachGrade;
		$[22] = t14;
	} else t14 = $[22];
	let t15;
	if ($[23] !== t10 || $[24] !== t12 || $[25] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				t10,
				t12,
				t14
			]
		});
		$[23] = t10;
		$[24] = t12;
		$[25] = t14;
		$[26] = t15;
	} else t15 = $[26];
	let t16;
	if ($[27] !== data || $[28] !== layout) {
		t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotlyChart, {
			data,
			layout,
			className: "h-96"
		});
		$[27] = data;
		$[28] = layout;
		$[29] = t16;
	} else t16 = $[29];
	let t17;
	if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-zinc-500",
			children: "Out of students who got a letter grade. Withdrawals (W) are in the table below."
		});
		$[30] = t17;
	} else t17 = $[30];
	let t18;
	if ($[31] !== t15 || $[32] !== t16) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				t15,
				t16,
				t17
			]
		});
		$[31] = t15;
		$[32] = t16;
		$[33] = t18;
	} else t18 = $[33];
	return t18;
}
function yAxisTitle(inPercent, atOrAbove) {
	const measure = inPercent ? "% of students" : "Students";
	return atOrAbove ? `${measure} at or above` : measure;
}
//#endregion
//#region src/components/analytics/MedianChart.tsx
function MedianChart(t0) {
	const $ = (0, import_compiler_runtime.c)(24);
	const { seriesData } = t0;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	let t7;
	if ($[0] !== seriesData) {
		const withGrades = seriesData.filter(_temp$8);
		const medians = withGrades.map(_temp2$3);
		t2 = "bar";
		t3 = withGrades.map(_temp3);
		t4 = medians.map(gradePosition);
		t5 = medians;
		t6 = "outside";
		if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
			t7 = {
				color: "#f4f4f5",
				size: 15
			};
			$[8] = t7;
		} else t7 = $[8];
		t1 = withGrades.map(_temp4);
		$[0] = seriesData;
		$[1] = t1;
		$[2] = t2;
		$[3] = t3;
		$[4] = t4;
		$[5] = t5;
		$[6] = t6;
		$[7] = t7;
	} else {
		t1 = $[1];
		t2 = $[2];
		t3 = $[3];
		t4 = $[4];
		t5 = $[5];
		t6 = $[6];
		t7 = $[7];
	}
	let t8;
	if ($[9] !== t1) {
		t8 = { color: t1 };
		$[9] = t1;
		$[10] = t8;
	} else t8 = $[10];
	let t9;
	if ($[11] !== t2 || $[12] !== t3 || $[13] !== t4 || $[14] !== t5 || $[15] !== t6 || $[16] !== t7 || $[17] !== t8) {
		t9 = [{
			type: t2,
			x: t3,
			y: t4,
			text: t5,
			textposition: t6,
			textfont: t7,
			marker: t8,
			hovertemplate: "%{x}<br>Median Grade %{text}<extra></extra>"
		}];
		$[11] = t2;
		$[12] = t3;
		$[13] = t4;
		$[14] = t5;
		$[15] = t6;
		$[16] = t7;
		$[17] = t8;
		$[18] = t9;
	} else t9 = $[18];
	const data = t9;
	let t10;
	let t11;
	if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
		t10 = {
			l: 16,
			r: 16,
			t: 32,
			b: 56
		};
		t11 = { showgrid: false };
		$[19] = t10;
		$[20] = t11;
	} else {
		t10 = $[19];
		t11 = $[20];
	}
	let t12;
	if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
		t12 = {
			showlegend: false,
			hovermode: "closest",
			margin: t10,
			xaxis: t11,
			yaxis: {
				visible: false,
				range: [0, GRADES_WORST_FIRST.length + 1]
			}
		};
		$[21] = t12;
	} else t12 = $[21];
	const layout = t12;
	let t13;
	if ($[22] !== data) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlotlyChart, {
			data,
			layout,
			className: "h-80"
		});
		$[22] = data;
		$[23] = t13;
	} else t13 = $[23];
	return t13;
}
function _temp4(series_2) {
	return series_2.color;
}
function _temp3(series_1) {
	return series_1.label;
}
function _temp2$3(series_0) {
	return medianGrade(series_0.grades);
}
function _temp$8(series) {
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
		t1 = reviews.map(_temp$7);
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
function _temp$7(review, index) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-zinc-800 p-3 text-sm text-zinc-300",
		children: [
			"“",
			review,
			"”"
		]
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
	const $ = (0, import_compiler_runtime.c)(8);
	const { seriesData } = t0;
	const { professors } = useLookup();
	let t1;
	if ($[0] !== seriesData) {
		t1 = new Set(seriesData.map(_temp$6).filter(_temp2$2));
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
	if ($[5] !== professorNames || $[6] !== professors) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: professorNames.map((name_0) => {
				const { rmp } = professors[name_0];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					open: true,
					className: "rounded-xl border border-zinc-800 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
						className: "cursor-pointer font-medium",
						children: [
							name_0,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-zinc-400",
								children: [
									"· ",
									formatRmpRating(rmp.rating),
									" · ",
									rmp.ratingCount,
									" ratings"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: rmp.reviews })
					})]
				}, name_0);
			})
		});
		$[5] = professorNames;
		$[6] = professors;
		$[7] = t3;
	} else t3 = $[7];
	return t3;
}
function _temp2$2(name) {
	return name !== null;
}
function _temp$6(series) {
	return series.professorName;
}
//#endregion
//#region src/utils/pageForSearch.ts
function pageForSearch(query, results, professors) {
	if (results.length === 0) return null;
	const [bestMatch] = results;
	const professor = professors[bestMatch.professor];
	const course = findCourse(professor, bestMatch.course);
	const courseWords = [course.code, ...course.offerings.map((offering) => offering.title)].join(" ");
	const namesProfessor = sharesAWord(query, professor.name);
	const namesCourse = sharesAWord(query, courseWords);
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
		courseCode: closestCourse(results.filter((match) => match.score === bestMatch.score), professors)
	};
}
function closestCourse(matches, professors) {
	const courses = /* @__PURE__ */ new Map();
	for (const match of matches) {
		const title = findCourse(professors[match.professor], match.course).title;
		const teachers = (courses.get(match.course)?.teachers ?? 0) + 1;
		courses.set(match.course, {
			titleWords: title.split(" ").length,
			teachers
		});
	}
	return [...courses].sort(([, first], [, second]) => first.titleWords - second.titleWords || second.teachers - first.teachers)[0][0];
}
//#endregion
//#region src/components/analytics/SubjectPicker.tsx
var MAX_MATCHES = 6;
function SubjectPicker(t0) {
	const $ = (0, import_compiler_runtime.c)(31);
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
	if ($[18] !== canAddMore || $[19] !== isAdded || $[20] !== onAdd || $[21] !== results) {
		let t8;
		if ($[23] !== canAddMore || $[24] !== isAdded || $[25] !== onAdd) {
			t8 = (match) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchChoices, {
				match,
				canAddMore,
				isAdded,
				onAdd
			}, `${match.professor} ${match.course}`);
			$[23] = canAddMore;
			$[24] = isAdded;
			$[25] = onAdd;
			$[26] = t8;
		} else t8 = $[26];
		t7 = results.slice(0, MAX_MATCHES).map(t8);
		$[18] = canAddMore;
		$[19] = isAdded;
		$[20] = onAdd;
		$[21] = results;
		$[22] = t7;
	} else t7 = $[22];
	let t8;
	if ($[27] !== t5 || $[28] !== t6 || $[29] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [
				t5,
				t6,
				t7
			]
		});
		$[27] = t5;
		$[28] = t6;
		$[29] = t7;
		$[30] = t8;
	} else t8 = $[30];
	return t8;
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
	const $ = (0, import_compiler_runtime.c)(45);
	const { page, professors, searchIndex, closeAnalytics } = useLookup();
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
	const [sidebarWidth] = (0, import_react.useState)(_temp$5);
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
	if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = function addSubject(subject) {
			setSeriesList((curr) => withSubjectAdded(curr, subject));
		};
		$[16] = t6;
	} else t6 = $[16];
	const addSubject = t6;
	let t7;
	if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
		t7 = function removeSeries(key) {
			setSeriesList((curr_0) => curr_0.filter((series_0) => subjectKey(series_0.subject) !== key));
		};
		$[17] = t7;
	} else t7 = $[17];
	const removeSeries = t7;
	let t8;
	if ($[18] !== sidebarWidth) {
		t8 = { width: sidebarWidth };
		$[18] = sidebarWidth;
		$[19] = t8;
	} else t8 = $[19];
	let t9;
	if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "flex items-center gap-3 text-2xl font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VennIcon, { className: "h-8 w-12 text-orange-500" }), "Analytical Mode"]
		});
		$[20] = t9;
	} else t9 = $[20];
	let t10;
	if ($[21] !== handleClose) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			"data-reveal": true,
			className: "flex items-center justify-between gap-4 opacity-0",
			children: [t9, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: handleClose,
				children: "✕ Close"
			})]
		});
		$[21] = handleClose;
		$[22] = t10;
	} else t10 = $[22];
	let t11;
	if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
		t11 = () => setSeriesList([]);
		$[23] = t11;
	} else t11 = $[23];
	let t12;
	if ($[24] !== seriesData) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparingList, {
			seriesData,
			onRemove: removeSeries,
			onClear: t11
		});
		$[24] = seriesData;
		$[25] = t12;
	} else t12 = $[25];
	const t13 = seriesList.length < SERIES_COLORS.length;
	let t14;
	if ($[26] !== seriesList) {
		t14 = (subject_0) => isAdded(seriesList, subject_0);
		$[26] = seriesList;
		$[27] = t14;
	} else t14 = $[27];
	let t15;
	if ($[28] !== t13 || $[29] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPicker, {
			canAddMore: t13,
			isAdded: t14,
			onAdd: addSubject
		});
		$[28] = t13;
		$[29] = t14;
		$[30] = t15;
	} else t15 = $[30];
	let t16;
	if ($[31] !== t12 || $[32] !== t15) {
		t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			"data-reveal": true,
			className: "flex flex-col gap-6 opacity-0",
			children: [t12, t15]
		});
		$[31] = t12;
		$[32] = t15;
		$[33] = t16;
	} else t16 = $[33];
	let t17;
	if ($[34] !== seriesData) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComparisonTable, { seriesData })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "What students say",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorReviews, { seriesData })
				})
			] })
		});
		$[34] = seriesData;
		$[35] = t17;
	} else t17 = $[35];
	let t18;
	if ($[36] !== t16 || $[37] !== t17) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[20rem_1fr]",
			children: [t16, t17]
		});
		$[36] = t16;
		$[37] = t17;
		$[38] = t18;
	} else t18 = $[38];
	let t19;
	if ($[39] !== t10 || $[40] !== t18) {
		t19 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 p-6",
			children: [t10, t18]
		});
		$[39] = t10;
		$[40] = t18;
		$[41] = t19;
	} else t19 = $[41];
	let t20;
	if ($[42] !== t19 || $[43] !== t8) {
		t20 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: panelRef,
			className: "fixed inset-y-0 right-0 overflow-y-auto bg-zinc-900 text-zinc-100",
			style: t8,
			children: t19
		});
		$[42] = t19;
		$[43] = t8;
		$[44] = t20;
	} else t20 = $[44];
	return t20;
}
function _temp$5() {
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
			const tallestPercent = Math.max(...shares.map(_temp$4));
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
function _temp$4(share) {
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
	const $ = (0, import_compiler_runtime.c)(27);
	const { rmp, grades, medianLabel } = t0;
	let t1;
	if ($[0] !== grades) {
		t1 = medianGrade(grades) ?? "No grades yet";
		$[0] = grades;
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
	if ($[5] !== rmp.rating) {
		t3 = formatOutOfFive(rmp.rating);
		$[5] = rmp.rating;
		$[6] = t3;
	} else t3 = $[6];
	let t4;
	if ($[7] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "RMP rating",
			value: t3
		});
		$[7] = t3;
		$[8] = t4;
	} else t4 = $[8];
	let t5;
	if ($[9] !== rmp.difficulty) {
		t5 = formatOutOfFive(rmp.difficulty);
		$[9] = rmp.difficulty;
		$[10] = t5;
	} else t5 = $[10];
	let t6;
	if ($[11] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Difficulty",
			value: t5
		});
		$[11] = t5;
		$[12] = t6;
	} else t6 = $[12];
	let t7;
	if ($[13] !== rmp.wouldTakeAgainPercent) {
		t7 = formatPercent(rmp.wouldTakeAgainPercent);
		$[13] = rmp.wouldTakeAgainPercent;
		$[14] = t7;
	} else t7 = $[14];
	let t8;
	if ($[15] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
			label: "Would take again",
			value: t7
		});
		$[15] = t7;
		$[16] = t8;
	} else t8 = $[16];
	let t9;
	if ($[17] !== t2 || $[18] !== t4 || $[19] !== t6 || $[20] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [
				t2,
				t4,
				t6,
				t8
			]
		});
		$[17] = t2;
		$[18] = t4;
		$[19] = t6;
		$[20] = t8;
		$[21] = t9;
	} else t9 = $[21];
	let t10;
	if ($[22] !== rmp) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RmpLink, { rmp });
		$[22] = rmp;
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] !== t10 || $[25] !== t9) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [t9, t10]
		});
		$[24] = t10;
		$[25] = t9;
		$[26] = t11;
	} else t11 = $[26];
	return t11;
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
function RmpLink(t0) {
	const $ = (0, import_compiler_runtime.c)(4);
	const { rmp } = t0;
	if (rmp.link === null) {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-zinc-500",
				children: "Not found on Rate My Professors"
			});
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	let t1;
	if ($[1] !== rmp.link || $[2] !== rmp.ratingCount) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ExternalLink, {
				href: rmp.link,
				children: [
					"See all ",
					rmp.ratingCount,
					" ratings on Rate My Professors"
				]
			})
		});
		$[1] = rmp.link;
		$[2] = rmp.ratingCount;
		$[3] = t1;
	} else t1 = $[3];
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
		t1 = syllabi.map(_temp$3);
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
function _temp$3(syllabus) {
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
	const $ = (0, import_compiler_runtime.c)(56);
	const { professorName, courseCode } = t0;
	const { professors, openProfessor, openCourse } = useLookup();
	const professor = professors[professorName];
	let course;
	let t1;
	if ($[0] !== courseCode || $[1] !== professor) {
		course = findCourse(professor, courseCode);
		t1 = gradesOf(course.offerings);
		$[0] = courseCode;
		$[1] = professor;
		$[2] = course;
		$[3] = t1;
	} else {
		course = $[2];
		t1 = $[3];
	}
	const grades = t1;
	let t2;
	if ($[4] !== course.code || $[5] !== course.title) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-2xl font-bold",
			children: [
				course.code,
				" · ",
				course.title
			]
		});
		$[4] = course.code;
		$[5] = course.title;
		$[6] = t2;
	} else t2 = $[6];
	let t3;
	if ($[7] !== openProfessor || $[8] !== professor.name) {
		t3 = () => openProfessor(professor.name);
		$[7] = openProfessor;
		$[8] = professor.name;
		$[9] = t3;
	} else t3 = $[9];
	let t4;
	if ($[10] !== professor.name || $[11] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-zinc-400",
			children: [
				"with",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					onClick: t3,
					children: professor.name
				})
			]
		});
		$[10] = professor.name;
		$[11] = t3;
		$[12] = t4;
	} else t4 = $[12];
	let t5;
	if ($[13] !== t2 || $[14] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start",
			children: [t2, t4]
		});
		$[13] = t2;
		$[14] = t4;
		$[15] = t5;
	} else t5 = $[15];
	const t6 = `Median Grade in ${course.code}`;
	let t7;
	if ($[16] !== grades || $[17] !== professor.rmp || $[18] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorStats, {
			rmp: professor.rmp,
			grades,
			medianLabel: t6
		});
		$[16] = grades;
		$[17] = professor.rmp;
		$[18] = t6;
		$[19] = t7;
	} else t7 = $[19];
	let t8;
	if ($[20] !== course) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Latest syllabus",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LatestSyllabus, { course })
		});
		$[20] = course;
		$[21] = t8;
	} else t8 = $[21];
	const t9 = `Grades in ${course.code}`;
	let t10;
	if ($[22] !== grades) {
		t10 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades });
		$[22] = grades;
		$[23] = t10;
	} else t10 = $[23];
	let t11;
	if ($[24] !== t10 || $[25] !== t9) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: t9,
			children: t10
		});
		$[24] = t10;
		$[25] = t9;
		$[26] = t11;
	} else t11 = $[26];
	let t12;
	if ($[27] !== professor.rmp.reviews) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "What students say",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: professor.rmp.reviews })
		});
		$[27] = professor.rmp.reviews;
		$[28] = t12;
	} else t12 = $[28];
	let t13;
	if ($[29] !== course.offerings) {
		t13 = course.offerings.map(_temp$2);
		$[29] = course.offerings;
		$[30] = t13;
	} else t13 = $[30];
	let t14;
	if ($[31] !== t13) {
		t14 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Every semester",
			children: t13
		});
		$[31] = t13;
		$[32] = t14;
	} else t14 = $[32];
	let t15;
	if ($[33] !== course.code || $[34] !== openCourse) {
		t15 = () => openCourse(course.code);
		$[33] = course.code;
		$[34] = openCourse;
		$[35] = t15;
	} else t15 = $[35];
	let t16;
	if ($[36] !== course.code || $[37] !== t15) {
		t16 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t15,
			children: ["Compare every professor who teaches ", course.code]
		});
		$[36] = course.code;
		$[37] = t15;
		$[38] = t16;
	} else t16 = $[38];
	let t17;
	if ($[39] !== openProfessor || $[40] !== professor.name) {
		t17 = () => openProfessor(professor.name);
		$[39] = openProfessor;
		$[40] = professor.name;
		$[41] = t17;
	} else t17 = $[41];
	let t18;
	if ($[42] !== professor.name || $[43] !== t17) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t17,
			children: [
				"See all of ",
				professor.name,
				"'s classes"
			]
		});
		$[42] = professor.name;
		$[43] = t17;
		$[44] = t18;
	} else t18 = $[44];
	let t19;
	if ($[45] !== t16 || $[46] !== t18) {
		t19 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-1",
			children: [t16, t18]
		});
		$[45] = t16;
		$[46] = t18;
		$[47] = t19;
	} else t19 = $[47];
	let t20;
	if ($[48] !== t11 || $[49] !== t12 || $[50] !== t14 || $[51] !== t19 || $[52] !== t5 || $[53] !== t7 || $[54] !== t8) {
		t20 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				t5,
				t7,
				t8,
				t11,
				t12,
				t14,
				t19
			]
		});
		$[48] = t11;
		$[49] = t12;
		$[50] = t14;
		$[51] = t19;
		$[52] = t5;
		$[53] = t7;
		$[54] = t8;
		$[55] = t20;
	} else t20 = $[55];
	return t20;
}
function _temp$2(offering) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SemesterRow, { offering }, `${offering.semester} ${offering.title}`);
}
function LatestSyllabus(t0) {
	const $ = (0, import_compiler_runtime.c)(10);
	const { course } = t0;
	let t1;
	if ($[0] !== course.offerings) {
		t1 = course.offerings.find(_temp2$1);
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
function _temp2$1(offering) {
	return offering.syllabi.length > 0;
}
function SemesterRow(t0) {
	const $ = (0, import_compiler_runtime.c)(14);
	const { offering } = t0;
	let t1;
	if ($[0] !== offering.grades) {
		t1 = medianGrade(offering.grades);
		$[0] = offering.grades;
		$[1] = t1;
	} else t1 = $[1];
	const median = t1;
	let t2;
	if ($[2] !== offering.semester) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: offering.semester
		});
		$[2] = offering.semester;
		$[3] = t2;
	} else t2 = $[3];
	const t3 = median === null ? "No grades yet" : `Median ${median}`;
	let t4;
	if ($[4] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: t3
		});
		$[4] = t3;
		$[5] = t4;
	} else t4 = $[5];
	let t5;
	if ($[6] !== t2 || $[7] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [t2, t4]
		});
		$[6] = t2;
		$[7] = t4;
		$[8] = t5;
	} else t5 = $[8];
	let t6;
	if ($[9] !== offering.syllabi) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SyllabusLinks, { syllabi: offering.syllabi });
		$[9] = offering.syllabi;
		$[10] = t6;
	} else t6 = $[10];
	let t7;
	if ($[11] !== t5 || $[12] !== t6) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1 rounded-xl bg-zinc-800 p-3",
			children: [t5, t6]
		});
		$[11] = t5;
		$[12] = t6;
		$[13] = t7;
	} else t7 = $[13];
	return t7;
}
//#endregion
//#region src/components/ClassCard.tsx
function ClassCard(t0) {
	const $ = (0, import_compiler_runtime.c)(30);
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
	if ($[20] !== professor.rmp.rating) {
		t9 = formatRmpRating(professor.rmp.rating);
		$[20] = professor.rmp.rating;
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
	if ($[24] !== t10 || $[25] !== t8) {
		t11 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 flex-col items-end text-sm",
			children: [t8, t10]
		});
		$[24] = t10;
		$[25] = t8;
		$[26] = t11;
	} else t11 = $[26];
	let t12;
	if ($[27] !== t11 || $[28] !== t6) {
		t12 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3",
			children: [t6, t11]
		});
		$[27] = t11;
		$[28] = t6;
		$[29] = t12;
	} else t12 = $[29];
	return t12;
}
//#endregion
//#region src/components/CoursePage.tsx
function CoursePage(t0) {
	const $ = (0, import_compiler_runtime.c)(21);
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
			const everyonesGrades = gradesOf(teachers.flatMap(_temp$1));
			t3 = "flex flex-col gap-5";
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-2xl font-bold",
					children: [
						courseCode,
						" · ",
						teachers[0].course.title
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-zinc-400",
					children: [
						teachers.length,
						" ",
						teachers.length === 1 ? "professor has" : "professors have",
						" taught this class"
					]
				})]
			});
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: `Grades in ${courseCode} (every professor)`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades: everyonesGrades })
			});
			T0 = Section;
			t1 = "Professors, most recent first";
			t2 = teachers.map(_temp2);
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
	if ($[12] !== T0 || $[13] !== t1 || $[14] !== t2) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T0, {
			title: t1,
			children: t2
		});
		$[12] = T0;
		$[13] = t1;
		$[14] = t2;
		$[15] = t7;
	} else t7 = $[15];
	let t8;
	if ($[16] !== t3 || $[17] !== t4 || $[18] !== t5 || $[19] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t3,
			children: [
				t4,
				t5,
				t7
			]
		});
		$[16] = t3;
		$[17] = t4;
		$[18] = t5;
		$[19] = t7;
		$[20] = t8;
	} else t8 = $[20];
	return t8;
}
function _temp2(teacher_0) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassCard, {
		professor: teacher_0.professor,
		course: teacher_0.course,
		detail: `Last taught ${teacher_0.course.offerings[0].semester}`
	}, teacher_0.professor.name);
}
function _temp$1(teacher) {
	return teacher.course.offerings;
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
	const $ = (0, import_compiler_runtime.c)(37);
	const { professorName } = t0;
	const { professors } = useLookup();
	const professor = professors[professorName];
	let T0;
	let t1;
	let t2;
	let t3;
	let t4;
	let t5;
	let t6;
	if ($[0] !== professor) {
		const courses = coursesOf(professor);
		let t7;
		if ($[8] !== professor.classes) {
			t7 = gradesOf(professor.classes);
			$[8] = professor.classes;
			$[9] = t7;
		} else t7 = $[9];
		const allGrades = t7;
		t3 = "flex flex-col gap-5";
		let t8;
		if ($[10] !== professor.name) {
			t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold",
				children: professor.name
			});
			$[10] = professor.name;
			$[11] = t8;
		} else t8 = $[11];
		let t9;
		if ($[12] !== professor.department) {
			t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-sm text-zinc-400",
				children: [professor.department, " department"]
			});
			$[12] = professor.department;
			$[13] = t9;
		} else t9 = $[13];
		if ($[14] !== t8 || $[15] !== t9) {
			t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [t8, t9]
			});
			$[14] = t8;
			$[15] = t9;
			$[16] = t4;
		} else t4 = $[16];
		if ($[17] !== allGrades || $[18] !== professor.rmp) {
			t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfessorStats, {
				rmp: professor.rmp,
				grades: allGrades,
				medianLabel: "Median Grade (all classes)"
			});
			$[17] = allGrades;
			$[18] = professor.rmp;
			$[19] = t5;
		} else t5 = $[19];
		if ($[20] !== allGrades) {
			t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Grades in all classes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeBars, { grades: allGrades })
			});
			$[20] = allGrades;
			$[21] = t6;
		} else t6 = $[21];
		T0 = Section;
		t1 = `Classes (${courses.length})`;
		let t10;
		if ($[22] !== professor.name) {
			t10 = (course) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseRow, {
				professorName: professor.name,
				course
			}, course.code);
			$[22] = professor.name;
			$[23] = t10;
		} else t10 = $[23];
		t2 = courses.map(t10);
		$[0] = professor;
		$[1] = T0;
		$[2] = t1;
		$[3] = t2;
		$[4] = t3;
		$[5] = t4;
		$[6] = t5;
		$[7] = t6;
	} else {
		T0 = $[1];
		t1 = $[2];
		t2 = $[3];
		t3 = $[4];
		t4 = $[5];
		t5 = $[6];
		t6 = $[7];
	}
	let t7;
	if ($[24] !== T0 || $[25] !== t1 || $[26] !== t2) {
		t7 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(T0, {
			title: t1,
			children: t2
		});
		$[24] = T0;
		$[25] = t1;
		$[26] = t2;
		$[27] = t7;
	} else t7 = $[27];
	let t8;
	if ($[28] !== professor.rmp.reviews) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "What students say",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, { reviews: professor.rmp.reviews })
		});
		$[28] = professor.rmp.reviews;
		$[29] = t8;
	} else t8 = $[29];
	let t9;
	if ($[30] !== t3 || $[31] !== t4 || $[32] !== t5 || $[33] !== t6 || $[34] !== t7 || $[35] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: t3,
			children: [
				t4,
				t5,
				t6,
				t7,
				t8
			]
		});
		$[30] = t3;
		$[31] = t4;
		$[32] = t5;
		$[33] = t6;
		$[34] = t7;
		$[35] = t8;
		$[36] = t9;
	} else t9 = $[36];
	return t9;
}
function CourseRow(t0) {
	const $ = (0, import_compiler_runtime.c)(22);
	const { professorName, course } = t0;
	const { openClass } = useLookup();
	let t1;
	if ($[0] !== course.offerings) {
		t1 = medianGrade(gradesOf(course.offerings));
		$[0] = course.offerings;
		$[1] = t1;
	} else t1 = $[1];
	const median = t1;
	const semesterCount = course.offerings.length;
	let t2;
	if ($[2] !== course.code || $[3] !== openClass || $[4] !== professorName) {
		t2 = () => openClass(professorName, course.code);
		$[2] = course.code;
		$[3] = openClass;
		$[4] = professorName;
		$[5] = t2;
	} else t2 = $[5];
	let t3;
	if ($[6] !== course.code || $[7] !== course.title || $[8] !== t2) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			className: "font-medium",
			onClick: t2,
			children: [
				course.code,
				" · ",
				course.title
			]
		});
		$[6] = course.code;
		$[7] = course.title;
		$[8] = t2;
		$[9] = t3;
	} else t3 = $[9];
	const t4 = semesterCount === 1 ? "semester" : "semesters";
	let t5;
	if ($[10] !== course.offerings[0].semester || $[11] !== semesterCount || $[12] !== t4) {
		t5 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs text-zinc-400",
			children: [
				"Latest ",
				course.offerings[0].semester,
				" · ",
				semesterCount,
				" ",
				t4
			]
		});
		$[10] = course.offerings[0].semester;
		$[11] = semesterCount;
		$[12] = t4;
		$[13] = t5;
	} else t5 = $[13];
	let t6;
	if ($[14] !== t3 || $[15] !== t5) {
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-0.5",
			children: [t3, t5]
		});
		$[14] = t3;
		$[15] = t5;
		$[16] = t6;
	} else t6 = $[16];
	const t7 = median ?? "—";
	let t8;
	if ($[17] !== t7) {
		t8 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "shrink-0 text-sm",
			children: ["Median ", t7]
		});
		$[17] = t7;
		$[18] = t8;
	} else t8 = $[18];
	let t9;
	if ($[19] !== t6 || $[20] !== t8) {
		t9 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3",
			children: [t6, t8]
		});
		$[19] = t6;
		$[20] = t8;
		$[21] = t9;
	} else t9 = $[21];
	return t9;
}
//#endregion
//#region src/components/SearchPage.tsx
var MAX_RESULTS = 50;
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
		t6 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchResults, {
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
	if (query.trim() === "") {
		let t1;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-zinc-500",
				children: "Type a professor, a class, or a subject like \"linear algebra\", then press Enter."
			});
			$[0] = t1;
		} else t1 = $[0];
		return t1;
	}
	if (results.length === 0) {
		let t1;
		if ($[1] !== query) {
			t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "py-12 text-center text-zinc-500",
				children: [
					"No matches for \"",
					query,
					"\"."
				]
			});
			$[1] = query;
			$[2] = t1;
		} else t1 = $[2];
		return t1;
	}
	const t1 = results.length > MAX_RESULTS && ` · showing the best ${MAX_RESULTS} of ${results.length}`;
	let t2;
	if ($[3] !== t1) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm text-zinc-400",
			children: ["Press Enter to open the best match", t1]
		});
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
		t3 = results.slice(0, MAX_RESULTS).map(t4);
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
	const $ = (0, import_compiler_runtime.c)(25);
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
		t4 = function openPage(page_0) {
			setPages((curr_0) => [...curr_0, page_0]);
		};
		$[4] = t4;
	} else t4 = $[4];
	const openPage = t4;
	let t5;
	if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
		t5 = function replaceCurrentPage(page_1) {
			setPages((curr_1) => [...curr_1.slice(0, -1), page_1]);
		};
		$[5] = t5;
	} else t5 = $[5];
	const replaceCurrentPage = t5;
	let t6;
	if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
		t6 = function goBack() {
			setPages(_temp);
		};
		$[6] = t6;
	} else t6 = $[6];
	const goBack = t6;
	let t7;
	if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
		t7 = function goHome() {
			setPages([HOME_PAGE]);
		};
		$[7] = t7;
	} else t7 = $[7];
	const goHome = t7;
	let t8;
	if ($[8] !== pages) {
		t8 = pages.at(-1);
		$[8] = pages;
		$[9] = t8;
	} else t8 = $[9];
	const t9 = pages.length > 1;
	let t10;
	let t11;
	if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
		t10 = () => setIsAnalyticsOpen(true);
		t11 = () => setIsAnalyticsOpen(false);
		$[10] = t10;
		$[11] = t11;
	} else {
		t10 = $[10];
		t11 = $[11];
	}
	let t12;
	let t13;
	let t14;
	let t15;
	if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
		t12 = (query) => replaceCurrentPage({
			type: "search",
			query
		});
		t13 = (professorName) => openPage({
			type: "professor",
			professorName
		});
		t14 = (professorName_0, courseCode) => openPage({
			type: "class",
			professorName: professorName_0,
			courseCode
		});
		t15 = (courseCode_0) => openPage({
			type: "course",
			courseCode: courseCode_0
		});
		$[12] = t12;
		$[13] = t13;
		$[14] = t14;
		$[15] = t15;
	} else {
		t12 = $[12];
		t13 = $[13];
		t14 = $[14];
		t15 = $[15];
	}
	let t16;
	if ($[16] !== gradeData.professors || $[17] !== gradeData.searchIndex || $[18] !== isAnalyticsOpen || $[19] !== t8 || $[20] !== t9) {
		t16 = {
			page: t8,
			canGoBack: t9,
			isAnalyticsOpen,
			openAnalytics: t10,
			closeAnalytics: t11,
			professors: gradeData.professors,
			searchIndex: gradeData.searchIndex,
			goBack,
			goHome,
			openPage,
			updateSearch: t12,
			openProfessor: t13,
			openClass: t14,
			openCourse: t15
		};
		$[16] = gradeData.professors;
		$[17] = gradeData.searchIndex;
		$[18] = isAnalyticsOpen;
		$[19] = t8;
		$[20] = t9;
		$[21] = t16;
	} else t16 = $[21];
	let t17;
	if ($[22] !== children || $[23] !== t16) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupContext, {
			value: t16,
			children
		});
		$[22] = children;
		$[23] = t16;
		$[24] = t17;
	} else t17 = $[24];
	return t17;
}
function _temp(curr_2) {
	return curr_2.length > 1 ? curr_2.slice(0, -1) : curr_2;
}
//#endregion
//#region src/hooks/useGradeData.ts
var GRADE_DATA_URL = "../data/cleaned_grade_data.json";
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
	const rawData = await (await fetch(GRADE_DATA_URL)).json();
	return {
		professors: readProfessors(rawData),
		searchIndex: buildSearchIndex(rawData)
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentPage, {})]
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
