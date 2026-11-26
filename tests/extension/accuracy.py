"""Accuracy test: every number RowdySearch shows must be right, and the same everywhere.

Two parts:

1. The data pipeline. data/professors.json must hold exactly what the scrapers collected in
   data/raw_data/: every graded section with the same grade counts, and every Bluebook result with
   the same scores.

2. The screen. For a sample of professors, it opens their professor page, one of their class pages,
   that course's page, and Analytical Mode from the class page, in the real built sidebar (like
   tests/extension/chaos.py, so `npm run build` first). It reads every number shown and checks it against an
   answer worked out here, separately from the app's code, with exact fractions instead of
   floating point, so rounding mistakes can't hide. Because Analytical Mode's table is checked
   against the same answers as the pages, a number that differs between the two modes fails too.

    .venv/bin/python tests/extension/accuracy.py               the pipeline, then 40 professors
    .venv/bin/python tests/extension/accuracy.py --sample 200  more professors
"""

import argparse
import json
import math
import random
import sys
from collections import Counter
from fractions import Fraction
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chaos  # noqa: E402  (its server and its way of looking at the sidebar)

ROOT = Path(__file__).resolve().parents[2]
LETTERS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]
POINTS = {"A+": 4, "A": 4, "A-": Fraction("3.67"), "B+": Fraction("3.33"), "B": 3, "B-": Fraction("2.67"),
          "C+": Fraction("2.33"), "C": 2, "C-": Fraction("1.67"), "D+": Fraction("1.33"), "D": 1, "D-": Fraction("0.67"), "F": 0}
GROUPS = {"A": ["A+", "A", "A-"], "B": ["B+", "B", "B-"], "C": ["C+", "C", "C-"], "D": ["D+", "D", "D-"], "F": ["F"], "W": ["W"]}
SEASONS = {"Spring": 1, "Summer": 2, "Fall": 3}
# Professors worth checking every time: ones from bug reports, two RMP profiles, RMP with no ratings.
ALWAYS = ["Taha Malik", "Henry Esparza", "Carlos Bassetto", "Tina Vega", "Xiaohong Xu", "Kai Xu", "Madelyn Duffey"]

# ---------------------------------------------------------------- the right answers, worked out here


def is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def exact(value):
    """The decimal as written in the JSON, exactly (4.85 is 485/100, not 4.8499999...)."""
    return Fraction(str(value))


def half_up(value, decimals):
    scale = Fraction(10) ** decimals
    rounded = math.floor(abs(value) * scale + Fraction(1, 2))
    return (rounded if value >= 0 else -rounded) / scale


def out_of_five(value):
    return "No ratings" if value is None else f"{float(half_up(value, 1)):.1f} / 5"


def percent(value, missing="No ratings"):
    return missing if value is None else f"{int(half_up(value, 0))}%"


def gpa_text(value):
    return "—" if value is None else f"{float(half_up(value, 2)):.2f}"


def mean(values):
    return sum(values, Fraction(0)) / len(values) if values else None


def median(values):
    if not values:
        return None
    ordered = sorted(values)
    middle = len(ordered) // 2
    return ordered[middle] if len(ordered) % 2 else (ordered[middle - 1] + ordered[middle]) / 2


def semester_rank(semester):
    season, year = semester.split()
    return int(year) * 10 + SEASONS[season]


