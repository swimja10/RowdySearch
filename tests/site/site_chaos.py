"""Chaos test for the website: breaks it on purpose and checks that it recovers.

The same idea as tests/chaos.py, which does this to the extension. It serves the built site
(site/dist, so `cd site && npm run build` first) from a local server that makes files fail while
the site is in use: the search index arrives slowly, not at all, cut off, or in the wrong shape;
the search's own code fails to load; Analytical Mode's data, charts, or code fail to load;
scripts, styles, or JavaScript itself are missing.

Each scenario checks three things. The page is never blank, because every page's content is in
its HTML. The search says what's wrong instead of doing nothing. And it comes back once things
work again, without reloading the page.

    .venv/bin/python tests/site_chaos.py                 every scenario, then 25 random monkey runs
    .venv/bin/python tests/site_chaos.py --monkey 100    more random runs
    .venv/bin/python tests/site_chaos.py --only index --headed    some scenarios, in a visible window
    .venv/bin/python tests/site_chaos.py --browser webkit         in Safari's engine (or firefox)
"""

import argparse
import random
import re
import socket
import sys
import threading
import time
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site" / "dist"

TYPES = {".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html",
         ".png": "image/png", ".webp": "image/webp", ".xml": "application/xml", ".txt": "text/plain"}

BEATTY_CALCULUS = "/professors/sean-beatty/mat-1213/"
DATA_STRUCTURES = "/courses/cs-2123/"
COMPARE = "/compare/?s=c.cs-2123,k.john-heaps.cs-2123"  # Analytical Mode, comparing a course with one of its classes

# ---------------------------------------------------------------- the chaos server


class Chaos:
    """The faults to inject. Each rule matches request paths containing `path`; `times` limits it to
    the first few matching requests (a hiccup that goes away by itself)."""

    def __init__(self):
        self.rules = []
        self.monkey = None  # (probability, random.Random) for random faults on scripts, styles, and the index
        self.release = threading.Event()  # lets requests stuck in a "hang" finish
        self.lock = threading.Lock()

    def set(self, rules=(), monkey=None):
        with self.lock:
            self.release.set()
            self.release = threading.Event()
            self.rules = [dict(rule) for rule in rules]
            self.monkey = monkey

    def fault_for(self, path):
        with self.lock:
            for rule in self.rules:
                if rule["path"] in path and rule.get("times", 1) > 0:
                    if "times" in rule:
                        rule["times"] -= 1
                    return rule
            # The monkey breaks the site's files, never its pages: a server that's down isn't the site's to fix.
            if self.monkey and path.startswith(("/_astro/", "/search-index", "/compare-data/")):
                probability, rng = self.monkey
                if rng.random() < probability:
                    kind = rng.choice(["status", "drop", "truncate", "delay"])
                    # A script is never cut off, only dropped. Over this test's plain HTTP, Firefox runs
                    # the part of a script it got. The real site's HTTP/2 refuses a cut-off file instead.
                    if kind == "truncate" and path.endswith(".js"):
                        kind = "drop"
                    return {"status": {"status": 500}, "drop": {"drop": True}, "truncate": {"truncate": rng.random()},
                            "delay": {"delay": rng.uniform(0.3, 3)}}[kind]
            return None


CHAOS = Chaos()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        file = (SITE / path.lstrip("/")).resolve()
        if file.is_dir():
            file = file / "index.html"
        if not file.is_relative_to(SITE) or not file.is_file():
            return self.send(404, (SITE / "404.html").read_bytes(), ".html")

        body = file.read_bytes()
        fault = CHAOS.fault_for(path)
        if fault:
            if fault.get("hang"):
                CHAOS.release.wait(90)
                return self.drop()
            if "delay" in fault:
                time.sleep(fault["delay"])
            if "status" in fault:
                return self.send(fault["status"], b"chaos", ".txt")
            if fault.get("drop"):
                return self.drop()
            if "truncate" in fault:
                return self.cut_off(body, fault["truncate"], file.suffix)
            if "body" in fault:
                body = fault["body"]
        self.send(200, body, file.suffix)

    def send(self, status, body, suffix):
        try:
            self.send_response(status)
            self.send_header("Content-Type", TYPES.get(suffix, "text/plain"))
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def cut_off(self, body, fraction, suffix):
        """Promises the whole file, sends only part of it, and hangs up: a download that got cut off.
        The browser sees a failed download, not half a file to run."""
        try:
            self.send_response(200)
            self.send_header("Content-Type", TYPES.get(suffix, "text/plain"))
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body[: int(len(body) * fraction)])
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        self.drop()

    def drop(self):
        self.close_connection = True
        try:
            self.connection.shutdown(socket.SHUT_RDWR)
        except OSError:
            pass


