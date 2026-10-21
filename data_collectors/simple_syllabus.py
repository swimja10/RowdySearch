import math
import time
from concurrent.futures import ThreadPoolExecutor

import requests

from data_collectors.common_format import save

URL = "https://utsa.simplesyllabus.com/api2/doc-library-search"


def get_page(status, page, attempts=5):
    for attempt in range(1, attempts + 1):
        try:
            response = requests.get(
                URL,
                params={"page": page, "term_statuses[]": status},
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as error:
            if attempt == attempts:
                raise
            wait = 2**attempt
            print(
                f"{status} page {page + 1} failed ({type(error).__name__}), retrying in {wait}s"
            )
            time.sleep(wait)


def add_section(data, professor_id, professor_name, course_id, title, section_info):
    professor = data.setdefault(professor_id, {"name": professor_name, "courses": {}})
    course = professor["courses"].setdefault(
        course_id, {"title": title, "sections": []}
    )
    if section_info not in course["sections"]:
        course["sections"].append(section_info)


def get_course_info(api_page, data):
    for item in api_page["items"]:
        title = item["title"].split()
        if len(title) < 3:
            print(f"Skipped odd title: {item['title']}")
            continue

        course_id = f"{title[0]} {title[1]}"
        section_info = {
            "term": item["term_name"],
            "section": title[2],
            "syllabusCode": item["code"],
        }

        for editor in item["editors"]:
            add_section(
                data,
                editor["entity_id"],
                editor["full_name"],
                course_id,
                item["sub_title"],
                section_info,
            )


def collect_data(status, data, workers=4):
    first = get_page(status, 0)
    pagination = first["pagination"]
    pages = math.ceil(pagination["total"] / pagination["page_size"])
    get_course_info(first, data)
    print(f"{status} page 1 of {pages}")

    with ThreadPoolExecutor(max_workers=workers) as pool:
        results = pool.map(lambda page: get_page(status, page), range(1, pages))
        for page, api_page in enumerate(results, start=2):
            get_course_info(api_page, data)
            
            if page % 50 == 0 or page == pages:
                print(f"{status} page {page} of {pages}")


def simple_syllabus():
    data = {}
    start = time.perf_counter()

    collect_data("current", data)
    collect_data("historic", data)

    save(data, "simple_syllabus_data.json")
    print("Simple syllabus is done!")
    print(f"Took {time.perf_counter() - start:.1f}s\n")


if __name__ == "__main__":
    simple_syllabus()
