import { a as require_react, i as require_client, n as twMerge, r as require_compiler_runtime, t as require_jsx_runtime } from "./libraries.js";
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
			const tallestPercent = Math.max(...shares.map(_temp$5));
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
function _temp$5(share) {
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
//#region src/context/useLookup.ts
var LookupContext = (0, import_react.createContext)(null);
function useLookup() {
	const lookupContext = (0, import_react.useContext)(LookupContext);
	if (lookupContext == null) throw new Error("useLookup must be used inside LookupProvider");
	return lookupContext;
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
//#region src/components/ClassPage.tsx
function ClassPage(t0) {
	const $ = (0, import_compiler_runtime.c)(53);
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
	const t6 = `Median grade in ${course.code}`;
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
	if ($[27] !== course.offerings) {
		t12 = course.offerings.map(_temp$3);
		$[27] = course.offerings;
		$[28] = t12;
	} else t12 = $[28];
	let t13;
	if ($[29] !== t12) {
		t13 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Every semester",
			children: t12
		});
		$[29] = t12;
		$[30] = t13;
	} else t13 = $[30];
	let t14;
	if ($[31] !== course.code || $[32] !== openCourse) {
		t14 = () => openCourse(course.code);
		$[31] = course.code;
		$[32] = openCourse;
		$[33] = t14;
	} else t14 = $[33];
	let t15;
	if ($[34] !== course.code || $[35] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t14,
			children: ["Compare every professor who teaches ", course.code]
		});
		$[34] = course.code;
		$[35] = t14;
		$[36] = t15;
	} else t15 = $[36];
	let t16;
	if ($[37] !== openProfessor || $[38] !== professor.name) {
		t16 = () => openProfessor(professor.name);
		$[37] = openProfessor;
		$[38] = professor.name;
		$[39] = t16;
	} else t16 = $[39];
	let t17;
	if ($[40] !== professor.name || $[41] !== t16) {
		t17 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "link",
			onClick: t16,
			children: [
				"See all of ",
				professor.name,
				"'s classes"
			]
		});
		$[40] = professor.name;
		$[41] = t16;
		$[42] = t17;
	} else t17 = $[42];
	let t18;
	if ($[43] !== t15 || $[44] !== t17) {
		t18 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-1",
			children: [t15, t17]
		});
		$[43] = t15;
		$[44] = t17;
		$[45] = t18;
	} else t18 = $[45];
	let t19;
	if ($[46] !== t11 || $[47] !== t13 || $[48] !== t18 || $[49] !== t5 || $[50] !== t7 || $[51] !== t8) {
		t19 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				t5,
				t7,
				t8,
				t11,
				t13,
				t18
			]
		});
		$[46] = t11;
		$[47] = t13;
		$[48] = t18;
		$[49] = t5;
		$[50] = t7;
		$[51] = t8;
		$[52] = t19;
	} else t19 = $[52];
	return t19;
}
function _temp$3(offering) {
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
			const everyonesGrades = gradesOf(teachers.flatMap(_temp$2));
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
function _temp$2(teacher) {
	return teacher.course.offerings;
}
//#endregion
//#region src/components/Header.tsx
function Header() {
	const $ = (0, import_compiler_runtime.c)(9);
	const { canGoBack, goBack, openSearch } = useLookup();
	const t0 = !canGoBack;
	let t1;
	if ($[0] !== goBack || $[1] !== t0) {
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "whitespace-nowrap text-sm",
			onClick: goBack,
			disabled: t0,
			children: "← Back"
		});
		$[0] = goBack;
		$[1] = t0;
		$[2] = t1;
	} else t1 = $[2];
	let t2;
	if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "flex items-center gap-2 text-lg font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "icons/icon-48.png",
				alt: "",
				className: "size-6 rounded-md"
			}), "RowdySearch"]
		});
		$[3] = t2;
	} else t2 = $[3];
	let t3;
	if ($[4] !== openSearch) {
		t3 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "secondary",
			className: "whitespace-nowrap text-sm",
			onClick: () => openSearch(""),
			children: "Search"
		});
		$[4] = openSearch;
		$[5] = t3;
	} else t3 = $[5];
	let t4;
	if ($[6] !== t1 || $[7] !== t3) {
		t4 = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-2",
			children: [
				t1,
				t2,
				t3
			]
		});
		$[6] = t1;
		$[7] = t3;
		$[8] = t4;
	} else t4 = $[8];
	return t4;
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
		t1 = reviews.map(_temp$1);
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
function _temp$1(review, index) {
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
				medianLabel: "Median grade (all classes)"
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
function LookupProvider(t0) {
	const $ = (0, import_compiler_runtime.c)(22);
	const { gradeData, children } = t0;
	let t1;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t1 = [{
			type: "search",
			query: ""
		}];
		$[0] = t1;
	} else t1 = $[0];
	const [pages, setPages] = (0, import_react.useState)(t1);
	let t2;
	let t3;
	if ($[1] !== gradeData.searchIndex) {
		t2 = () => {
			const openSectionFromAddress = function openSectionFromAddress() {
				if (window.location.hash === "") return;
				const page = pageForSection(JSON.parse(decodeURIComponent(window.location.hash.slice(1))), gradeData.searchIndex);
				setPages((curr) => [...curr, page]);
				window.history.replaceState(null, "", window.location.pathname);
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
	if ($[7] !== pages) {
		t7 = pages.at(-1);
		$[7] = pages;
		$[8] = t7;
	} else t7 = $[8];
	const t8 = pages.length > 1;
	let t10;
	let t11;
	let t12;
	let t13;
	let t9;
	if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
		t9 = (query) => replaceCurrentPage({
			type: "search",
			query
		});
		t10 = (query_0) => openPage({
			type: "search",
			query: query_0
		});
		t11 = (professorName) => openPage({
			type: "professor",
			professorName
		});
		t12 = (professorName_0, courseCode) => openPage({
			type: "class",
			professorName: professorName_0,
			courseCode
		});
		t13 = (courseCode_0) => openPage({
			type: "course",
			courseCode: courseCode_0
		});
		$[9] = t10;
		$[10] = t11;
		$[11] = t12;
		$[12] = t13;
		$[13] = t9;
	} else {
		t10 = $[9];
		t11 = $[10];
		t12 = $[11];
		t13 = $[12];
		t9 = $[13];
	}
	let t14;
	if ($[14] !== gradeData.professors || $[15] !== gradeData.searchIndex || $[16] !== t7 || $[17] !== t8) {
		t14 = {
			page: t7,
			canGoBack: t8,
			professors: gradeData.professors,
			searchIndex: gradeData.searchIndex,
			goBack,
			openPage,
			updateSearch: t9,
			openSearch: t10,
			openProfessor: t11,
			openClass: t12,
			openCourse: t13
		};
		$[14] = gradeData.professors;
		$[15] = gradeData.searchIndex;
		$[16] = t7;
		$[17] = t8;
		$[18] = t14;
	} else t14 = $[18];
	let t15;
	if ($[19] !== children || $[20] !== t14) {
		t15 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LookupContext, {
			value: t14,
			children
		});
		$[19] = children;
		$[20] = t14;
		$[21] = t15;
	} else t15 = $[21];
	return t15;
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
	const $ = (0, import_compiler_runtime.c)(5);
	const gradeData = useGradeData();
	if (gradeData === null) {
		let t0;
		if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
			t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "py-12 text-center text-zinc-500",
				children: "Loading professors..."
			});
			$[0] = t0;
		} else t0 = $[0];
		return t0;
	}
	let t0;
	let t1;
	if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
		t0 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {});
		t1 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentPage, {});
		$[1] = t0;
		$[2] = t1;
	} else {
		t0 = $[1];
		t1 = $[2];
	}
	let t2;
	if ($[3] !== gradeData) {
		t2 = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-4 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LookupProvider, {
				gradeData,
				children: [t0, t1]
			})
		});
		$[3] = gradeData;
		$[4] = t2;
	} else t2 = $[4];
	return t2;
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
