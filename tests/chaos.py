"""Chaos test: breaks RowdySearch on purpose and checks that it recovers.

Like Netflix's Chaos Monkey, it makes the extension's own files fail while it runs: slow or failed
downloads, cut-off and corrupted data, and parts of the sidebar that crash. Each scenario checks
that the sidebar never goes see-through or blank, says what's wrong, and comes back once things
work again, with reloading as the last resort.

It runs the built extension (dist/ and data/professors.json, so `npm run build` first) in Playwright's
Chromium: a fake Schedule Planner page runs the real content script, and its sidebar loads from a
local server that injects the faults. Run it with:

    .venv/bin/python tests/chaos.py              every scenario, then 25 random monkey runs
    .venv/bin/python tests/chaos.py --monkey 100 more random runs
    .venv/bin/python tests/chaos.py --only plotly --headed   one scenario, in a visible window
"""

import argparse
import json
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
SIDEBAR_WIDTH = 420  # content/sidebar.ts

# The fake registration page: one Schedule Planner table, plus a stand-in for the chrome.* APIs the
# content script uses, pointing the sidebar at the chaos server (a different origin, like the real one).
HOST_PAGE = """<!doctype html><html><head><meta charset="utf-8"><title>Schedule Planner</title></head>
<body style="background:#fff;font-family:sans-serif">
<table><thead><tr><th>Subject</th><th>Course</th><th>Section</th><th>Instructor</th></tr></thead>
<tbody>
<tr><td>PHY</td><td>1943</td><td>001</td><td><span>Malik, Taha</span></td></tr>
<tr><td>POL</td><td>1013</td><td>002</td><td><span>Esparza, Henry</span></td></tr>
<tr><td>CS</td><td>9999</td><td>001</td><td></td></tr>
<tr><td>IS</td><td>7063</td><td>001</td><td></td></tr>
</tbody></table>
<script>window.chrome = { runtime: {
  getURL: (path) => "SIDEBAR_ORIGIN/" + path,
  onMessage: { addListener() {} },
} };</script>
<script src="SIDEBAR_ORIGIN/dist/content.js"></script>
</body></html>"""

TYPES = {".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".png": "image/png"}

# ---------------------------------------------------------------- the chaos server

class Chaos:
    """The faults to inject. Each rule matches request paths containing `path`; `times` limits it to
    the first few matching requests (a hiccup that goes away by itself)."""

    def __init__(self):
        self.rules = []
        self.monkey = None  # (probability, random.Random) for random faults on every file
        self.release = threading.Event()  # lets requests stuck in a "hang" finish
        self.log = []
        self.lock = threading.Lock()

    def set(self, rules=(), monkey=None):
        with self.lock:
            self.release.set()
            self.release = threading.Event()
            self.rules = [dict(rule) for rule in rules]
            self.monkey = monkey
            self.log = []

    def fault_for(self, path):
        with self.lock:
            for rule in self.rules:
                if rule["path"] in path and rule.get("times", 1) > 0:
                    if "times" in rule:
                        rule["times"] -= 1
                    return rule
            if self.monkey and (path.startswith("/dist/") or path.startswith("/data/")) and not path.endswith(".html"):
                probability, rng = self.monkey
                if rng.random() < probability:
                    kind = rng.choice(["status", "drop", "truncate", "delay"])
                    return {"status": {"status": 500}, "drop": {"drop": True}, "truncate": {"truncate": rng.random()},
                            "delay": {"delay": rng.uniform(0.5, 6)}}[kind]
            return None


CHAOS = Chaos()
_corrupted_data = None


def corrupted_professors():
    """data/professors.json with a few professors broken in the ways a bad scrape could break them."""
    global _corrupted_data
    if _corrupted_data is None:
        data = json.loads((ROOT / "data/professors.json").read_text(encoding="utf-8"))
        data["Taha Malik"]["courses"]["PHY 1943"]["semesters"] = {}  # a course with no semesters
        names = [name for name in data if name not in ("Taha Malik", "Henry Esparza")]
        data[names[0]]["courses"] = None
        data[names[1]]["rmp"] = None
        data[names[2]] = "not a professor"
        first_course = next(iter(data[names[3]]["courses"].values()))
        first_section = next(iter(first_course["semesters"].values()))[0]
        first_section["grades"] = "garbage"
        first_section["instructorEvaluation"] = "five"
        # Break POL 1013's other professors in ways that reach the course page's medians and syllabus.
        pol = [name for name, professor in data.items() if isinstance(professor, dict) and name != "Henry Esparza"
               and "POL 1013" in (professor.get("courses") or {})]
        if pol[0:1] and data[pol[0]]["rmp"]:
            data[pol[0]]["rmp"][0]["avgRating"] = "great"
            data[pol[0]]["rmp"][0]["wouldTakeAgainPercent"] = None
        for name in pol[1:3]:
            for sections in data[name]["courses"]["POL 1013"]["semesters"].values():
                for section in sections:
                    section["instructorEvaluation"] = "4.5"
                    section["courseEvaluation"] = None
                    section["syllabusCode"] = 12345
        if pol[3:4]:
            data[pol[3]]["courses"]["POL 1013"]["semesters"] = {}
        _corrupted_data = json.dumps(data).encode()
    return _corrupted_data


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]
        if path == "/host.html":
            return self.send(200, HOST_PAGE.replace("SIDEBAR_ORIGIN", self.server.sidebar_origin).encode(), ".html")

        fault = CHAOS.fault_for(path)
        if fault:
            CHAOS.log.append((path, {k: v for k, v in fault.items() if k not in ("path", "times")}))

        file = (ROOT / path.lstrip("/")).resolve()
        allowed = file.is_relative_to(ROOT / "dist") or file == ROOT / "data/professors.json"
        if not allowed or not file.is_file():
            return self.send(404, b"not found", ".txt")
        body = corrupted_professors() if fault and fault.get("corrupt") else file.read_bytes()

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
                body = body[: int(len(body) * fault["truncate"])]
            for old, new in fault.get("replace", []):
                if old.encode() not in body:
                    raise RuntimeError(f"chaos: {old!r} isn't in {path} any more; update the scenario")
                body = body.replace(old.encode(), new.encode(), 1)
        self.send(200, body, file.suffix)

    def send(self, status, body, suffix):
        try:
            self.send_response(status)
            self.send_header("Content-Type", TYPES.get(suffix, "text/plain"))
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def drop(self):
        self.close_connection = True
        try:
            self.connection.shutdown(socket.SHUT_RDWR)
        except OSError:
            pass


