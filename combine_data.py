"""Combines grade_data.json, professors.json and RMP.json into cleaned_grade_data.json."""

import json
import re
import unicodedata
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
GRADES = [
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
    "F",
    "W",
    "IN",
    "IW",
    "IF",
]
NOT_A_CLASS = {"Department", "RMP"}
SEASONS = ["Spring", "Summer", "Fall"]
# Renumbered courses are found automatically: same subject and same title, where
# one number stops and the other starts within a year. List a pair here only when
# the title changed too, which the automatic rule cannot see.
RETITLED = {"CS 1714": "CS 2713"}
CLASS_KEY = re.compile(r"(?P<course>.+?) - (?P<title>.+) \((?P<semester>\w+ \d{4})\)")
NO_RATING = {
    "Professor rating": None,
    "Difficulty level": None,
    "Number of ratings": None,
    "Would take again %": None,
    "Link": None,
    "5 reviews": {f"Review {number}": None for number in range(1, 6)},
}


def main():
    grades = load("grade_data.json")
    syllabi = load("professors.json")
    ratings = load("RMP.json")
    renumbered = renumbered_courses(grades, syllabi)
    for old, new in sorted(renumbered.items()):
        print(f"{old} -> {new}")
    grades = renumber(grades, renumbered)
    syllabi = renumber(syllabi, renumbered)
    save(combine(grades, syllabi, ratings), "cleaned_grade_data.json")


def load(file_name):
    with open(DATA_DIR / file_name, encoding="utf-8") as file:
        return json.load(file)


def save(professors, file_name):
    with open(DATA_DIR / file_name, "w", encoding="utf-8") as file:
        json.dump(professors, file, indent=2, ensure_ascii=False)


def renumbered_courses(grades, syllabi):
    terms, same_title = {}, {}
    for entry in [*grades.values(), *syllabi.values()]:
        for class_key, _ in classes_of(entry):
            match = CLASS_KEY.fullmatch(class_key)
            courses = split_courses(match["course"])
            for course in courses:
                terms.setdefault(course, set()).add(term_number(match["semester"]))
            if len(courses) == 1:
                subject = courses[0].rsplit(" ", 1)[0]
                title = re.sub(
                    r"[^a-z0-9]", "", match["title"].lower().replace("&", "and")
                )
                same_title.setdefault((subject, title), set()).add(courses[0])

    renumbered = {}
    for courses in same_title.values():
        in_order = sorted(courses, key=lambda course: min(terms[course]))
        handovers = list(zip(in_order, in_order[1:]))
        if handovers and all(
            is_handover(terms[old], terms[new], old, new) for old, new in handovers
        ):
            renumbered.update({old: in_order[-1] for old in in_order[:-1]})
    return {**renumbered, **RETITLED}


def is_handover(old_terms, new_terms, old, new):
    gap = min(new_terms) - max(old_terms)
    return 0 < gap <= len(SEASONS) and is_graduate(old) == is_graduate(new)


def is_graduate(course):
    return course.rsplit(" ", 1)[1] >= "5"


def term_number(semester):
    season, year = semester.split()
    return int(year) * len(SEASONS) + SEASONS.index(season)


def split_courses(course):
    subjects, numbers = course.rsplit(" ", 1)
    return [
        f"{subject} {number}"
        for subject, number in zip(subjects.split("/"), numbers.split("/"))
    ]


def renumber(professors, renumbered):
    return {
        name: renumber_classes(name, entry, renumbered)
        for name, entry in professors.items()
    }


def renumber_classes(name, entry, renumbered):
    result = {}
    for key, value in entry.items():
        new_key = key if key in NOT_A_CLASS else current_class_key(key, renumbered)
        if new_key in result or (new_key != key and new_key in entry):
            raise ValueError(f"{name}: {key!r} collides with {new_key!r}")
        result[new_key] = value
    return result


def current_class_key(class_key, renumbered):
    course = course_of(class_key)
    current = [renumbered.get(old, old).rsplit(" ", 1) for old in split_courses(course)]
    subjects = "/".join(subject for subject, _ in current)
    numbers = "/".join(number for _, number in current)
    return f"{subjects} {numbers}{class_key[len(course) :]}"