def start_server():
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{server.server_port}"

# ---------------------------------------------------------------- watching the site


class Site:
    """One run: a fresh browser tab, and ways to look at the page and use its search box."""

    def __init__(self, browser, origin, javascript=True, phone=False):
        self.browser = browser
        self.origin = origin
        viewport = {"width": 390, "height": 800} if phone else {"width": 1280, "height": 800}
        self.context = browser.new_context(viewport=viewport, java_script_enabled=javascript)
        self.page = self.context.new_page()
        self.errors = []  # anything the site's code threw and didn't catch
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.saw_blank = False

    def close(self):
        self.context.close()

    def goto(self, path):
        self.page.goto(self.origin + path, wait_until="domcontentloaded")

    def look(self):
        """What the page shows right now."""
        try:
            state = self.page.evaluate("""() => {
                const panel = document.querySelector('[data-search-panel]:not([hidden])');
                return {
                    text: document.body ? document.body.innerText : '',
                    panel: panel ? panel.innerText : '',
                    path: location.pathname,
                    ready: document.readyState,
                    ours: location.protocol === 'http:',
                };
            }""")
        except Exception:
            return {"text": "", "panel": "", "path": "", "ready": "loading", "ours": False}  # between two pages
        self.saw_blank |= state["ours"] and state["ready"] == "complete" and not state["text"].strip()
        return state

    def wait_for(self, what, test, timeout):
        """Watches the page (and notes any blank moment) until test(state) is true."""
        deadline = time.time() + timeout
        while True:
            state = self.look()
            if test(state):
                return state
            if time.time() > deadline:
                panel = " ".join(state["panel"].split())[:160]
                raise AssertionError(f"waited {timeout}s for {what}; on {state['path']!r} the search shows: {panel!r}")
            self.page.wait_for_timeout(100)

    def box(self):
        return self.page.locator("form[data-search] input").first

    def type(self, query):
        self.box().click()
        self.box().fill("")
        self.box().press_sequentially(query, delay=15)

    def press(self, key):
        self.box().press(key)


def results_show(*words):
    return lambda state: all(word.lower() in state["panel"].lower() for word in words)


def on_page(path, *words):
    """The browser is on `path`, and the page there has finished arriving with these words on it."""
    return lambda state: state["path"] == path and all(word.lower() in state["text"].lower() for word in words)


def page_shows(*words):
    return lambda state: all(word.lower() in state["text"].lower() for word in words)


def offers_retry(state):
    return "Try again" in state["panel"] and "every subject" in state["panel"] and "Loading" not in state["panel"]

# ---------------------------------------------------------------- scenarios
# Each one sets up faults, uses the site the way a student would, and checks what happens.


def healthy(s):
    s.goto("/")
    s.type("beatty mat 1213")
    s.wait_for("Sean Beatty's MAT 1213 in the results", results_show("MAT 1213", "Sean Beatty", "Enter"), 15)
    s.press("Enter")
    s.wait_for("his MAT 1213 page", on_page(BEATTY_CALCULUS, "median grade was"), 15)


def slow_index(s):
    CHAOS.set([{"path": "search-index", "delay": 4}])
    s.goto("/")
    s.type("data structures")
    s.press("Enter")  # pressed before the search has even loaded
    s.wait_for("a loading message", results_show("Loading search"), 3)
    s.wait_for("the course page, once the search arrives", on_page(DATA_STRUCTURES, "CS 2123"), 25)


def index_hiccup(s):
    CHAOS.set([{"path": "search-index", "status": 500, "times": 2}])
    s.goto("/")
    s.type("data structures")
    s.wait_for("results after retrying by itself", results_show("CS 2123"), 20)


def index_down(s):
    CHAOS.set([{"path": "search-index", "status": 500}])
    s.goto("/")
    s.type("data structures")
    s.wait_for("an error with Try again and the browse links", offers_retry, 30)
    assert "Pick the right UTSA professor" in s.look()["text"], "the page behind the search went away"
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").click()
    s.wait_for("results after Try again", results_show("CS 2123"), 20)


def index_cut_off(s):
    CHAOS.set([{"path": "search-index", "truncate": 0.5}])
    s.goto("/")
    s.type("beatty")
    s.wait_for("an error with Try again", offers_retry, 30)
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").click()
    s.wait_for("results after Try again", results_show("Sean Beatty"), 20)


def index_wrong_shape(s):
    CHAOS.set([{"path": "search-index", "body": b'{"version": 99, "professors": "not a list"}'}])
    s.goto("/")
    s.type("beatty")
    s.wait_for("an error with Try again", offers_retry, 30)
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").click()
    s.wait_for("results after Try again", results_show("Sean Beatty"), 20)


