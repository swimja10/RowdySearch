import { useEffect, useRef, useState, type ReactNode } from "react";
import Button from "../Button.tsx";
import { copyText } from "../../utils/clipboard.ts";
import { STORE_LINK } from "../../utils/links.ts";
import { MORE_ICON, SHARE_MESSAGE, SHARE_TARGETS, SHARE_TEXT, SHARE_TITLE, type Icon, type ShareTarget } from "./shareTargets.ts";

const STATUS_MESSAGE_MS = 4000;
const COPIED_LABEL_MS = 2000;

// Chrome on Windows, macOS, and ChromeOS has a system share menu (with apps like Messages and Mail).
// Chrome on Linux doesn't, so the More button is left out there.
const HAS_SHARE_MENU = "share" in navigator;

// Each share button takes a fifth of the row, so five show at a time.
const SHARE_BUTTON_STYLE = "group flex shrink-0 basis-1/5 snap-start flex-col items-center gap-1 text-xs text-zinc-300 outline-none";

// Share buttons for RowdySearch's Chrome Web Store page, like the share menus in other apps.
export function ShareCard() {
  const [message, setMessage] = useState("");

  function showMessage(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), STATUS_MESSAGE_MS);
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-zinc-800 p-4">
      <div className="flex flex-col">
        <h2 className="font-semibold">Share RowdySearch</h2>
        <p className="text-sm text-zinc-400">Know someone picking classes? Send it their way.</p>
      </div>

      <ScrollingRow>
        {SHARE_TARGETS.map(target => <ShareLink key={target.name} target={target} onMessage={showMessage} />)}
        {HAS_SHARE_MENU && (
          <button type="button" onClick={openShareMenu} className={SHARE_BUTTON_STYLE}>
            <ShareIcon icon={MORE_ICON}>More</ShareIcon>
          </button>
        )}
      </ScrollingRow>
      {message !== "" && <p role="status" className="text-xs text-zinc-400">{message}</p>}

      <CopyLink />
    </section>
  );
}

type ScrollingRowProps = {
  children: ReactNode;
};

// A row that scrolls sideways a page at a time. Hovering over it shows arrows to the other pages.
function ScrollingRow({ children }: ScrollingRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ back: false, forward: false });

  function updateArrows() {
    const row = rowRef.current!;
    // Scroll positions can land a fraction of a pixel short of the end.
    setCanScroll({ back: row.scrollLeft > 1, forward: row.scrollLeft + row.clientWidth < row.scrollWidth - 1 });
  }

  function scrollPage(direction: 1 | -1) {
    const row = rowRef.current!;
    row.scrollBy({ left: direction * row.clientWidth, behavior: "smooth" });
  }

  useEffect(updateArrows, []);

  return (
    <div className="group/row relative">
      <div ref={rowRef} onScroll={updateArrows} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
        {children}
      </div>
      {canScroll.back && <RowArrow label="Fewer share options" side="left" onClick={() => scrollPage(-1)}>‹</RowArrow>}
      {canScroll.forward && <RowArrow label="More share options" side="right" onClick={() => scrollPage(1)}>›</RowArrow>}
    </div>
  );
}

type RowArrowProps = {
  label: string;
  side: "left" | "right";
  onClick: () => void;
  children: ReactNode;
};

// Sits over the edge of the row, lined up with the round icons.
function RowArrow({ label, side, onClick, children }: RowArrowProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-[22px] flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-600 pb-0.5 text-xl leading-none text-zinc-100 opacity-0 shadow-lg transition hover:bg-zinc-500 focus-visible:opacity-100 group-hover/row:opacity-100 ${side === "left" ? "-left-3" : "-right-3"}`}>
      {children}
    </button>
  );
}

type ShareLinkProps = {
  target: ShareTarget;
  onMessage: (message: string) => void;
};

function ShareLink({ target, onMessage }: ShareLinkProps) {
  // Copy as the click happens: the link then opens the app, ready to paste.
  async function copyMessage() {
    const copied = await copyText(SHARE_TEXT);
    onMessage(copied ? `Message copied. Paste it in ${target.name}.` : `Copy the link below and paste it in ${target.name}.`);
  }

  return (
    <a
      href={target.link}
      target="_blank"
      rel="noreferrer"
      title={target.copiesMessage ? `Copy a message about RowdySearch and open ${target.name}` : `Share on ${target.name}`}
      onClick={target.copiesMessage ? copyMessage : undefined}
      className={SHARE_BUTTON_STYLE}>
      <ShareIcon icon={target.icon}>{target.name}</ShareIcon>
    </a>
  );
}

type ShareIconProps = {
  icon: Icon;
  children: ReactNode;
};

// A round icon with the app's name under it.
function ShareIcon({ icon, children }: ShareIconProps) {
  return (
    <>
      <span className="flex size-11 items-center justify-center rounded-full bg-zinc-900 transition-colors group-hover:bg-zinc-700 group-focus-visible:ring-2 group-focus-visible:ring-orange-500">
        <svg viewBox="0 0 24 24" className="size-5" fill={icon.color} aria-hidden="true">
          <path d={icon.path} />
        </svg>
      </span>
      {children}
    </>
  );
}

async function openShareMenu() {
  try {
    await navigator.share({ title: SHARE_TITLE, text: SHARE_MESSAGE, url: STORE_LINK });
  } catch {
    // Closing the menu without picking an app counts as an error. There's nothing to do about it.
  }
}

// The link itself, with a button that copies it.
function CopyLink() {
  const [isCopied, setIsCopied] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  async function copyLink() {
    if (await copyText(STORE_LINK)) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_LABEL_MS);
    } else {
      // This website blocks both ways of copying, so leave the link selected for Ctrl+C.
      linkRef.current!.select();
    }
  }

  return (
    <div className="flex gap-2">
      <input
        ref={linkRef}
        readOnly
        value={STORE_LINK}
        aria-label="RowdySearch's link"
        onFocus={e => e.target.select()}
        className="min-w-0 flex-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      />
      <Button className="min-w-24 shrink-0 text-sm" onClick={copyLink}>{isCopied ? "Copied!" : "Copy link"}</Button>
    </div>
  );
}
