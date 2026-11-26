"""Pulls every course in the UTSA catalog into data/raw_data/catalog_data.json.
It reads about 120 pages and takes about a minute.

    cd pipeline
    python3 -m collectors.catalog

The file is nested the way the university is:

    college -> "subjects" -> subject -> "courses" -> course
    college -> "departments" -> department -> "subjects" -> subject -> "courses" -> course

A college's own "subjects" are the courses it lists under no department.
Every college and department also gets an empty "faculty" for professors.py to fill.
The whole shape of the file is written out in catalog_types.py.
"""

import time

import requests
from bs4 import BeautifulSoup, Tag

from collectors.catalog_types import Catalog, College, CourseInfo, Department, Subject
from collectors.common_format import save

BASE_UTSA_URL = "https://catalog.utsa.edu"
# the catalog has two parts, and each part has its own menu of colleges
LEVELS = ["undergraduate", "graduate"]
# A menu entry with one of these words in it is read as a college. First Year
# Experience is not called a college, but it has courses of its own (CSS and UPM).
# CHECKED BY HAND: if UTSA adds a part with courses that is not called a college,
# its name goes here.
KEYWORDS = ["College", "First Year Experience"]


def get_page(link: str) -> BeautifulSoup:
    """Opens one catalog page. link looks like "/undergraduate/business/"."""
    response: requests.Response = requests.get(BASE_UTSA_URL + link, timeout=30)
    response.raise_for_status()
    time.sleep(0.2)  # a short pause, let us be nice :)))
    return BeautifulSoup(response.content, "html.parser")


def page_name(page: BeautifulSoup) -> str:
    """The page's heading, like "Department of Chemistry"."""
    # some headings have an invisible zero-width space in them, so it is taken out
    heading: str = page.find("h1").getText().replace("\u200b", "")
    return " ".join(heading.split())


def get_college_links(level: str) -> list[str]:
    """The link of every college in the menu of the undergraduate or graduate catalog."""
    page: BeautifulSoup = get_page(f"/{level}/")
    menu: Tag = page.find(id=f"/{level}/")
    links: list[str] = []

    for item in menu.find_all("li", recursive=False):
        link: Tag = item.find("a")
        for word in KEYWORDS:
            if word in link.getText():
                links.append(link.get("href"))
                break

    return links


def get_department_links(college_page: BeautifulSoup) -> list[str]:
    """The link of every department the college page lists. Some colleges have none."""
    menu: Tag | None = college_page.find("ul", class_="leveltwo")
    if menu is None:
        return []

    links: list[str] = []
    for link in menu.find_all("a"):
        links.append(link.get("href"))
    return links


def has_courses(page: BeautifulSoup) -> bool:
    """True when the page's course list has at least one course in it."""
    return page.select_one("#courseinventorycontainer .courseblock") is not None


def add_subjects(subjects: dict[str, Subject], page: BeautifulSoup) -> None:
    """Adds every subject and course the page lists to subjects."""
    # only this container: a few pages repeat another page's courses in their other tabs
    container: Tag | None = page.find(id="courseinventorycontainer")
    if container is None:
        return

    for heading in container.find_all("h2"):
        # the heading looks like "Biochemistry (BCH) Courses"
        heading_text: str = " ".join(heading.getText().split())
        heading_parts: list[str] = heading_text.removesuffix(" Courses").rsplit(" (", 1)
        subject_name: str = heading_parts[0]
        subject_code: str = heading_parts[1].rstrip(")")
        if subject_code not in subjects:
            subjects[subject_code] = {"name": subject_name, "courses": {}}

    for block in container.find_all(class_="courseblock"):
        course: dict[str, CourseInfo] = get_course_info(block)
        course_code: str = list(course)[0]  # "BCH 2903"
        course_subject: str = course_code.split()[0]  # "BCH"
        subjects[course_subject]["courses"].update(course)


def get_course_info(course: Tag) -> dict[str, CourseInfo]:
    """Reads one course block. Returns {"CS 1083": its CourseInfo}."""
    title_text: str = (
        course.find(class_="courseblocktitle").getText().replace("\xa0", " ")
    )
    # split() then join turns line breaks, double spaces and non-breaking spaces into single spaces
    description: str = " ".join(course.find(class_="courseblockdesc").getText().split())

    # title_text looks like "CS 1083. Programming I. (3-0) 3 Credit Hours. (TCCN = COSC 1336)"
    # The first period ends the code. The last two are counted from the right, because
    # a title can have periods of its own, like "History of the U.S. South".
    title_parts: list[str] = title_text.split(".", 1)
    code: str = title_parts[0].strip()
    # that gives [" Programming I", " (3-0) 3 Credit Hours", " (TCCN = COSC 1336)"]
    rest_parts: list[str] = title_parts[1].rsplit(".", 2)
    # rstrip is for the two titles the catalog ends with two periods
    title: str = " ".join(rest_parts[0].split()).rstrip(".")
    hours: str = rest_parts[1]
    transfer_text: str = rest_parts[2]

    # hours looks like "(2-3) 3 Credit Hours": 2 lecture hours and 3 lab hours a week, for 3 credits
    credit_hours: int = int(hours.split(" Credit")[0].split()[-1])
    lecture_hours: int | None = None
    lab_hours: int | None = None
    if "(" in hours:
        weekly_hours: list[str] = hours.split(")")[0].replace("(", "").split("-")
        lecture_hours = int(weekly_hours[0])
        lab_hours = int(weekly_hours[1])

    # some courses end with a Texas transfer number, like "(TCCN = COSC 1336)"
    transfer_number: str | None = (
        transfer_text.replace("(TCCN = ", "").replace(")", "").strip()
    )
    if transfer_number == "":
        transfer_number = None

    course_info: CourseInfo = {
        "title": title,
        "credit_hours": credit_hours,
        "lecture_hours": lecture_hours,
        "lab_hours": lab_hours,
        "transfer_number": transfer_number,
        "description": description,
    }
    return {code: course_info}


def get_catalog() -> None:
    catalog: Catalog = {}
    start: float = time.perf_counter()

    # graduate comes second and adds to the colleges and departments undergraduate made
    for level in LEVELS:
        for college_link in get_college_links(level):
            college_page: BeautifulSoup = get_page(college_link)
            college_name: str = page_name(college_page)
            print(f"{level}: {college_name}")

            if college_name not in catalog:
                catalog[college_name] = {
                    "subjects": {},
                    "faculty": {},
                    "departments": {},
                }
            college: College = catalog[college_name]

            add_subjects(college["subjects"], college_page)

            for department_link in get_department_links(college_page):
                department_page: BeautifulSoup = get_page(department_link)
                department_name: str = page_name(department_page)

                # a page with no courses is not a department, like Teacher Certification Programs
                if not has_courses(department_page):
                    continue

                if department_name not in college["departments"]:
                    college["departments"][department_name] = {
                        "subjects": {},
                        "faculty": {},
                    }
                department: Department = college["departments"][department_name]

                add_subjects(department["subjects"], department_page)

    save(catalog, "catalog_data.json")
    print("The catalog is done!")
    print(f"{len(catalog)} colleges | took {time.perf_counter() - start:.1f}s")


if __name__ == "__main__":
    get_catalog()
