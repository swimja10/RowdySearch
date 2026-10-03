import { countStudents, gradeShares, type GradeCounts } from "../utils/grades.ts";

type GradeBarsProps = {
  grades: GradeCounts;
};

export function GradeBars({ grades }: GradeBarsProps) {
  const shares = gradeShares(grades);
  // The most common grade gets a full-height bar so the bars are easy to compare.
  const tallestPercent = Math.max(...shares.map(share => share.percent));

  if (tallestPercent === 0) {
    return <p className="text-sm text-zinc-500">No grades have been released yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-zinc-800 p-3">
      <div className="flex gap-2">
        {shares.map(share => (
          <div key={share.label} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs text-zinc-400">{Math.round(share.percent)}%</span>
            <div className="flex h-16 w-full items-end rounded bg-zinc-700">
              <div className="w-full rounded bg-orange-500" style={{ height: `${(share.percent / tallestPercent) * 100}%` }} />
            </div>
            <span className="text-sm font-medium">{share.label}</span>
          </div>
        ))}
      </div>
      <span className="text-xs text-zinc-400">Based on {countStudents(grades).toLocaleString()} grades</span>
    </div>
  );
}
