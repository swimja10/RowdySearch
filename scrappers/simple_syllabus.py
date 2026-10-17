import requests
import math
import json
import time


def write_to_json(
    professor_id, cnr, section, professor_name, course_name, term, syllabus_code
):

    with open("simple_syllabus_data.json", "r") as f:
        data = json.load(f)

    if professor_id not in data:
        data[professor_id] = {"name": professor_name, "courses": {}}

    courses = data[professor_id]["courses"]

    if cnr not in courses:
        courses[cnr] = {"title": course_name, "sections": []}

    sections = courses[cnr]["sections"]

    new_section = {"term": term, "section": section, "syllabus_code": syllabus_code}

    if new_section not in sections:
        sections.append(new_section)

    with open("simple_syllabus_data.json", "w") as f:
        json.dump(data, f, indent=4)


def get_course_info(data):

    for item in data["items"]:
        title = item["title"].split()
        if len(title) < 3:
            print(f"Skipped odd title: {item['title']}")
            continue

        cnr = f"{title[0]} {title[1]}"
        section = title[2]
        course_name = item["sub_title"]
        term = item["term_name"]
        syllabus_code = item["code"]

        for editor in item["editors"]:
            professor_id = editor["entity_id"]
            professor_name = editor["full_name"]
            write_to_json(
                professor_id,
                cnr,
                section,
                professor_name,
                course_name,
                term,
                syllabus_code,
            )


def collect_data(status):

    page = 0
    end = 1

    while page < end:
        time.sleep(0.5)

        response = requests.get(
            f"https://utsa.simplesyllabus.com/api2/doc-library-search?page={page}&term_statuses%5B%5D={status}"
        )
        data = response.json()

        total = data["pagination"]["total"]
        page_size = data["pagination"]["page_size"]
        end = math.ceil(total / page_size)

        get_course_info(data)
        print(f"{status} page {page} of {end}")
        page += 1


def simple_syllabus():

    with open("simple_syllabus_data.json", "w") as f:
        json.dump({}, f)

    collect_data("current")
    collect_data("historic")


simple_syllabus()
