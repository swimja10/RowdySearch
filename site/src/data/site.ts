import { STORE_LINK } from "../../../src/utils/links.ts";

// Facts about the site that more than one page uses.
export const SITE_NAME = "RowdySearch";
export const SITE_URL = "https://rowdysearch.com";
export const CREATOR = "Jacob Swim";
export const CONTACT_EMAIL = "rowdysearch@gmail.com";

export const CHROME_LINK = STORE_LINK;
export const FIREFOX_LINK = "https://addons.mozilla.org/en-US/firefox/addon/rowdysearch/";

// The picture shown when a link to the site is sent in GroupMe, Discord, iMessage, and so on.
// scripts/make_preview_image.py draws it.
export const PREVIEW_IMAGE = `${SITE_URL}/preview.png`;
export const PREVIEW_IMAGE_SAYS = "RowdySearch: pick the right UTSA professor. Grade data, Bluebook, Rate My Professors, and syllabi, in one search.";

export const SEARCH_PLACEHOLDER = "Professor, class, or subject";

type NavLink = { href: string; label: string };

// The links in the header, on every page.
export const HEADER_LINKS: NavLink[] = [
  { href: "/subjects/", label: "Subjects" },
  { href: "/professors/", label: "Professors" },
  { href: "/compare/", label: "Compare" },
  { href: "/extension/", label: "Extension" },
  { href: "/about/", label: "About" },
];

// The links in the footer, on every page.
export const FOOTER_LINKS: NavLink[] = [
  { href: "/subjects/", label: "Subjects" },
  { href: "/professors/", label: "Professors" },
  { href: "/compare/", label: "Compare" },
  { href: "/about/", label: "About" },
  { href: "/data/", label: "The data" },
  { href: "/extension/", label: "Extension" },
  { href: "/contact/", label: "Contact" },
  { href: "/privacy/", label: "Privacy" },
];

export const DISCLAIMER =
  "RowdySearch is not affiliated with or endorsed by UTSA, Rate My Professors, or Simple Syllabus.";
