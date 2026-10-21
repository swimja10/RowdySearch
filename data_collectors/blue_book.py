from playwright.sync_api import sync_playwright, Page
import json
from pathlib import Path
import time

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw_data"
RAW_DIR.mkdir(parents=True, exist_ok=True)

FACULTY_BOX = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_FacultyTitleTxtBox"
NEXT_BTN = "#ctl00_MainContent_mainContent1_PagerImgBtn_NextTOP"
PAST_COURSES = "#ctl00_MainContent_mainContent1_CourseTermSelectRBL_2"


CURRENT_PAGE = "#ctl00_MainContent_mainContent1_CurrentPage"
LAST_PAGE = "#ctl00_MainContent_mainContent1_TotalPages"

SEMESTER = '[style="width: 60px;"]'
COURSE_ID = '[style="width: 85px;"]'
COURSE_NAME = '[style="width: 180px;"]'
INSTRUCTOR_EVALUATION = '[style="width: 120px;"]'
COURSE_EVALUATION = '[style="width: 115px; vertical-align: middle"]'
TABLE_ROW = ".infoTable"
PROFESSOR_NAME = '[style="width: 130px;"]'


def wait_for_new_page(page: Page, action):
    with page.expect_navigation(wait_until="domcontentloaded"):
        action()


def block_extras(route):
    if route.request.resource_type in ("image", "stylesheet", "font"):
        route.abort()
    else:
        route.continue_()


def click_past_courses(page):
    radio = page.locator(PAST_COURSES)
    if radio.count() == 0:
        return
    if not radio.is_checked():
        wait_for_new_page(page, lambda: radio.click())


def term_parser(term):
    term = term.split()
    semester = term[0]
    year = term[1]

    match semester:
        case "Sum":
            semester = "Summer"
        case "Spr":
            semester = "Spring"

    return f"{semester} {year}"


def click_faculty(page: Page):
    page.get_by_role("radio", name="Faculty").click()


def search_faculty(page: Page, name: str):
    page.locator(FACULTY_BOX).fill(name)
    wait_for_new_page(page, lambda: page.keyboard.press("Enter"))


def click_next_button(page: Page):
    wait_for_new_page(page, lambda: page.locator(NEXT_BTN).click())


def get_evaluation_data(data):
    if "." not in data:
        return None

    return float(data.split()[0])


def write_to_json(
    data,
    professorName,
    term,
    courseID,
    section,
    courseName,
    instructorEvaluation,
    courseEvaluation,
):
    if professorName not in data:
        data[professorName] = {"courses": {}}

    courses = data[professorName]["courses"]

    if courseID not in courses:
        courses[courseID] = {"title": courseName, "sections": []}

    sections = courses[courseID]["sections"]

    newSection = {
        "term": term,
        "section": section,
        "instructorEvaluation": instructorEvaluation,
        "courseEvaluation": courseEvaluation,
    }

    if newSection not in sections:
        sections.append(newSection)


def save(data, path):
    with open(RAW_DIR / path, "w") as f:
        json.dump(data, f, indent=4)


def get_professor_info(page: Page, data):

    rows = page.locator(TABLE_ROW).all()

    if len(rows) == 0:
        return

    for row in rows:
        professorName = row.locator(PROFESSOR_NAME).inner_text()
        semester = term_parser(row.locator(SEMESTER).inner_text())
        courseInfo = row.locator(COURSE_ID).inner_text().split(".")
        courseID = courseInfo[0]
        section = courseInfo[1]
        courseName = row.locator(COURSE_NAME).inner_text()
        instructorEvaluation = get_evaluation_data(
            row.locator(INSTRUCTOR_EVALUATION).inner_text()
        )
        courseEvaluation = get_evaluation_data(
            row.locator(COURSE_EVALUATION).inner_text()
        )

        write_to_json(
            data,
            professorName,
            semester,
            courseID,
            section,
            courseName,
            instructorEvaluation,
            courseEvaluation,
        )


def scrape_professor(page, data, professor):
    search_faculty(page, professor)
    click_past_courses(page)
    while True:
        get_professor_info(page, data)
        current_page = int(page.locator(CURRENT_PAGE).input_value())
        total_pages = int(page.locator(LAST_PAGE).input_value())
        if current_page >= total_pages:
            break
        click_next_button(page)


def bluebook():
    data = {}

    with open(RAW_DIR / "grade_distribution_data.json") as f:
        professor_list = json.load(f).keys()

    with sync_playwright() as playwright:
        chromium = playwright.chromium
        browser = chromium.launch()
        page = browser.new_page()
        page.route("**/*", block_extras)
        page.goto("https://bluebook.utsa.edu/")
        click_faculty(page)
        total = len(professor_list)
        start = time.perf_counter()

        for i, professor in enumerate(professor_list, start=1):
            scrape_professor(page, data, professor)

            if i % 50 == 0:
                elapsed = time.perf_counter() - start
                per_professor = elapsed / i
                remaining = per_professor * (total - i)
                print(
                    f"{i} of {total} searched | {len(data)} with evaluations | "
                    f"{elapsed / 60:.1f} min elapsed | {per_professor:.1f} s/professor | "
                    f"~{remaining / 60:.0f} min left"
                )
                save(data, "bluebook.json")

        browser.close()

    print("Bluebook collection is complete!")
    save(data, "bluebook.json")


if __name__ == "__main__":
    bluebook()