def start_server():
    """Two servers on two ports, so the sidebar's origin differs from the page's, like the real thing."""
    servers = []
    for _ in range(2):
        server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        server.daemon_threads = True
        threading.Thread(target=server.serve_forever, daemon=True).start()
        servers.append(server)
    sidebar_origin = f"http://127.0.0.1:{servers[1].server_port}"
    for server in servers:
        server.sidebar_origin = sidebar_origin
    return f"http://127.0.0.1:{servers[0].server_port}/host.html"

# ---------------------------------------------------------------- watching the sidebar


def opaque(color):
    if not color or color == "transparent":
        return False
    numbers = re.findall(r"[\d.]+", color)
    return len(numbers) == 3 or (len(numbers) == 4 and float(numbers[3]) == 1)


class Sidebar:
    """One run: a fresh browser tab on the fake page, and ways to look at and click the sidebar."""

    def __init__(self, browser, host_url):
        self.context = browser.new_context(viewport={"width": 1280, "height": 800})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto(host_url)
        self.page.get_by_role("button", name="Search").first.wait_for(timeout=10_000)
        self.saw_see_through = False
        self.saw_nan = False

    def close(self):
        self.context.close()

    def frame(self):
        return next((f for f in self.page.frames if "/dist/index.html" in f.url), None)

    def look(self):
        """What the sidebar shows right now."""
        host = self.page.evaluate("""() => {
            const f = document.querySelector('iframe');
            if (!f) return null;
            const s = getComputedStyle(f);
            return { bg: s.backgroundColor, display: s.display, width: f.getBoundingClientRect().width };
        }""")
        inside = {"text": "", "html": "", "body": ""}
        frame = self.frame()
        if frame:
            try:
                inside = frame.evaluate("""() => ({
                    text: document.body ? document.body.innerText : '',
                    html: getComputedStyle(document.documentElement).backgroundColor,
                    body: document.body ? getComputedStyle(document.body).backgroundColor : '',
                })""")
            except Exception:
                pass  # the frame is between documents
        state = {**inside, "iframe": host}
        shown = host and host["display"] != "none"
        state["see_through"] = bool(shown and not any(opaque(c) for c in (host["bg"], inside["html"], inside["body"]))
                                    and not inside["text"].strip())
        self.saw_see_through |= state["see_through"]
        self.saw_nan |= "NaN" in inside["text"]
        return state

    def wait_for(self, what, test, timeout):
        """Watches the sidebar (and notes any see-through moment) until test(state) is true."""
        deadline = time.time() + timeout
        while True:
            state = self.look()
            if test(state):
                return state
            if time.time() > deadline:
                text = " ".join(state["text"].split())[:160]
                raise AssertionError(f"waited {timeout}s for {what}; sidebar shows: {text!r} (iframe {state['iframe']})")
            self.page.wait_for_timeout(100)

    def open_section(self, row=0):
        self.page.get_by_role("button", name="Search").nth(row).click()

    def click(self, name, exact=True):
        self.frame().get_by_role("button", name=name, exact=exact).first.click()

    def click_link(self, name):
        self.frame().get_by_role("link", name=name).first.click()

    def has_button(self, name):
        frame = self.frame()
        return bool(frame) and frame.get_by_role("button", name=name, exact=True).count() > 0


