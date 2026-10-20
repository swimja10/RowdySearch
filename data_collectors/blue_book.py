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


def get_professor_info(page: Page):
    page.wait_for_load_state("networkidle")

    rows = page.locator(TABLE_ROW).all()

    for row in rows:
        professor_name = page.locator(PROFESSOR_NAME).inner_text()
        professor_name = page.locator(PROFESSOR_NAME).inner_text()
        professor_name = page.locator(PROFESSOR_NAME).inner_text()
        professor_name = page.locator(PROFESSOR_NAME).inner_text()
        professor_name = page.locator(PROFESSOR_NAME).inner_text()
        professor_name = page.locator(PROFESSOR_NAME).inner_text()


def bluebook(playwright: Playwright):
    chromium = playwright.chromium
    browser = chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://bluebook.utsa.edu/")

    click_faculty(page)
    search_faculty(page, "Heaps, John")
    time.sleep(2)
    get_professor_info(page)
    click_next_button(page)
    time.sleep(5)
    browser.close()


with sync_playwright() as playwright:
    bluebook(playwright)
