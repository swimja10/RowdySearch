import { type ReactNode } from "react";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { Problem } from "./StatusScreen.tsx";

type SectionProps = {
  title: string;
  children: ReactNode;
};

// If what's inside crashes, only this section shows an error. The rest of the page still works.
export function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</h3>
      <ErrorBoundary
        name={`the ${title} section`}
        fallback={retry => <Problem message="Something went wrong showing this part." onRetry={retry} />}>
        {children}
      </ErrorBoundary>
    </section>
  );
}
