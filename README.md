<p align="center">
  <img src="public/icons/icon-128.png" alt="RowdySearch logo" width="128" height="128">
</p>

<h1 align="center">RowdySearch</h1>

<p align="center">A Chrome extension that cuts UTSA professor research from ten minutes to one click.</p>

## Install

No building needed. The built extension is already in `dist/`.

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this folder (the one with `manifest.json` in it).
4. Pin RowdySearch from the puzzle-piece menu so its icon stays in the toolbar.


## Inspiration

Joining a class is like getting into a relationship. You are going to be with them for months, and whether those months will be good or bad is up to you and the professor. So, the last thing you want is to be stuck with a professor that you hate. That is why you go on and do research on the professor by looking them up on Rate My Professors and then Simple Syllabus. 

It is all very boring and tedious work. It takes me like 10 minutes to do one professor! This problem caused me to create Rowdy Search. Rowdy Search turns a 10-minute process into milliseconds! It is as simple as clicking a button. Also, the most important thing Rowdy Search has is grade distribution data. So now you have real grade data to make judgements on the professor you choose.

## What it does

- **Search buttons:** a **RowdySearch** column gives every class a **Search** button that opens
  that professor's class: median grade, Rate My Professors rating, and the last syllabus.
  It's added to Schedule Planner's section tables and Shopping Cart, and to the Summary
  table in Banner's Register for Classes.
- **Toolbar icon:** click the RowdySearch icon to open or close the sidebar on any website.
  It's the same sidebar everywhere (it just can't open on Chrome's own `chrome://` pages).
