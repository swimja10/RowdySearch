import time
from pathlib import Path
import pandas as pd
from data_collectors.common_format import save, term_key
import warnings

GRADE_DIR = Path(__file__).resolve().parent.parent / "grade_data"

GRADES = {
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
    "W",
    "IN",
    "IW",
    "IF",
}

warnings.filterwarnings(
    "ignore",
    message="Workbook contains no default style",
    category=UserWarning,
    module="openpyxl",
)


def term_from_path(file_path):
    return " ".join(file_path.stem.split("_")[-2:])


def add_section(professors, professor_name, course_id, title, section_info):
    courses = professors.setdefault(professor_name, {"courses": {}})["courses"]
    course = courses.setdefault(course_id, {"title": title, "sections": []})
    course["title"] = title
    course["sections"].append(section_info)


def process_info(df, term, professors):
    course_id = section = title = professor_name = None
    grades = {}

    for label, value, name, professor in df.itertuples(index=False, name=None):
        if label == "SUB/CRS":
            course_id = value
        elif label == "SEC":
            section = value
        elif label == "CRN":
            title = name
            professor_name = professor
            grades = {}
        elif label == "TOTALS by Subj/Crse":
            if not isinstance(professor_name, str):
                continue
            section_info = {
                "term": term,
                "section": section,
                "totalStudents": int(value),
                "grades": grades,
            }
            add_section(professors, professor_name, course_id, title, section_info)
        elif label in GRADES:
            grades[label] = int(value)


def grade_distribution():
    professors = {}

    files = sorted(
        GRADE_DIR.glob("Grade_Distribution_*.csv"),
        key=lambda path: term_key(term_from_path(path)),
    )
    if not files:
        raise FileNotFoundError(f"No grade files found in {GRADE_DIR}")

    for file_path in files:
        df = pd.read_excel(
            file_path, header=None, engine="openpyxl", usecols=[0, 1, 2, 3]
        )
        term = term_from_path(file_path)
        process_info(df, term, professors)
        print(f"Term: {term} is completed!")

    save(professors, "grade_distribution_data.json")


if __name__ == "__main__":
    start = time.perf_counter()
    grade_distribution()
    print(f"Took {time.perf_counter() - start:.1f}s")
