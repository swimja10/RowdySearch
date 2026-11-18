import { prefetch } from "astro:prefetch";
import { onSearchState, searchFor, searchState, startSearch } from "./connection.ts";
import type { SearchResponse } from "./engine.ts";

// The search box, on every page. It draws results as you type and goes to the best one on Enter,
// the same way the extension's sidebar does. The searching itself happens in connection.ts.

// How long after the last keystroke the page Enter would open starts loading ahead of time.
const PREFETCH_AFTER = 120;

const OPTION_STYLE = "flex items-center justify-between gap-3 px-3 py-2 outline-none";
const ACTIVE_STYLE = "bg-zinc-700";
const LINK_STYLE = "text-orange-400 hover:text-orange-300 hover:underline";

function element<Tag extends keyof HTMLElementTagNameMap>(tag: Tag, style: string, text?: string): HTMLElementTagNameMap[Tag] {
  const made = document.createElement(tag);
  made.className = style;
  if (text !== undefined) made.textContent = text;
  return made;
}

function formatTime(milliseconds: number): string {
  return milliseconds < 1 ? "under 1 ms" : `${Math.round(milliseconds)} ms`;
}

function setUp(form: HTMLFormElement) {
  const input = form.querySelector("input")!;
  const panel = form.querySelector<HTMLElement>("[data-search-panel]")!;
  const indexUrl = form.dataset.searchIndex!;

  let shown: SearchResponse | null = null; // the results on screen
  let active = -1; // which option the arrow keys are on, or -1 for none
  let enterIsWaiting = false; // Enter was pressed before the answer arrived
  let prefetchTimer: ReturnType<typeof setTimeout> | undefined;

  const typed = () => input.value.trim();
  const options = () => [...panel.querySelectorAll<HTMLAnchorElement>("[data-option]")];

  function open() {
    panel.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function close() {
    panel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    active = -1;
  }

  function draw(...parts: HTMLElement[]) {
    panel.replaceChildren(...parts);
    active = -1;
    input.removeAttribute("aria-activedescendant");
  }

  function drawStatus(text: string) {
    shown = null;
    draw(element("p", "px-3 py-3 text-sm text-zinc-400", text));
  }

  // The search couldn't load: say so, offer to try again, and point at the pages that list everything.
  function drawFailure() {
    shown = null;
    const message = element("div", "flex flex-col gap-2 px-3 py-3 text-sm");
    message.append(element("p", "text-zinc-300", "Search couldn't load. Check your connection and try again."));

    const retry = element("button", "self-start rounded bg-orange-600 px-2 py-1 text-zinc-100 hover:bg-orange-500", "Try again");
    retry.type = "button";
    retry.addEventListener("click", () => {
      startSearch(indexUrl);
      input.focus();
    });

    const browse = element("p", "text-zinc-400", "Or browse ");
    const subjects = element("a", LINK_STYLE, "every subject");
    subjects.href = "/subjects/";
    const professors = element("a", LINK_STYLE, "every professor");
    professors.href = "/professors/";
    browse.append(subjects, " and ", professors, ".");

    message.append(retry, browse);
    draw(message);
  }

  function option(url: string, number: number): HTMLAnchorElement {
    const link = element("a", OPTION_STYLE);
    link.href = url;
    link.id = `${input.id}-option-${number}`;
    link.setAttribute("role", "option");
    link.dataset.option = "";
    // Start loading a result's page as soon as it's pointed at, so the click feels instant.
    for (const hint of ["pointerenter", "touchstart", "focus"]) link.addEventListener(hint, () => prefetch(url), { passive: true });
    return link;
  }

  function drawResults(response: SearchResponse) {
    shown = response;
    if (response.target === null) {
      draw(element("p", "px-3 py-3 text-sm text-zinc-400", `No matches for "${response.query}".`));
      return;
    }

    const list = element("div", "flex flex-col");
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", "Search results");

    // First, where Enter goes.
    const target = option(response.target.url, 0);
    const targetText = element("span", "flex min-w-0 flex-col");
    targetText.append(
      element("span", "truncate font-semibold text-orange-400", response.target.label),
      element("span", "truncate text-xs text-zinc-400", response.target.detail),
    );
    target.append(targetText, element("span", "shrink-0 rounded border border-zinc-600 px-1.5 py-0.5 text-xs text-zinc-400", "Enter"));
    list.append(target);

    // Then each professor's class that matched. The one Enter already goes to isn't listed twice.
    const others = response.results.filter((result) => result.url !== response.target!.url);
    others.forEach((result, number) => {
      const row = option(result.url, number + 1);
      row.classList.add("border-t", "border-zinc-700");
      const text = element("span", "flex min-w-0 flex-col");
      text.append(
        element("span", "truncate font-medium", result.professor),
        element("span", "truncate text-xs text-zinc-400", `${result.code} · ${result.title}`),
      );
      row.append(text, element("span", "shrink-0 text-xs text-zinc-500", result.lastTaught));
      list.append(row);
    });

    const matches = `${response.total.toLocaleString("en-US")} ${response.total === 1 ? "match" : "matches"}`;
    const best = response.total > response.results.length ? `, showing the best ${response.results.length}` : "";
    const footer = element("p", "border-t border-zinc-700 px-3 py-1.5 text-xs text-zinc-500", `${matches}${best} · ${formatTime(response.milliseconds)}`);

    draw(list, footer);
  }

  function go(url: string) {
    window.location.href = url;
  }

  // Asks for the results for what's typed, and draws them unless more has been typed since.
  function ask() {
    const query = typed();
    if (query === "") return;
    if (searchState() !== "ready") {
      if (searchState() === "failed") drawFailure();
      else if (shown === null) drawStatus("Loading search…");
      return;
    }

    searchFor(query).then((response) => {
      if (typed() !== query) return;
      drawResults(response);
      if (response.target === null) return;

      if (enterIsWaiting) {
        go(response.target.url);
        return;
      }
      clearTimeout(prefetchTimer);
      prefetchTimer = setTimeout(() => {
        if (typed() === query) prefetch(response.target!.url);
      }, PREFETCH_AFTER);
    });
  }

  function typedSomething() {
    enterIsWaiting = false;
    startSearch(indexUrl);
    if (typed() === "") {
      shown = null;
      close();
      return;
    }
    open();
    ask();
  }

  function moveTo(next: number) {
    const all = options();
    if (all.length === 0) return;
    all[active]?.classList.remove(ACTIVE_STYLE);
    all[active]?.removeAttribute("aria-selected");

    active = (next + all.length) % all.length;
    const link = all[active];
    link.classList.add(ACTIVE_STYLE);
    link.setAttribute("aria-selected", "true");
    link.scrollIntoView({ block: "nearest" });
    input.setAttribute("aria-activedescendant", link.id);
    prefetch(link.href);
  }

  input.addEventListener("input", typedSomething);
  input.addEventListener("focus", () => {
    startSearch(indexUrl);
    if (typed() !== "") {
      open();
      ask();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (panel.hidden) return;
      event.preventDefault();
      moveTo(event.key === "ArrowDown" ? active + 1 : active - 1);
    } else if (event.key === "Escape") {
      if (!panel.hidden) event.preventDefault();
      close();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (typed() === "") return;
      const picked = options()[active];
      if (picked !== undefined) go(picked.href);
      // The answer on screen is for what's typed: go. Otherwise go as soon as it arrives.
      else if (shown !== null && shown.query === typed() && shown.target !== null) go(shown.target.url);
      else if (shown === null || shown.query !== typed()) {
        enterIsWaiting = true;
        open();
        ask();
      }
    }
  });

  // The search finished loading, or failed, while the box was in use: catch up.
  onSearchState((state) => {
    if (panel.hidden || typed() === "") return;
    if (state === "failed") drawFailure();
    else if (state === "loading") drawStatus("Loading search…");
    else ask();
  });

  // Clicking or tabbing anywhere else closes the results.
  form.addEventListener("focusout", (event) => {
    if (!form.contains(event.relatedTarget as Node | null)) close();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!form.contains(event.target as Node)) close();
  });

  // The home page's box is ready to type in on a computer. On a phone that would pop the keyboard up.
  if (form.dataset.searchAutofocus !== undefined && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    input.focus({ preventScroll: true });
  }
}

const forms = [...document.querySelectorAll<HTMLFormElement>("form[data-search]")];
forms.forEach(setUp);

if (forms.length > 0) {
  const indexUrl = forms[0].dataset.searchIndex!;

  // Get the search ready once the page itself has finished loading, so it's there before the first
  // keystroke. Someone saving data only gets it when they touch the search box.
  const savesData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  if (!savesData) {
    const whenIdle = () => ("requestIdleCallback" in window ? requestIdleCallback(() => startSearch(indexUrl), { timeout: 2000 }) : setTimeout(() => startSearch(indexUrl), 1200));
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
  }

  // "/" jumps to the search box, as on most sites with a search.
  document.addEventListener("keydown", (event) => {
    const typingAlready = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    if (event.key !== "/" || typingAlready || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    forms[0].querySelector("input")!.focus();
  });
}
