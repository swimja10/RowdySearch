import { useEffect, type ReactNode } from "react";
import Button from "./Button.tsx";
import { setFullScreen } from "../utils/hostPage.ts";

type StatusScreenProps = {
  children: ReactNode;
};

// The whole sidebar, for while it's loading or when something went wrong.
export function StatusScreen({ children }: StatusScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-3 bg-zinc-900 px-4 py-12 text-center text-zinc-400">
      {children}
    </div>
  );
}

type ProblemProps = {
  message: string;
  onRetry: () => void;
  // Reloading starts the sidebar over, so it's only offered once trying again hasn't worked.
  offerReload?: boolean;
};

// Something went wrong: what, a Try again button, and if that hasn't helped, a reload.
export function Problem({ message, onRetry, offerReload = false }: ProblemProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-zinc-800 p-6 text-center text-sm text-zinc-300">
      <p>{message}</p>
      <Button onClick={onRetry}>Try again</Button>
      {offerReload && <ReloadLink />}
    </div>
  );
}

// The last resort: start the sidebar over, the same as refreshing the page.
export function ReloadLink() {
  return (
    <p className="text-xs text-zinc-500">
      Still not working?{" "}
      <a href="index.html" className="text-orange-400 hover:underline">Reload RowdySearch</a>
    </p>
  );
}

type CrashScreenProps = {
  onRetry: () => void;
};

// Shown in place of the whole sidebar when it crashed. If it crashed in Analytical Mode, the sidebar
// may still be stretched across the page, so it shrinks back first and the page can be used again.
export function CrashScreen({ onRetry }: CrashScreenProps) {
  useEffect(() => {
    setFullScreen(false);
  }, []);

  return (
    <StatusScreen>
      <Problem message="Something went wrong in RowdySearch." onRetry={onRetry} offerReload />
    </StatusScreen>
  );
}
