<p align="center">
  <img src="public/icons/icon-128.png" alt="RowdySearch logo" width="128" height="128">
</p>

<img width="1280" height="800" alt="r2" src="https://github.com/user-attachments/assets/e85ce7fa-e019-4b11-ae3b-d87b2c6b74e3" /> <img width="403" height="488" alt="r3" src="https://github.com/user-attachments/assets/518d1b1d-fb6c-4091-b673-d9ec74ab6d75" />



# RowdySearch

**Pick the right UTSA professor in one click.** RowdySearch is a Chrome extension that puts grade distributions, Rate My Professors ratings, and the latest syllabus next to every class while you register.

Built by Jacob Swim and Angelina Lu.

## Try it

No building needed. The built extension is already in `dist/`.

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this folder (the one with `manifest.json` in it).
4. Pin RowdySearch from the puzzle-piece menu so its icon stays in the toolbar.
5. Open Schedule Planner and click any **Search** button, or click the toolbar icon on any site.

## Inspiration

Joining a class is like getting into a relationship. You are going to be with that professor for months, and the last thing you want is to be stuck with one you hate. So before registering, you look them up on Rate My Professors, then on Simple Syllabus, then you go hunting for grade data.

It is boring, tedious work, and it takes about 10 minutes per professor. RowdySearch turns those 10 minutes into one click. It also adds the piece that matters most and is hardest to find: real grade distribution data, so you are judging a professor on what students actually earned instead of on a handful of reviews.

## What it does

| Feature | What you get |
| --- | --- |
| **Search buttons** | A **RowdySearch** column gives every class a **Search** button that opens that professor's class: median grade, Rate My Professors rating, and the latest syllabus. It appears in Schedule Planner's section tables and Shopping Cart, and in the Summary table of Banner's Register for Classes. |
| **Sidebar anywhere** | Click the toolbar icon, or the orange Lookup tab on the right edge of the page, to open or close the sidebar on any website. (It can't open on Chrome's own `chrome://` pages.) |
| **Analytical Mode** | The orange Venn diagram in the sidebar's top right corner opens a full screen view for comparing up to 8 professors, whole courses, or one professor's class. It starts out comparing whatever page you opened it from. |

Analytical Mode shows four things side by side:

| View | Details |
| --- | --- |
| Grade distribution chart | F to A+, as percent or students, lines or bars, each grade or "at or above" |
| Median Grade chart | Every subject you are comparing on one chart |
| Comparison table | Average GPA, % above or below the course average, A's, D/F, withdrawals, RMP |
| Reviews | Everyone's RMP reviews in one place |

### Searching

In the sidebar or in Analytical Mode, type a search and press **Enter**:

| You type | Enter opens |
| --- | --- |
| `Sean Beatty` | His professor page: RMP stats, reviews, median grade across every class |
| `Beatty MAT 1213` | His MAT 1213 page: median grade, latest syllabus, every semester |
| `linear algebra` or `MAT 1213` | The course page: every professor who teaches it, side by side |

## How we built it

| Layer | Tools |
| --- | --- |
| Extension | Chrome extension APIs (Manifest V3) |
| Sidebar UI | React, TypeScript, Tailwind CSS, Vite |
| Charts and motion | Plotly.js, anime.js |
| Search | Our own typo-tolerant search engine (`src/searcher.ts`) |
| Grade data | Official UTSA grade distributions, obtained straight from the university through a public records request |
| Syllabi and reviews | Simple Syllabus and Rate My Professors, gathered with the scrapers in `scrappers/` |
| Data pipeline | Python (`combine_data.py`) merges all three sources into one file |

### Where the grade data comes from

The grade data is not scraped. We filed a public records request with UTSA under the Texas Public Information Act (Texas Government Code, Chapter 552), and the university sent us the grade distributions directly. That means every median, chart, and comparison in RowdySearch is built on the school's own official records.

## Challenges we ran into

We started with Fuse.js for search and hit two problems: it was slow on our data, and it struggled when a professor's name had changed. Life happens, and people change their names or surnames. So we built our own search engine, one that tolerates a whole wrong word in a query and is faster than Fuse.js on this data set.

The approach is a process of elimination that runs the cheapest checks first.

1. **Index ahead of time.** We build an index of every unique word in the data set and which professor-course entries contain it.
2. **Split the query.** At search time the query becomes a set of unique words, each compared against the index.
3. **Exact matches pass immediately.**
4. **Everything else gets a typo budget** based on word length: none for short words and course numbers, one for medium words, two for long ones.
5. **Reject on length first.** If two words differ in length by more than the budget, the pair is thrown out with no further work. "smth" and "hi" are rejected on length alone.
6. **Edit distance only for the survivors.** "smth" and "smith" pass with a distance of 1.
7. **Allow one missing word.** An entry stays in the results if it matches all but one of the query words, which is how a professor is still found after a surname change.
8. **Rank by similarity.** Each query word scores $1 - \frac{\text{edit distance}}{\max(\text{len}_1, \text{len}_2)}$, and the entry's score is the average across the query words.

Worked example: "smth" against "smith" scores $1 - \frac{1}{5} = 0.8$. If the other query word matches exactly, it scores $1$, and the entry's score is $\frac{0.8 + 1}{2} = 0.9$. The highest scores are shown first.

## Accomplishments that we're proud of

The search engine is the piece we are proudest of technically: a homemade algorithm that beat a well-known library on our own data.

The accomplishment most students will care about is the grade data. You don't just see a professor's median grade; you see how it compares to other professors and to the course as a whole. That answers the question every student actually has: is this professor hard, or is the course hard? We believe RowdySearch is something every UTSA student should be using at registration time.

## What we learned

| Lesson | Where it came from |
| --- | --- |
| Presenting data clearly in Plotly | The grade distribution and Median Grade charts |
| Balancing complexity and simplicity | Deciding what belongs in Analytical Mode and what doesn't |
| Deploying web scrapers to gather data | The Simple Syllabus and RMP scrapers |
| Public data is there if you ask for it | Getting official grade distributions from UTSA through a public records request |
| A homemade algorithm can beat a library | Replacing Fuse.js with our own search |

## What's next for RowdySearch

AI integration: upload your transcript, and RowdySearch recommends which courses to take next based on your degree plan, with the best professor for each.

---

## For developers

### Working on the code

```bash
npm install
npm run build
```

`npm run build` updates `dist/`. **Commit `dist/` along with your code changes**, since that's what everyone else's Chrome runs. Then press the reload button on the extension's card in `chrome://extensions`, and reload any open Schedule Planner tabs.

`npm run dev` opens the sidebar as a normal web page with hot reload. The Schedule Planner column and the Lookup tab only appear once the extension is loaded in Chrome.

Try the searcher in the terminal:

```bash
node searcher.ts "Darrn Meritz WRC"
```

Running a `.ts` file directly with `node` needs Node.js 22.18 or newer. On Node 22.6 through 22.17, add the flag: `node --experimental-strip-types searcher.ts "Darrn Meritz WRC"`.

### Updating the data

1. Run the scrapers in `scrappers/` to get new `professors.json` and `RMP.json`.
2. For new semesters of grades, file a new public records request with UTSA (through the online portal on [utsa.edu/openrecords](https://www.utsa.edu/openrecords/), by email to PublicInfo@utsa.edu, or by mail to the Office of Legal Affairs) and update `data/grade_data.json` with what they send.
3. Run `python3 combine_data.py` to rebuild `data/cleaned_grade_data.json`.
4. Reload the extension. (No build needed: the sidebar reads the data file directly.)

### How it fits together

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

### Repo structure

<details>
<summary>Full file tree</summary>

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

</details>
