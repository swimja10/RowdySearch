import { type ReactNode } from "react";
import { ExternalLink } from "./ExternalLink.tsx";
import type { ClassOffering, Syllabus } from "../utils/gradeData.ts";

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

type LatestSyllabusProps = {
  offering: ClassOffering | undefined; // the newest semester with a syllabus, if there is one
  teacher?: ReactNode; // whose class it was, on the course page
};

export function LatestSyllabus({ offering, teacher }: LatestSyllabusProps) {
  if (offering === undefined) {
    return <span className="text-sm text-zinc-500">No syllabus on Simple Syllabus</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1 rounded-xl bg-zinc-800 p-3">
      <span className="font-medium">{offering.semester}</span>
      {teacher}
      <SyllabusLinks syllabi={offering.syllabi} />
    </div>
  );
}