class Answers:
    """What every page should show, from data/professors.json alone."""

    def __init__(self, data):
        self.data = data
        self.teachers = {}  # course code -> professor names
        for name, professor in data.items():
            for code in professor["courses"]:
                self.teachers.setdefault(code, []).append(name)

    def sections(self, name, code=None):
        courses = self.data[name]["courses"]
        return [section for course_code, course in courses.items() if code in (None, course_code)
                for sections in course["semesters"].values() for section in sections]

    @staticmethod
    def counts(sections):
        counts = Counter()
        for section in sections:
            for grade, count in (section["grades"] or {}).items():
                if is_number(count):
                    counts[grade] += count
        return counts

    @staticmethod
    def median_grade(counts):
        students = sum(counts[grade] for grade in LETTERS)
        if students == 0:
            return None
        middle, so_far = math.ceil(students / 2), 0
        for grade in LETTERS:
            so_far += counts[grade]
            if so_far >= middle:
                return grade

    @staticmethod
    def graded_or_withdrew(counts):
        return sum(counts[grade] for grade in LETTERS + ["W"])

    def share(self, counts, grades):
        total = self.graded_or_withdrew(counts)
        return None if total == 0 else Fraction(sum(counts[grade] for grade in grades) * 100, total)

    @staticmethod
    def gpa(counts):
        students = sum(counts[grade] for grade in LETTERS)
        return None if students == 0 else sum(counts[grade] * POINTS[grade] for grade in LETTERS) / students

    @staticmethod
    def evaluations(sections):
        return [(exact(s["instructorEvaluation"]), exact(s["courseEvaluation"])) for s in sections
                if is_number(s["instructorEvaluation"]) and is_number(s["courseEvaluation"])]

    def rmp(self, name):
        """A professor's RMP numbers: the average of their profiles, leaving out ones with no number."""
        profiles = self.data[name]["rmp"] or []
        read = lambda field: mean([exact(p[field]) for p in profiles if is_number(p[field])])
        return {"on": bool(profiles), "rating": read("avgRating"), "difficulty": read("avgDifficulty"),
                "again": read("wouldTakeAgainPercent")}

    def bars(self, counts):
        total = self.graded_or_withdrew(counts)
        if total == 0:
            return None
        return {group: percent(Fraction(sum(counts[g] for g in grades) * 100, total)) for group, grades in GROUPS.items()}

    def latest_syllabus(self, names, code):
        """The newest semester with a syllabus, and who had one that semester."""
        best, who = None, set()
        for name in names:
            for semester, sections in self.data[name]["courses"][code]["semesters"].items():
                if any(s["syllabusCode"] for s in sections):
                    if best is None or semester_rank(semester) > semester_rank(best):
                        best, who = semester, {name}
                    elif semester == best:
                        who.add(name)
        return best, who

    # Each page: {what it's called on screen: what it should say}.

    def professor_page(self, name):
        counts = self.counts(self.sections(name))
        evaluations = self.evaluations(self.sections(name))
        rmp = self.rmp(name)
        expected = {"Median Grade (All Classes)": self.median_grade(counts) or "No grades yet"}
        expected.update(self.bluebook_average(evaluations))
        expected.update(self.rmp_stats(rmp))
        expected.update(self.bar_stats(counts))
        return expected

    def class_page(self, name, code):
        sections = self.sections(name, code)
        counts = self.counts(sections)
        expected = {f"Median Grade in {code}": self.median_grade(counts) or "No grades yet"}
        expected.update(self.bluebook_average(self.evaluations(sections)))
        expected.update(self.rmp_stats(self.rmp(name)))
        expected.update(self.bar_stats(counts))
        semester, _ = self.latest_syllabus([name], code)
        expected["latest syllabus"] = semester or "No syllabus on Simple Syllabus"
        return expected

    def course_page(self, code):
        names = self.teachers[code]
        sections = [s for name in names for s in self.sections(name, code)]
        counts = self.counts(sections)
        evaluations = self.evaluations(sections)
        expected = {"Median Grade (Every Professor)": self.median_grade(counts) or "No grades yet",
                    "professor count": f"{len(names)} {'professor has' if len(names) == 1 else 'professors have'} taught this class"}
        if evaluations:
            expected.update({"Bluebook detail": f"Median of {len(evaluations):,} section{'s' * (len(evaluations) != 1)}",
                             "Instructor": out_of_five(median([e[0] for e in evaluations])),
                             "Course": out_of_five(median([e[1] for e in evaluations]))})
        else:
            expected["note: No Bluebook evaluations yet"] = True
        on_rmp = [self.rmp(name) for name in names if self.rmp(name)["on"]]
        if on_rmp:
            pick = lambda field: median([r[field] for r in on_rmp if r[field] is not None])
            expected.update({"RMP detail": f"Median of {len(on_rmp):,} professor{'s' * (len(on_rmp) != 1)}",
                             "Rating": out_of_five(pick("rating")), "Difficulty": out_of_five(pick("difficulty")),
                             "Would take again": percent(pick("again"))})
        else:
            expected["note: None of its professors are on Rate My Professors"] = True
        expected.update(self.bar_stats(counts))
        semester, who = self.latest_syllabus(names, code)
        expected["latest syllabus"] = semester or "No syllabus on Simple Syllabus"
        expected["latest syllabus by one of"] = who
        return expected

    def bluebook_average(self, evaluations):
        if not evaluations:
            return {"note: No Bluebook evaluations yet": True}
        return {"Bluebook detail": f"UTSA course evaluations · {len(evaluations):,} section{'s' * (len(evaluations) != 1)}",
                "Instructor": out_of_five(mean([e[0] for e in evaluations])),
                "Course": out_of_five(mean([e[1] for e in evaluations]))}

    @staticmethod
    def rmp_stats(rmp):
        if not rmp["on"]:
            return {"note: Not found on Rate My Professors": True}
        return {"Rating": out_of_five(rmp["rating"]), "Difficulty": out_of_five(rmp["difficulty"]),
                "Would take again": percent(rmp["again"])}

    def bar_stats(self, counts):
        bars = self.bars(counts)
        if bars is None:
            return {"note: No grades have been released yet.": True}
        return {**{f"bar {group}": text for group, text in bars.items()},
                "based on": f"Based on {self.graded_or_withdrew(counts):,} grades"}

    def table_row(self, counts, bluebook, rating, course_gpa=None):
        """One row of Analytical Mode's table."""
        gpa = self.gpa(counts)
        if gpa is None or course_gpa is None:
            versus = "—"
        else:
            difference = int(half_up((gpa - course_gpa) / course_gpa * 100, 0))
            versus = "Same as average" if difference == 0 else (f"▲ {difference}% higher" if difference > 0 else f"▼ {-difference}% lower")
        return [self.median_grade(counts) or "—", gpa_text(gpa), versus,
                percent(self.share(counts, GROUPS["A"]), "—"), percent(self.share(counts, ["D+", "D", "D-", "F"]), "—"),
                percent(self.share(counts, ["W"]), "—"), f"{self.graded_or_withdrew(counts):,}",
                out_of_five(bluebook[0]), out_of_five(bluebook[1]), "—" if rating is None else out_of_five(rating)]

    def analytics_rows(self, name, code):
        """Analytical Mode opened from a class page: the class, the whole course, and the professor."""
        class_sections = self.sections(name, code)
        course_sections = [s for teacher in self.teachers[code] for s in self.sections(teacher, code)]
        course_counts = self.counts(course_sections)
        average = lambda evaluations: (mean([e[0] for e in evaluations]), mean([e[1] for e in evaluations]))
        middle = lambda evaluations: (median([e[0] for e in evaluations]), median([e[1] for e in evaluations]))
        on_rmp = [self.rmp(t) for t in self.teachers[code] if self.rmp(t)["on"]]
        course_rating = median([r["rating"] for r in on_rmp if r["rating"] is not None])
        return {
            f"{name} · {code}": self.table_row(self.counts(class_sections), average(self.evaluations(class_sections)),
                                               self.rmp(name)["rating"], self.gpa(course_counts)),
            f"{code} (Every Professor)": self.table_row(course_counts, middle(self.evaluations(course_sections)), course_rating),
            f"{name} (All Classes)": self.table_row(self.counts(self.sections(name)), average(self.evaluations(self.sections(name))),
                                                    self.rmp(name)["rating"]),
        }

    def chart_hover(self, counts):
        """The Grade distribution chart's hover text for one series, F to A+."""
        return [percent(self.share(counts, [grade]), "—") for grade in reversed(LETTERS)]

