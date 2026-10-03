import { ExternalLink } from "./ExternalLink.tsx";
import { formatOutOfFive, formatPercent } from "../utils/format.ts";
import { medianGrade, type GradeCounts } from "../utils/grades.ts";
import type { Rmp } from "../utils/gradeData.ts";

type ProfessorStatsProps = {
  rmp: Rmp;
  grades: GradeCounts;
  medianLabel: string;
};

export function ProfessorStats({ rmp, grades, medianLabel }: ProfessorStatsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Stat label={medianLabel} value={medianGrade(grades) ?? "No grades yet"} />
        <Stat label="RMP rating" value={formatOutOfFive(rmp.rating)} />
        <Stat label="Difficulty" value={formatOutOfFive(rmp.difficulty)} />
        <Stat label="Would take again" value={formatPercent(rmp.wouldTakeAgainPercent)} />
      </div>
      <RmpLink rmp={rmp} />
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

type RmpLinkProps = {
  rmp: Rmp;
};

function RmpLink({ rmp }: RmpLinkProps) {
  if (rmp.link === null) {
    return <span className="text-sm text-zinc-500">Not found on Rate My Professors</span>;
  }

  return (
    <span className="text-sm">
      <ExternalLink href={rmp.link}>See all {rmp.ratingCount} ratings on Rate My Professors</ExternalLink>
    </span>
  );
}
