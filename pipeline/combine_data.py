import base64
import json
import re
import time
from collections import Counter, defaultdict
from pathlib import Path

from course_titles import full_titles
from data_collectors.common_format import RAW_DIR, term_key
from departments import SHARED_UNITS, is_department, written_out
from professor_names import display_name, match_key
from same_names import write_report

DATA_DIR = Path(__file__).resolve().parent / "data"
# Names confirmed to be two different professors, written down by hand. See same_names.py.
SPLITS_FILE = DATA_DIR / "professor_splits.json"
REPORT_FILE = DATA_DIR / "same_name_report.md"

RENUMBERED = {"CS 1714": "CS 2713"}


def load(file_name):
    with open(RAW_DIR / file_name, encoding="utf-8") as file:
        return json.load(file)


def load_splits():
    if not SPLITS_FILE.exists():
        return {}
    with open(SPLITS_FILE, encoding="utf-8") as file:
        return json.load(file)


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


# Simple Syllabus lists a cross-listed class's titles together: "Introduction to African American
# Studies ; Approaches to American Culture" for AAS/AMS 2013/2043. Each course gets its own title
# from the list. When the list doesn't line up with the courses, each one keeps the whole list.
def split_cross_listed_title(title, course_count):
    titles = [part.strip() for part in title.split(";")]
    if len(titles) == course_count:
        return titles
    if len(set(titles)) == 1:
        return titles[:1] * course_count
    return [title] * course_count


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


# The course's name in the newest semester it was taught. Courses get renamed: CS 2713 was
# "Computer Programming II" back when its sections were CS 1714.
def newest_title(semesters):
    newest_sections = list(semesters.values())[-1]
    return newest_sections[0]["title"]


# The department a professor is in now: the one with the most of their sections in the newest
# semester they have grades for. Departments get renamed and moved between colleges, so older
# semesters can say something else. None when they have no graded sections in any department.
def main_department(sections):
    for is_wanted in (
        lambda department: is_department(department) and department not in SHARED_UNITS,
        lambda department: department in SHARED_UNITS,
    ):
        taught = [(term, department) for term, department in sections if is_wanted(department)]
        if not taught:
            continue
        newest_term = max((term for term, _ in taught), key=term_key)
        counts = Counter(department for term, department in taught if term == newest_term)
        # The most sections, and the first in the alphabet when two tie, so it's the same every run.
        department = min(counts, key=lambda each: (-counts[each], each))
        return written_out(department)
    return None


# Who a split name's sections belong to: {department: the person's name}.
def people_by_department(name, people):
    by_department = {}
    for person, departments in people.items():
        for department in departments:
            if department in by_department:
                raise ValueError(
                    f"{SPLITS_FILE.name}: {department} is listed under two people for {name}."
                )
            by_department[department] = person
    return by_department


