// Rate My Professors scraper for UTSA - browser console version.
//
// 1. Open https://www.ratemyprofessors.com in Chrome (any page on that site).
// 2. Open DevTools (F12) -> Console, paste this whole file, press Enter.
// 3. RMP.json lands in Downloads when it finishes.
//
// To stop early and download what it has so far, run:  stopScrape = true
(async () => {
  const SCHOOL_NAME = "University of Texas at San Antonio";
  const PAGE_SIZE = 100; // professors per request
  const REVIEWS = 5;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const data = {};
  window.stopScrape = false;

  // heartbeat: prints every 10s so you can see it is alive even while waiting
  const startedAt = Date.now();
  let lastProgress = Date.now();
  let status = "starting";
  const heartbeat = setInterval(() => {
    const secs = (ms) => Math.round(ms / 1000);
    console.log(
      `[heartbeat ${new Date().toLocaleTimeString()}] still running - ${status} - ` +
      `${Object.keys(data).length} professors so far, running ${secs(Date.now() - startedAt)}s, ` +
      `last progress ${secs(Date.now() - lastProgress)}s ago`
    );
  }, 10000);

  async function gql(query, variables) {
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch("/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Basic dGVzdDp0ZXN0" },
          body: JSON.stringify({ query, variables }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.errors) {
          const e = new Error("GraphQL error: " + JSON.stringify(json.errors));
          e.fatal = true; // a bad query will not fix itself, do not retry
          throw e;
        }
        return json.data;
      } catch (e) {
        if (e.fatal || attempt >= 5) throw e;
        console.warn(`request failed (${e.message}), retry ${attempt} of 4`);
        await sleep(3000 * attempt);
      }
    }
  }

  const SCHOOL_QUERY = `query ($query: SchoolSearchQuery!) {
    newSearch { schools(query: $query) { edges { node { id legacyId name city state } } } }
  }`;

  const TEACHER_QUERY = `query ($count: Int!, $cursor: String, $query: TeacherSearchQuery!) {
    newSearch {
      teachers(query: $query, first: $count, after: $cursor) {
        resultCount
        pageInfo { hasNextPage endCursor }
        edges { node {
          legacyId firstName lastName department
          avgRating avgDifficulty numRatings wouldTakeAgainPercent
          ratings(first: ${REVIEWS}) { edges { node { comment class date } } }
        } }
      }
    }
  }`;

  function download() {
    const out = {};
    for (const name of Object.keys(data).sort()) out[name] = data[name];
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "RMP.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log(`downloaded RMP.json with ${Object.keys(out).length} professors`);
  }

  function addTeacher(t) {
    const hasRatings = t.numRatings > 0;
    const reviews = {};
    const edges = t.ratings?.edges || [];
    for (let i = 0; i < REVIEWS; i++) {
      const r = edges[i]?.node;
      reviews[`Review ${i + 1}`] = r?.comment ? r.comment.trim() : null;
    }
    const entry = {
      Department: t.department || null,
      RMP: {
        "Professor rating": hasRatings ? t.avgRating : null,
        "Difficulty level": hasRatings ? t.avgDifficulty : null,
        "Number of ratings": t.numRatings,
        "Would take again %": hasRatings && t.wouldTakeAgainPercent >= 0 ? Math.round(t.wouldTakeAgainPercent) : null,
        Link: `https://www.ratemyprofessors.com/professor/${t.legacyId}`,
        "5 reviews": reviews,
      },
    };
    let name = `${(t.firstName || "").trim()} ${(t.lastName || "").trim()}`.trim();
    const existing = data[name];
    if (existing) {
      // two RMP profiles with the same name: the one with more ratings keeps the plain name
      if (existing.RMP["Number of ratings"] >= t.numRatings) {
        name = `${name} [RMP ${t.legacyId}]`;
      } else {
        const oldId = existing.RMP.Link.split("/").pop();
        data[`${name} [RMP ${oldId}]`] = existing;
      }
    }
    data[name] = entry;
  }

  try {
    const s = await gql(SCHOOL_QUERY, { query: { text: SCHOOL_NAME } });
    const schools = s.newSearch.schools.edges.map((e) => e.node);
    const school = schools.find((x) => x.name.trim().toLowerCase() === SCHOOL_NAME.toLowerCase());
    if (!school) {
      console.log("schools found:", schools);
      throw new Error(`no school named exactly "${SCHOOL_NAME}"`);
    }
    console.log(`school: ${school.name}, ${school.city}, ${school.state} (RMP school ${school.legacyId})`);

    let cursor = null;
    let fetched = 0;
    while (true) {
      const d = await gql(TEACHER_QUERY, {
        count: PAGE_SIZE,
        cursor,
        query: { text: "", schoolID: school.id, fallback: false },
      });
      const t = d.newSearch.teachers;
      for (const e of t.edges) addTeacher(e.node);
      fetched += t.edges.length;
      console.log(`${fetched} of ${t.resultCount} professors`);
      lastProgress = Date.now();
      status = `fetched ${fetched} of ${t.resultCount}`;
      if (window.stopScrape || !t.pageInfo.hasNextPage || !t.edges.length) break;
      cursor = t.pageInfo.endCursor;
      await sleep(500); // be polite to the server
    }
  } catch (e) {
    console.error("stopped early:", e);
  }
  clearInterval(heartbeat);
  if (Object.keys(data).length) download();
  console.log("finished - the script has stopped");
})();