def index_hangs(s):
    CHAOS.set([{"path": "search-index", "hang": True}])
    s.goto(DATA_STRUCTURES)
    s.type("beatty")
    s.wait_for("a loading message", results_show("Loading search"), 5)
    assert "median grade was" in s.look()["text"], "the page behind the search isn't readable"
    CHAOS.set()  # the stuck download is dropped, and the next try gets through
    s.wait_for("results once the download gets through", results_show("Sean Beatty"), 30)


def no_background_thread(s):
    CHAOS.set([{"path": "/_astro/worker", "status": 500}])
    s.goto("/")
    s.type("beatty mat 1213")
    s.wait_for("results from searching on the page instead", results_show("MAT 1213", "Sean Beatty"), 20)
    s.press("Enter")
    s.wait_for("his MAT 1213 page", on_page(BEATTY_CALCULUS, "median grade was"), 15)


def no_search_code(s):
    CHAOS.set([{"path": "/_astro/worker", "status": 500}, {"path": "/_astro/loadEngine", "status": 500}])
    s.goto(BEATTY_CALCULUS)
    s.type("data structures")
    s.wait_for("an error with Try again", offers_retry, 30)
    assert "median grade was" in s.look()["text"], "the page behind the search isn't readable"
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").click()
    s.wait_for("results after Try again", results_show("CS 2123"), 20)


def no_scripts(s):
    CHAOS.set([{"path": "/_astro/", "status": 500}])
    s.goto(DATA_STRUCTURES)
    s.wait_for("the course page's own content", on_page(DATA_STRUCTURES, "median grade was", "Jonathan Sherette", "Every grade"), 10)
    s.page.get_by_role("link", name="John Heaps").first.click()
    s.wait_for("a professor's class page, by following a link", lambda st: "/professors/john-heaps/" in st["path"] and "John Heaps" in st["text"], 15)


def javascript_off(s):
    s.close()
    s.__init__(s.browser, s.origin, javascript=False)
    s.goto(BEATTY_CALCULUS)
    text = s.page.inner_text("body").lower()  # section titles are drawn in capitals
    for words in ("median grade was", "every semester", "search needs javascript", "every subject"):
        assert words in text, f"with JavaScript off, the page doesn't show {words!r}"
    s.page.get_by_role("link", name="Compare every professor who teaches MAT 1213").click()
    s.page.wait_for_url("**/courses/mat-1213/")
    assert "Calculus I" in s.page.inner_text("body")


def no_styles(s):
    CHAOS.set([{"path": ".css", "status": 500}])
    s.goto("/")
    s.type("beatty mat 1213")
    s.wait_for("results, even unstyled", results_show("MAT 1213", "Sean Beatty"), 20)
    s.press("Enter")
    s.wait_for("his MAT 1213 page", on_page(BEATTY_CALCULUS, "median grade was"), 15)


def preload_fails(s):
    # The first request for the course page is the search loading it ahead of time. It's dropped.
    CHAOS.set([{"path": DATA_STRUCTURES, "drop": True, "times": 1}])
    s.goto("/")
    s.type("cs 2123")
    s.wait_for("the course in the results", results_show("CS 2123", "Enter"), 15)
    s.page.wait_for_timeout(600)  # long enough for the preload to be tried and to fail
    s.press("Enter")
    s.wait_for("the course page, loaded the ordinary way", on_page(DATA_STRUCTURES, "median grade was"), 15)


def arrow_keys(s):
    s.goto("/")
    s.type("smith")
    s.wait_for("several results", lambda st: st["panel"].count("\n") > 6, 15)
    s.press("ArrowDown")
    s.press("ArrowDown")
    picked = s.page.evaluate("document.querySelector('[data-option][aria-selected=true]').getAttribute('href')")
    s.press("Enter")
    s.wait_for("the page the arrow keys picked", lambda st: st["path"] == picked, 15)


def back_and_forward(s):
    s.goto("/")
    s.type("beatty mat 1213")
    s.wait_for("results", results_show("MAT 1213"), 15)
    s.press("Enter")
    s.wait_for("his MAT 1213 page", on_page(BEATTY_CALCULUS), 15)
    s.page.go_back()
    s.wait_for("the home page again", on_page("/", "Pick the right UTSA professor"), 15)
    s.type("data structures")
    s.wait_for("the search working after coming back", results_show("CS 2123"), 20)


def nothing_to_find(s):
    s.goto("/")
    s.type("xyzzyq")
    s.wait_for("a message that nothing matched", results_show("No matches"), 15)
    s.press("Enter")
    s.page.wait_for_timeout(500)
    assert s.look()["path"] == "/", "Enter went somewhere with nothing to open"
    s.press("Escape")
    s.wait_for("the results closed", lambda st: st["panel"] == "", 5)