- **Lookup tab:** an orange tab on the right edge of the page also opens and closes it.
- **Analytical Mode:** the orange Venn diagram in the sidebar's top right corner opens a full
  screen view for comparing up to 8 professors, whole courses, or one professor's class:
  a grade distribution chart (F to A+, as percent or students, lines or bars, each grade or
  "at or above"), a Median Grade chart, a side-by-side table (average GPA, % above or below
  the course average, A's, D/F, withdrawals, RMP), and everyone's RMP reviews.
  It starts out comparing whatever page you opened it from.

In the sidebar or in Analytical Mode, type a search and press **Enter**:

| You type | Enter opens |
| --- | --- |
| `Sean Beatty` | His professor page: RMP stats, reviews, median grade across every class |
| `Beatty MAT 1213` | His MAT 1213 page: median grade, latest syllabus, every semester |
| `linear algebra` or `MAT 1213` | The course page: every professor who teaches it, side by side |

## How we built it

**Built with:** React, TypeScript, Tailwind CSS, Vite, Plotly.js, anime.js, and Chrome's
extension APIs (Manifest V3). The data comes from UTSA grade distributions, Simple Syllabus,
and Rate My Professors, gathered with the scrapers in `scrappers/` and combined with Python
(`combine_data.py`).

## Challenges we ran into

_Write the challenges you ran into here._

## Accomplishments that we're proud of

_Write what you're proud of here._

## What we learned

_Write what you learned here._

## What's next for RowdySearch

_Write what's next here._

## Team

_Write your team members here._


## Working on the code

```bash
npm install
npm run build
```

`npm run build` updates `dist/`. **Commit `dist/` along with your code changes**, since
that's what everyone else's Chrome runs. Then press the reload button on the extension's
card in `chrome://extensions`, and reload any open Schedule Planner tabs.

`npm run dev` opens the sidebar as a normal web page with hot reload. The Schedule Planner
column and the Lookup tab only appear once the extension is loaded in Chrome.

Try the searcher in the terminal:

```bash
node searcher.ts "Darrn Meritz WRC"
```

## How it fits together

| File | What it does |
| --- | --- |
| `manifest.json` | Tells Chrome about the icon, its permissions, and which sites get the sidebar on their own |
| `dist/` | The built extension that Chrome runs (made by `npm run build`, committed on purpose). `plotly.js` is the chart library and `libraries.js` is React and the other npm packages; the rest is our code |
| `data/cleaned_grade_data.json` | Every professor's grades, syllabi, and RMP data. The sidebar reads it from here |
| `src/background.ts` | Opens or closes the sidebar on the current page when you click the toolbar icon |
| `src/content/` | Runs on the page: the sidebar and its Lookup tab, and the RowdySearch column (`searchColumn.ts`) with one file per site that reads its table (`schedulePlanner.ts`, `bannerSummary.ts`) |
| `index.html`, `src/main.tsx`, `src/App.tsx` | The sidebar (React + Tailwind) |
| `src/context/` | Which page the sidebar is on, plus the Back history |
| `src/components/` | The search, professor, class, and course pages and their pieces |
| `src/components/analytics/` | Analytical Mode: the full screen panel, its charts (Plotly), table, and picker |
| `src/utils/subjects.ts`, `series.ts`, `statistics.ts` | What Analytical Mode compares, the chart colors, and the math (GPA, percentages) |
| `src/searcher.ts` | Finds professors and courses, even with typos |
| `src/utils/` | Reads the JSON, groups classes into courses, works out median grades |

## Updating the data

1. Run the scrapers in `scrappers/` to get new `professors.json` and `RMP.json`.
2. Run `python3 combine_data.py` to rebuild `data/cleaned_grade_data.json`.
3. Reload the extension. (No build needed: the sidebar reads the data file directly.)

## Repo structure

```
RowdyLookup
├── README.md
├── .gitignore
├── .oxlintrc.json
├── manifest.json
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── searcher.ts
├── combine_data.py
├── data   (grades, syllabi, and RMP data)
│   ├── cleaned_grade_data.json
│   ├── grade_data.json
│   ├── professors.json
│   └── RMP.json
├── dist   (built extension, committed on purpose)
│   ├── background.js
│   ├── content.js
│   ├── index.html
│   ├── libraries.js
│   ├── plotly.js
│   ├── rolldown-runtime.js
│   ├── sidebar.css
│   ├── sidebar.js
│   └── icons
│       ├── icon-128.png
│       ├── icon-16.png
│       ├── icon-32.png
│       └── icon-48.png
├── public
│   └── icons
│       ├── icon-128.png
│       ├── icon-16.png
│       ├── icon-32.png
│       └── icon-48.png
├── scrappers   (browser-console scrapers)
│   ├── rmp_scrapper.js
│   └── simple_syllabus_console.js
└── src
    ├── App.tsx
    ├── background.ts
    ├── index.css
    ├── main.tsx
    ├── page.ts
    ├── plotly-basic.d.ts
    ├── searcher.ts
    ├── components
    │   ├── AnalyticsButton.tsx
    │   ├── Button.tsx
    │   ├── ClassCard.tsx
    │   ├── ClassPage.tsx
    │   ├── CoursePage.tsx
    │   ├── ExternalLink.tsx
    │   ├── GradeBars.tsx
    │   ├── Header.tsx
    │   ├── ProfessorPage.tsx
    │   ├── ProfessorStats.tsx
    │   ├── Reviews.tsx
    │   ├── SearchPage.tsx
    │   ├── Section.tsx
    │   ├── SyllabusLinks.tsx
    │   ├── VennIcon.tsx
    │   └── analytics   (Analytical Mode)
    │       ├── AnalyticsMode.tsx
    │       ├── ComparingList.tsx
    │       ├── ComparisonTable.tsx
    │       ├── GradeDistributionChart.tsx
    │       ├── MedianChart.tsx
    │       ├── PlotlyChart.tsx
    │       ├── ProfessorReviews.tsx
    │       ├── SeriesName.tsx
    │       ├── SubjectPicker.tsx
    │       └── Toggle.tsx
    ├── content   (runs on the web page)
    │   ├── bannerSummary.ts
    │   ├── index.ts
    │   ├── schedulePlanner.ts
    │   ├── searchColumn.ts
    │   └── sidebar.ts
    ├── context
    │   ├── LookupProvider.tsx
    │   └── useLookup.ts
    ├── hooks
    │   └── useGradeData.ts
    └── utils
        ├── courses.ts
        ├── format.ts
        ├── gradeData.ts
        ├── grades.ts
        ├── hostPage.ts
        ├── pageForSearch.ts
        ├── pageForSection.ts
        ├── series.ts
        ├── statistics.ts
        └── subjects.ts
```
