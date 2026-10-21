import json
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw_data"
RAW_DIR.mkdir(parents=True, exist_ok=True)

SEASON_ORDER = {"Spring": 0, "Summer": 1, "Fall": 2}


def term_key(term):
    season, year = term.split()
    return int(year), SEASON_ORDER[season]


def save(data, filename):
    with open(RAW_DIR / filename, "w") as f:
        json.dump(data, f, indent=4)
