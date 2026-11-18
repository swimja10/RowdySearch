"""What the grade spreadsheets call a department, and which of those names really are one."""

# Real units, but everyone from every department teaches in them. They're only a professor's
# department when they teach nowhere else.
SHARED_UNITS = {"University College", "Honors College", "Air Force ROTC", "Army ROTC"}

# The grade spreadsheets cut department names off at 30 characters and abbreviate them.
# These are the ones that need writing out. Check a new one against UTSA's own list.
DEPARTMENT_NAMES = {
    "Biomedical & Chemical Engr": "Biomedical & Chemical Engineering",
    "Civi/Environ Engr&Constr Mngmt": "Civil & Environmental Engineering & Construction Management",
    "Educ Leadership & Policy Studi": "Educational Leadership & Policy Studies",
    "Electrical & Computer Engineer": "Electrical & Computer Engineering",
    "Engagement in Hum & Social Sci": "Engagement in Humanities & Social Sciences",
    "Info Systems & Cybersecurity": "Information Systems & Cybersecurity",
    "Interdisc Learning & Teaching": "Interdisciplinary Learning & Teaching",
    "Management Science & Statisti": "Management Science & Statistics",
    "Mech, Aerospace, & Indust Engr": "Mechanical, Aerospace, & Industrial Engineering",
    "Molecular Microbio&Immunology": "Molecular Microbiology & Immunology",
    "Neuroscience, Dev & Regen Bio": "Neuroscience, Developmental & Regenerative Biology",
    "Race/Ethn/Gender/Sexuality Sts": "Race, Ethnicity, Gender, & Sexuality Studies",
}


def is_department(department):
    """False for what the spreadsheets list where a department would go but isn't one."""
    return bool(department) and department not in ("Other", "Undeclared") and not department.endswith("(Admin Unit)")


def written_out(department):
    """A department's name in full: "Info Systems & Cybersecurity" -> "Information Systems & Cybersecurity"."""
    return DEPARTMENT_NAMES.get(department, department)
