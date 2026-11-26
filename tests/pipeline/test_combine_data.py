"""Checks the parts of combine_data.py that choose titles, departments, and who a section belongs to.

    .venv/bin/python -m pytest tests/pipeline

It uses small made-up data, so it runs in a moment and doesn't need the collected files.
"""

from collections import Counter

import pytest

from combine_data import Combiner, main_department, split_cross_listed_title
from course_titles import abbreviates, full_titles
from same_names import find_same_names

# ---------------------------------------------------------------- titles


@pytest.mark.parametrize("short, long", [
    ("Intro to American Politics", "Introduction to American Politics"),
    ("Design Analysis of Algorithms", "Design and Analysis of Algorithms"),
    ("Intro-Comp Prog for Engineers", "Introduction to Computer Programming for Engineers"),
    ("Contemp Issues in ACC Practice", "Contemporary Issues in Accounting Practice"),
    ("Govt and Not-for-Profit Acct", "Governmental and Not-for-Profit Accounting"),
    ("Physics-Scientists&Engrs I Lab", "Physics for Scientists and Engineers I Laboratory"),
    ("Grt Bldgs & Cities of the Wrld", "Great Buildings and Cities of the World"),
])
def test_a_short_title_stands_for_its_long_one(short, long):
    assert abbreviates(short, long)
    assert not abbreviates(long, short)


@pytest.mark.parametrize("first, second", [
    ("Calculus I", "Calculus II"),  # a number is never short for another
    ("Freshman Composition II", "Freshman Composition II (HON)"),  # honors is its own title
    ("Analysis of Algorithms", "Design and Analysis of Algorithms"),  # it leaves out a real word
    ("Special Topics", "Special Topics: Cloud Computing"),  # a topic isn't the course's name
    ("Art History", "Architecture History and Theory"),
])
def test_different_titles_are_left_alone(first, second):
    assert not abbreviates(first, second)


def test_a_cut_off_title_can_stop_partway():
    cut = "Quantitative Analysis for Acc"  # 29 characters: 30, with the space it was cut after
    assert not abbreviates("Personal Nutrition", "Personal Nutrition and Cooking Basics")
    assert abbreviates(cut, "Quantitative Analysis for Accountants", cut_off=True)
    assert abbreviates("Personal Nutrition and Cooking", "Personal Nutrition and Cooking Basics", cut_off=True)


def test_every_title_of_a_course_gets_its_full_version():
    titles = {
        "Quantitative Analysis for Acc": Counter(grades=19, bluebook=12),
        "Quantitative Analysis for Accountants": Counter(syllabus=14),
        "Topics: Something Else": Counter(grades=2),
    }
    assert full_titles(titles) == {
        "Quantitative Analysis for Acc": "Quantitative Analysis for Accountants",
        "Quantitative Analysis for Accountants": "Quantitative Analysis for Accountants",
        "Topics: Something Else": "Topics: Something Else",
    }


def test_the_same_words_take_simple_syllabus_spelling():
    titles = {"Foundations Of Accounting": Counter(grades=30), "Foundations of Accounting": Counter(syllabus=4)}
    assert set(full_titles(titles).values()) == {"Foundations of Accounting"}


def test_a_list_of_cross_listed_titles_is_never_chosen():
    titles = {
        "Intro African American Studies": Counter(grades=33),
        "Introduction to African American Studies ; Approaches to American Culture": Counter(syllabus=5),
    }
    assert full_titles(titles)["Intro African American Studies"] == "Intro African American Studies"


def test_a_cross_listed_title_is_split_between_its_courses():
    both = "Introduction to African American Studies ; Approaches to American Culture"
    assert split_cross_listed_title(both, 2) == ["Introduction to African American Studies", "Approaches to American Culture"]
    assert split_cross_listed_title("Algebra ; Algebra", 3) == ["Algebra", "Algebra", "Algebra"]
    assert split_cross_listed_title(both, 3) == [both, both, both]  # it doesn't line up, so it's kept whole
    assert split_cross_listed_title("Calculus I", 1) == ["Calculus I"]

# ---------------------------------------------------------------- departments


def test_the_department_is_the_newest_semesters():
    sections = [("Fall 2022", "Electrical Engineering")] * 9 + [("Fall 2025", "Electrical & Computer Engineer")] * 2
    assert main_department(sections) == "Electrical & Computer Engineering"


def test_shared_units_only_count_when_there_is_nothing_else():
    assert main_department([("Fall 2025", "University College")] * 5 + [("Fall 2024", "Mathematics")]) == "Mathematics"
    assert main_department([("Fall 2025", "University College")]) == "University College"
    assert main_department([("Fall 2025", "COS (Admin Unit)"), ("Fall 2025", "Other")]) is None
    assert main_department([]) is None

# ---------------------------------------------------------------- who a section belongs to


def section(term, number, department, college="Sciences"):
    return {"term": term, "section": number, "college": college, "department": department, "totalStudents": 3, "grades": {"A": 3}}


def grades_for_two_smiths():
    return {
        "Smith, Jennifer": {"courses": {
            "BIO 1203": {"title": "Biosciences I", "sections": [section("Fall 2024", "001", "Integrative Biology")]},
            "HUM 2023": {"title": "Humanities", "sections": [section("Fall 2024", "001", "Philosophy & Classics", "Liberal and Fine Arts")]},
        }},
        "Jones, Sam": {"courses": {"BIO 1203": {"title": "Biosciences I", "sections": [section("Fall 2024", "002", "Integrative Biology")]}}},
    }


