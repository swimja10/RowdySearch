"""Checks that catalog.py reads catalog pages right. Nothing here goes online:
every page is a real one from catalog.utsa.edu, saved in fixtures/ on 2026-11-24.
"""

from pathlib import Path

from bs4 import BeautifulSoup

from collectors.catalog import add_subjects, has_courses, page_name

FIXTURES = Path(__file__).parent / "fixtures"

# Each page is here for what it has. The address is where it was saved from.

# an ordinary department page: two subjects, lab hours and transfer numbers
# /undergraduate/sciences/chemistry/
CHEMISTRY = "catalog_chemistry.html"
# a title with periods of its own
# /graduate/liberalfinearts/history/
HISTORY = "catalog_history.html"
# a title the catalog ends with two periods
# /undergraduate/aicybercomputing/statisticsdatascience/
STATISTICS = "catalog_statistics.html"
# the one course with no weekly hours, and two courses outside the course list
# /graduate/educationhumandevelopment/interdisciplinarylearningteaching/
LEARNING_TEACHING = "catalog_learning_teaching.html"
# a course list with nothing in it
# /undergraduate/onlineprograms/
ONLINE_PROGRAMS = "catalog_online_programs.html"


def saved_page(filename):
    with open(FIXTURES / filename, "rb") as f:
        return BeautifulSoup(f.read(), "html.parser")


def read_subjects(filename):
    subjects = {}
    add_subjects(subjects, saved_page(filename))
    return subjects


def test_page_name_is_the_heading():
    assert page_name(saved_page(CHEMISTRY)) == "Department of Chemistry"


def test_page_with_courses_has_courses():
    assert has_courses(saved_page(CHEMISTRY))


def test_both_subjects_are_found_with_their_courses():
    subjects = read_subjects(CHEMISTRY)

    assert set(subjects) == {"BCH", "CHE"}
    assert subjects["BCH"]["name"] == "Biochemistry"
    assert subjects["CHE"]["name"] == "Chemistry"
    assert len(subjects["BCH"]["courses"]) == 7
    assert len(subjects["CHE"]["courses"]) == 46


def test_course_is_read_in_full():
    course = read_subjects(CHEMISTRY)["BCH"]["courses"]["BCH 2903"]

    assert course["title"] == "Biochemistry for the Life Sciences"
    assert course["credit_hours"] == 3
    assert course["lecture_hours"] == 3
    assert course["lab_hours"] == 0
    assert course["transfer_number"] is None
    assert course["description"].startswith("Prerequisite: CHE 2603 with a grade of")


def test_lab_hours_and_transfer_number_are_read():
    course = read_subjects(CHEMISTRY)["CHE"]["courses"]["CHE 1121"]

    assert course["title"] == "General Chemistry I Laboratory"
    assert course["credit_hours"] == 1
    assert course["lecture_hours"] == 1
    assert course["lab_hours"] == 4
    assert course["transfer_number"] == "CHEM 1111"


def test_reading_same_page_twice_adds_no_duplicates():
    subjects = {}
    add_subjects(subjects, saved_page(CHEMISTRY))
    add_subjects(subjects, saved_page(CHEMISTRY))

    assert len(subjects["BCH"]["courses"]) == 7
    assert len(subjects["CHE"]["courses"]) == 46


def test_title_keeps_periods_of_its_own():
    course = read_subjects(HISTORY)["HIS"]["courses"]["HIS 5163"]

    assert course["title"] == "History of the U.S. South"
    assert course["credit_hours"] == 3


def test_title_ending_in_two_periods_loses_both():
    course = read_subjects(STATISTICS)["STA"]["courses"]["STA 4513"]

    assert course["title"] == "Introduction to Bayesian Methods and Applications"
    assert course["credit_hours"] == 3


def test_course_with_no_weekly_hours():
    course = read_subjects(LEARNING_TEACHING)["CI"]["courses"]["CI 5653"]

    assert course["title"] == "Secondary Yearlong Clinical Teaching Semester 1"
    assert course["credit_hours"] == 0
    assert course["lecture_hours"] is None
    assert course["lab_hours"] is None


def test_courses_outside_the_course_list_are_not_read():
    page = saved_page(LEARNING_TEACHING)
    subjects = read_subjects(LEARNING_TEACHING)
    courses_read = 0
    for subject in subjects.values():
        courses_read += len(subject["courses"])

    # the page has 188 course blocks, and 2 of them sit in another tab
    assert len(page.find_all(class_="courseblock")) == 188
    assert courses_read == 186
    assert "CI 5620" not in subjects["CI"]["courses"]
    assert "CI 5630" not in subjects["CI"]["courses"]


def test_page_with_empty_course_list_has_no_courses():
    assert not has_courses(saved_page(ONLINE_PROGRAMS))
    assert read_subjects(ONLINE_PROGRAMS) == {}
