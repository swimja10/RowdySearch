"""Checks the numbers on the built website against data/professors.json.

    cd site && npm run build
    python3 tests/site_accuracy.py            # 300 random pages of each kind
    python3 tests/site_accuracy.py --all      # every page

The website works its numbers out with the extension's TypeScript. This works them out again from
the file itself, with exact fractions and none of that code, then reads each built page's summary
sentence and compares. A wrong median, a miscounted section, or a page that's missing fails it.
It needs nothing installed.
"""

import argparse
import html
import json
import random
import re
import sys
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "professors.json"
SLUGS_FILE = ROOT / "site" / "slugs.json"
BUILT_SITE = ROOT / "site" / "dist"

LETTER_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"]


def add_grades(sections):
    total = {}
    for section in sections:
        for grade, students in (section["grades"] or {}).items():
            total[grade] = total.get(grade, 0) + students
    return total


def median_grade(grades):
    """The letter grade the middle student got, or None when nobody has a letter grade."""
    letters = sum(grades.get(grade, 0) for grade in LETTER_GRADES)
    if letters == 0:
        return None
    middle = -(-letters // 2)  # half, rounded up
    counted = 0
    for grade in LETTER_GRADES:
        counted += grades.get(grade, 0)
        if counted >= middle:
            return grade


def finished_or_withdrew(grades):
    return sum(grades.get(grade, 0) for grade in LETTER_GRADES + ["W"])


def round_half_up(value):
    return int(value + Fraction(1, 2))


def count(number, noun):
    return f"{number:,} {noun if number == 1 else noun + 's'}"


def sections_of(course):
    return [section for sections in course["semesters"].values() for section in sections]


def graded(sections):
    return [section for section in sections if section["grades"]]


def description_of(page):
    """The page's summary sentence, which is also its description for search engines."""
    if not page.exists():
        return None
    match = re.search(r'<meta name="description" content="([^"]*)"', page.read_text(encoding="utf-8"))
    return html.unescape(match.group(1)) if match else None


def course_slug(code):
    return code.lower().replace(" ", "-")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--sample", type=int, default=300, help="pages of each kind to check (default 300)")
    parser.add_argument("--all", action="store_true", help="check every page")
    parser.add_argument("--seed", type=int, default=None, help="repeat an earlier run's random sample")
    args = parser.parse_args()

    if not BUILT_SITE.exists():
        sys.exit(f"{BUILT_SITE} isn't there. Build the site first: cd site && npm run build")

    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    slugs = json.loads(SLUGS_FILE.read_text(encoding="utf-8"))
    seed = args.seed if args.seed is not None else random.randrange(1_000_000)
    random.seed(seed)

    def sample(items):
        return items if args.all or len(items) <= args.sample else random.sample(items, args.sample)

    # Everyone's sections of each course, for the course pages and the "all professors" medians.
    by_course = {}
    for name, professor in data.items():
        for code, course in professor["courses"].items():
            by_course.setdefault(code, {})[name] = sections_of(course)

    problems = []
    checked = 0

    def check(page, expected):
        nonlocal checked
        checked += 1
        found = description_of(page)
        if found is None:
            problems.append(f"{page.relative_to(BUILT_SITE)}: the page is missing")
        elif expected not in found:
            problems.append(f"{page.relative_to(BUILT_SITE)}\n    expected: {expected}\n    found:    {found}")

    # Professor pages.
    for name in sample(sorted(data)):
        sections = [section for course in data[name]["courses"].values() for section in sections_of(course)]
        grades = add_grades(sections)
        median = median_grade(grades)
        taught = f"{name} has taught {count(len(data[name]['courses']), 'course')} at UTSA."
        if median is None:
            expected = f"{taught} No grades have been released yet."
        else:
            expected = (
                f"{taught} Across {count(len(graded(sections)), 'section')} and "
                f"{count(finished_or_withdrew(grades), 'grade')}, the median grade was {median}."
            )
        check(BUILT_SITE / "professors" / slugs[name] / "index.html", expected)

    # Class pages: one professor's course.
    classes = [(name, code) for name, professor in data.items() for code in professor["courses"]]
    for name, code in sample(sorted(classes)):
        sections = by_course[code][name]
        median = median_grade(add_grades(sections))
        if median is None:
            expected = "No grades have been released yet."
        else:
            expected = f"Across {count(len(graded(sections)), 'section')} of {code}, {name}'s median grade was {median}."
            everyone = by_course[code]
            if len(everyone) == 1:
                expected += " No one else has taught it."
            else:
                all_sections = [section for theirs in everyone.values() for section in theirs]
                expected += f" The median for all {len(everyone)} professors was {median_grade(add_grades(all_sections))}."
        check(BUILT_SITE / "professors" / slugs[name] / course_slug(code) / "index.html", expected)

    # Course pages.
    for code in sample(sorted(by_course)):
        everyone = by_course[code]
        sections = [section for theirs in everyone.values() for section in theirs]
        grades = add_grades(sections)
        median = median_grade(grades)
        professors = count(len(everyone), "professor")
        if median is None:
            expected = "No grades have been released yet."
        else:
            withdrew = round_half_up(Fraction(grades.get("W", 0) * 100, finished_or_withdrew(grades)))
            expected = (
                f"Across {count(len(graded(sections)), 'section')}, the median grade was {median} "
                f"and {withdrew}% of students withdrew."
            )
        check(BUILT_SITE / "courses" / course_slug(code) / "index.html", expected)
        found = description_of(BUILT_SITE / "courses" / course_slug(code) / "index.html") or ""
        if professors not in found:
            problems.append(f"courses/{course_slug(code)}: expected it to say {professors}\n    found:    {found}")

    for problem in problems[:25]:
        print(problem)
    if len(problems) > 25:
        print(f"... and {len(problems) - 25} more")
    print(f"\n{checked:,} pages checked, {len(problems):,} wrong. (seed {seed})")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