# ---------------------------------------------------------------- Analytical Mode


def comparison(state):
    """Analytical Mode has drawn the comparison: its table has John Heaps's CS 2123 and its average GPA."""
    return page_shows("Side by side", "Grade spread", "John Heaps · CS 2123", "3.72")(state)


def charts_drawn(s):
    return s.page.evaluate("document.querySelectorAll('.js-plotly-plot').length")


def compare_healthy(s):
    s.goto(COMPARE)
    s.wait_for("the comparison", comparison, 20)
    s.wait_for("its three charts", lambda st: charts_drawn(s) >= 3, 20)

    picker = s.page.get_by_placeholder("Add a professor, class, or subject")
    picker.fill("sean beatty")
    picker.press("Enter")
    s.wait_for("Sean Beatty on the list", page_shows("Sean Beatty (All Classes)", "Comparing 3 of 8"), 20)
    assert "p.sean-beatty" in s.page.url, "the address doesn't have what was added"

    s.page.get_by_role("button", name="Remove Sean Beatty (All Classes)").click()
    s.wait_for("Sean Beatty off the list", page_shows("Comparing 2 of 8"), 5)
    assert "p.sean-beatty" not in s.page.url, "the address still has what was removed"


def compare_from_a_page(s):
    s.goto(DATA_STRUCTURES)
    s.page.get_by_role("link", name="Compare in Analytical Mode").click()
    s.wait_for("the course and its professors compared", page_shows("Side by side", "CS 2123 (Every Professor)", "Jonathan Sherette · CS 2123"), 20)
    s.page.get_by_role("button", name="John Heaps · CS 2123").first.click()
    s.wait_for("his class page, from clicking his name", on_page("/professors/john-heaps/cs-2123/", "median grade was"), 15)


def compare_data_hiccup(s):
    CHAOS.set([{"path": "/compare-data/", "status": 500, "times": 2}])
    s.goto(COMPARE)
    s.wait_for("the comparison after retrying by itself", comparison, 25)


def compare_data_down(s):
    CHAOS.set([{"path": "/compare-data/", "status": 500}])
    s.goto(COMPARE)
    s.wait_for("an error with a Try again button", page_shows("Couldn't load the data for", "Try again"), 30)
    assert page_shows("Analytical Mode", "Comparing 2 of 8", "What it shows")(s.look()), "the rest of the page went away"
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").first.click()
    s.wait_for("the comparison after Try again", comparison, 20)


def compare_data_cut_off(s):
    CHAOS.set([{"path": "/compare-data/", "truncate": 0.4}])
    s.goto(COMPARE)
    s.wait_for("an error with a Try again button", page_shows("Couldn't load the data for", "Try again"), 30)
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").first.click()
    s.wait_for("the comparison after Try again", comparison, 20)


def compare_no_charts(s):
    CHAOS.set([{"path": "plotly", "status": 500}])
    s.goto(COMPARE)
    s.wait_for("the table, and a message where the charts go", lambda st: comparison(st) and "The charts couldn't load" in st["text"], 25)
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").first.click()
    s.wait_for("the charts after Try again", lambda st: charts_drawn(s) >= 3, 20)


def compare_list_down(s):
    CHAOS.set([{"path": "search-index", "status": 500}])
    s.goto(COMPARE)
    s.wait_for("an error with a Try again button", page_shows("Analytical Mode couldn't load", "Try again"), 30)
    assert page_shows("What it shows")(s.look()), "the rest of the page went away"
    CHAOS.set()
    s.page.get_by_role("button", name="Try again").first.click()
    s.wait_for("the comparison after Try again", comparison, 20)


def compare_code_down(s):
    CHAOS.set([{"path": "/_astro/CompareApp", "status": 500}])
    s.goto(COMPARE)
    s.wait_for("a 'taking longer than usual' message", page_shows("longer than usual", "Reload Analytical Mode"), 20)
    assert page_shows("What it shows")(s.look()), "the rest of the page went away"
    CHAOS.set()
    s.page.get_by_role("link", name="Reload Analytical Mode").click()
    s.wait_for("the comparison after reloading", comparison, 20)


def compare_bad_address(s):
    s.goto("/compare/?s=p.nobody-here,c.zz-9999,k.john-heaps.cs-2123,k.john-heaps,what,,c.cs-2123,c.cs-2123,%3Cb%3E")
    s.wait_for("only the real ones compared", page_shows("Comparing 2 of 8", "John Heaps · CS 2123", "CS 2123 (Every Professor)", "3.72"), 20)


