# Names that may be two professors

Made by `combine_data.py`. Nothing here is split automatically.

Each name below has at least one sign that it covers two people:

1. They teach in two colleges with no subject or department in common.
2. Bluebook has the name with two different middle names.
3. Simple Syllabus has two instructors with the name.

Most are one person. A professor with a joint appointment teaches in two colleges, and
Simple Syllabus sometimes has the same person twice. Check before splitting anyone.

To split a name, add it to `data/professor_splits.json` and run `combine_data.py` again.
Each person gets the departments whose sections are theirs, spelled as they are here.

41 names, 0 already split.

## Amir Karimi

2 of 3 signs.

- Engineering/Integrated Design: 11 sections in Engineering/Integrated Design, Mech, Aerospace, & Indust Engr, Mechanical Engineering (EGR, ME), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Business: 7 sections in Management Science & Statisti (MS), Fall 2022 to Fall 2024 **(nothing in common with another)**
- Simple Syllabus has 2 instructors: Amir Karimi (id 364d5c35, ME); Amir Karimi (id 5536cb04, MBA, MS)

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Amir Karimi": {
    "Amir Karimi (Management Science & Statisti)": [
      "Management Science & Statisti"
    ],
    "Amir Karimi (Mechanical Engineering)": [
      "Mechanical Engineering",
      "Engineering/Integrated Design",
      "Mech, Aerospace, & Indust Engr"
    ]
  }
}
```

Every department has to go to one of them. Still to place: COB (Admin Unit) (6).

## Jennifer Smith

2 of 3 signs.

- Liberal and Fine Arts: 19 sections in Philosophy & Classics (HUM), Fall 2024 to Spring 2026 **(nothing in common with another)**
- Sciences: 18 sections in Biology, Health, & Environment, Integrative Biology (BIO, ES), Fall 2022 to Spring 2025 **(nothing in common with another)**
- Simple Syllabus has 2 instructors: Jennifer Smith (id 1ed1da2d, FMS, HUM); Jennifer Alison Smith (id bec632df, ENG, ES)

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Jennifer Smith": {
    "Jennifer Smith (Integrative Biology)": [
      "Integrative Biology",
      "Biology, Health, & Environment"
    ],
    "Jennifer Smith (Philosophy & Classics)": [
      "Philosophy & Classics"
    ]
  }
}
```

## Abelardo Ramirez-Hernandez

1 of 3 signs.

- Sciences: 25 sections in Physics & Astronomy (PHY), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 16 sections in Biomedical & Chemical Engr (BME, CME), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Abelardo Ramirez-Hernandez": {
    "Abelardo Ramirez-Hernandez (Biomedical & Chemical Engr)": [
      "Biomedical & Chemical Engr"
    ],
    "Abelardo Ramirez-Hernandez (Physics & Astronomy)": [
      "Physics & Astronomy"
    ]
  }
}
```

## Andres Romero-Sanchez

1 of 3 signs.

- Business: 27 sections in Info Systems & Cybersecurity, Management (MOT), Fall 2023 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 3 sections in Engineering/Integrated Design (EGR), Fall 2025 to Summer 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Andres Romero-Sanchez": {
    "Andres Romero-Sanchez (Info Systems & Cybersecurity)": [
      "Info Systems & Cybersecurity",
      "Management"
    ],
    "Andres Romero-Sanchez (Engineering/Integrated Design)": [
      "Engineering/Integrated Design"
    ]
  }
}
```

## Annette Portillo

1 of 3 signs.