def shows(*words):
    """Section titles are drawn in capitals, so this ignores case."""
    return lambda state: all(word.lower() in state["text"].lower() for word in words)


def malik_class(state):
    return shows("Taha Malik", "PHY 1943")(state)

# ---------------------------------------------------------------- scenarios
# Each one sets up faults, opens the sidebar the way a student would, and checks what happens.


def healthy(s):
    s.open_section()
    s.wait_for("Taha Malik's PHY 1943 page", malik_class, 20)


def slow_data(s):
    CHAOS.set([{"path": "professors.json", "delay": 6}])
    s.open_section()
    s.wait_for("a loading message", shows("Loading"), 5)
    s.wait_for("the class page once the data arrives", malik_class, 20)


def data_hiccup(s):
    CHAOS.set([{"path": "professors.json", "status": 500, "times": 2}])
    s.open_section()
    s.wait_for("the class page after retrying by itself", malik_class, 20)


def data_down(s):
    CHAOS.set([{"path": "professors.json", "status": 500}])
    s.open_section()
    s.wait_for("an error with a Try again button", lambda st: "Try again" in st["text"] and "Loading" not in st["text"], 30)
    CHAOS.set()
    s.click("Try again")
    s.wait_for("the class page after Try again", malik_class, 20)


def data_cut_off(s):
    CHAOS.set([{"path": "professors.json", "truncate": 0.5}])
    s.open_section()
    s.wait_for("an error with a Try again button", lambda st: "Try again" in st["text"] and "Loading" not in st["text"], 30)
    CHAOS.set()
    s.click("Try again")
    s.wait_for("the class page after Try again", malik_class, 20)


def data_hangs(s):
    CHAOS.set([{"path": "professors.json", "hang": True}])
    s.open_section()
    s.wait_for("a 'taking longer than usual' message", shows("longer than usual"), 15)
    CHAOS.set()
    s.click("Try again")
    s.wait_for("the class page after Try again", malik_class, 25)


def corrupted_data(s):
    CHAOS.set([{"path": "professors.json", "corrupt": True}])
    s.open_section()
    s.wait_for("Taha Malik's page despite broken professors in the data", shows("Taha Malik"), 20)
    s.click("Home")
    s.wait_for("the home page", shows("Search any professor"), 5)


def no_charts(s):
    CHAOS.set([{"path": "plotly.js", "status": 404}])
    s.open_section()
    s.wait_for("the class page without the chart library", malik_class, 20)
    s.click("Analytical Mode")
    s.wait_for("Analytical Mode's table with a chart error", shows("Side by side", "couldn't load"), 15)
    s.click("✕ Close")
    s.wait_for("the sidebar back at its normal width", lambda st: st["iframe"]["width"] == SIDEBAR_WIDTH and malik_class(st), 10)


def charts_come_back(s):
    CHAOS.set([{"path": "plotly.js", "status": 500, "times": 1}])
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("Analytical Mode")
    s.wait_for("a chart error with Try again", shows("couldn't load", "Try again"), 15)
    s.click("Try again")
    s.wait_for("the charts drawn after Try again", lambda st: "couldn't load" not in st["text"] and s.frame().locator(".main-svg").count() > 0, 15)


def no_libraries(s):
    CHAOS.set([{"path": "libraries.js", "status": 404}])
    s.open_section()
    s.wait_for("a loading message that isn't see-through", shows("Loading"), 5)
    s.wait_for("a Reload link once it's clearly stuck", shows("Reload"), 20)
    CHAOS.set()
    s.click_link("Reload")
    s.wait_for("the sidebar working after Reload", shows("Search any professor"), 20)


def no_styles(s):
    CHAOS.set([{"path": "sidebar.css", "status": 404}])
    s.open_section()
    s.wait_for("the class page, unstyled but readable", malik_class, 20)


