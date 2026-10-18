import json
from pathlib import Path

import pytest

from scrappers.simple_syllabus import get_course_info, save

FIXTURE = Path(__file__).parent / "fixtures" / "simple_syllabus_page0.json"
HAYES = "e0f17f4d-bd9a-4307-9e20-2216797e902a"


@pytest.fixture
def api_page():
    with open(FIXTURE) as f:
        return json.load(f)


def count_sections(data):
    total = 0
    for professor in data.values():
        for course in professor["courses"].values():
            total += len(course["sections"])
    return total


def make_item(code, title, editors):
    return {
        "code": code,
        "title": title,
        "sub_title": "Test Course",
        "term_name": "Fall 2026",
        "editors": [{"entity_id": eid, "full_name": name} for eid, name in editors],
    }


def test_page_produces_expected_totals(api_page):
    data = {}
    get_course_info(api_page, data)

    assert len(data) == 21
    assert count_sections(data) == 50


def test_professor_sections_are_grouped_under_one_id(api_page):
    data = {}
    get_course_info(api_page, data)

    assert data[HAYES]["name"] == "Endia Hayes"
    assert set(data[HAYES]["courses"]) == {"AAS 2013", "AAS 4103"}


def test_section_is_stored_with_term_section_and_code(api_page):
    data = {}
    get_course_info(api_page, data)
    course = data[HAYES]["courses"]["AAS 2013"]
    assert course["title"] == "Introduction to African American Studies"

    item = {
        "term": "Fall 2026",
        "section": "003",
        "syllabus_code": "3u2jp5ex9",
    }

    assert item in course["sections"]


def test_running_same_page_twice_adds_no_duplicates(api_page):
    data = {}
    get_course_info(api_page, data)
    get_course_info(api_page, data)
    assert count_sections(data) == 50


def test_co_taught_section_appears_under_each_professor():
    data = {}
    item = make_item(
        "abc123xyz", "CS 1083 001", [("prof-a", "Ann A"), ("prof-b", "Bob B")]
    )
    get_course_info({"items": [item]}, data)
    for pid in ("prof-a", "prof-b"):
        codes = [
            s["syllabus_code"] for s in data[pid]["courses"]["CS 1083"]["sections"]
        ]
        assert "abc123xyz" in codes


def test_save_writes_data_as_json(tmp_path):
    data = {"prof-a": {"name": "Ann A", "courses": {}}}
    path = tmp_path / "out.json"
    save(data, path)
    with open(path) as f:
        assert json.load(f) == data
