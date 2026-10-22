import { ReviewCard } from "./ReviewCard.tsx";
import { ShareCard } from "./ShareCard.tsx";

// What the sidebar shows before you search: ways to share and review RowdySearch.
export function Home() {
  return (
    <div className="flex flex-col gap-4">
      <p className="py-4 text-center text-sm text-zinc-500">Search any professor, class, or subject.</p>
      <ShareCard />
      <ReviewCard />
    </div>
  );
}
