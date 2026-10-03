import { ExternalLink } from "./ExternalLink.tsx";
import type { Syllabus } from "../utils/gradeData.ts";

type SyllabusLinksProps = {
  syllabi: Syllabus[];
};

export function SyllabusLinks({ syllabi }: SyllabusLinksProps) {
  if (syllabi.length === 0) {
    return <span className="text-sm text-zinc-500">No syllabus on Simple Syllabus</span>;
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {syllabi.map(syllabus => (
        <ExternalLink key={syllabus.section} href={syllabus.link}>
          Section {syllabus.section} syllabus
        </ExternalLink>
      ))}
    </div>
  );
}
