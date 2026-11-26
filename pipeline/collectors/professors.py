"""Adds the faculty the UTSA catalog lists to data/raw_data/catalog_data.json.
catalog.py has to run first: this reads the file it makes and saves it again
with the faculty in.

    cd pipeline
    python3 -m collectors.professors

Every college and department gets a "faculty":

    college -> "faculty" -> person
    college -> "departments" -> department -> "faculty" -> person

A college's own "faculty" are the people it lists under no department.
"""

import json
import time

from bs4 import BeautifulSoup, Tag

from collectors.catalog import LEVELS, get_page
from collectors.catalog_types import Catalog, College, Department, Faculty
from collectors.common_format import RAW_DIR, save

CATALOG_FILE = "catalog_data.json"
# the catalog says "Department of Chemistry" and the faculty pages say "Chemistry"
PREFIXES = ["Department of ", "School of "]

# Faculty headings that are a department the catalog has under another name:
# the faculty page's name -> the catalog's name.
# THIS IS WRITTEN AND CHECKED BY HAND. When a run prints "new department", look
# whether the catalog already has that department under another name. If it does,
# add a line here. If a line here stops working, its heading is printed the same way.
SAME_DEPARTMENT: dict[str, str] = {
    "Communication": "School of Communication, Language and Culture",
    "Modern Languages and Literatures": "School of Communication, Language and Culture",
    "Academic Inquiry and Scholarship": "Academic Introduction and Strategies",
    "Interdisciplinary School for Engagement in the Humanities and Social Sciences": (
        "Interdisciplinary School for Engagement in Humanities and Social Sciences"
    ),
}


def load_catalog() -> Catalog:
    with open(RAW_DIR / CATALOG_FILE) as file:
        return json.load(file)


def clean(text: str) -> str:
    """Turns line breaks, double spaces and non-breaking spaces into single spaces."""
    return " ".join(text.split())


def short_name(department_name: str) -> str:
    """Turns "Department of Chemistry" into "Chemistry", as the faculty pages say it."""
    for prefix in PREFIXES:
        department_name = department_name.removeprefix(prefix)
    return department_name


def reset_faculty(catalog: Catalog) -> None:
    """Takes out what an earlier run added, so a second run starts clean."""
    for college in catalog.values():
        college["faculty"] = {}
        departments: dict[str, Department] = {}

        for department_name, department in college["departments"].items():
            # no subjects: an earlier run made this department from a faculty heading
            if department["subjects"]:
                department["faculty"] = {}
                departments[department_name] = department

        college["departments"] = departments


def find_or_make_faculty(catalog: Catalog, college_name: str, heading: str) -> Faculty:
    """The faculty a person listed under this heading goes into.
    When no department matches the heading, a new department is made for it.
    """
    college: College = catalog[college_name]

    # no heading: the person is listed under the college itself
    if heading == "":
        return college["faculty"]

    # a heading in SAME_DEPARTMENT is looked up by the name the catalog gives it
    name_to_find: str = heading
    if heading in SAME_DEPARTMENT:
        name_to_find = short_name(SAME_DEPARTMENT[heading])

    # Every college is searched, so a person goes where the catalog has the department
    # now, even when the faculty page lists them under another college. The graduate
    # page still has Computer Science under the College of Sciences, and the catalog
    # has it in the College of AI, Cyber and Computing.
    for other_college in catalog.values():
        for department_name, department in other_college["departments"].items():
            if short_name(department_name) == name_to_find:
                return department["faculty"]

    # no department has this name, so one is made, named as the faculty page names it
    if heading not in college["departments"]:
        print(f"new department: {heading} | {college_name}")
        college["departments"][heading] = {"subjects": {}, "faculty": {}}
    return college["departments"][heading]["faculty"]


def get_professors() -> None:
    catalog: Catalog = load_catalog()
    reset_faculty(catalog)
    start: float = time.perf_counter()
    undergraduate_professor_names: set[str] = set()
    listings: int = 0

    for level in LEVELS:
        page: BeautifulSoup = get_page(f"/{level}/faculty/")
        container: Tag = page.find(id="facultycontainer")

        # one block for each college: its name, then a table of its people
        for college_block in container.find_all("div", recursive=False):
            college_name: str = clean(college_block.find("h2").getText())
            if college_name not in catalog:
                print(f"skipped, not a college in the catalog: {college_name}")
                continue

            heading: str = ""
            for row in college_block.find_all("tr"):
                # a department row names the department of everyone below it
                department_cell: Tag | None = row.find("th", class_="department")
                if department_cell is not None:
                    heading = clean(department_cell.getText())
                    continue

                # the Name / Title / Education row has no td cells
                cells: list[Tag] = row.find_all("td")
                if len(cells) == 0:
                    continue

                name: str = clean(cells[0].getText())
                title: str = clean(cells[1].getText())
                education: str | None = clean(cells[2].getText())
                if education == "":
                    education = None

                # the graduate page is the older one, so a person the undergraduate page
                # lists stays where that page put them
                if level == "graduate" and name in undergraduate_professor_names:
                    continue
                if level == "undergraduate":
                    undergraduate_professor_names.add(name)

                faculty: Faculty = find_or_make_faculty(catalog, college_name, heading)
                faculty[name] = {"title": title, "education": education}
                listings += 1

    save(catalog, CATALOG_FILE)
    print("The faculty is in!")
    print(f"{listings} listings | took {time.perf_counter() - start:.1f}s")


if __name__ == "__main__":
    get_professors()