# ---------------------------------------------------------------- part 1: the pipeline


def check_pipeline(data, problems):
    raw = ROOT / "data/raw_data"
    renumbered = {"CS 1714": "CS 2713"}  # combine_data.py's RENUMBERED

    def rows(file):
        for name, info in json.loads((raw / file).read_text(encoding="utf-8")).items():
            for course, details in info["courses"].items():
                for section in details["sections"]:
                    yield name, renumbered.get(course, course), section

    combined = {}
    for professor in data.values():
        for code, course in professor["courses"].items():
            for term, sections in course["semesters"].items():
                for section in sections:
                    key = (code, term, section["section"])
                    if key in combined:
                        problems.append(f"pipeline: {key} appears twice in professors.json")
                    combined[key] = section

    grades = list(rows("grade_distribution_data.json"))
    for _, code, section in grades:
        kept = combined.get((code, section["term"], section["section"]))
        if kept is None or kept["grades"] != section["grades"]:
            problems.append(f"pipeline: grades for {code} {section['term']} {section['section']} didn't carry over")
    raw_students = sum(sum(s["grades"].values()) for _, _, s in grades if s["grades"])
    kept_students = sum(sum(s["grades"].values()) for s in combined.values() if s["grades"])
    print(f"  grades: {len(grades):,} sections and {raw_students:,} grades scraped, {kept_students:,} grades in professors.json")
    if raw_students != kept_students:
        problems.append(f"pipeline: {raw_students:,} grades scraped but {kept_students:,} in professors.json")

    bluebook = list(rows("bluebook_data.json"))
    scored = 0
    for _, code, section in bluebook:
        kept = combined.get((code, section["term"], section["section"]))
        scored += section["instructorEvaluation"] is not None
        if kept is None or (kept["instructorEvaluation"], kept["courseEvaluation"]) != (section["instructorEvaluation"], section["courseEvaluation"]):
            problems.append(f"pipeline: Bluebook for {code} {section['term']} {section['section']} didn't carry over")
    kept_scored = sum(s["instructorEvaluation"] is not None for s in combined.values())
    print(f"  Bluebook: {len(bluebook):,} sections scraped, {scored:,} with scores; {kept_scored:,} with scores in professors.json")
    if scored != kept_scored:
        problems.append(f"pipeline: {scored:,} Bluebook sections have scores but {kept_scored:,} in professors.json")