SPLIT = {"Jennifer Smith": {
    "Jennifer Smith (Integrative Biology)": ["Integrative Biology"],
    "Jennifer Smith (Philosophy & Classics)": ["Philosophy & Classics"],
}}


def test_without_a_split_the_name_is_one_professor():
    combiner = Combiner()
    combiner.add_grades(grades_for_two_smiths())
    assert list(combiner.professors) == ["Jennifer Smith", "Sam Jones"]
    assert set(combiner.professors["Jennifer Smith"]["courses"]) == {"BIO 1203", "HUM 2023"}


def test_a_split_name_becomes_two_professors():
    combiner = Combiner(SPLIT)
    combiner.add_grades(grades_for_two_smiths())
    assert "Jennifer Smith" not in combiner.professors
    assert set(combiner.professors["Jennifer Smith (Integrative Biology)"]["courses"]) == {"BIO 1203"}
    assert set(combiner.professors["Jennifer Smith (Philosophy & Classics)"]["courses"]) == {"HUM 2023"}
    output = combiner.sorted_output()
    assert output["Jennifer Smith (Integrative Biology)"]["department"] == "Integrative Biology"
    assert output["Jennifer Smith (Philosophy & Classics)"]["department"] == "Philosophy & Classics"


def test_an_ungraded_section_goes_to_whoever_teaches_that_course():
    combiner = Combiner(SPLIT)
    combiner.add_grades(grades_for_two_smiths())
    # Bluebook has a new semester of each course, under the one name both of them share.
    combiner.add_bluebook({"Smith, Jennifer A": {"courses": {
        "HUM 2023": {"title": "Humanities", "sections": [{"term": "Fall 2026", "section": "001", "instructorEvaluation": 4.5, "courseEvaluation": 4.4}]},
        "BIO 1404": {"title": "Biosciences II", "sections": [{"term": "Fall 2026", "section": "001", "instructorEvaluation": 4.0, "courseEvaluation": 4.0}]},
    }}})
    assert "Fall 2026" in combiner.professors["Jennifer Smith (Philosophy & Classics)"]["courses"]["HUM 2023"]["semesters"]
    # She doesn't teach BIO 1404, but she's the one who teaches BIO.
    assert "BIO 1404" in combiner.professors["Jennifer Smith (Integrative Biology)"]["courses"]


def test_a_split_has_to_place_every_department():
    grades = grades_for_two_smiths()
    grades["Smith, Jennifer"]["courses"]["AIS 1203"] = {"title": "AIS", "sections": [section("Fall 2024", "009", "University College")]}
    with pytest.raises(ValueError, match="University College"):
        Combiner(SPLIT).add_grades(grades)


def test_a_split_for_nobody_is_an_error():
    with pytest.raises(ValueError, match="Jane Nobody"):
        Combiner({"Jane Nobody": {"A": ["Art"], "B": ["Music"]}}).add_grades(grades_for_two_smiths())

# ---------------------------------------------------------------- the same-name report


def test_two_unrelated_colleges_are_reported_and_a_joint_appointment_is_not():
    def taught(subject, department, college, count=3):
        return {f"{subject} 1003": {"title": "t", "sections": [section("Fall 2024", f"00{n}", department, college) for n in range(count)]}}

    grades = {
        # Biology and humanities: nothing in common.
        "Smith, Jennifer": {"courses": {**taught("BIO", "Integrative Biology", "Sciences"), **taught("HUM", "Philosophy & Classics", "Liberal and Fine Arts")}},
        # Computer science, before and after it moved to a new college: the same department.
        "Heaps, John": {"courses": {**taught("CS", "Computer Science", "Sciences"), **taught("CS", "Computer Science", "AI, Cyber and Computing")}},
        # One guest section in another college isn't a second person.
        "Jones, Sam": {"courses": {**taught("BIO", "Integrative Biology", "Sciences"), **taught("MUS", "Music", "Liberal and Fine Arts", count=1)}},
        # First-year courses are taught by everyone.
        "Lee, Ana": {"courses": {**taught("MAT", "Mathematics", "Sciences"), **taught("AIS", "University College", "University College")}},
    }
    found = find_same_names(grades, bluebook={}, syllabi={})
    assert [entry["name"] for entry in found] == ["Jennifer Smith"]
    assert sorted(found[0]["unrelated"]) == ["Liberal and Fine Arts", "Sciences"]


def test_bluebook_and_simple_syllabus_are_signs_too():
    grades = {"Karimi, Amir": {"courses": {"ME 3293": {"title": "t", "sections": [section("Fall 2024", "001", "Mechanical Engineering")]}}}}
    bluebook = {"Karimi, Amir H": {"courses": {}}, "Karimi, Amir R": {"courses": {}}}
    syllabi = {
        "id-one": {"name": "Amir Karimi", "courses": {"ME 3293": {}}},
        "id-two": {"name": "Amir Karimi", "courses": {"MBA 5413": {}}},
    }
    assert find_same_names(grades, {}, {}) == []
    assert find_same_names(grades, bluebook, {})[0]["clues"] == 1
    assert find_same_names(grades, bluebook, syllabi)[0]["clues"] == 2