class Combiner:
    def __init__(self, splits=None):
        self.professors = {}  # display name -> {"courses": {...}, "rmp": [...]}
        self.names = {}  # match key -> [display names]
        self.sections = {}  # (course, term, section) -> section dict
        self.owners = {}  # (course, term, section) -> display name
        self.splits = splits or {}  # display name -> {person's name: [their departments]}
        self.departments = defaultdict(list)  # display name -> [(term, department)] of graded sections
        # course -> {title: how many sections had it, by source}, for choosing each title's full version
        self.titles = defaultdict(lambda: defaultdict(Counter))

    def add_professor(self, name, display=None):
        display = display or display_name(name)
        if display not in self.professors:
            self.professors[display] = {"courses": {}, "rmp": []}
            self.names.setdefault(match_key(name), []).append(display)
        return display

    # Several professors can share a first and last name (a name that was split, or "Carlos
    # Rodriguez" and "Carlos Montoya Rodriguez"). Take the one who teaches this course, then the
    # one who teaches in its subject, then the first.
    def find_professor(self, name, course=None):
        matches = self.names.get(match_key(name))
        if not matches:
            return self.add_professor(name)
        if len(matches) == 1 or course is None:
            return matches[0]

        subject = course.split()[0]
        teaches_course = [m for m in matches if course in self.professors[m]["courses"]]
        teaches_subject = [
            m for m in matches
            if any(taught.split()[0] == subject for taught in self.professors[m]["courses"])
        ]
        return (teaches_course or teaches_subject or matches)[0]

    def add_section(self, professor, course, title, term, section):
        key = (course, term, section)
        if key not in self.sections:
            courses = self.professors[professor]["courses"]
            semesters = courses.setdefault(course, {"semesters": {}})["semesters"]
            entry = {
                "section": section,
                "title": title,  # Topics courses (like ARC 3433) have a different one per section.
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
        unknown = set(self.splits) - {display_name(name) for name in grades}
        if unknown:
            raise ValueError(f"{SPLITS_FILE.name}: nobody in the grade data is named {sorted(unknown)}.")

        for name, info in grades.items():
            display = display_name(name)
            # A name that's two people: each section goes to whoever its department belongs to.
            people = self.splits.get(display)
            by_department = people_by_department(display, people) if people else None
            if by_department is None:
                self.add_professor(name)

            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    professor = display
                    if by_department is not None:
                        if s["department"] not in by_department:
                            raise ValueError(
                                f"{SPLITS_FILE.name}: {display} has a section in {s['department']}, "
                                "which isn't listed under either person."
                            )
                        professor = self.add_professor(name, by_department[s["department"]])

                    entry = self.add_section(
                        professor,
                        course_id(raw_course),
                        course["title"],
                        s["term"],
                        s["section"],
                    )
                    entry["grades"] = s["grades"]
                    self.departments[professor].append((s["term"], s["department"]))
                    self.titles[course_id(raw_course)][course["title"]]["grades"] += 1

    def add_bluebook(self, bluebook):
        for name, info in bluebook.items():
            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    course_code = course_id(raw_course)
                    key = (course_code, s["term"], s["section"])
                    if key in self.sections:
                        entry = self.sections[key]
                    else:
                        professor = self.find_professor(name, course_code)
                        entry = self.add_section(
                            professor,
                            course_code,
                            course["title"],
                            s["term"],
                            s["section"],
                        )
                    entry["instructorEvaluation"] = s["instructorEvaluation"]
                    entry["courseEvaluation"] = s["courseEvaluation"]
                    self.titles[course_code][course["title"]]["bluebook"] += 1

    def add_syllabi(self, syllabi, graded_terms):
        for info in syllabi.values():
            rows = []
            for raw_course, course in info["courses"].items():
                for s in course["sections"]:
                    cross_listed = split_cross_listed(raw_course, s["section"])
                    titles = split_cross_listed_title(course["title"], len(cross_listed))
                    for (one_course, one_section), title in zip(cross_listed, titles):
                        key = (course_id(one_course), s["term"], one_section)
                        rows.append((key, title, s["syllabusCode"]))

            known = Counter(
                self.owners[key] for key, _, _ in rows if key in self.owners
            )
            professor = known.most_common(1)[0][0] if known else None

            for key, title, code in rows:
                self.titles[key[0]][title]["syllabus"] += 1
                if key in self.sections:
                    entry = self.sections[key]
                elif key[1] in graded_terms:
                    continue
                else:
                    professor = professor or self.find_professor(info["name"], key[0])
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

    # Every section's title becomes its full version: "Quantitative Analysis for Acc" becomes
    # "Quantitative Analysis for Accountants". Returns how many sections changed.
    def use_full_titles(self):
        changed = 0
        full = {course: full_titles(titles) for course, titles in self.titles.items()}
        for (course, _, _), entry in self.sections.items():
            title = full[course].get(entry["title"], entry["title"])
            changed += title != entry["title"]
            entry["title"] = title
        return changed

    def sorted_output(self):
        output = {}
        for name, professor in self.professors.items():
            courses = {}
            for code, course in professor["courses"].items():
                semesters = {
                    term: sorted(course["semesters"][term], key=lambda s: s["section"])
                    for term in sorted(course["semesters"], key=term_key)
                }
                courses[code] = {
                    "courseName": newest_title(semesters),
                    "semesters": semesters,
                }
            output[name] = {
                "department": main_department(self.departments[name]),
                "courses": courses,
                "rmp": professor["rmp"],
            }
        return output


def combine_data():
    start = time.perf_counter()

    grades = load("grade_distribution_data.json")
    bluebook = load("bluebook_data.json")
    syllabi = load("simple_syllabus_data.json")
    splits = load_splits()
    graded_terms = {
        s["term"]
        for info in grades.values()
        for c in info["courses"].values()
        for s in c["sections"]
    }

    combiner = Combiner(splits)
    combiner.add_grades(grades)
    combiner.add_bluebook(bluebook)
    combiner.add_syllabi(syllabi, graded_terms)
    combiner.add_rmp(load("rmp_data.json"))
    titles_changed = combiner.use_full_titles()
    data = combiner.sorted_output()

    with open(DATA_DIR / "professors.json", "w", encoding="utf-8") as file:
        json.dump(data, file, separators=(",", ":"), ensure_ascii=False)

    same_names = write_report(REPORT_FILE, grades, bluebook, syllabi, splits)

    sections = combiner.sections.values()
    print(f"{len(data)} professors | {len(combiner.sections)} sections")
    print(
        f"grades: {sum(s['grades'] is not None for s in sections)} | "
        f"evaluations: {sum(s['instructorEvaluation'] is not None for s in sections)} | "
        f"syllabi: {sum(s['syllabusCode'] is not None for s in sections)} | "
        f"RMP: {sum(bool(p['rmp']) for p in data.values())} professors"
    )
    print(
        f"departments: {sum(p['department'] is not None for p in data.values())} professors | "
        f"full titles: {titles_changed} sections | "
        f"split names: {len(splits)}"
    )
    print(f"{len(same_names)} names may be two professors: see {REPORT_FILE.relative_to(DATA_DIR.parent)}")
    print(f"Took {time.perf_counter() - start:.1f}s")


if __name__ == "__main__":
    combine_data()
