import { STORE_REVIEWS_LINK } from "../../utils/links.ts";

// Opens the Chrome Web Store's Reviews tab, where "Write a review" is one click away.
export function ReviewCard() {
  return (
    <a
      href={STORE_REVIEWS_LINK}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col gap-1 rounded-xl bg-zinc-800 p-4 outline-none transition-colors hover:bg-zinc-700 active:bg-zinc-600 focus-visible:ring-2 focus-visible:ring-orange-500">
      <span className="flex items-center justify-between gap-2">
        <span className="font-semibold">Enjoying RowdySearch?</span>
        <span aria-hidden="true" className="text-lg leading-none tracking-wider text-amber-400">★★★★★</span>
      </span>
      <span className="text-sm text-zinc-400">
        A quick review on the Chrome Web Store helps other Roadrunners find it.{" "}
        <span className="text-orange-400">Write a review ↗</span>
      </span>
    </a>
  );
}
