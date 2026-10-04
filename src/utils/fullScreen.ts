import type { FullScreenMessage } from "../page.ts";

// Inside the registration page, the sidebar is the Lookup tab's iframe, so covering the whole
// screen means asking the page (content/sidebar.ts) to stretch the iframe. In Chrome's side
// panel there's no page to ask, so analytical mode just fills the panel.
const isInsideRegistrationPage = window.parent !== window;

export function setFullScreen(isFullScreen: boolean): Promise<void> {
  if (!isInsideRegistrationPage) return Promise.resolve();

  return new Promise((resolve) => {
    // The iframe changing size is the sign that the page did it. Don't wait forever if it doesn't.
    window.addEventListener("resize", () => resolve(), { once: true });
    setTimeout(resolve, 500);

    const message: FullScreenMessage = { rowdySearch: "fullScreen", isFullScreen };
    window.parent.postMessage(message, "*");
  });
}
