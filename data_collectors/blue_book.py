import json
import time
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import Value

from playwright.sync_api import sync_playwright, Page, Error as PlaywrightError

from data_collectors.common_format import save, RAW_DIR

FACULTY_BOX = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_FacultyTitleTxtBox"
NEXT_BTN = "#ctl00_MainContent_mainContent1_PagerImgBtn_NextTOP"
PAST_COURSES = "#ctl00_MainContent_mainContent1_CourseTermSelectRBL_2"

CURRENT_PAGE = "#ctl00_MainContent_mainContent1_CurrentPage"
LAST_PAGE = "#ctl00_MainContent_mainContent1_TotalPages"
TOTAL_ROWS = "#ctl00_MainContent_mainContent1_TotalRows"

SEMESTER = '[style="width: 60px;"]'
COURSE_ID = '[style="width: 85px;"]'
COURSE_NAME = '[style="width: 180px;"]'
INSTRUCTOR_EVALUATION = '[style="width: 120px;"]'
COURSE_EVALUATION = '[style="width: 115px; vertical-align: middle"]'
TABLE_ROW = ".infoTable"
PROFESSOR_NAME = '[style="width: 130px;"]'

# Shared across worker processes, set once per worker by init_worker
progress = None
run_start = None


def init_worker(counter, start):
    global progress, run_start
    progress = counter
    run_start = start


def report_progress(total, every=100):
    with progress.get_lock():
        progress.value += 1
        done = progress.value
    if done % every == 0 or done == total:
        per_professor = (time.time() - run_start) / done
        remaining = per_professor * (total - done) / 60
        print(f"{done} of {total} searched | ~{remaining:.0f} min left")


def wait_for_new_page(page: Page, action):
    with page.expect_navigation(wait_until="domcontentloaded"):
        action()


def block_extras(route):
    if route.request.resource_type in ("image", "stylesheet", "font"):
        route.abort()
    else:
        route.continue_()


def click_faculty(page: Page):
    page.get_by_role("radio", name="Faculty").click()


def click_past_courses(page: Page):
    radio = page.locator(PAST_COURSES)
    if radio.count() == 0:
        return
    if not radio.is_checked():
        wait_for_new_page(page, lambda: radio.click())


def search_faculty(page: Page, name: str):
    page.locator(FACULTY_BOX).fill(name)
    wait_for_new_page(page, lambda: page.keyboard.press("Enter"))


def click_next_button(page: Page):
    wait_for_new_page(page, lambda: page.locator(NEXT_BTN).click())


def open_bluebook(browser):
    page = browser.new_page()
    page.route("**/*", block_extras)
    page.goto("https://bluebook.utsa.edu/")
    click_faculty(page)
    return page


def term_parser(term):
    semester, year = term.split()

    match semester:
        case "Sum":
            semester = "Summer"
        case "Spr":
            semester = "Spring"

    return f"{semester} {year}"


def get_evaluation_data(text):
    if "." not in text:
        return None

    return float(text.split()[0])


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
    courses = data.setdefault(professorName, {"courses": {}})["courses"]
    sections = courses.setdefault(courseID, {"title": courseName, "sections": []})[
        "sections"
    ]

    newSection = {
        "term": term,
        "section": section,
        "instructorEvaluation": instructorEvaluation,
        "courseEvaluation": courseEvaluation,
    }

    if newSection not in sections:
        sections.append(newSection)


def get_professor_info(page: Page, data):
    keys = set()

    for row in page.locator(TABLE_ROW).all():
        professorName = row.locator(PROFESSOR_NAME).inner_text()
        semester = term_parser(row.locator(SEMESTER).inner_text())
        courseID, section = row.locator(COURSE_ID).inner_text().split(".", 1)
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
        keys.add((professorName, courseID, section, semester))

    return keys


def page_through(page: Page, data, verbose=False):
    seen = set()
    last_page = 0
    while True:
        seen |= get_professor_info(page, data)
        current_page = int(page.locator(CURRENT_PAGE).input_value())
        total_pages = int(page.locator(LAST_PAGE).input_value())
        if verbose:
            print(
                f"    page {current_page} of {total_pages} | {len(seen)} rows this pass"
            )
        if current_page >= total_pages:
            return seen
        if current_page <= last_page:
            # Next didn't move us forward; stop instead of looping forever.
            print(
                f"    stuck on page {current_page} of {total_pages}, stopping this pass"
            )
            return seen
        last_page = current_page
        click_next_button(page)


def scrape_professor(page: Page, data, professor, max_passes=3, verbose=False):
    # Bluebook's row order within a term isn't stable between page loads, so
    # a single pass can skip rows. Re-page until we've seen TotalRows unique rows.
    seen = set()
    for attempt in range(1, max_passes + 1):
        search_faculty(page, professor)
        click_past_courses(page)
        expected = int(page.locator(TOTAL_ROWS).input_value() or 0)
        seen |= page_through(page, data, verbose)
        if verbose:
            print(f"  {professor}: pass {attempt} | {len(seen)} of {expected} rows")
        if len(seen) >= expected:
            return


def scrape_data_chunk(worker_id, professors, total):
    data = {}
    failed = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = open_bluebook(browser)

        for professor in professors:
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

            report_progress(total)

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
    total = len(professor_list)
    counter = Value("i", 0)
    data = {}
    failed = []
    start = time.time()

    with ProcessPoolExecutor(
        max_workers=workers, initializer=init_worker, initargs=(counter, start)
    ) as pool:
        for chunk_data, chunk_failed in pool.map(
            scrape_data_chunk, range(1, workers + 1), data_chunks, [total] * workers
        ):
            merge(data, chunk_data)
            failed += chunk_failed

    save(data, "bluebook_data.json")
    print("Bluebook is finally done...")
    print(
        f"Done: {len(data)} professors | failed: {failed} | took {(time.time() - start) / 60:.1f} min"
    )


def test_names(names=("Dunn, Christopher", "Heaps, John", "Professor, Evil")):
    run_start = time.time()
    data = {}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = open_bluebook(browser)
        for name in names:
            start = time.time()
            print(f"{name}:")
            scrape_professor(page, data, name, verbose=True)
            print(f"  took {time.time() - start:.1f}s")
        browser.close()

    print(f"{(time.time() - run_start) / 60:.1f} min total")
    for name, professor in data.items():
        print(
            name,
            sum(len(course["sections"]) for course in professor["courses"].values()),
        )


if __name__ == "__main__":
    test_names()