def styles_cut_off(s):
    # A stylesheet cut off partway applies only some of its rules. Found by the monkey: the Analytical
    # Mode button (just an icon) shrank to nothing when its size rules were in the missing part.
    CHAOS.set([{"path": "sidebar.css", "truncate": 0.2}])
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("Analytical Mode")
    s.wait_for("Analytical Mode", shows("Side by side"), 15)


def page_crashes(s):
    CHAOS.set([{"path": "sidebar.js", "replace": [("function ClassPage(t0) {", "function ClassPage(t0) { throw new Error('chaos: ClassPage');")]}])
    s.open_section()
    s.wait_for("a message that this page broke", shows("went wrong"), 20)
    s.click("Home")
    s.wait_for("the home page after the crash", shows("Search any professor"), 5)


def chart_crashes(s):
    CHAOS.set([{"path": "sidebar.js", "replace": [("function MedianChart(t0) {", "function MedianChart(t0) { throw new Error('chaos: MedianChart');")]}])
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("Analytical Mode")
    s.wait_for("the rest of Analytical Mode around the broken chart", shows("Side by side", "went wrong"), 15)
    s.click("✕ Close")
    s.wait_for("the sidebar back at its normal width", lambda st: st["iframe"]["width"] == SIDEBAR_WIDTH, 10)


def analytics_crashes(s):
    CHAOS.set([{"path": "sidebar.js", "replace": [("function AnalyticsMode() {", "function AnalyticsMode() { throw new Error('chaos: AnalyticsMode');")]}])
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("Analytical Mode")
    s.wait_for("an error instead of a frozen full-screen panel", shows("went wrong"), 10)
    s.wait_for("the sidebar not stuck covering the page", lambda st: st["iframe"]["width"] == SIDEBAR_WIDTH, 5)
    s.click("Back to the sidebar")
    s.wait_for("the class page again", malik_class, 5)


def bad_address(s):
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.page.evaluate("() => { document.querySelector('iframe').src = document.querySelector('iframe').src.split('#')[0] + '#%7Bnot-json'; }")
    s.page.wait_for_timeout(500)
    s.wait_for("the sidebar still working after a garbled address", lambda st: st["text"].strip() != "" and "went wrong" not in st["text"], 5)


def empty_instructor(s):
    s.open_section(row=2)  # a row with no instructor and a course nobody has taught
    s.wait_for("the sidebar opening anyway", lambda st: st["text"].strip() != "" and not st["see_through"], 20)


def course_page(s):
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("PHY 1943")
    s.wait_for("the course page's medians and latest syllabus",
               shows("Median Grade (Every Professor)", "Bluebook", "Median of", "Rate My Professors", "Latest syllabus", "syllabus"), 10)
    s.click("← Back")
    s.wait_for("the class page again", malik_class, 5)


def course_page_empty(s):
    s.open_section(row=3)  # IS 7063: no syllabus, no Bluebook results, nobody on RMP
    s.wait_for("the course page saying what it doesn't have",
               shows("IS 7063", "Median Grade (Every Professor)", "No Bluebook evaluations yet",
                     "None of its professors are on Rate My Professors", "No syllabus"), 20)


def course_page_corrupted(s):
    CHAOS.set([{"path": "professors.json", "corrupt": True}])
    s.open_section(row=1)
    s.wait_for("Henry Esparza's POL 1013 page", shows("Henry Esparza", "POL 1013"), 20)
    s.click("POL 1013")
    s.wait_for("POL 1013's course page despite broken professors",
               lambda st: shows("Median Grade (Every Professor)", "Median of", "Latest syllabus")(st) and not shows("went wrong")(st), 10)


def course_stats_crash(s):
    CHAOS.set([{"path": "sidebar.js", "replace": [("function CourseStats(t0) {", "function CourseStats(t0) { throw new Error('chaos: CourseStats');")]}])
    s.open_section()
    s.wait_for("the class page", malik_class, 20)
    s.click("PHY 1943")
    s.wait_for("a message that the course page broke", shows("went wrong"), 10)
    s.click("← Back")
    s.wait_for("the class page after going back", malik_class, 5)


def course_syllabus_crash(s):
    CHAOS.set([{"path": "sidebar.js", "replace": [("function LatestSyllabus(t0) {", "function LatestSyllabus(t0) { throw new Error('chaos: LatestSyllabus');")]}])
    s.open_section()
    s.wait_for("the class page's broken syllabus box, and the rest of the page", lambda st: malik_class(st) and shows("went wrong", "Every semester")(st), 20)
    s.click("PHY 1943")
    s.wait_for("the course page's medians around the broken syllabus box",
               shows("Median Grade (Every Professor)", "Median of", "went wrong", "Professors, most recent first"), 10)


