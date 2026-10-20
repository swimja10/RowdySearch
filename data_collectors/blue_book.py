from playwright.sync_api import sync_playwright, Playwright, Page
import time

FACULTY_BOX = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_FacultyTitleTxtBox"
SEARCH_BTN = "#ctl00_MainContentSearchQuery_searchCriteriaEntry_SearchBtn"
NEXT_BTN = 


def click_faculty(page: Page):
    page.get_by_role("radio", name="Faculty").click()


def search_faculty(page: Page, name: str):
    page.locator(FACULTY_BOX).fill(name)
    page.keyboard.press("Enter")
    page.wait_for_load_state("load")


def run(playwright: Playwright):
    chromium = playwright.chromium
    browser = chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://bluebook.utsa.edu/")

    click_faculty(page)
    search_faculty(page, "Heaps, John")
    search_faculty(page, "Fatma, Arlsan")
    time.sleep(5)
    # other actions...
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
