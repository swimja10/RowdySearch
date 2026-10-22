import base64
import json
import re
import time
import unicodedata
from collections import Counter
from pathlib import Path

from data_collectors.common_format import RAW_DIR, term_key

DATA_DIR = Path(__file__).resolve().parent / "data"

RENUMBERED = {"CS 1714": "CS 2713"}

TITLES = {"dr", "phd", "edd"}
NAME_SUFFIXES = {"jr", "sr", "ii", "iii", "iv"}  # Only for display not for matching.


def load(file_name):
    with open(RAW_DIR / file_name, encoding="utf-8") as file:
        return json.load(file)


def split_name(name):
    words = [
        word for word in name.split() if word.replace(".", "").lower() not in TITLES
    ]
    name = " ".join(words)
    if "," in name:
        last, first = name.split(",", 1)
    else:
        first, _, last = name.partition(" ")
    return first.strip(), last.strip()


def display_name(name):
    first, last = split_name(name)
    return f"{first} {last}"


def match_key(name):
    plain = (
        unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    )
    first, last = split_name(plain)
    surname = [
        word for word in last.split() if word.replace(".", "") not in NAME_SUFFIXES
    ]
    if not first or not surname:
        return None
    return first.split()[0], surname[-1]


def course_id(course):
    return RENUMBERED.get(course, course)


def split_cross_listed(course, section):
    subjects, numbers = course.split(" ", 1)
    subjects, numbers, sections = (
        subjects.split("/"),
        numbers.split("/"),
        section.split("/"),
    )
    if not len(subjects) == len(numbers) == len(sections):
        return [(course, section)]
    return [
        (f"{subject} {number}", sec)
        for subject, number, sec in zip(subjects, numbers, sections)
    ]


def rmp_id(base64_id):
    return int(base64.b64decode(base64_id).decode().split("-")[1])


def reviewed_numbers(profile):
    return {
        number
        for review in profile["recentReviews"]
        for number in re.findall(r"\d{4}", review["course"])
    }


def taught_numbers(professor):
    return {course.split()[-1] for course in professor["courses"]}


class Combiner:
    def __init__(self):
        self.professors = {}  # display name -> {"courses": {...}, "rmp": [...]}
        self.names = {}  # match key -> [display names]
        self.sections = {}  # (course, term, section) -> section dict
        self.owners = {}  # (course, term, section) -> display name

    def add_professor(self, name):
        display = display_name(name)
        if display not in self.professors:
            self.professors[display] = {"courses": {}, "rmp": []}
            self.names.setdefault(match_key(name), []).append(display)
        return display

    def find_professor(self, name):
        matches = self.names.get(match_key(name))
        return matches[0] if matches else self.add_professor(name)

    def add_section(self, professor, course, title, term, section):
        key = (course, term, section)
        if key not in self.sections:
            courses = self.professors[professor]["courses"]
            semesters = courses.setdefault(
                course, {"courseName": title, "semesters": {}}
            )["semesters"]
            entry = {
                "section": section,
                "syllabusCode": None,
                "grades": None,
                "instructorEvaluation": None,
                "courseEvaluation": None,
            }
            semesters.setdefault(term, []).append(entry)
            self.sections[key] = entry
            self.owners[key] = professor
        return self.sections[key]

    def add_grades(self, grades):
        for name, info in grades.items():
            professor = self.add_professor(name)
            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    entry = self.add_section(
                        professor,
                        course_id(raw_course),
                        course["title"],
                        s["term"],
                        s["section"],
                    )
                    entry["grades"] = s["grades"]

    def add_bluebook(self, bluebook):
        for name, info in bluebook.items():
            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    course_code = course_id(raw_course)
                    key = (course_code, s["term"], s["section"])
                    if key in self.sections:
                        entry = self.sections[key]
                    else:
                        professor = self.find_professor(name)
                        entry = self.add_section(
                            professor,
                            course_code,
                            course["title"],
                            s["term"],
                            s["section"],
                        )
                    entry["instructorEvaluation"] = s["instructorEvaluation"]
                    entry["courseEvaluation"] = s["courseEvaluation"]

    def add_syllabi(self, syllabi, graded_terms):
        for info in syllabi.values():
            rows = []
            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    for one_course, one_section in split_cross_listed(
                        raw_course, s["section"]
                    ):
                        key = (course_id(one_course), s["term"], one_section)
                        rows.append((key, course["title"], s["syllabusCode"]))

            known = Counter(
                self.owners[key] for key, _, _ in rows if key in self.owners
            )
            professor = known.most_common(1)[0][0] if known else None

            for key, title, code in rows:
                if key in self.sections:
                    entry = self.sections[key]
                elif key[1] in graded_terms:
                    continue
                else:
                    professor = professor or self.find_professor(info["name"])
                    entry = self.add_section(professor, key[0], title, key[1], key[2])
                if entry["syllabusCode"] is None:
                    entry["syllabusCode"] = code

    def add_rmp(self, ratings):
        for base64_id, profile in ratings.items():
            candidates = self.names.get(match_key(profile["name"]), [])
            if len(candidates) > 1:
                candidates = [
                    p
                    for p in candidates
                    if reviewed_numbers(profile) & taught_numbers(self.professors[p])
                ]
            for professor in candidates:
                self.professors[professor]["rmp"].append(
                    {
                        "rmpId": rmp_id(base64_id),
                        "department": profile["department"],
                        "avgRating": profile["avgRating"],
                        "avgDifficulty": profile["avgDifficulty"],
                        "wouldTakeAgainPercent": profile["wouldTakeAgainPercent"],
                        "recentReviews": profile["recentReviews"],
                    }
                )

        for professor in self.professors.values():
            if len(professor["rmp"]) > 1:
                taught = [
                    p
                    for p in professor["rmp"]
                    if reviewed_numbers(p) & taught_numbers(professor)
                ]
                if taught:
                    professor["rmp"] = taught

    def sorted_output(self):
        for professor in self.professors.values():
            for course in professor["courses"].values():
                semesters = course["semesters"]
                course["semesters"] = {
                    term: sorted(semesters[term], key=lambda s: s["section"])
                    for term in sorted(semesters, key=term_key)
                }
        return self.professors


def combine_data():
    start = time.perf_counter()

    grades = load("grade_distribution_data.json")
    graded_terms = {
        s["term"]
        for info in grades.values()
        for c in info["courses"].values()
        for s in c["sections"]
    }

    combiner = Combiner()
    combiner.add_grades(grades)
    combiner.add_bluebook(load("bluebook.json"))
    combiner.add_syllabi(load("simple_syllabus_data.json"), graded_terms)
    combiner.add_rmp(load("rmp_data.json"))
    data = combiner.sorted_output()

    with open(DATA_DIR / "professors.json", "w", encoding="utf-8") as file:
        json.dump(data, file, separators=(",", ":"), ensure_ascii=False)

    sections = combiner.sections.values()
    print(f"{len(data)} professors | {len(combiner.sections)} sections")
    print(
        f"grades: {sum(s['grades'] is not None for s in sections)} | "
        f"evaluations: {sum(s['instructorEvaluation'] is not None for s in sections)} | "
        f"syllabi: {sum(s['syllabusCode'] is not None for s in sections)} | "
        f"RMP: {sum(bool(p['rmp']) for p in data.values())} professors"
    )
    print(f"Took {time.perf_counter() - start:.1f}s")


if __name__ == "__main__":
    combine_data()
