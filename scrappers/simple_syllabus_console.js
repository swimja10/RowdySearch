// UTSA Simple Syllabus scraper - browser console version.
//
// 1. Open https://utsa.simplesyllabus.com/en-US/syllabus-library in Chrome.
// 2. Set the Term filter to the terms you want and go to the first page.
// 3. Open DevTools (F12) -> Console, paste this whole file, press Enter.
// 4. Keep the tab open. professors.json lands in Downloads when it finishes.
//
// To stop early and download what it has so far, run:  stopScrape = true
(async () => {
  const MAX_PAGES = 0; // 0 = all pages
  const GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "W"];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const data = {};
  window.stopScrape = false;

  const labelText = () =>
    (document.querySelector(".mat-mdc-paginator-range-label")?.textContent || "").trim();
  const cardSig = () =>
    [...document.querySelectorAll("app-library-doc-card .doc-term-title")]
      .map((e) => e.textContent.trim())
      .join("|");

  function parsePage() {
    let count = 0;
    for (const card of document.querySelectorAll("app-library-doc-card")) {
      const termTitle = card.querySelector(".doc-term-title");
      const subtitle = card.querySelector(".doc-subtitle");
      if (!termTitle || !subtitle) continue;
      // e.g. "Fall 2026 • ACC 2013 003"
      const parts = termTitle.textContent.split("•").map((s) => s.trim());
      if (parts.length !== 2) continue;
      const [semester, code] = parts;
      const tokens = code.split(/\s+/);
      const subject = tokens[0];
      const course = tokens.slice(0, 2).join(" ");
      const section = tokens.slice(2).join(" ");
      let profs = [...card.querySelectorAll(".doc-editor p")]
        .map((p) => p.textContent.trim())
        .filter(Boolean);
      if (!profs.length) profs = ["Unknown"];
      count++;
      for (const prof of profs) {
        const entry = (data[prof] ??= { Department: subject });
        const key = `${course} - ${subtitle.textContent.trim()} (${semester})`;
        if (!entry[key]) {
          entry[key] = { Semester: semester, Sections: [] };
          for (const g of GRADES) entry[key][g] = null;
        }
        if (section && !entry[key].Sections.includes(section)) entry[key].Sections.push(section);
      }
    }
    return count;
  }

  function download() {
    const out = {};
    for (const prof of Object.keys(data).sort()) {
      out[prof] = {
        ...data[prof],
        RMP: {
          "Professor rating": null,
          "Difficulty level": null,
          "5 reviews": Object.fromEntries([1, 2, 3, 4, 5].map((i) => [`Review ${i}`, null])),
        },
      };
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "professors.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log(`downloaded professors.json with ${Object.keys(out).length} professors`);
  }

  try {
    let n = 0;
    while (true) {
      n++;
      const label = labelText(); // "1 – 50 of 20834"
      const sig = cardSig();
      const cards = parsePage();
      console.log(`page ${n}: ${label} (${cards} cards, ${Object.keys(data).length} professors)`);

      const nums = (label.match(/\d+/g) || []).map(Number);
      const atEnd = nums.length >= 3 && nums[1] >= nums[2];
      const next = document.querySelector("button.mat-mdc-paginator-navigation-next");
      const disabled =
        !next ||
        next.disabled ||
        next.getAttribute("aria-disabled") === "true" ||
        next.classList.contains("mat-mdc-button-disabled");
      if (window.stopScrape || atEnd || disabled || (MAX_PAGES && n >= MAX_PAGES)) break;

      next.click();
      // wait for the range label AND the cards to change, i.e. the next page rendered
      const start = Date.now();
      while (labelText() === label || cardSig() === sig || !cardSig()) {
        if (Date.now() - start > 60000) throw new Error(`page after "${label}" did not load in 60s`);
        await sleep(100);
      }
      await sleep(300); // small pause to be polite to the server
    }
  } catch (e) {
    console.error("stopped early:", e);
  }
  download(); // always save whatever was collected
})();
