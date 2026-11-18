"""Finds names that may be two different professors, and writes them to data/same_name_report.md.

The grade spreadsheets only give "Last, First", so two professors with the same name arrive as
one. Nothing here splits anyone. It lists the names worth a look, with what points that way, and
data/professor_splits.json is where a name confirmed to be two people is written down by hand.

Three things point to two people:
  1. They teach in two colleges with no subject or department in common.
  2. Bluebook has the name with two different middle names.
  3. Simple Syllabus has two instructors with the name.
None of them is proof. Most professors who teach in two colleges are one person with a joint
appointment, which is why a person has to decide.
"""

import json
from collections import defaultdict

from data_collectors.common_format import term_key
from departments import is_department, written_out
from professor_names import display_name, match_key, middle_names

# Sections here don't say what a professor's own field is, so they don't count as a second college.
SHARED_COLLEGES = {"University College", "Honors College", "Undetermined", "No College Identified"}
# A college needs this many of a name's sections to count. One guest section isn't a second person.
SECTIONS_TO_COUNT = 3


def is_shared(college, department):
    return college in SHARED_COLLEGES or department in SHARED_COLLEGES or not is_department(department)


def colleges_taught_in(info):
    """One professor name's graded sections, by college: how many, in which departments, subjects, and terms."""
    colleges = defaultdict(lambda: {"sections": 0, "departments": defaultdict(int), "subjects": set(), "terms": set()})
    for course, details in info["courses"].items():
        for section in details["sections"]:
            if is_shared(section["college"], section["department"]):
                continue
            college = colleges[section["college"]]
            college["sections"] += 1
            college["departments"][section["department"]] += 1
            college["subjects"].add(course.split()[0])
            college["terms"].add(section["term"])
    return {name: college for name, college in colleges.items() if college["sections"] >= SECTIONS_TO_COUNT}


def unrelated_colleges(colleges):
    """The colleges that share no subject and no department with at least one of the others."""
    names = list(colleges)
    unrelated = set()
    for number, first in enumerate(names):
        for second in names[number + 1:]:
            a, b = colleges[first], colleges[second]
            if not (a["subjects"] & b["subjects"]) and not (set(a["departments"]) & set(b["departments"])):
                unrelated.update((first, second))
    return [name for name in names if name in unrelated]


def different_middle_names(names):
    """True when two of these names have middle names that start with different letters."""
    initials = {middle_names(name)[0][0].lower() for name in names if middle_names(name)}
    return len(initials) > 1


def term_range(terms):
    ordered = sorted(terms, key=term_key)
    return ordered[0] if len(ordered) == 1 else f"{ordered[0]} to {ordered[-1]}"


def find_same_names(grades, bluebook, syllabi):
    """Every name with at least one of the three clues, most clues first."""
    bluebook_names = defaultdict(list)
    for name in bluebook:
        bluebook_names[match_key(name)].append(name)

    syllabus_instructors = defaultdict(list)
    for instructor_id, info in syllabi.items():
        subjects = sorted({part for course in info["courses"] for part in course.split()[0].split("/")})
        syllabus_instructors[match_key(info["name"])].append((instructor_id, info["name"], subjects))

    grade_names = defaultdict(list)
    for name in grades:
        grade_names[match_key(name)].append(display_name(name))

    found = []
    for name, info in grades.items():
        key = match_key(name)
        colleges = colleges_taught_in(info)
        unrelated = unrelated_colleges(colleges)
        in_bluebook = sorted(bluebook_names[key])
        in_syllabus = sorted(syllabus_instructors[key])

        clues = [bool(unrelated), different_middle_names(in_bluebook), len(in_syllabus) > 1]
        if not any(clues):
            continue
        every_department = defaultdict(int)
        for details in info["courses"].values():
            for section in details["sections"]:
                every_department[section["department"]] += 1

        found.append({
            "name": display_name(name),
            "clues": sum(clues),
            "colleges": colleges,
            "departments": dict(every_department),  # every one they have a section in, with how many
            "unrelated": unrelated,
            "bluebook": in_bluebook if clues[1] else [],
            "syllabus": in_syllabus if clues[2] else [],
            "shares_name_with": [other for other in grade_names[key] if other != display_name(name)],
        })
    return sorted(found, key=lambda entry: (-entry["clues"], entry["name"]))


def suggested_split(entry):
    """What to paste into professor_splits.json to split a name by its colleges: a first guess."""
    people = {}
    for college in entry["unrelated"]:
        departments = sorted(entry["colleges"][college]["departments"], key=lambda d: -entry["colleges"][college]["departments"][d])
        # Each person is named after their main department, written out. The list under them
        # keeps the spreadsheets' spelling, since that's what their sections say.
        people[f"{entry['name']} ({written_out(departments[0])})"] = departments
    return json.dumps({entry["name"]: people}, indent=2, ensure_ascii=False)


def write_report(path, grades, bluebook, syllabi, splits):
    found = find_same_names(grades, bluebook, syllabi)
    lines = [
        "# Names that may be two professors",
        "",
        "Made by `combine_data.py`. Nothing here is split automatically.",
        "",
        "Each name below has at least one sign that it covers two people:",
        "",
        "1. They teach in two colleges with no subject or department in common.",
        "2. Bluebook has the name with two different middle names.",
        "3. Simple Syllabus has two instructors with the name.",
        "",
        "Most are one person. A professor with a joint appointment teaches in two colleges, and",
        "Simple Syllabus sometimes has the same person twice. Check before splitting anyone.",
        "",
        "To split a name, add it to `data/professor_splits.json` and run `combine_data.py` again.",
        "Each person gets the departments whose sections are theirs, spelled as they are here.",
        "",
        f"{len(found)} names, {sum(entry['name'] in splits for entry in found)} already split.",
        "",
    ]

    for entry in found:
        split = " (already split)" if entry["name"] in splits else ""
        lines.append(f"## {entry['name']}{split}")
        lines.append("")
        lines.append(f"{entry['clues']} of 3 signs.")
        lines.append("")
        for college, taught in sorted(entry["colleges"].items(), key=lambda item: -item[1]["sections"]):
            departments = ", ".join(sorted(taught["departments"]))
            subjects = ", ".join(sorted(taught["subjects"]))
            mark = " **(nothing in common with another)**" if college in entry["unrelated"] else ""
            lines.append(f"- {college}: {taught['sections']} sections in {departments} ({subjects}), {term_range(taught['terms'])}{mark}")
        if entry["bluebook"]:
            lines.append("- Bluebook has: " + "; ".join(f'"{name}"' for name in entry["bluebook"]))
        if entry["syllabus"]:
            instructors = "; ".join(f"{name} (id {instructor_id[:8]}, {', '.join(subjects) or 'no courses'})" for instructor_id, name, subjects in entry["syllabus"])
            lines.append(f"- Simple Syllabus has {len(entry['syllabus'])} instructors: {instructors}")
        if entry["shares_name_with"]:
            lines.append("- The same first and last name as: " + ", ".join(entry["shares_name_with"]))
        if entry["unrelated"] and not split:
            lines += ["", "If these are two people, a starting point for `professor_splits.json`:", "", "```json", suggested_split(entry), "```"]
            suggested = {department for college in entry["unrelated"] for department in entry["colleges"][college]["departments"]}
            left_over = [f"{department} ({count})" for department, count in sorted(entry["departments"].items()) if department not in suggested]
            if left_over:
                lines += ["", "Every department has to go to one of them. Still to place: " + ", ".join(left_over) + "."]
        lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")
    return found