- Liberal and Fine Arts: 26 sections in English, History (AMS, ENG), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Education & Human Development: 20 sections in Bicultural Bilingual Studies, Race/Ethn/Gender/Sexuality Sts (BBL, MAS, WGSS), Fall 2022 to Summer 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Annette Portillo": {
    "Annette Portillo (Race/Ethn/Gender/Sexuality Sts)": [
      "Race/Ethn/Gender/Sexuality Sts",
      "Bicultural Bilingual Studies"
    ],
    "Annette Portillo (English)": [
      "English",
      "History"
    ]
  }
}
```

## Benjamin Anderson

1 of 3 signs.

- Sciences: 18 sections in Computer Science (CS), Fall 2022 to Summer 2025 **(nothing in common with another)**
- Business: 14 sections in Info Systems & Cybersecurity (IS), Fall 2022 to Summer 2025 **(nothing in common with another)**
- AI, Cyber and Computing: 12 sections in Computer Science, Info Systems & Cybersecurity (CS, IS), Fall 2025 to Summer 2026

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Benjamin Anderson": {
    "Benjamin Anderson (Info Systems & Cybersecurity)": [
      "Info Systems & Cybersecurity"
    ],
    "Benjamin Anderson (Computer Science)": [
      "Computer Science"
    ]
  }
}
```

## Caren Albarian

1 of 3 signs.

- Engineering/Integrated Design: 7 sections in Civi/Environ Engr&Constr Mngmt (FM), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Business: 3 sections in Management (MGT), Fall 2022 to Spring 2023 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Caren Albarian": {
    "Caren Albarian (Management)": [
      "Management"
    ],
    "Caren Albarian (Civi/Environ Engr&Constr Mngmt)": [
      "Civi/Environ Engr&Constr Mngmt"
    ]
  }
}
```

## Carlos Montoya Rodriguez

1 of 3 signs.

- Engineering/Integrated Design: 3 sections in Engineering/Integrated Design (EGR), Fall 2023 to Fall 2025
- Simple Syllabus has 2 instructors: Carlos Montoya Rodriguez (id 9643cabe, EGR); Carlos Rodriguez (id 96b1173e, WRC)
- The same first and last name as: Carlos Rodriguez

## Carlos Rodriguez

1 of 3 signs.

- Simple Syllabus has 2 instructors: Carlos Montoya Rodriguez (id 9643cabe, EGR); Carlos Rodriguez (id 96b1173e, WRC)
- The same first and last name as: Carlos Montoya Rodriguez

## Charles Wright

1 of 3 signs.

- Liberal and Fine Arts: 56 sections in Communication (COM), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Business: 4 sections in Management (MGT), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Charles Wright": {
    "Charles Wright (Management)": [
      "Management"
    ],
    "Charles Wright (Communication)": [
      "Communication"
    ]
  }
}
```

## Chia Hsu

1 of 3 signs.

- Health, Community and Policy: 17 sections in Kinesiology (KIN), Fall 2023 to Summer 2026 **(nothing in common with another)**
- Sciences: 3 sections in Biology, Health, & Environment, Molecular Microbio&Immunology (BIO, MMI), Fall 2024 to Fall 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Chia Hsu": {
    "Chia Hsu (Kinesiology)": [
      "Kinesiology"
    ],
    "Chia Hsu (Molecular Microbio&Immunology)": [
      "Molecular Microbio&Immunology",
      "Biology, Health, & Environment"
    ]
  }
}
```

## Claire Walton

1 of 3 signs.

- Sciences: 16 sections in Computer Science, Mathematics (AIM, CS, MAT), Fall 2022 to Fall 2025 **(nothing in common with another)**
- Engineering/Integrated Design: 15 sections in Electrical & Computer Engineer, Electrical Engineering, Engineering/Integrated Design (EE, EGR), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Claire Walton": {
    "Claire Walton (Electrical & Computer Engineer)": [
      "Electrical & Computer Engineer",
      "Electrical Engineering",
      "Engineering/Integrated Design"
    ],
    "Claire Walton (Mathematics)": [
      "Mathematics",
      "Computer Science"
    ]
  }
}
```

## David Senseman

1 of 3 signs.

