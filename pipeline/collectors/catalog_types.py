"""The shape of catalog_data.json, which catalog.py and professors.py both use.

    college -> "subjects" -> subject -> "courses" -> course
    college -> "faculty" -> person
    college -> "departments" -> department -> "subjects" -> subject -> "courses" -> course
    college -> "departments" -> department -> "faculty" -> person

catalog.py makes the colleges, departments, subjects and courses, and leaves every
"faculty" empty. professors.py fills the "faculty" in.
"""

from typing import TypedDict


class CourseInfo(TypedDict):
    """One course as the catalog lists it. What the catalog does not give stays None."""

    title: str  # "Programming I for Computer Scientists"
    credit_hours: int
    lecture_hours: int | None  # hours in class each week
    lab_hours: int | None  # hours in lab each week
    transfer_number: str | None  # the Texas common course number, "COSC 1336"
    description: str


class Subject(TypedDict):
    name: str  # "Computer Science"
    courses: dict[str, CourseInfo]  # "CS 1083" -> the course


class Professor(TypedDict):
    """One person as the faculty pages list them."""

    title: str  # "Professor of Practice"
    education: str | None  # "B.S., Trinity University; Ph.D., Rice University"


Faculty = dict[str, Professor]  # "Agrawal, Sharad C." -> the person


class Department(TypedDict):
    subjects: dict[str, Subject]  # "CS" -> the subject
    faculty: Faculty


class College(TypedDict):
    subjects: dict[str, Subject]  # what the college lists under no department
    faculty: Faculty  # who the college lists under no department
    departments: dict[str, Department]  # "Department of Computer Science" -> it


Catalog = dict[str, College]  # "College of Sciences" -> the college
