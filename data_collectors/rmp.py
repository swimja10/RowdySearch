import time

import requests

from data_collectors.common_format import save

URL = "https://www.ratemyprofessors.com/graphql"
UTSA_ID = "U2Nob29sLTE1MTY="

QUERY = """
query TeacherSearchPaginationQuery($count: Int!, $cursor: String, $query: TeacherSearchQuery!) {
  search: newSearch {
    teachers(query: $query, first: $count, after: $cursor) {
      edges {
        node {
          id
          firstName
          lastName
          department
          avgRating
          avgDifficulty
          wouldTakeAgainPercent
          ratings(first: 5) {
            edges {
              node {
                class
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

SESSION = requests.Session()
SESSION.headers.update(
    {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36",
    }
)


def fetch_page(cursor, count):
    body = {
        "query": QUERY,
        "variables": {
            "count": count,
            "cursor": cursor,
            "query": {"text": "", "schoolID": UTSA_ID, "fallback": True},
        },
    }
    response = SESSION.post(URL, json=body, timeout=30)
    response.raise_for_status()
    return response.json()["data"]["search"]["teachers"]


def create_professor(data):
    reviews = []
    for edge in data["ratings"]["edges"]:
        node = edge["node"]
        comment = (node["comment"] or "").strip()
        if comment:
            reviews.append({"course": node["class"], "comment": comment})

    rating = data["avgRating"]
    difficulty = data["avgDifficulty"]
    take_again = data["wouldTakeAgainPercent"]

    if rating == 0 and difficulty == 0 and take_again == -1 and not reviews:
        return None

    return {
        "name": f"{data['firstName']} {data['lastName']}",
        "department": data["department"],
        "avgRating": None if rating == 0 else rating,
        "avgDifficulty": None if difficulty == 0 else difficulty,
        "wouldTakeAgainPercent": None if take_again == -1 else take_again,
        "recentReviews": reviews,
    }


def collect_professors(count=50, delay=0.2):
    professors = {}
    cursor = ""
    has_next_page = True

    while has_next_page:
        time.sleep(delay)
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


def rmp():
    start = time.perf_counter()
    save(collect_professors(), "rmp_data.json")
    print(f"Took {time.perf_counter() - start:.1f}s")


if __name__ == "__main__":
    rmp()