- Sciences: 21 sections in Biology, Health, & Environment, Integrative Biology (BIO), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Business: 6 sections in Management Science & Statisti (STA), Fall 2022 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "David Senseman": {
    "David Senseman (Management Science & Statisti)": [
      "Management Science & Statisti"
    ],
    "David Senseman (Integrative Biology)": [
      "Integrative Biology",
      "Biology, Health, & Environment"
    ]
  }
}
```

Every department has to go to one of them. Still to place: Statistics & Data Science (2).

## Dhireesha Kudithipudi

1 of 3 signs.

- Engineering/Integrated Design: 11 sections in Electrical & Computer Engineer, Electrical Engineering (CPE, EE), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Sciences: 10 sections in Computer Science (CS), Fall 2022 to Spring 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Dhireesha Kudithipudi": {
    "Dhireesha Kudithipudi (Electrical & Computer Engineer)": [
      "Electrical & Computer Engineer",
      "Electrical Engineering"
    ],
    "Dhireesha Kudithipudi (Computer Science)": [
      "Computer Science"
    ]
  }
}
```

Every department has to go to one of them. Still to place: Computer Engineering (1), Management Science & Statisti (2).

## Elizabeth Reichman

1 of 3 signs.

- Liberal and Fine Arts: 14 sections in History (HIS), Fall 2023 to Spring 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 7 sections in Engineering/Integrated Design (EGR), Fall 2022 to Spring 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Elizabeth Reichman": {
    "Elizabeth Reichman (Engineering/Integrated Design)": [
      "Engineering/Integrated Design"
    ],
    "Elizabeth Reichman (History)": [
      "History"
    ]
  }
}
```

## Elizabeth Sooby

1 of 3 signs.

- Sciences: 61 sections in Physics & Astronomy (PHY), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 9 sections in Mech, Aerospace, & Indust Engr, Mechanical Engineering (ME), Fall 2023 to Summer 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Elizabeth Sooby": {
    "Elizabeth Sooby (Physics & Astronomy)": [
      "Physics & Astronomy"
    ],
    "Elizabeth Sooby (Mech, Aerospace, & Indust Engr)": [
      "Mech, Aerospace, & Indust Engr",
      "Mechanical Engineering"
    ]
  }
}
```

## Itamar Lerner

1 of 3 signs.

- Health, Community and Policy: 25 sections in Psychology (PSY), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Sciences: 3 sections in Neuroscience, Dev & Regen Bio (NDRB), Fall 2025 to Summer 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Itamar Lerner": {
    "Itamar Lerner (Psychology)": [
      "Psychology"
    ],
    "Itamar Lerner (Neuroscience, Dev & Regen Bio)": [
      "Neuroscience, Dev & Regen Bio"
    ]
  }
}
```

## James McDonald

1 of 3 signs.

- Liberal and Fine Arts: 22 sections in Communication (COM), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Business: 4 sections in Management (MGT), Spring 2024 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "James McDonald": {
    "James McDonald (Communication)": [
      "Communication"
    ],
    "James McDonald (Management)": [
      "Management"
    ]
  }
}
```

## Jenny Hsieh

1 of 3 signs.

- Sciences: 23 sections in Biology, Health, & Environment, Integrative Biology, Neuroscience, Dev & Regen Bio (BIO, NDRB), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 15 sections in Biomedical & Chemical Engr (BME), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Jenny Hsieh": {
    "Jenny Hsieh (Neuroscience, Dev & Regen Bio)": [
      "Neuroscience, Dev & Regen Bio",
      "Integrative Biology",
      "Biology, Health, & Environment"
    ],
    "Jenny Hsieh (Biomedical & Chemical Engr)": [
      "Biomedical & Chemical Engr"
    ]
  }
}
```

Every department has to go to one of them. Still to place: Honors College (1).

## Joel Mejia

1 of 3 signs.

- Engineering/Integrated Design: 7 sections in Biomedical & Chemical Engr, Engineering/Integrated Design (EGR), Fall 2022 to Fall 2024 **(nothing in common with another)**
- Education & Human Development: 3 sections in Bicultural Bilingual Studies (BBL), Fall 2023 to Fall 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Joel Mejia": {
    "Joel Mejia (Biomedical & Chemical Engr)": [
      "Biomedical & Chemical Engr",
      "Engineering/Integrated Design"
    ],
    "Joel Mejia (Bicultural Bilingual Studies)": [
      "Bicultural Bilingual Studies"
    ]
  }
}
```