# ---------------------------------------------------------------- part 2: the screen

READ_PAGE = """() => {
  const page = { stats: {}, groups: {}, notes: [], bars: {} };
  page.title = document.querySelector('h2')?.textContent.trim() ?? '';
  page.subtitle = document.querySelector('h2')?.parentElement.querySelector('span')?.textContent.trim() ?? '';
  for (const label of document.querySelectorAll('span.text-xs.text-zinc-400')) {
    const value = label.nextElementSibling;
    if (value?.classList.contains('text-lg')) page.stats[label.textContent.trim()] = value.textContent.trim();
  }
  for (const title of document.querySelectorAll('span.font-semibold.uppercase')) {
    page.groups[title.textContent.trim()] = title.nextElementSibling?.textContent.trim() ?? '';
  }
  for (const note of document.querySelectorAll('p.text-sm.text-zinc-500')) page.notes.push(note.textContent.trim());
  const basedOn = [...document.querySelectorAll('span')].find(s => s.textContent.startsWith('Based on '));
  if (basedOn) {
    page.basedOn = basedOn.textContent.trim();
    for (const column of basedOn.parentElement.firstElementChild.children) {
      page.bars[column.lastElementChild.textContent.trim()] = column.firstElementChild.textContent.trim();
    }
  }
  const syllabus = [...document.querySelectorAll('h3')].find(h => h.textContent.trim() === 'Latest syllabus');
  page.syllabus = syllabus ? syllabus.parentElement.textContent.replace('Latest syllabus', '').trim() : null;
  return page;
}"""

READ_ANALYTICS = """() => ({
  rows: [...document.querySelectorAll('table tbody tr')].map(row => [...row.cells].map(cell => cell.textContent.trim())),
  hover: [...document.querySelectorAll('.js-plotly-plot')][0]?.data?.map(trace => ({ name: trace.name, text: trace.customdata })) ?? [],
})"""


def compare(where, expected, page, problems):
    """Checks one page's numbers. Returns how many it checked."""
    checked = 0
    for key, want in expected.items():
        if key == "latest syllabus by one of":
            continue
        if key.startswith("note: "):
            got = key[6:] in page["notes"] or any(key[6:] in text for text in page["notes"])
            shown = "shown" if got else f"missing (notes: {page['notes']})"
        elif key.startswith("bar "):
            got = page["bars"].get(key[4:]) == want
            shown = page["bars"].get(key[4:])
        elif key == "based on":
            got, shown = page.get("basedOn") == want, page.get("basedOn")
        elif key == "Bluebook detail":
            got, shown = page["groups"].get("Bluebook") == want, page["groups"].get("Bluebook")
        elif key == "RMP detail":
            got, shown = page["groups"].get("Rate My Professors") == want, page["groups"].get("Rate My Professors")
        elif key == "professor count":
            got, shown = page["subtitle"].startswith(want), page["subtitle"]
        elif key == "latest syllabus":
            shown = page["syllabus"]
            got = shown is not None and shown.startswith(want)
            who = expected.get("latest syllabus by one of")
            if got and who:
                got = any(name in shown for name in who)
        else:
            got, shown = page["stats"].get(key) == want, page["stats"].get(key)
        checked += 1
        if not got:
            problems.append(f"{where}: {key} shows {shown!r}, should be {want!r}")
    return checked


def open_from_search(s, text):
    s.click("Home")
    box = s.frame().get_by_placeholder("Professor, class, or subject")
    box.fill(text)
    box.press("Enter")