def compare_javascript_off(s):
    s.close()
    s.__init__(s.browser, s.origin, javascript=False)
    s.goto(COMPARE)
    text = s.page.inner_text("body").lower()
    for words in ("analytical mode needs javascript", "what it shows", "grade spread", "every professor"):
        assert words in text, f"with JavaScript off, Analytical Mode's page doesn't show {words!r}"


def shown(s, inside="[data-paged]"):
    """The items of a paged list that are on screen now."""
    return s.page.locator(f"{inside} [data-paged-item]:visible")


def paging(s):
    s.goto("/professors/")
    everyone = s.page.locator("[data-paged-item]").count()
    pages = -(-everyone // 50)
    label = s.page.locator("[data-pager-label]")
    assert shown(s).count() == 50, f"the first page shows {shown(s).count()} professors, not 50"
    assert label.inner_text() == f"Page 1 of {pages}"
    assert s.page.get_by_role("button", name="Previous").is_disabled()

    # Every professor is on exactly one page.
    seen = shown(s).all_inner_texts()
    for number in range(2, pages + 1):
        s.page.get_by_role("button", name="Next").click()
        assert label.inner_text() == f"Page {number} of {pages}"
        seen += shown(s).all_inner_texts()
    assert len(seen) == everyone and len(set(seen)) == len(set(s.page.locator("[data-paged-item]").all_text_contents())), \
        f"paging through showed {len(seen)} professors, and the list has {everyone}"
    assert s.page.get_by_role("button", name="Next").is_disabled()

    # The address remembers the page, so Reload and Back return to it.
    assert f"page={pages}" in s.page.url
    last = shown(s).first.inner_text()
    s.page.reload(wait_until="domcontentloaded")
    assert shown(s).first.inner_text() == last, "reloading went back to the first page"
    shown(s).first.locator("a").click()
    s.wait_for("a professor's page", lambda state: state["path"].startswith("/professors/") and state["path"] != "/professors/", 10)
    s.page.go_back(wait_until="domcontentloaded")
    s.wait_for("the same page of the list after Back", lambda state: state["path"] == "/professors/" and last in state["text"], 10)

    # A letter opens the page that letter starts on.
    for attempt in ("the first time", "a second time, after paging away"):
        s.page.get_by_role("link", name="M", exact=True).click()
        try:
            s.page.locator("[id='M']").wait_for(state="visible", timeout=3000)
        except Exception:
            raise AssertionError(f"the M button didn't open the page M starts on, {attempt}") from None
        s.page.get_by_role("button", name="Next").click()

    # A page number that doesn't exist opens the nearest one that does.
    for address, page in (("/professors/?page=9999", pages), ("/professors/?page=-3", 1), ("/professors/?page=abc", 1)):
        s.goto(address)
        assert label.inner_text() == f"Page {page} of {pages}", f"{address} shows {label.inner_text()!r}"
        assert 0 < shown(s).count() <= 50


def paging_two_lists(s):
    """A subject's page has two lists. Each pages by itself, and the site's script files aren't needed."""
    CHAOS.set([{"path": ".js", "status": 500}])
    s.goto("/subjects/mus/")
    courses, professors = "[data-paged='courses']", "[data-paged='professors']"
    first_professor = shown(s, professors).first.inner_text()
    first_course = shown(s, courses).first.inner_text()
    assert shown(s, courses).count() == 50, f"the first page shows {shown(s, courses).count()} courses, not 50"
    s.page.locator(f"{courses} [data-pager-next]").click()
    assert shown(s, courses).first.inner_text() != first_course, "Next didn't change the courses"
    assert shown(s, professors).first.inner_text() == first_professor, "paging the courses moved the professors"
    assert "courses=2" in s.page.url
    s.goto("/subjects/")
    assert shown(s).count() == 50
    s.page.get_by_role("button", name="Next").click()
    assert shown(s).count() == 50 and "page=2" in s.page.url


def paging_javascript_off(s):
    s.close()
    s.__init__(s.browser, s.origin, javascript=False)
    for address in ("/professors/", "/subjects/", "/subjects/mus/"):
        s.goto(address)
        everything = s.page.locator("[data-paged-item]").count()
        assert shown(s).count() == everything, f"with JavaScript off, {address} shows {shown(s).count()} of {everything}"
        assert s.page.locator("[data-pager]:visible").count() == 0, f"with JavaScript off, {address} shows page buttons that can't work"


def phone_menu(s):
    s.close()
    s.__init__(s.browser, s.origin, phone=True)
    links = lambda: s.page.locator("nav[aria-label='Site menu'] a")
    button = lambda: s.page.locator("details[data-menu] summary")
    open_links = lambda: links().locator("visible=true").count()
    for address in ("/about/", "/", BEATTY_CALCULUS, "/professors/", "/subjects/mus/", "/extension/", "/data/"):
        s.goto(address)
        wider = s.page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        assert wider <= 0, f"on a phone, {address} is {wider}px wider than the screen"
        assert s.page.locator("nav[aria-label='Site'] a:visible").count() == 0, f"on a phone, {address} shows the links in a row"
        assert open_links() == 0, "the menu starts open"

    def closes(how):
        """The menu plays its closing movement, then is gone."""
        try:
            links().first.wait_for(state="hidden", timeout=3000)
        except Exception:
            raise AssertionError(f"{how} didn't close the menu") from None

    s.goto("/about/")
    s.page.mouse.wheel(0, 300)  # a little way down the page, with the button still in view
    button().click()
    assert open_links() == 5, "the menu button didn't show the five links"
    s.page.wait_for_timeout(700)  # the opening movement
    panel = s.page.locator("nav[aria-label='Site menu']").bounding_box()
    assert (panel["x"], panel["y"], panel["width"], panel["height"]) == (0, 0, 390, 800), f"the open menu doesn't cover the screen: {panel}"
    for part in ("details[data-menu] summary", "header a[href='/']"):
        box = s.page.locator(part).first.bounding_box()
        assert box["y"] >= 0 and box["y"] + box["height"] <= 100, f"{part} isn't at the top of the open menu: {box}"
    s.page.mouse.wheel(0, 500)
    assert s.page.evaluate("scrollY") == 0, "the page under the open menu scrolls"
    button().click()
    closes("the X button")
    button().click()
    s.page.keyboard.press("Escape")
    closes("Escape")
    for _ in range(7):  # tapped over and over, faster than it moves
        button().click()
    s.page.wait_for_timeout(700)
    assert open_links() == 5, "after seven fast taps the menu should be open"
    links().filter(has_text="Professors").click()
    s.wait_for("the professor list, from the menu", on_page("/professors/", "Page 1 of"), 10)
    assert open_links() == 0, "the menu is open on the new page"

    # Back to a page that was left with its menu open: it isn't still covering the page.
    button().click()
    links().filter(has_text="Subjects").click()
    s.wait_for("the subject list", on_page("/subjects/", "Page 1 of"), 10)
    s.page.go_back(wait_until="domcontentloaded")
    s.wait_for("the professor list again", on_page("/professors/", "Page 1 of"), 10)
    closes("going Back")

    # The menu opens without JavaScript too.
    s.close()
    s.__init__(s.browser, s.origin, javascript=False, phone=True)
    s.goto("/about/")
    button().click()
    links().filter(has_text="Subjects").click()
    s.page.wait_for_url("**/subjects/")


def desktop_links(s):
    s.goto("/about/")
    assert s.page.locator("nav[aria-label='Site'] a:visible").count() == 5, "on a computer, the links aren't in a row"
    assert s.page.locator("details[data-menu] summary:visible").count() == 0, "on a computer, the menu button shows"


REAL_SITE = "https://rowdysearch.com"


def found_by_search_engines(s):
    """Reads the site the way a search engine does: robots.txt, then the sitemap it points to, then
    pages picked from the sitemap. Each page has to say its own address, title, description, and
    preview picture, and its markup has to be readable."""
    s.goto("/")
    read = lambda path: s.page.evaluate("path => fetch(path).then(reply => reply.ok ? reply.text() : '')", path)
    locations = lambda xml: re.findall(r"<loc>([^<]*)</loc>", xml)

    robots = read("/robots.txt")
    assert "Disallow" not in robots, "robots.txt keeps search engines out of something"
    sitemap = re.search(r"^Sitemap: (\S+)$", robots, re.MULTILINE)
    assert sitemap, "robots.txt doesn't point to the sitemap"
    parts = locations(read(sitemap.group(1).replace(REAL_SITE, "")))
    assert len(parts) == 5, f"the sitemap has {len(parts)} parts, not 5"
    pages = [page for part in parts for page in locations(read(part.replace(REAL_SITE, "")))]
    assert len(pages) > 19000 and len(pages) == len(set(pages)), f"the sitemap lists {len(pages)} pages, {len(set(pages))} different"

    always = [REAL_SITE + path for path in ("/", "/data/", BEATTY_CALCULUS, "/courses/mat-1213/", "/subjects/mat/", "/professors/")]
    assert all(address in pages for address in always), "a page everyone uses isn't in the sitemap"
    for address in always + random.Random(6).sample(pages, 20):
        s.goto(address.replace(REAL_SITE, ""))
        found = s.page.evaluate("""() => {
          const content = (pick) => document.querySelector(pick)?.getAttribute('content') ?? '';
          const markup = [...document.querySelectorAll('script[type="application/ld+json"]')].map((block) => {
            try { return JSON.parse(block.textContent); } catch { return null; }
          });
          return {
            title: document.title,
            heading: document.querySelector('h1')?.textContent.trim() ?? '',
            canonical: document.querySelector('link[rel=canonical]')?.href ?? '',
            description: content('meta[name=description]'),
            picture: content('meta[property="og:image"]'),
            hidden: content('meta[name=robots]'),
            markup,
          };
        }""")
        assert found["canonical"] == address, f"{address} says its address is {found['canonical']}"
        assert found["title"].strip() and found["heading"], f"{address} has no title or no heading"
        assert len(found["description"]) >= 50, f"{address} has no real description"
        assert found["picture"] == REAL_SITE + "/preview.png", f"{address} has no preview picture"
        assert found["hidden"] == "", f"{address} is in the sitemap but tells search engines to leave it out"
        assert None not in found["markup"], f"{address} has markup that can't be read"
        trails = [block for block in found["markup"] if block.get("@type") == "BreadcrumbList"]
        if re.search(r"/(subjects|courses|professors)/", address):
            assert len(trails) == 1, f"{address} has {len(trails)} breadcrumb trails"
            steps = trails[0]["itemListElement"]
            assert steps[0]["item"] == REAL_SITE + "/" and steps[-1]["item"] == address, f"{address}'s breadcrumbs don't run from home to it"
            assert all(step["item"] in pages for step in steps), f"{address}'s breadcrumbs go through a page that isn't in the sitemap"

    def kinds(path):
        """The kinds of thing a page's markup describes."""
        s.goto(path)
        blocks = s.page.evaluate(
            "[...document.querySelectorAll('script[type=\"application/ld+json\"]')].map((block) => JSON.parse(block.textContent))")
        return {thing["@type"] for block in blocks for thing in block.get("@graph", [block])}

    assert {"WebSite", "Organization"} <= kinds("/"), "the home page doesn't say what the site is"
    assert "Dataset" in kinds("/data/"), "the data page doesn't describe the data set"

    picture = s.page.evaluate("fetch('/preview.png').then(reply => reply.blob()).then(createImageBitmap).then(image => [image.width, image.height])")
    assert picture == [1200, 630], f"the preview picture is {picture}, not 1200 by 630"

    s.goto("/does-not-exist/")
    assert s.page.locator("meta[name=robots]").get_attribute("content") == "noindex", "the not-found page isn't kept out of search engines"


SCENARIOS = [healthy, slow_index, index_hiccup, index_down, index_cut_off, index_wrong_shape, index_hangs,
             no_background_thread, no_search_code, no_scripts, javascript_off, no_styles, preload_fails,
             arrow_keys, back_and_forward, nothing_to_find,
             compare_healthy, compare_from_a_page, compare_data_hiccup, compare_data_down, compare_data_cut_off,
             compare_no_charts, compare_list_down, compare_code_down, compare_bad_address, compare_javascript_off,
             paging, paging_two_lists, paging_javascript_off, phone_menu, desktop_links, found_by_search_engines]

# ---------------------------------------------------------------- the monkey

MONKEY_PAGES = ["/", BEATTY_CALCULUS, DATA_STRUCTURES, "/professors/sean-beatty/", "/subjects/mat/", "/subjects/",
                "/professors/?page=7#M", "/subjects/mus/?courses=2&professors=3",
                "/extension/", "/data/", "/courses/arc-3433/", "/does-not-exist/", COMPARE, "/compare/",
                "/compare/?s=p.sean-beatty,c.mat-1213,k.sean-beatty.mat-1213"]
MONKEY_SEARCHES = ["beatty", "mat 1213", "calc 1", "data structures", "smith", "cs", "a", "xyzzyq", "Darrn Meritz",
                   "organic chem", "us history", "  ", "ñandú 3", "<b>bold</b>", "'; drop table", "1" * 40, "physics 1 lab"]


def monkey(s, rng):
    """Random faults on the site's files, and a student who types, clicks, and goes back at random.
    Whatever happens, no page may be blank and none of the site's code may crash. Then everything is
    fixed, and the search has to work."""
    CHAOS.set(monkey=(rng.uniform(0.15, 0.6), rng))
    s.goto(rng.choice(MONKEY_PAGES))

    for _ in range(rng.randint(8, 16)):
        action = rng.choice(["type", "type", "type", "enter", "arrow", "escape", "link", "back", "forward", "reload", "goto",
                             "compare", "compare"])
        try:
            if action == "type":
                s.box().click(timeout=3000)
                s.box().fill("")
                s.box().press_sequentially(rng.choice(MONKEY_SEARCHES), delay=rng.choice([0, 10, 40]))
            elif action == "enter":
                s.box().press("Enter", timeout=3000)
            elif action == "arrow":
                for _ in range(rng.randint(1, 5)):
                    s.box().press(rng.choice(["ArrowDown", "ArrowUp"]), timeout=3000)
            elif action == "escape":
                s.box().press("Escape", timeout=3000)
            elif action == "link":
                links = s.page.locator("main a[href^='/']")
                if links.count() > 0:
                    links.nth(rng.randrange(min(links.count(), 40))).click(timeout=3000)
            elif action == "compare":
                # In Analytical Mode: add something, take something off, or flip one of the charts' switches.
                if "/compare/" not in s.page.url:
                    s.goto(rng.choice([COMPARE, "/compare/"]))
                move = rng.choice(["add", "add", "remove", "switch", "clear"])
                if move == "add":
                    picker = s.page.get_by_placeholder("Add a professor, class, or subject")
                    picker.fill(rng.choice(MONKEY_SEARCHES), timeout=3000)
                    picker.press("Enter", timeout=3000)
                elif move == "remove":
                    buttons = s.page.locator("button[aria-label^='Remove ']")
                    if buttons.count() > 0:
                        buttons.nth(rng.randrange(buttons.count())).click(timeout=3000)
                elif move == "switch":
                    switch = rng.choice(["Percent", "Students", "Lines", "Bars", "Each grade", "At or above"])
                    s.page.get_by_role("button", name=switch).first.click(timeout=3000)
                else:
                    s.page.get_by_role("button", name="Clear all").click(timeout=3000)
            elif action == "back":
                s.page.go_back(wait_until="domcontentloaded", timeout=5000)
            elif action == "forward":
                s.page.go_forward(wait_until="domcontentloaded", timeout=5000)
            elif action == "reload":
                s.page.reload(wait_until="domcontentloaded", timeout=5000)
            else:
                s.goto(rng.choice(MONKEY_PAGES))
        except Exception:
            pass  # the click landed mid-navigation, or there was nothing to go back to
        s.page.wait_for_timeout(rng.choice([50, 200, 600]))
        if not s.look()["ours"] and s.look()["ready"] == "complete":
            s.goto(rng.choice(MONKEY_PAGES))  # Back went past the first page, to the browser's empty one

    CHAOS.set()
    s.goto("/")
    s.type("beatty mat 1213")
    s.wait_for("the search working once everything is fixed", results_show("MAT 1213", "Sean Beatty"), 30)
    s.goto(COMPARE)
    s.wait_for("Analytical Mode working once everything is fixed", comparison, 30)

# ---------------------------------------------------------------- running them


def run(name, test, browser, origin, results):
    CHAOS.set()
    site = Site(browser, origin)
    started = time.time()
    problem = None
    try:
        test(site)
        if site.saw_blank:
            problem = "a page was blank at some point"
        elif site.errors:
            problem = f"the site's code crashed: {site.errors[0]}"
    except Exception as error:
        said = str(error).splitlines()
        problem = said[0] if isinstance(error, AssertionError) and said else traceback.format_exc(limit=3)
    finally:
        site.close()
        CHAOS.set()

    results.append((name, problem is None, problem))
    print(f"  {'ok  ' if problem is None else 'FAIL'} {name} ({time.time() - started:.1f}s)")
    if problem:
        print(f"       {problem}")


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--monkey", type=int, default=25, help="random runs after the scenarios (default 25)")
    parser.add_argument("--seed", type=int, default=None, help="repeat a monkey run from an earlier seed")
    parser.add_argument("--only", help="run only scenarios whose name contains this")
    parser.add_argument("--headed", action="store_true", help="show the browser")
    parser.add_argument("--browser", choices=["chromium", "firefox", "webkit"], default="chromium")
    args = parser.parse_args()

    if not (SITE / "index.html").exists():
        sys.exit(f"{SITE} isn't built. Build the site first: cd site && npm run build")

    origin = start_server()
    seed = args.seed if args.seed is not None else random.randrange(1_000_000)
    results = []
    with sync_playwright() as playwright:
        browser = getattr(playwright, args.browser).launch(headless=not args.headed)
        print(f"Scenarios ({args.browser}):")
        for test in SCENARIOS:
            if not args.only or args.only in test.__name__:
                run(test.__name__, test, browser, origin, results)
        if args.monkey and not args.only:
            print(f"Monkey ({args.monkey} runs, seed {seed}):")
            rng = random.Random(seed)
            for i in range(args.monkey):
                run_seed = rng.randrange(1_000_000)
                run(f"monkey #{i + 1} (seed {run_seed})", lambda s, r=run_seed: monkey(s, random.Random(r)), browser, origin, results)
        browser.close()

    failed = [name for name, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)} of {len(results)} passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
