import { type ReactNode } from "react";
import { ExternalLink } from "./ExternalLink.tsx";
import { bluebookOf, gradesOf, type Bluebook } from "../utils/courses.ts";
import { formatCount, formatOutOfFive, formatPercent } from "../utils/format.ts";
import { medianGrade } from "../utils/grades.ts";
import type { ClassOffering, Rmp, RmpProfile } from "../utils/gradeData.ts";

type ProfessorStatsProps = {
  rmp: Rmp;
  offerings: ClassOffering[];
  medianLabel: string;
};

// The numbers at the top of a professor's or a class's page, grouped by where they're from.
export function ProfessorStats({ rmp, offerings, medianLabel }: ProfessorStatsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Stat label={medianLabel} value={medianGrade(gradesOf(offerings)) ?? "No grades yet"} />
      <BluebookStats bluebook={bluebookOf(offerings)} />
      <RmpStats rmp={rmp} />
    </div>
  );
}

type BluebookStatsProps = {
  bluebook: Bluebook;
};

function BluebookStats({ bluebook }: BluebookStatsProps) {
  if (bluebook.sectionCount === 0) return <Unavailable>No Bluebook evaluations yet</Unavailable>;

  return (
    <StatGroup title="Bluebook" detail={`UTSA course evaluations · ${formatCount(bluebook.sectionCount, "section")}`}>
      <Stat label="Instructor" value={formatOutOfFive(bluebook.instructor)} />
      <Stat label="Course" value={formatOutOfFive(bluebook.course)} />
    </StatGroup>
  );
}

type RmpStatsProps = {
  rmp: Rmp;
};

function RmpStats({ rmp }: RmpStatsProps) {
  if (rmp.profiles.length === 0) return <Unavailable>Not found on Rate My Professors</Unavailable>;

  return (
    <StatGroup title="Rate My Professors" detail={<RmpLinks profiles={rmp.profiles} />}>
      <Stat label="Rating" value={formatOutOfFive(rmp.rating)} />
      <Stat label="Difficulty" value={formatOutOfFive(rmp.difficulty)} />
      <Stat label="Would take again" value={formatPercent(rmp.wouldTakeAgainPercent)} />
    </StatGroup>
  );
}

type RmpLinksProps = {
  profiles: RmpProfile[];
};

// A few professors have two RMP profiles (RMP made a duplicate), so each link says its department.
function RmpLinks({ profiles }: RmpLinksProps) {
  if (profiles.length === 1) return <ExternalLink href={profiles[0].link}>See all ratings</ExternalLink>;

  return (
    <span className="flex gap-2">
      {profiles.map(profile => (
        <ExternalLink key={profile.link} href={profile.link}>{profile.department}</ExternalLink>
      ))}
    </span>
  );
}

type StatGroupProps = {
  title: string;
  detail: ReactNode;
  children: ReactNode;
};

function StatGroup({ title, detail, children }: StatGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wide text-zinc-400">{title}</span>
        <span className="text-right text-zinc-500">{detail}</span>
      </div>
      <div className="grid auto-cols-fr grid-flow-col gap-2">{children}</div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div className="flex flex-col rounded-xl bg-zinc-800 p-3">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

type UnavailableProps = {
  children: ReactNode;
};

function Unavailable({ children }: UnavailableProps) {
  return <p className="text-sm text-zinc-500">{children}</p>;
}