## John Millican

1 of 3 signs.

- Liberal and Fine Arts: 8 sections in Music (MUS), Fall 2022 to Spring 2025 **(nothing in common with another)**
- Education & Human Development: 7 sections in Interdisc Learning & Teaching (CI, EED), Spring 2023 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "John Millican": {
    "John Millican (Music)": [
      "Music"
    ],
    "John Millican (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ]
  }
}
```

## John Murphy

1 of 3 signs.

- Engineering/Integrated Design: 13 sections in Architecture & Planning (ARC, IDE), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Liberal and Fine Arts: 5 sections in History (HIS), Fall 2023 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "John Murphy": {
    "John Murphy (Architecture & Planning)": [
      "Architecture & Planning"
    ],
    "John Murphy (History)": [
      "History"
    ]
  }
}
```

## John Prevost

1 of 3 signs.

- Sciences: 17 sections in Physics & Astronomy (PHY), Fall 2023 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 14 sections in Electrical & Computer Engineer, Electrical Engineering (EE), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "John Prevost": {
    "John Prevost (Electrical & Computer Engineer)": [
      "Electrical & Computer Engineer",
      "Electrical Engineering"
    ],
    "John Prevost (Physics & Astronomy)": [
      "Physics & Astronomy"
    ]
  }
}
```

Every department has to go to one of them. Still to place: University College (1).

## Karina Vielma

1 of 3 signs.

- Engineering/Integrated Design: 10 sections in Biomedical & Chemical Engr, Engineering/Integrated Design (EGR), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Education & Human Development: 5 sections in Interdisc Learning & Teaching (CI, ILT), Fall 2023 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Karina Vielma": {
    "Karina Vielma (Biomedical & Chemical Engr)": [
      "Biomedical & Chemical Engr",
      "Engineering/Integrated Design"
    ],
    "Karina Vielma (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ]
  }
}
```

## Kenny Walker

1 of 3 signs.

- Liberal and Fine Arts: 51 sections in English (ENG), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Sciences: 3 sections in Biology, Health, & Environment, Integrative Biology (ES), Fall 2023 to Fall 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Kenny Walker": {
    "Kenny Walker (English)": [
      "English"
    ],
    "Kenny Walker (Biology, Health, & Environment)": [
      "Biology, Health, & Environment",
      "Integrative Biology"
    ]
  }
}
```

Every department has to go to one of them. Still to place: Educ Leadership & Policy Studi (1), Race/Ethn/Gender/Sexuality Sts (1).

## Langston Clark

1 of 3 signs.

- Education & Human Development: 6 sections in Interdisc Learning & Teaching (CI, ILT), Fall 2024 to Summer 2026 **(nothing in common with another)**
- Health, Community and Policy: 5 sections in Kinesiology (KIN), Fall 2023 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Langston Clark": {
    "Langston Clark (Kinesiology)": [
      "Kinesiology"
    ],
    "Langston Clark (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ]
  }
}
```

## Laura Oliver

1 of 3 signs.

- Liberal and Fine Arts: 24 sections in Communication (COM), Fall 2022 to Summer 2024 **(nothing in common with another)**
- Business: 6 sections in Management (MGT), Fall 2022 to Spring 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Laura Oliver": {
    "Laura Oliver (Management)": [
      "Management"
    ],
    "Laura Oliver (Communication)": [
      "Communication"
    ]
  }
}
```

## Laurie Lewis

1 of 3 signs.

- Liberal and Fine Arts: 18 sections in Communication (COM), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Business: 7 sections in Management (MGT), Fall 2022 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Laurie Lewis": {
    "Laurie Lewis (Management)": [
      "Management"
    ],
    "Laurie Lewis (Communication)": [
      "Communication"
    ]
  }
}
```

