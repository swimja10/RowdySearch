import { MORE_ICON, SHARE_TARGETS, type Icon } from "../../../src/components/home/shareTargets.ts";
import { SITE_URL } from "./site.ts";

// What the site's Share buttons send. The extension shares its store page; the site shares itself.
export const SHARE_TITLE = "RowdySearch: grades and ratings for every UTSA professor";
export const SHARE_MESSAGE =
  "Picking UTSA classes? RowdySearch shows every professor's grade distributions, Bluebook and " +
  "Rate My Professors ratings, and syllabi. It's free:";
export const SHARE_LINK = `${SITE_URL}/`;
export const SHARE_TEXT = `${SHARE_MESSAGE} ${SHARE_LINK}`;

export type SiteShareTarget = {
  name: string;
  link: string;
  icon: Icon;
  copiesMessage: boolean; // the app has no share link, so the button copies SHARE_TEXT and opens the app
};

// The links that start a post with the message filled in, for the apps that have one.
const SHARE_LINKS: Record<string, string> = {
  X: withQuery("https://x.com/intent/tweet", { text: SHARE_MESSAGE, url: SHARE_LINK }),
  Reddit: withQuery("https://www.reddit.com/submit", { url: SHARE_LINK, title: SHARE_TITLE }),
  Email: withQuery("mailto:", { subject: SHARE_TITLE, body: `${SHARE_MESSAGE}\n\n${SHARE_LINK}` }),
  WhatsApp: withQuery("https://wa.me/", { text: SHARE_TEXT }),
  Facebook: withQuery("https://www.facebook.com/sharer/sharer.php", { u: SHARE_LINK }),
  Telegram: withQuery("https://t.me/share/url", { url: SHARE_LINK, text: SHARE_MESSAGE }),
};

// The same apps and icons as the extension's Share card, in the same order.
export const SITE_SHARE_TARGETS: SiteShareTarget[] = SHARE_TARGETS.flatMap((target) => {
  if (target.copiesMessage) return [{ name: target.name, link: target.link, icon: target.icon, copiesMessage: true }];
  const link = SHARE_LINKS[target.name];
  return link === undefined ? [] : [{ name: target.name, link, icon: target.icon, copiesMessage: false }];
});

export const SHARE_MORE_ICON = MORE_ICON;

// Spaces become "%20" instead of "+", which email apps would show as it is.
function withQuery(base: string, params: Record<string, string>): string {
  const query = Object.entries(params).map(([name, value]) => `${name}=${encodeURIComponent(value)}`);
  return `${base}?${query.join("&")}`;
}
