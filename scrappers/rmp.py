import json
import time
import requests

from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
URL = "https://www.ratemyprofessors.com/graphql"
UTSA_ID = "U2Nob29sLTE1MTY="

QUERY = """
query TeacherSearchPaginationQuery($count: Int!, $cursor: String, $query: TeacherSearchQuery!) {
  search: newSearch {
    teachers(query: $query, first: $count, after: $cursor) {
      edges {
        node {
          id
          legacyId
          firstName
          lastName
          department
          avgRating
          avgDifficulty
          numRatings
          wouldTakeAgainPercent
          ratings(first: 5) {
            edges {
              node {
                comment
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      resultCount
    }
  }
}
"""

HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36",
}


def fetch_page(cursor, count):
    body = {
        "query": QUERY,
        "variables": {
            "count": count,
            "cursor": cursor,
            "query": {"text": "", "schoolID": UTSA_ID, "fallback": True},
        },
    }
    response = requests.post(URL, json=body, headers=HEADERS)
    response.raise_for_status()
    return response.json()["data"]["search"]["teachers"]


def collect_professors(count=50):
    professors = {}
    cursor = ""
    has_next_page = True

    while has_next_page:
        time.sleep(0.5)
        teachers = fetch_page(cursor, count)

        for edge in teachers["edges"]:
            node = edge["node"]
            professor = create_professor(node)
            if professor is not None:
                professors[node["id"]] = professor

        cursor = teachers["pageInfo"]["endCursor"]
        has_next_page = teachers["pageInfo"]["hasNextPage"]

        print(f"{len(professors)} of {teachers['resultCount']}")

    return professors


def create_professor(data):

    reviews = [edge["node"]["comment"] for edge in data["ratings"]["edges"]]
    rating = data["avgRating"]
    difficulty = data["avgDifficulty"]
    take_again = data["wouldTakeAgainPercent"]

    if rating == 0 and difficulty == 0 and take_again == -1 and not reviews:
        return None

    if take_again == -1:
        take_again = None

    if rating == 0:
        rating = None

    if difficulty == 0:
        difficulty = None

    return {
        "name": f"{data['firstName']} {data['lastName']}",
        "department": data["department"],
        "avgRating": rating,
        "avgDifficulty": difficulty,
        "wouldTakeAgainPercent": take_again,
        "recentReviews": reviews,
    }


def save(data, path):
    with open(DATA_DIR / path, "w") as f:
        json.dump(data, f, indent=4)


def rmp():

    professors = collect_professors(50)

    save(professors, "rmp_data.json")


if __name__ == "__main__":
    rmp()