## Lesleigh Ring

1 of 3 signs.

- Liberal and Fine Arts: 36 sections in Communication (COM), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Business: 3 sections in Management (MGT), Fall 2022 to Spring 2023 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Lesleigh Ring": {
    "Lesleigh Ring (Management)": [
      "Management"
    ],
    "Lesleigh Ring (Communication)": [
      "Communication"
    ]
  }
}
```

## Marc Perry

1 of 3 signs.

- Education & Human Development: 13 sections in Race/Ethn/Gender/Sexuality Sts (AAS, MAS, WGSS), Fall 2022 to Spring 2025 **(nothing in common with another)**
- Liberal and Fine Arts: 3 sections in Anthropology, Philosophy & Classics (ANT, HUM), Fall 2024 to Spring 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Marc Perry": {
    "Marc Perry (Race/Ethn/Gender/Sexuality Sts)": [
      "Race/Ethn/Gender/Sexuality Sts"
    ],
    "Marc Perry (Philosophy & Classics)": [
      "Philosophy & Classics",
      "Anthropology"
    ]
  }
}
```

## Mario Salas

1 of 3 signs.

- Liberal and Fine Arts: 28 sections in Political Science & Geography (GLA, POL), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Education & Human Development: 16 sections in Race/Ethn/Gender/Sexuality Sts (AAS), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Mario Salas": {
    "Mario Salas (Race/Ethn/Gender/Sexuality Sts)": [
      "Race/Ethn/Gender/Sexuality Sts"
    ],
    "Mario Salas (Political Science & Geography)": [
      "Political Science & Geography"
    ]
  }
}
```

## Matias De Paula

1 of 3 signs.

- Education & Human Development: 14 sections in Bicultural Bilingual Studies (BBL, ESL), Fall 2022 to Fall 2024 **(nothing in common with another)**
- Liberal and Fine Arts: 14 sections in Modern Languages (CSH, SPN), Fall 2022 to Fall 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Matias De Paula": {
    "Matias De Paula (Bicultural Bilingual Studies)": [
      "Bicultural Bilingual Studies"
    ],
    "Matias De Paula (Modern Languages)": [
      "Modern Languages"
    ]
  }
}
```

## Michael Noll

1 of 3 signs.

- Business: 8 sections in Finance (RFD), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 8 sections in Civi/Environ Engr&Constr Mngmt (FM), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Michael Noll": {
    "Michael Noll (Finance)": [
      "Finance"
    ],
    "Michael Noll (Civi/Environ Engr&Constr Mngmt)": [
      "Civi/Environ Engr&Constr Mngmt"
    ]
  }
}
```

## Palden Lama

1 of 3 signs.

- Sciences: 25 sections in Computer Science (CS), Fall 2022 to Summer 2025 **(nothing in common with another)**
- AI, Cyber and Computing: 11 sections in Computer Science, Info Systems & Cybersecurity (CS, IS), Fall 2025 to Summer 2026 **(nothing in common with another)**
- Engineering/Integrated Design: 7 sections in Electrical & Computer Engineer, Electrical Engineering (EE), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Business: 4 sections in Info Systems & Cybersecurity (IS), Fall 2022 to Spring 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Palden Lama": {
    "Palden Lama (Info Systems & Cybersecurity)": [
      "Info Systems & Cybersecurity"
    ],
    "Palden Lama (Computer Science)": [
      "Computer Science"
    ],
    "Palden Lama (Electrical & Computer Engineer)": [
      "Electrical & Computer Engineer",
      "Electrical Engineering"
    ]
  }
}
```

## Paul Hunt

1 of 3 signs.