SCENARIOS = [healthy, slow_data, data_hiccup, data_down, data_cut_off, data_hangs, corrupted_data, no_charts,
             charts_come_back, no_libraries, no_styles, styles_cut_off, page_crashes, chart_crashes, analytics_crashes, bad_address,
             empty_instructor, course_page, course_page_empty, course_page_corrupted, course_stats_crash,
             course_syllabus_crash]


def monkey(s, rng):
    """Random faults on every file the sidebar loads. Whatever happens, the sidebar must end up working,
    or saying what's wrong with a way out; then, once the faults stop, that way out must work."""
    CHAOS.set(monkey=(0.3, rng))
    s.open_section(row=rng.choice([0, 1]))
    working = lambda st: (shows("Search any professor")(st) or shows("Median")(st)) and not shows("went wrong")(st)
    way_out = lambda st: shows("Try again")(st) or shows("Reload")(st)
    state = s.wait_for("the sidebar working or offering a way out", lambda st: working(st) or way_out(st), 45)

    course = ["PHY 1943", "POL 1013"][0 if "PHY 1943" in state["text"] else 1]
    if working(state) and rng.random() < 0.5 and s.has_button(course):
        s.click(course)
        state = s.wait_for("the course page", shows("Median Grade (Every Professor)"), 10)

    if working(state) and s.has_button("Analytical Mode"):
        s.click("Analytical Mode")
        s.wait_for("Analytical Mode", shows("Side by side"), 20)
        s.click("✕ Close")
        state = s.wait_for("the sidebar back at its normal width", lambda st: st["iframe"]["width"] == SIDEBAR_WIDTH, 10)

    CHAOS.set()
    for _ in range(2):
        if working(state):
            break
        if s.has_button("Try again"):
            s.click("Try again")
        else:
            s.click_link("Reload")
        state = s.wait_for("the sidebar working after the faults stop", lambda st: working(st) or way_out(st), 30)
    if not working(state):
        raise AssertionError("still not working after the faults stopped and two tries")

# ---------------------------------------------------------------- running them


def run(name, test, browser, host_url, results):
    CHAOS.set()
    s = Sidebar(browser, host_url)
    started = time.time()
    try:
        test(s)
        if s.saw_see_through:
            raise AssertionError("the sidebar was see-through and empty at some point")
        if s.saw_nan:
            raise AssertionError("the sidebar showed NaN at some point")
        results.append((name, True, ""))
        print(f"  PASS  {name} ({time.time() - started:.1f}s)")
    except Exception as error:
        message = str(error).splitlines()[0] if str(error) else repr(error)
        if s.saw_see_through and "see-through" not in message:
            message += " [was also see-through at some point]"
        faults = sorted({f"{path.rsplit('/', 1)[-1]}:{next(iter(f))}" for path, f in CHAOS.log})
        results.append((name, False, message))
        print(f"  FAIL  {name} ({time.time() - started:.1f}s): {message}")
        if faults:
            print(f"        faults: {', '.join(faults)}")
        if s.errors:
            print(f"        page errors: {s.errors[:3]}")
        if not isinstance(error, AssertionError):
            traceback.print_exc()
    finally:
        CHAOS.set()
        s.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--monkey", type=int, default=25, help="random runs after the scenarios (default 25)")
    parser.add_argument("--seed", type=int, default=None, help="repeat a monkey run from an earlier seed")
    parser.add_argument("--only", help="run only scenarios whose name contains this")
    parser.add_argument("--headed", action="store_true", help="show the browser")
    args = parser.parse_args()

    host_url = start_server()
    seed = args.seed if args.seed is not None else random.randrange(1_000_000)
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=not args.headed)
        print("Scenarios:")
        for test in SCENARIOS:
            if not args.only or args.only in test.__name__:
                run(test.__name__, test, browser, host_url, results)
        if args.monkey and not args.only:
            print(f"Monkey ({args.monkey} runs, seed {seed}):")
            rng = random.Random(seed)
            for i in range(args.monkey):
                run_seed = rng.randrange(1_000_000)
                run(f"monkey #{i + 1} (seed {run_seed})", lambda s, r=run_seed: monkey(s, random.Random(r)), browser, host_url, results)
        browser.close()

    failed = [name for name, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)} of {len(results)} passed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