def combine(grades, syllabi, ratings):
    professors = {name: graded_professor(entry) for name, entry in grades.items()}
    known_names = {name: [name] for name in grades}
    instructors = instructors_by_section(grades)

    for syllabus_name, entry in syllabi.items():
        name = registrar_name(syllabus_name, entry, grades, syllabi, instructors)
        known_names.setdefault(name, []).append(syllabus_name)
        professor = professors.setdefault(name, {"Department": entry["Department"]})
        for class_key, syllabus_class in classes_of(entry):
            add_syllabus_class(professor, class_key, syllabus_class)

    spare_ratings = index_spare_ratings(ratings, known_names)
    for name, professor in professors.items():
        professor["RMP"] = best_rating(known_names[name], ratings, spare_ratings)
    return dict(sorted(professors.items()))


def graded_professor(entry):
    professor = {"Department": entry["Department"]}
    for class_key, graded_class in classes_of(entry):
        professor[class_key] = {
            "Semester": graded_class["Semester"],
            "Sections": list(graded_class["Sections"]),
            "Syllabus": {},
            **{grade: graded_class[grade] for grade in GRADES},
        }
    return professor


def classes_of(entry):
    return [(key, value) for key, value in entry.items() if key not in NOT_A_CLASS]


def instructors_by_section(grades):
    instructors = {}
    for name, entry in grades.items():
        for class_key, graded_class in classes_of(entry):
            for section in graded_class["Sections"]:
                offering = (graded_class["Semester"], course_of(class_key), section)
                instructors[offering] = name
    return instructors


def course_of(class_key):
    return CLASS_KEY.fullmatch(class_key)["course"]


def registrar_name(syllabus_name, entry, grades, syllabi, instructors):
    if syllabus_name in grades:
        return syllabus_name
    for offering in offerings_of(entry):
        instructor = instructors.get(offering)
        if (
            instructor
            and instructor not in syllabi
            and share_a_name(instructor, syllabus_name)
        ):
            return instructor
    return syllabus_name


def offerings_of(entry):
    return [
        offering
        for class_key, syllabus_class in classes_of(entry)
        for combined_section in syllabus_class["Syllabus"]
        for offering in split_cross_listing(class_key, combined_section)
    ]


def split_cross_listing(class_key, combined_section):
    match = CLASS_KEY.fullmatch(class_key)
    subjects, numbers = match["course"].rsplit(" ", 1)
    return [
        (match["semester"], f"{subject} {number}", section)
        for subject, number, section in zip(
            subjects.split("/"), numbers.split("/"), combined_section.split("/")
        )
    ]


def share_a_name(first_name, second_name):
    return bool(set(name_words(first_name)) & set(name_words(second_name)))


def name_words(name):
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z ]", "", ascii_name.lower().replace("-", " ")).split()


def add_syllabus_class(professor, class_key, syllabus_class):
    for combined_section, link in syllabus_class["Syllabus"].items():
        offerings = split_cross_listing(class_key, combined_section)
        graded = [
            (find_class(professor, offering), offering[2]) for offering in offerings
        ]
        graded = [(found, section) for found, section in graded if found]
        for graded_class, section in graded:
            graded_class["Syllabus"][section] = link
        if not graded:
            add_unmatched_section(professor, class_key, combined_section, link)


def find_class(professor, offering):
    semester, course, section = offering
    for class_key, candidate in classes_of(professor):
        if (
            is_graded(candidate)
            and candidate["Semester"] == semester
            and course_of(class_key) == course
            and section in candidate["Sections"]
        ):
            return candidate
    return None


def is_graded(class_entry):
    return class_entry["A"] is not None


def add_unmatched_section(professor, class_key, section, link):
    semester = CLASS_KEY.fullmatch(class_key)["semester"]
    class_entry = professor.setdefault(
        class_key,
        {
            "Semester": semester,
            "Sections": [],
            "Syllabus": {},
            **{grade: None for grade in GRADES},
        },
    )
    if not is_graded(class_entry) and section not in class_entry["Sections"]:
        class_entry["Sections"].append(section)
    class_entry["Syllabus"][section] = link


def index_spare_ratings(ratings, known_names):
    taken_names = {name for names in known_names.values() for name in names}
    spare_ratings = {}
    for name, entry in ratings.items():
        if name not in taken_names:
            spare_ratings.setdefault(name_key(name), []).append(entry["RMP"])
    return spare_ratings


def name_key(name):
    words = name_words(re.sub(r"\[RMP \d+\]", "", name))
    return (words[0], words[-1]) if words else ()


def best_rating(names, ratings, spare_ratings):
    matches = [ratings[name]["RMP"] for name in names if name in ratings]
    if not matches:
        matches = [
            rating for name in names for rating in spare_ratings.get(name_key(name), [])
        ]
    return max(
        matches, key=lambda rating: rating["Number of ratings"], default=NO_RATING
    )


if __name__ == "__main__":
    main()
