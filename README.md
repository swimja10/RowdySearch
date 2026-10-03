# RowdySearch

A Chrome extension that cuts UTSA professor research from ten minutes to one click.

- **Schedule Planner:** a **RowdySearch** column after "Parts of Term" gives every section a
  **Search** button that opens that professor's class: median grade, Rate My Professors
  rating, and the last syllabus.
- **Toolbar icon:** click the RowdySearch icon on any website to open the sidebar.
- **Lookup tab:** an orange tab on the right edge of Schedule Planner and Register for
  Classes opens the same sidebar.

In the sidebar, type a search and press **Enter**:

| You type | Enter opens |
| --- | --- |
| `Sean Beatty` | His professor page: RMP stats, reviews, median grade across every class |
| `Beatty MAT 1213` | His MAT 1213 page: median grade, latest syllabus, every semester |
| `linear algebra` or `MAT 1213` | The course page: every professor who teaches it, side by side |

## Install

No building needed. The built extension is already in `dist/`.

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and pick this folder (the one with `manifest.json` in it).
4. Pin RowdySearch from the puzzle-piece menu so its icon stays in the toolbar.

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
| `manifest.json` | Tells Chrome about the icon, the side panel, and which sites to run on |
| `dist/` | The built extension that Chrome runs (made by `npm run build`, committed on purpose) |
| `data/cleaned_grade_data.json` | Every professor's grades, syllabi, and RMP data. The sidebar reads it from here |
| `src/background.ts` | Opens the side panel when you click the toolbar icon |
| `src/content/` | Runs on the registration sites: the RowdySearch column and the Lookup tab |
| `index.html`, `src/main.tsx`, `src/App.tsx` | The sidebar (React + Tailwind) |
| `src/context/` | Which page the sidebar is on, plus the Back history |
| `src/components/` | The search, professor, class, and course pages and their pieces |
| `src/searcher.ts` | Finds professors and courses, even with typos |
| `src/utils/` | Reads the JSON, groups classes into courses, works out median grades |

## Updating the data

1. Run the scrapers in `scrappers/` to get new `professors.json` and `RMP.json`.
2. Run `python3 combine_data.py` to rebuild `data/cleaned_grade_data.json`.
3. Reload the extension. (No build needed: the sidebar reads the data file directly.)
