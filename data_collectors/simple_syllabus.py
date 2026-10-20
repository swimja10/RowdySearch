import requests
import math
import json
import time
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw_data"
RAW_DIR.mkdir(parents=True, exist_ok=True)


def write_to_json(
    data,
    professor_id,
    course_ID,
    section,
    professor_name,
    course_name,
    term,
    syllabus_code,
):

    if professor_id not in data:
        data[professor_id] = {"name": professor_name, "courses": {}}

    courses = data[professor_id]["courses"]

    if course_ID not in courses:
        courses[course_ID] = {"title": course_name, "sections": []}

    sections = courses[course_ID]["sections"]

    new_section = {"term": term, "section": section, "syllabus_code": syllabus_code}

    if new_section not in sections:
        sections.append(new_section)


def get_course_info(api_page, data):

    for item in api_page["items"]:
        title = item["title"].split()
        if len(title) < 3:
            print(f"Skipped odd title: {item['title']}")
            continue

        course_ID = f"{title[0]} {title[1]}"
        section = title[2]
        course_name = item["sub_title"]
        term = item["term_name"]
        syllabus_code = item["code"]

        for editor in item["editors"]:
            professor_id = editor["entity_id"]
            professor_name = editor["full_name"]

            write_to_json(
                data,
                professor_id,
                course_ID,
                section,
                professor_name,
                course_name,
                term,
                syllabus_code,
            )


def collect_data(status, data):

    page = 0
    end = 1

    while page < end:
        time.sleep(0.5)

        response = requests.get(
            f"https://utsa.simplesyllabus.com/api2/doc-library-search?page={page}&term_statuses%5B%5D={status}"
        )
        api_page = response.json()

        total = api_page["pagination"]["total"]
        page_size = api_page["pagination"]["page_size"]
        end = math.ceil(total / page_size)

        get_course_info(api_page, data)
        print(f"{status} page {page} of {end}")
        page += 1


def save(data, path):
    with open(RAW_DIR / path, "w") as f:
        json.dump(data, f, indent=4)


def simple_syllabus():
    data = {}

    collect_data("current", data)
    collect_data("historic", data)
    save(data, "simple_syllabus_data.json")


if __name__ == "__main__":
    simple_syllabus()
