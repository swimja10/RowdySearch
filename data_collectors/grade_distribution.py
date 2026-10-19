import pandas as pd
import glob
from pathlib import Path
import json

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw_data"
RAW_DIR.mkdir(parents=True, exist_ok=True)
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


def add_section(professors, professor_name, cnr, section_info):
    if professor_name not in professors:
        professors[professor_name] = {"courses": {}}

    courses = professors[professor_name]["courses"]

    if cnr not in courses:
        courses[cnr] = {"sections": []}

    courses[cnr]["sections"].append(section_info)


def process_info(df, term, professors):
    course_name = None
    cnr = None
    section = None
    professor_name = None
    grades = {}

    for _, row in df.iterrows():
        label = row[0]

        if label == "SUB/CRS":
            cnr = row[1]
        elif label == "SEC":
            section = row[1]
        elif label == "CRN":
            course_name = row[2]
            professor_name = row[3]
            grades = {}
        elif label == "TOTALS by Subj/Crse":
            if not isinstance(professor_name, str):
                continue
            section_info = {
                "term": term,
                "section": section,
                "course_name": course_name,
                "total_students": int(row[1]),
                "grades": grades,
            }
            add_section(professors, professor_name, cnr, section_info)
        elif label in GRADES:
            grades[label] = int(row[1])


def grade_distribution():
    professors = {}

    files = sorted(GRADE_DIR.glob("Grade_Distribution_*.csv"))
    if not files:
        raise FileNotFoundError(f"No grade files found in {GRADE_DIR}")

    for file_path in files:
        df = pd.read_excel(
            file_path,
            header=None,
            engine="openpyxl",
            sheet_name="Sheet1",
            usecols=[0, 1, 2, 3],
        )
        term = " ".join(file_path.stem.split("_")[-2:])

        process_info(df, term, professors)

        print(f"Term: {term} is completed!")

    save(professors, "grade_distribution_data.json")


def save(data, path):
    with open(RAW_DIR / path, "w") as f:
        json.dump(data, f, indent=4)


if __name__ == "__main__":
    grade_distribution()
