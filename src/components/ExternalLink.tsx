import { type ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

// Opens Rate My Professors or Simple Syllabus in a new tab.
export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-orange-400 hover:text-orange-300 hover:underline">
      {children} ↗
    </a>
  );
}
