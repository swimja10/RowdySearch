"""Picks the full version of a course's title.

UTSA's grade spreadsheets and Bluebook cut titles off at 30 characters and abbreviate them, so the
same course shows up as "Quantitative Analysis for Acc" in one place and "Quantitative Analysis for
Accountants" on Simple Syllabus. When one title a course has had is a short form of another, the
longer one is used for both.

Only titles of the same course are ever compared, so "Calculus I" can't be taken for a short form
of some other course's "Calculus II".
"""

import re

# Titles are cut off here in the grade spreadsheets and on Bluebook. A trailing space is trimmed,
# so a cut-off title is 29 or 30 characters long.
CUT_OFF_AT = 30

# Words a short title may leave out: "Design Analysis of Algorithms" for "Design and Analysis of Algorithms".
LITTLE_WORDS = {"a", "an", "and", "at", "for", "in", "of", "on", "the", "to", "with"}
ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"]


def words(title):
    """A title's words, in lowercase, with "&" as "and" and roman numerals as numbers."""
    found = re.findall(r"[a-z0-9]+", title.lower().replace("&", " and "))
    return [str(ROMAN_NUMERALS.index(word) + 1) if word in ROMAN_NUMERALS else word for word in found]


def stands_for(short, long):
    """True when one word is a short form of another: its start ("Intro" for "Introduction"), or
    its first letter and some of the rest in order ("Mgmt" for "Management")."""
    if short == long:
        return True
    # A number is never short for another one ("1" isn't "12"), and neither is a single letter.
    if short.isdigit() or long.isdigit() or len(short) < 2:
        return False
    if long.startswith(short):
        return True
    letters = iter(long)
    return len(short) >= 3 and short[0] == long[0] and all(letter in letters for letter in short)


def abbreviates(short_title, long_title, cut_off=False):
    """True when `short_title` is a short form of `long_title`: each of its words stands for a word
    of the long one, in order, and the long one only adds little words. A title that was cut off
    (`cut_off`) may also stop partway through the long one, even in the middle of a word."""
    short, long = words(short_title), words(long_title)
    if len(" ".join(long)) <= len(" ".join(short)):
        return False

    place = 0
    for number, word in enumerate(short):
        # A little word the long title doesn't have at this spot is skipped.
        if word in LITTLE_WORDS and (place == len(long) or long[place] != word):
            continue
        is_last = number == len(short) - 1
        while place < len(long):
            candidate = long[place]
            if stands_for(word, candidate) or (cut_off and is_last and candidate.startswith(word)):
                break
            if candidate not in LITTLE_WORDS:
                return False
            place += 1
        else:
            return False
        place += 1

    return cut_off or all(word in LITTLE_WORDS for word in long[place:])


def may_be_cut_off(title, sources):
    """True when a title is the length a cut-off one would be, and came from a source that cuts them."""
    return len(title.strip()) in (CUT_OFF_AT - 1, CUT_OFF_AT) and (sources["grades"] > 0 or sources["bluebook"] > 0)


def full_titles(titles):
    """For every title one course has had, the title to show instead (often the same one).

    `titles` is {title: Counter of how many sections had it, by source}, where the sources are
    "grades", "bluebook", and "syllabus". Simple Syllabus has the full titles, so its spelling wins.
    """
    def uses(title):
        return sum(titles[title].values())

    def rank(title):
        return (titles[title]["syllabus"] > 0, len(" ".join(words(title))), uses(title), title)

    def is_better(current, other):
        # A list of a cross-listed class's titles ("Title A ; Title B") isn't a title to switch to.
        if ";" in other:
            return False
        if abbreviates(current, other, may_be_cut_off(current, titles[current])):
            return True
        # The same words written another way ("Foundations Of Accounting"): the better-ranked spelling.
        return words(current) == words(other) and rank(other) > rank(current)

    chosen = {}
    for title in titles:
        current, seen = title, {title}
        while True:
            better = [other for other in titles if other not in seen and is_better(current, other)]
            if not better:
                break
            current = max(better, key=rank)
            seen.add(current)
        chosen[title] = current
    return chosen
