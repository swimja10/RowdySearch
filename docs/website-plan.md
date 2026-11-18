# RowdySearch website: build plan

Written 2026-11-17. Status: plan only, nothing built yet.

## Goal

A public site at **rowdysearch.com** that does what the extension does, with no installation, on any device and browser.

It has three jobs:

1. Let anyone look up a UTSA professor, course, or class in milliseconds.
2. Be readable by Google, Bing, and AI assistants, so RowdySearch gets found and recommended.
3. Send people to the Chrome and Firefox extensions.

It is free, has no ads, and has no accounts.

## Decisions already made

| Topic | Decision |
|---|---|
| Framework | Astro, static output. React only where a page needs it. Tailwind for styling. |
| Hosting | Cloudflare Workers, static assets only, on the free plan. Move to Workers Paid ($5/month minimum, 100,000 files) only when the site passes the free limit of 20,000 files. |
| Where the code lives | Inside this repo, in `site/`, sharing the data, search engine, and components. |
| Look | Same as the extension: dark zinc background, orange accents, system fonts. |
| Page kinds | Professor, course, and class (one professor's course) each get their own page. |
| Rate My Professors | Ratings and review text both shown, as in the extension. |
| Small sections | Shown as they are. |
| Analytical Mode | On the site, with a box plot added. The box plot is site only for now. |
| Summary sentence | Each page gets one generated from its numbers. It does not say "since Fall 2022". |
| Course names | The long title wins over the 30-character cut-off one. |
| Same-name professors | Department is kept from the grade spreadsheets and used to find them. Splits are confirmed by hand. |
| Extension page | The site has one, showing what the extension does that the site cannot. |
| Analytics | Cloudflare Web Analytics only. No event tracking. |
| Credit | "Created by Jacob Swim". Contact: rowdysearch@gmail.com. |
| Privacy | The site gets its own policy. The extension's `PRIVACY.md` stays as it is. |
| Skipped | `llms.txt`, comparison of "easiest" sections, monetization. |

## What gets built

### Pages and addresses

Addresses are lowercase, guessable, and permanent. An AI assistant or a person can build one from a course code without searching.

| Page | Address | Count |
|---|---|---|
| Home | `/` | 1 |
| Professor | `/professors/sean-beatty/` | 2,408 |
| Class | `/professors/sean-beatty/mat-1213/` | 12,883 |
| Course | `/courses/mat-1213/` | 4,342 |
| Subject | `/subjects/mat/` | 140 |
| All subjects | `/subjects/` | 1 |
| All professors | `/professors/` | 1 |
| Analytical Mode | `/compare/` | 1 |
| The extension | `/extension/` | 1 |
| What it is | `/about/` | 1 |
| About the data and legal FAQ | `/data/` | 1 |
| Contact | `/contact/` | 1 |
| Privacy | `/privacy/` | 1 |
| Not found | `/404.html` | 1 |

Rules for addresses:

- A professor's address comes from their name: accents removed, lowercase, hyphens.
- A committed file, `site/slugs.json`, records every address ever published. A build never changes an existing address. If a name changes, the old address redirects to the new one through Cloudflare's `_redirects` file.
- If two professors share a name, each gets their department in the address, such as `/professors/jennifer-smith-biology/`.

### File budget

The free plan allows 20,000 files per deployment.

| What | Files |
|---|---|
| Professor, class, and course pages | 19,633 |
| Subject pages and the two lists | 142 |
| Other pages | 8 |
| Stylesheet, scripts, icons, search index | 22 |
| Analytical Mode data, grouped by subject | 48 |
| Analytical Mode page | 1 |
| **Total as built** | **19,855** |

That leaves 145 files of room. The sitemaps in step 6 will use about 5 of them.

- It fits today's data. The next data update will add professors and classes and will very likely pass 20,000.
- Every build prints the file count and fails above 20,000.
- When that happens, either move to Workers Paid, or fold class pages into their professor pages, which brings the site down to about 7,000 files.

### Turning a side panel into a site

The extension is a 420-pixel panel. That is already a phone layout, so the desktop layout is the new work.

- **Phone.** The same single column as the extension, at full width.
- **Desktop.** A header with the logo, the search box, and links to Subjects, Compare, and Extension. Lookup pages use two columns: headline numbers and charts on the left, lists (classes, professors, semesters) on the right, reviews underneath. The professor table on a course page takes the full width.
- **Navigation.** The extension keeps its own Back history in memory. The site uses real links and the browser's Back button.
- **Analytical Mode.** It is already a full-screen layout in the extension, so it carries over nearly as it is.

### What each page shows

Everything below is in the HTML at build time. No page needs JavaScript to be read.

The example sentences show the wording only. Their numbers are placeholders.

**Professor page**

- Name and department.
- Summary sentence. Example: "Sean Beatty has taught 6 courses at UTSA. Across 41 sections and 2,310 students, the median grade was B."
- Headline numbers: median grade, Bluebook instructor rating, Rate My Professors rating, difficulty, would-take-again, withdrawal rate.
- Grade distribution bars, with every percentage also written as text in a table.
- Each course taught, linking to its class page.
- Rate My Professors reviews, with a link to the profile.

**Class page** (one professor's course)

- Summary sentence. Example: "Across 14 sections of MAT 1213, Sean Beatty's median grade was B-. The median for all professors was C+."
- Headline numbers, with the course-wide figure beside each.
- Grade distribution bars and table.
- Every semester: median, Bluebook, students, syllabus links.
- Reviews, this course first.
- Links to the course page and the professor page.

**Course page**

- Code, name, and how many professors have taught it.
- Summary sentence. Example: "MAT 1213 Calculus I has been taught by 20 professors at UTSA. Across 77 sections, the median grade was C+ and 11% of students withdrew."
- Headline numbers for the whole course.
- Grade distribution bars and table.
- A sortable table of every professor: median, average GPA, A rate, D/F rate, withdrawal rate, Bluebook, Rate My Professors, sections, last taught. It is readable without JavaScript. Sorting is the only part that needs it.
- Latest syllabus.

**Subject page**

- Every course in the subject, with its name, median grade, and number of professors.
- Every professor who has taught in the subject.

Subject pages give search engines and AI assistants a path from the home page to every other page by following links.

**Home page**

- The search box, focused on load on desktop.
- One line on what RowdySearch is and where the grade data comes from.
- Site totals: professors, courses, sections, semesters, and the date the data was last updated.
- Links to the Chrome and Firefox extensions.
- Links to browse by subject and by professor.
- The share buttons from the extension's home page. No "leave a review" card.

**Extension page**

- What the extension does that the site cannot: a Search button on every class in Schedule Planner and in Banner's class search and registration tables, and the sidebar that opens on any page.
- **Before and after.** The same registration page without RowdySearch, with its Search column, and with the sidebar open. One set for Schedule Planner and one for Banner's Browse Classes. A switch flips between the three states in place, so the difference is obvious.
- **How much faster.** The steps side by side. Without RowdySearch: look the professor up on Rate My Professors, then on Simple Syllabus, then on Bluebook, and the grade distribution is not available anywhere. With RowdySearch: one click. The headline is "90x faster": about 90 seconds per professor by hand, timed, against about 1 second for the extension's first click, which is its slowest because it also loads the data.
- Install links for Chrome and Firefox.

Screenshot rules:

- Source images are in `Downloads/REGISTRATION PAGES`. The Schedule Planner ones show no personal details. The Banner ones show the signed-in student's name in the header, so the name is covered.
- The saved page sources in that folder contain the signed-in name, student identifiers, and a session token. They are reference only. They are never copied into the repo or published.
- The Banner sidebar example stays as shot, showing a class with a low median grade. The page shows it without comment.

**About, data, contact, privacy**

- `/about/`: what RowdySearch is and who made it.
- `/data/`: where each source comes from, how the numbers are worked out, when the data was last updated, and the legal FAQ (public records request, FERPA, Rate My Professors, how to ask for a correction).
- `/contact/`: Jacob Swim, rowdysearch@gmail.com.
- `/privacy/`: no accounts, no cookies, Cloudflare Web Analytics for page counts, links to other sites.

Every page footer says RowdySearch is not affiliated with or endorsed by UTSA, Rate My Professors, or Simple Syllabus.

### Search

Measured on the current engine with the real data, on a desktop: 7 ms typical, 16 ms for the slowest 5%, 22 ms worst case. Getting ready takes about 420 ms, because the extension loads the whole 11.3 MB file.

The site keeps the same engine and changes how it loads.

- **Slim index.** The build writes a search-only file: names, course codes, every title, last semester taught, and student counts. It is about 104 KB compressed and parses in about 5 ms. The full data file is never loaded for search.
- **When it loads.** After the page has painted, or when the search box is first touched, whichever comes first. The browser caches it afterwards.
- **Where it runs.** In a background thread (a Web Worker), so typing never stutters on a phone.
- **What Enter does.** The same rule as the extension (`pageForSearch`): a name opens the professor page, a name plus a course opens the class page, a course opens the course page.
- **Preloading.** A result's page is fetched when it is hovered or touched, so the click feels instant.
- **Weight.** The search box is written without React, so pages do not load React just to search.

Targets:

| Measure | Target |
|---|---|
| Search, desktop, slowest 5% | under 10 ms |
| Search, mid-range phone, slowest 5% | under 30 ms |
| Search ready after first paint, on 4G | under 300 ms |
| Results drawn per keystroke | top 20 only |

The existing tests in `tests/search.test.ts` run against the slim index too. A search must open the same page on the site as in the extension.

### Analytical Mode

- Lives at `/compare/` as a React page, reusing the components in `src/components/analytics/`.
- What is being compared is stored in the address, so a comparison can be shared as a link.
- It loads only what is being compared. The build cuts the full data by subject into 48 files of about 300 KB each, and the page fetches the ones it needs. Comparing a course and its professors downloads one file.
- Plotly loads on this page only.
- **Box plot.** One box per thing being compared, on the F to A+ scale: lowest grade, first quartile, median, third quartile, highest grade. Withdrawals are left out, as in the median. The Plotly build the extension uses has no box plot, so the site uses a custom build with scatter, bar, and box.

### Page speed

- Pages are plain HTML plus one small stylesheet. No web fonts.
- Charts on professor, class, course, and subject pages are drawn at build time.
- Files with hashed names are cached for a year. HTML is revalidated.
- Long per-semester lists are collapsed, so the largest professor page stays small.

Targets, on a mid-range phone over 4G:

| Measure | Google's "good" | Our target |
|---|---|---|
| Largest content shown (LCP) | 2.5 s | under 1 s |
| Response to a tap (INP) | 200 ms | under 100 ms |
| Layout shift (CLS) | 0.1 | 0 |
| JavaScript on a lookup page | — | under 30 KB compressed |

### Devices and browsers

- `<meta name="viewport" content="width=device-width, initial-scale=1">` on every page. Zoom is never disabled.
- Tables and charts stack on narrow screens.
- Only web features that are Baseline "Widely available". Preloading on hover may use newer features where they degrade silently.
- Tested on a Galaxy Z Flip 8, on a real iPhone in Safari, and in Chrome, Firefox, and Safari on a desktop.

### Being found

**In every page**

- A title and description written for what people search. Professor: "Sean Beatty at UTSA: grades, Bluebook and reviews | RowdySearch". Course: "MAT 1213 Calculus I at UTSA: grades by professor | RowdySearch".
- A canonical address.
- Breadcrumb markup (home, subject, course, professor).
- Open Graph tags and one shared preview image, so links look right in GroupMe, Discord, and iMessage.

**Site-wide**

- `robots.txt` that allows everything and points to the sitemap.
- A sitemap index, split into professors, classes, courses, and subjects, each entry dated with the data build.
- Organization and website markup on the home page. Dataset markup on `/data/`.
- No review or rating markup for Rate My Professors data, since the reviews are not ours.

**After the first deploy**

1. In Cloudflare, under Security > Settings, set the AI crawler policies for Search, Agents, and Training to Allow. Reports conflict on the default, and a block here hides the site from AI assistants.
2. Verify the site in Google Search Console and Bing Webmaster Tools, and submit the sitemap to both.
3. Set up IndexNow: a key file on the site, and a script that submits changed addresses after each deploy.
4. Add rowdysearch.com to the Chrome Web Store listing, the Firefox listing, and the GitHub README.
5. Mentions elsewhere matter more than the site itself for AI recommendations. An r/UTSA thread already asks whether a site like this exists: https://www.reddit.com/r/UTSA/comments/1kt86t0/ ("Does UTSA have a website where you can look up..."). A commenter there names utdgrades.com and wonders why nobody has built one for UTSA.

### Hosting and deploy

- `wrangler.jsonc` points at the built folder as static assets, with no Worker script.
- Deploy with `npx wrangler deploy`.
- Attach rowdysearch.com under Worker > Settings > Domains & Routes > Add > Custom Domain.
- Add the Cloudflare Web Analytics snippet to the page layout. Its top-pages list answers "which professor is looked up most".
- The build fails if the file count passes 20,000 or if any internal link points nowhere.

## Data pipeline changes

These change `data/professors.json`, so the extension gets them too on its next release.

### Long course titles

UTSA's grade spreadsheets and Bluebook cut titles at 30 characters. Simple Syllabus has the full title.

- When a short title is an abbreviation of a longer one for the same course, the longer one is used: "Quantitative Analysis for Accountants", not "Quantitative Analysis for Acc".
- Topics courses, where each section has its own title, keep their per-section titles.
- 1,119 of the 4,342 courses have no title on Simple Syllabus, so they keep the spreadsheets' title until another source is added. The UTSA catalog is the likely one. It has not been checked yet.

### Department, and same-name professors

The grade spreadsheets list a college and a department above every section. `data_collectors/grade_distribution.py` currently drops them.

- Keep both for every section.
- Each professor gets a main department: the one with the most sections. It shows on their page, replacing the Rate My Professors department.

Department alone cannot split people automatically. Measured on the current spreadsheets:

| Names with sections in | Count |
|---|---|
| One college | 1,975 |
| Two or more colleges | 334 |
| Two unrelated colleges, with no shared subject or department | 45 |

Most of the 334 are one person: computer science, information systems, and statistics moved into a new college, and many professors hold joint appointments. Most of the 45 are also one person, such as physics with biomedical engineering.

So the pipeline works in two steps:

1. A report lists the suspicious names with three clues side by side: unrelated departments, different middle names in Bluebook, and different instructor IDs in Simple Syllabus. "Jennifer Smith" (biology and humanities, two syllabus IDs) and "Amir Karimi" (mechanical engineering and business, two syllabus IDs) are the kind of case it finds.
2. A small hand-kept file, `data/professor_splits.json`, lists the names confirmed to be two people and which department's sections belong to each. The pipeline splits only those.

## How it fits in the repo

```
RowdySearch/
├── src/            extension code; utils and searcher are shared with the site
├── data/           professors.json, read by both
├── site/           new
│   ├── astro.config.mjs
│   ├── wrangler.jsonc
│   ├── slugs.json            every address ever published
│   ├── public/               robots.txt, _headers, _redirects, icons, preview image
│   └── src/
│       ├── pages/            one file per page kind
│       ├── layouts/
│       ├── components/       static versions of the extension's page pieces
│       ├── search/           slim index builder, worker, search box
│       └── data/             loads professors.json once per build
└── docs/website-plan.md      this file
```

- The numbers on the site come from the same functions as the extension (`src/utils/`), so they cannot drift apart.
- The extension's components navigate in memory. The site's versions use real links.
- The extension build and its `dist/` are not touched.
- The site needs Node 22 or newer. Ubuntu's system Node is 18, and nvm has 22.15 and 24.21 installed.

## Build order

Each step ends with something that can be opened and checked.

1. **Scaffold.** Astro in `site/`, Tailwind, the shared imports, the phone and desktop layouts, and the home, extension, about, data, contact, and privacy pages.
2. **Lookup pages.** Professor, class, course, and subject pages with summary sentences, built from the real data.
3. **Search.** Slim index, worker, search box, preloading, and the shared search tests.
4. **Analytical Mode.** Port to `/compare/`, grouped data files, box plot.
5. **Pipeline.** Long course titles, department, the same-name report, and the splits file.
6. **Being found.** Titles, descriptions, sitemap, `robots.txt`, markup, preview image.
7. **Checks.** File count, broken links, numbers against the extension, speed targets, phones and desktop browsers, and the chaos test below.
8. **Deploy.** `wrangler deploy`, domain, AI crawler policy, analytics.
9. **After launch.** Search Console, Bing, IndexNow, store listings, README.
10. **AI connection (MCP server).\*** A small program on Cloudflare that Claude or ChatGPT can call for RowdySearch's data: search, one professor, one course, a whole subject. Students add its address in their AI app's settings, so the AI can answer "what are the business professors like?" from the real numbers and reviews. To check first: which Claude and ChatGPT plans allow adding it, and where the 53 MB of data would be kept on the free plan. Cloudflare's "MCP server portals" are a different product, for a company's IT team.

\* Maybe. Jacob is looking into it first. Don't build it until he says so.

## Chaos test

The extension has `tests/chaos.py`, which breaks the sidebar on purpose and checks that it recovers. The site has the same kind of test, `tests/site_chaos.py`, run against the built site with Playwright. The search scenarios are written. The Analytical Mode ones are added in step 4.

Run it with `.venv/bin/python tests/site_chaos.py`. Add `--browser firefox` or `--browser webkit` for the other engines.

What it breaks:

- The search index loads slowly, fails, or arrives cut off.
- Analytical Mode's data files or Plotly fail to load, or arrive corrupted.
- JavaScript is turned off entirely.
- The network drops while a page is preloading.

What must stay true every time:

- Every lookup page is still readable, since its content is in the HTML.
- The page says what went wrong, and never shows a blank or frozen screen.
- Search and Analytical Mode come back once things work again, without a reload where possible.

After the fixed scenarios it runs random "monkey" runs: random searches, clicks, and back-and-forward presses, with random failures mixed in.

## Progress

- **Step 1, done 2026-11-17.** `site/` has Astro and Tailwind set up, the shared data loader, the phone and desktop layout, and seven pages: home, extension, about, data, contact, privacy, and not found. The search box is drawn but does nothing until step 3.

- **Step 2, done 2026-11-17.** Professor, class, course, and subject pages, plus the lists of all subjects and all professors. Each has its summary sentence, headline numbers, grade bars with a table of every grade, and breadcrumbs. Course pages have the sortable professor table. `site/slugs.json` holds every professor's permanent address. `tests/site_accuracy.py` recomputes the numbers from the data file and compares them with the built pages.

- **Step 3, done 2026-11-17.** Search works on every page. It runs the extension's own engine on a slim index, in a background thread, and falls back to the page itself when a thread can't start. Results show as you type, with where Enter goes on top, how many matched, and how long the search took. Arrow keys, Enter, Escape, and "/" to jump to the box all work. Links and results start loading when pointed at. `tests/site_search.test.ts` checks that the site's search gives the same answers as the extension's on about 4,800 searches. `tests/site_chaos.py` covers the search: 16 scenarios, then random monkey runs.

  Measured in Chrome on a desktop: the search is ready about 120 ms after it starts loading, a typical search takes 5 ms, and the slowest 5% take 12 ms. That last number is over the 10 ms target. Getting under it means caching each word's matches inside the shared engine (`src/searcher.ts`), which is extension code, so it is left as a decision.

- **Step 4, done 2026-11-17.** Analytical Mode is at `/compare/`. It reuses the extension's chart, table, picker, and review components unchanged, and adds the box plot ("Grade spread") with its five grades in a table underneath. What is being compared is kept in the address, so a comparison can be shared as a link. Every professor, class, and course page has a "Compare in Analytical Mode" link that opens it the way the extension would from that page. `tests/site_compare.test.ts` checks that it draws the same numbers as the extension for about 700 professors, courses, and classes. `tests/site_chaos.py` has 10 more scenarios for it.

- **Step 5, done 2026-11-17.** The pipeline now keeps each section's college and department from the grade spreadsheets. Every professor gets a department: the one they taught in during their newest semester with grades, written out in full. Section titles become their full versions, which changed 10,008 sections. `combine_data.py` writes `data/same_name_report.md`, which lists 41 names with a sign of being two people, and reads `data/professor_splits.json`, which is empty until a name is confirmed. Nobody is split automatically. `tests/test_combine_data.py` covers the titles, departments, splits, and report. The extension's reader and professor page use the new department, and its `dist/` is rebuilt.

- **Preview upload, 2026-11-17.** The site is on Cloudflare at https://rowdysearch.delicate-violet-f754.workers.dev, on the free plan. Cloudflare counted 19,855 files. This address tells search engines to skip it, through a rule in `site/public/_headers`. rowdysearch.com is not attached yet. To upload again: `cd site && npm run deploy`.

- **Phone review, 2026-11-17.** Changes from looking at the preview on a phone:
  - Below laptop width (1024px) the header's links are behind a menu button. The menu covers the whole screen, comes down from the top, and its links arrive one after another, with apple.com's timing. It opens without JavaScript. Laptops and bigger keep the links in a row.
  - The lists of professors and subjects, and each subject's courses and professors, show 50 at a time with Previous and Next. The whole list is still in the page, so it costs no files, search engines read every link, and it all shows with JavaScript off. The page number is kept in the address (`components/Pager.astro`).
  - The median-by-semester chart is gone from class pages.
  - The home page's line and the extension page's speed comparison are reworded. The 90 seconds no longer counts grade data, which can't be looked up by hand.
  - The build dropped the line break between words and a link, which glued them together ("and4,342"). All six places are fixed, and the build check now fails on any new one.
  - `tests/site_chaos.py` has 5 more scenarios, for paging and for the menu.
  - The Extension page kept showing the old header on a phone. The rule in `public/_headers` that lets browsers keep the screenshots for a day (`/extension/*`) also matched the page `/extension/`. The rule now names the picture files only (`/extension/*.webp`), and the build check fails if any rule that keeps files also matches a page.
  - The question "Where do the reviews come from?" is gone from `/data/`.

- **Step 6, done 2026-11-17.** What search engines and AI assistants read:
  - `robots.txt` allows everything and points to `/sitemap-index.xml`, which lists five parts: pages, subjects, courses, professors, classes (`src/data/sitemap.ts`). Every page made from the data is dated with the day `data/professors.json` was last written. Thin class pages are still in it.
  - Every page has the preview picture (`public/preview.png`, 1200 by 630, drawn by `scripts/make_preview_image.py`) and the tags that show it large. The tags point at rowdysearch.com, so the picture shows in link previews only once the domain is attached.
  - Breadcrumb markup on every subject, course, professor, and class page. Website and organization markup on the home page. Dataset markup on `/data/`. No rating or review markup. All of it goes through `components/Markup.astro`.
  - Class page titles now put the name, code, and UTSA first ("Sean Beatty, MAT 1213 at UTSA: Calculus I grades and reviews"), so a long course title can't push them out of the 60 letters a search engine shows. The "page not found" page is kept out of search engines.
  - The build check fails when a page lacks a title, description, its own address, or the picture, when two pages share a title, when markup can't be read, or when the sitemap and the built pages differ. `tests/site_chaos.py` has a scenario that reads the site as a search engine would.
  - 19,864 files, 136 under the limit.

- **Search, 2026-11-17.** "introduction to computer programming" opened EE 2073 ("... for Engineers") instead of CS 1063 ("Introduction to Computer Programming I"), because a part number counted as much as any other extra word. In `src/searcher.ts`, a title that is what was typed plus only its part number now counts the number as half a word. Of 9,081 searches made from the real titles, 10 changed, all to the course whose title was typed. This is the extension's search too.
  - The FERPA answer on `/data/` now says UTSA is the one that made sure the records follow FERPA before releasing them.

- **Step 8, domain attached 2026-11-17.** The site is live at https://rowdysearch.com. `wrangler.jsonc` lists rowdysearch.com and www.rowdysearch.com as custom domains, and Cloudflare made the DNS records and the certificate. Both addresses show the site, and every page names rowdysearch.com as its address. Attaching the domain turned off the workers.dev preview address. Left for the Cloudflare dashboard, which the deploy tool can't change: the AI crawler policies (Security > Settings), Web Analytics, and Always Use HTTPS (plain http still answers without sending people to https).

- **Step 9, partly done 2026-11-17.**
  - IndexNow: the key is `public/indexnow-key.txt`, and `scripts/indexnow.mjs` submits the pages that are new, changed, or gone since the last time. It compares what each page says, leaving out script and style file names, and remembers what it submitted in `site/.indexnow-sent.json` (not in git). `npm run deploy` runs it after the upload. All 19,782 pages were submitted on 2026-11-17. The first try was refused with 403 seconds after the upload and the second was accepted, so the script tries a 403 once more after 30 seconds. `npm run test:indexnow` runs it against a stand-in that fails in different ways.
  - The README links to rowdysearch.com.
  - Left for Jacob, because they need his sign-in: Google Search Console (add rowdysearch.com as a Domain property, then submit `https://rowdysearch.com/sitemap-index.xml`), Bing Webmaster Tools (import the site from Search Console), and the homepage field on the Chrome Web Store and Firefox listings.
  - **Jacob did all of those on 2026-11-18**, and the three Cloudflare settings left from step 8. Checked on the live site the same day: http sends people to https (301), Cloudflare adds the Web Analytics script to pages in a browser (no snippet in our code is needed), `robots.txt` is unchanged, and GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot all get the page (200). Search Console, Bing, and the store listings are behind his sign-in, so those weren't checked.
  - Still open: a reply on the r/UTSA thread, which is Jacob's to post.

## Updating each semester

1. Add the new grade spreadsheets and run the collectors, as today.
2. Run `combine_data.py`, and check the same-name report for new names.
3. Build the site and read the file count.
4. Deploy.
5. The IndexNow script submits the pages that changed.

## Still open

- **Course titles for the grade-only courses.** A course that is only in the grade spreadsheets and Bluebook has no full title to switch to. Needs the UTSA catalog, which has not been checked.
- **Same-name professors.** `data/same_name_report.md` lists 41 names to look over. Two have two signs: Amir Karimi and Jennifer Smith.
- **One name under two spellings.** A person listed as both "Betty Nyasulu" and "Betty Mkwinda Nyasulu" is still two professors. Not started.
- **Thin pages.** 5,957 graded sections have one student. Decide later whether class pages with very little data are left out of the sitemap.