- Liberal and Fine Arts: 8 sections in Music (MUS), Fall 2025 to Spring 2026 **(nothing in common with another)**
- Education & Human Development: 3 sections in Interdisc Learning & Teaching (CI, EED), Fall 2025 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Paul Hunt": {
    "Paul Hunt (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ],
    "Paul Hunt (Music)": [
      "Music"
    ]
  }
}
```

## Peyman Najafirad

1 of 3 signs.

- Sciences: 29 sections in Computer Science (CS), Fall 2022 to Summer 2025 **(nothing in common with another)**
- AI, Cyber and Computing: 12 sections in Computer Science, Info Systems & Cybersecurity (CS, IS), Fall 2025 to Summer 2026
- Business: 12 sections in Info Systems & Cybersecurity (IS), Fall 2022 to Summer 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Peyman Najafirad": {
    "Peyman Najafirad (Computer Science)": [
      "Computer Science"
    ],
    "Peyman Najafirad (Info Systems & Cybersecurity)": [
      "Info Systems & Cybersecurity"
    ]
  }
}
```

## Ram Krishnan

1 of 3 signs.

- Engineering/Integrated Design: 17 sections in Electrical & Computer Engineer, Electrical Engineering (CPE, EE), Fall 2022 to Fall 2025 **(nothing in common with another)**
- AI, Cyber and Computing: 6 sections in Computer Engineering, Computer Science (CPE, CS), Fall 2025 to Spring 2026
- Sciences: 5 sections in Computer Science (CS), Fall 2024 to Summer 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Ram Krishnan": {
    "Ram Krishnan (Electrical & Computer Engineer)": [
      "Electrical & Computer Engineer",
      "Electrical Engineering"
    ],
    "Ram Krishnan (Computer Science)": [
      "Computer Science"
    ]
  }
}
```

Every department has to go to one of them. Still to place: Computer Engineering (2).

## Sara Valdes Cavazos

1 of 3 signs.

- Health, Community and Policy: 4 sections in Psychology (PSY), Fall 2022 to Summer 2023 **(nothing in common with another)**
- Liberal and Fine Arts: 3 sections in Modern Languages (SPN), Fall 2023 to Fall 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Sara Valdes Cavazos": {
    "Sara Valdes Cavazos (Psychology)": [
      "Psychology"
    ],
    "Sara Valdes Cavazos (Modern Languages)": [
      "Modern Languages"
    ]
  }
}
```

## Sarah Serpas

1 of 3 signs.

- Engineering/Integrated Design: 17 sections in Architecture & Planning (URP), Summer 2023 to Summer 2026 **(nothing in common with another)**
- Health, Community and Policy: 5 sections in Demography, Public Administration, Sociology & Demography (DEM, PAD), Fall 2022 to Fall 2024 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Sarah Serpas": {
    "Sarah Serpas (Sociology & Demography)": [
      "Sociology & Demography",
      "Public Administration",
      "Demography"
    ],
    "Sarah Serpas (Architecture & Planning)": [
      "Architecture & Planning"
    ]
  }
}
```

## Susan Dill

1 of 3 signs.

- Liberal and Fine Arts: 17 sections in Music (MUS), Fall 2022 to Spring 2026 **(nothing in common with another)**
- Education & Human Development: 8 sections in Interdisc Learning & Teaching (CI), Fall 2022 to Spring 2026 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Susan Dill": {
    "Susan Dill (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ],
    "Susan Dill (Music)": [
      "Music"
    ]
  }
}
```

## Uchenna Emenaha

1 of 3 signs.

- Education & Human Development: 14 sections in Interdisc Learning & Teaching (CI, IDS, ILR, ILT), Fall 2022 to Summer 2026 **(nothing in common with another)**
- Sciences: 4 sections in Mathematics (UTE), Fall 2022 to Fall 2025 **(nothing in common with another)**

If these are two people, a starting point for `professor_splits.json`:

```json
{
  "Uchenna Emenaha": {
    "Uchenna Emenaha (Mathematics)": [
      "Mathematics"
    ],
    "Uchenna Emenaha (Interdisc Learning & Teaching)": [
      "Interdisc Learning & Teaching"
    ]
  }
}
```
