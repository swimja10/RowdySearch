# RowdySearch

A Chrome extension that cuts UTSA professor research from ten minutes to one click.

- **Schedule Planner:** a **RowdySearch** column after "Parts of Term" shows every section's
  professor rating, their median grade in that class, and when they last taught it.
  Click a cell to open the full details.
- **Toolbar icon:** click the RowdySearch icon on any website to open the sidebar.
- **Lookup tab:** an orange tab on the right edge of Schedule Planner and Register for
  Classes opens the same sidebar.

In the sidebar, type a search and press **Enter**:

| You type | Enter opens |
| --- | --- |
| `Sean Beatty` | His professor page: RMP stats, reviews, median grade across every class |
| `Beatty MAT 1213` | His MAT 1213 page: median grade, latest syllabus, every semester |
| `linear algebra` or `MAT 1213` | The course page: every professor who teaches it, side by side |

Every search goes through `src/searcher.ts`.

## Build and load it

```bash
npm install
npm run build
```

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and pick the `dist` folder.
3. Pin RowdySearch from the puzzle-piece menu so its icon stays in the toolbar.

After changing code, run `npm run build` again and press the reload button on the
extension's card in `chrome://extensions`. Reload any open Schedule Planner tabs too.

## Work on the sidebar

`npm run dev` opens the sidebar as a normal web page, so you can work on it with hot reload.
The column and the Lookup tab only appear once the extension is loaded in Chrome.

## Try the searcher in the terminal

```bash
node searcher.ts "Darrn Meritz WRC"
```

## How it fits together

| File | What it does |
| --- | --- |
| `public/manifest.json` | Tells Chrome about the icon, the side panel, and which sites to run on |
| `src/background.ts` | Opens the side panel from the toolbar icon, answers the Schedule Planner column |
| `src/content/` | Runs on the registration sites: the RowdySearch column and the Lookup tab |
| `index.html`, `src/main.tsx`, `src/App.tsx` | The sidebar (React + Tailwind) |
| `src/context/` | Which page the sidebar is on, plus the Back history |
| `src/components/` | The search, professor, class, and course pages and their pieces |
| `src/searcher.ts` | Finds professors and courses, even with typos |
| `src/utils/` | Reads the JSON, groups classes into courses, works out median grades |

## Updating the data

1. Run the scrapers in `scrappers/` to get new `professors.json` and `RMP.json`.
2. Run `python3 combine_data.py` to rebuild `data/cleaned_grade_data.json`.
3. Run `npm run build` and reload the extension.
