import json
from pathlib import Path

RAW_DIR = Path(__file__).resolve().parents[2] / "data" / "raw_data"
RAW_DIR.mkdir(parents=True, exist_ok=True)

SEASON_ORDER = {"Spring": 0, "Summer": 1, "Fall": 2}


def term_key(term: str) -> tuple[int, int]:
    season, year = term.split()
    return int(year), SEASON_ORDER[season]


def save(data: dict, filename: str | Path) -> None:
    with open(RAW_DIR / filename, "w") as f:
        json.dump(data, f, indent=4)
