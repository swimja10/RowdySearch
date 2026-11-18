"""How a professor's name is read, written, and matched between the four sources.

The grade spreadsheets write "Vaello, Linda", Bluebook "Vaello, Linda R", and Rate My Professors
and Simple Syllabus "Linda Vaello". They're matched on the first word of the first name and the
last word of the surname.
"""

import unicodedata

TITLES = {"dr", "phd", "edd"}
NAME_SUFFIXES = {"jr", "sr", "ii", "iii", "iv"}  # Only for display not for matching.


def split_name(name):
    words = [
        word for word in name.split() if word.replace(".", "").lower() not in TITLES
    ]
    name = " ".join(words)
    if "," in name:
        last, first = name.split(",", 1)
    else:
        first, _, last = name.partition(" ")
    return first.strip(), last.strip()


def display_name(name):
    first, last = split_name(name)
    return f"{first} {last}"


def match_key(name):
    plain = (
        unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    )
    first, last = split_name(plain)
    surname = [
        word for word in last.split() if word.replace(".", "") not in NAME_SUFFIXES
    ]
    if not first or not surname:
        return None
    return first.split()[0], surname[-1]


def middle_names(name):
    """The words of a first name after the first: "Smith, Jennifer Alison" -> ["Alison"]."""
    first, _ = split_name(name)
    return first.split()[1:]