def check_professor(s, answers, name, problems, rng):
    open_from_search(s, name)
    s.wait_for(f"{name}'s page", lambda st: st["text"].lstrip().startswith("← Back") and name in st["text"] and "Median Grade" in st["text"], 10)
    page = s.frame().evaluate(READ_PAGE)
    if page["title"] != name:
        print(f"  note: searching {name!r} opened {page['title']!r}, so it's skipped")
        return 0
    checked = compare(f"{name} (professor page)", answers.professor_page(name), page, problems)

    code = rng.choice(list(answers.data[name]["courses"]))
    title = answers.data[name]["courses"][code]["courseName"]
    s.click(f"{code} · {title}")
    s.wait_for(f"{name}'s {code} page", chaos.shows(f"Median Grade in {code}"), 10)
    checked += compare(f"{name} · {code} (class page)", answers.class_page(name, code), s.frame().evaluate(READ_PAGE), problems)

    s.click("Analytical Mode")
    # A class with no letter grades (only incompletes, say) gets the table and a message, not a chart.
    chart_or_message = lambda st: s.frame().locator(".main-svg").count() > 0 or chaos.shows("None of these have grades")(st)
    s.wait_for("Analytical Mode's table and chart", lambda st: chaos.shows("Side by side")(st) and chart_or_message(st), 20)
    s.page.wait_for_timeout(300)
    shown = s.frame().evaluate(READ_ANALYTICS)
    rows = {row[0]: row[1:] for row in shown["rows"]}
    for label, want in answers.analytics_rows(name, code).items():
        checked += 1
        if rows.get(label) != want:
            problems.append(f"{label} (Analytical Mode table): shows {rows.get(label)}, should be {want}")
    hover = {trace["name"]: trace["text"] for trace in shown["hover"]}
    class_label = f"{name} · {code}"
    if class_label in hover:
        checked += 1
        want = answers.chart_hover(answers.counts(answers.sections(name, code)))
        if hover[class_label] != want:
            problems.append(f"{class_label} (Analytical Mode chart): hover shows {hover[class_label]}, should be {want}")
    s.click("✕ Close")
    # Analytical Mode leaves a moment after the sidebar is back to its width, so wait for the sidebar itself.
    s.wait_for("the sidebar again", lambda st: st["iframe"]["width"] == chaos.SIDEBAR_WIDTH and s.has_button("Home"), 10)

    s.click(code)
    s.wait_for(f"the {code} course page", chaos.shows("Median Grade (Every Professor)"), 10)
    checked += compare(f"{code} (course page)", answers.course_page(code), s.frame().evaluate(READ_PAGE), problems)
    return checked


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sample", type=int, default=40, help="random professors to check, plus a few always checked")
    parser.add_argument("--seed", type=int, default=None)
    args = parser.parse_args()

    data = json.loads((ROOT / "data/professors.json").read_text(encoding="utf-8"))
    problems = []
    print("Pipeline (data/raw_data -> data/professors.json):")
    check_pipeline(data, problems)

    answers = Answers(data)
    seed = args.seed if args.seed is not None else random.randrange(1_000_000)
    rng = random.Random(seed)
    names = ALWAYS + rng.sample(sorted(set(data) - set(ALWAYS)), args.sample)
    print(f"Screen ({len(names)} professors, seed {seed}):")
    host_url = chaos.start_server()
    checked = 0
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        s = chaos.Sidebar(browser, host_url)
        s.open_section()
        s.wait_for("the sidebar", chaos.malik_class, 20)
        for number, name in enumerate(names, 1):
            before = len(problems)
            try:
                checked += check_professor(s, answers, name, problems, rng)
            except Exception as error:
                problems.append(f"{name}: couldn't finish checking: {str(error).splitlines()[0]}")
                # Start the next professor in a fresh tab, so one problem can't spoil the rest.
                s.close()
                s = chaos.Sidebar(browser, host_url)
                s.open_section()
                s.wait_for("the sidebar", chaos.malik_class, 20)
            status = "ok" if len(problems) == before else f"{len(problems) - before} wrong"
            print(f"  {number:>3}. {name}: {status}")
        if s.saw_nan:
            problems.append("NaN appeared on screen")
        s.close()
        browser.close()

    print(f"\nChecked {checked:,} numbers on screen.")
    for problem in problems:
        print(f"  WRONG  {problem}")
    print("All correct." if not problems else f"{len(problems)} wrong.")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
