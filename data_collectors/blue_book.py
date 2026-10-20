# Finish getting professor data so you can create the JSON
from playwright.sync_api import sync_playwright, Playwright, Page
import time

FACULTY_BOX = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_FacultyTitleTxtBox"
SEARCH_BTN = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_SearchBtn"
NEXT_BTN = "#ctl00_MainContent_mainContent1_PagerImgBtn_NextTOP"
INFO_TABLE = "#ctl00_MainContent_mainContent1_MainContentAccordion"
SEMESTER = '[style="width: 60px;"]'
COURSE_ID = '[style="width: 85px;"]'
COURSE_NAME = '[style="width: 180px;"]'
INSTRUCTOR_EVALUATION = '[style="width: 120px;"]'
COURSE_EVALUATION = '[style="width: 115px; vertical-align: middle"]'
TABLE_ROW = ".infoTable"
PROFESSOR_NAME = '[style="width: 130px;"]'


def click_faculty(page: Page):
    page.get_by_role("radio", name="Faculty").click()


def search_faculty(page: Page, name: str):
    page.locator(FACULTY_BOX).fill(name)
    page.keyboard.press("Enter")


def click_next_button(page: Page):
    page.locator(NEXT_BTN).click()


def get_evaluation_data(data):
    if "." not in data:
        return None

    return data.split()[0]


def write_to_json(
    data,
    professor_name,
    semester,
    course_ID,
    section,
    course_name,
    instructor_evaluation,
    course_evaluation,
):
    if professor_name not in data:
        data[professor_name] = {"courses": {}}


def get_professor_info(page: Page, data):
    page.wait_for_load_state("networkidle")

    if page.get_by_text("No results returned for search:"):
        return

    rows = page.locator(TABLE_ROW).all()

    for row in rows:
        professor_name = row.locator(PROFESSOR_NAME).inner_text()
        semester = row.locator(SEMESTER).inner_text()
        course_info = row.locator(COURSE_ID).inner_text().split(".")
        course_ID = course_info[0]
        section = course_info[1]
        course_name = row.locator(COURSE_NAME).inner_text()
        instructor_evaluation = get_evaluation_data(
            row.locator(INSTRUCTOR_EVALUATION).inner_text()
        )
        course_evaluation = get_evaluation_data(
            row.locator(COURSE_EVALUATION).inner_text()
        )
        write_to_json(
            data,
            professor_name,
            semester,
            course_ID,
            section,
            course_name,
            instructor_evaluation,
            course_evaluation,
        )


def collect_data(page: Page, data):
    click_faculty(page)
    search_faculty(page, "Heaps, John")
    get_professor_info(page, data)


def bluebook(playwright: Playwright):
    data = {}

    chromium = playwright.chromium
    browser = chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://bluebook.utsa.edu/")

    collect_data(page, data)
    browser.close()


with sync_playwright() as playwright:
    bluebook(playwright)
