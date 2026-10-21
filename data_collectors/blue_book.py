import json
import time
from concurrent.futures import ProcessPoolExecutor

from playwright.sync_api import sync_playwright, Page, Error as PlaywrightError

from data_collectors.common_format import save, RAW_DIR

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


def open_bluebook(browser):
    page = browser.new_page()
    page.route("**/*", block_extras)
    page.goto("https://bluebook.utsa.edu/")
    click_faculty(page)
    return page


def scrape_data_chunk(worker_id, professors):
    data = {}
    failed = []
    start = time.perf_counter()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = open_bluebook(browser)

        for i, professor in enumerate(professors, start=1):
            try:
                scrape_professor(page, data, professor)
            except PlaywrightError as error:
                print(
                    f"[worker {worker_id}] {professor} failed ({type(error).__name__}), retrying once"
                )
                page.close()
                page = open_bluebook(browser)
                try:
                    scrape_professor(page, data, professor)
                except PlaywrightError:
                    failed.append(professor)

            if i % 25 == 0:
                per_professor = (time.perf_counter() - start) / i
                remaining = per_professor * (len(professors) - i) / 60
                print(
                    f"[worker {worker_id}] {i} of {len(professors)} | {per_professor:.1f} s/professor | ~{remaining:.0f} min left"
                )

        browser.close()

    return data, failed


def merge(total_data, chunk_data):
    for name, professor in chunk_data.items():
        for course_id, course in professor["courses"].items():
            for s in course["sections"]:
                write_to_json(
                    total_data,
                    name,
                    s["term"],
                    course_id,
                    s["section"],
                    course["title"],
                    s["instructorEvaluation"],
                    s["courseEvaluation"],
                )


def bluebook(workers=4, professor_limit=None):
    with open(RAW_DIR / "grade_distribution_data.json") as f:
        professor_list = list(json.load(f).keys())[:professor_limit]

    data_chunks = [professor_list[i::workers] for i in range(workers)]
    data = {}
    failed = []
    start = time.perf_counter()

    with ProcessPoolExecutor(max_workers=workers) as pool:
        for chunk_data, chunk_failed in pool.map(
            scrape_data_chunk, range(1, workers + 1), data_chunks
        ):
            merge(data, chunk_data)
            failed += chunk_failed

    save(data, "bluebook.json")
    print("Bluebook is finally done!")
    print(
        f"Done: {len(data)} professors | failed: {failed} | took {(time.perf_counter() - start) / 60:.1f} min"
    )


if __name__ == "__main__":
    bluebook()
