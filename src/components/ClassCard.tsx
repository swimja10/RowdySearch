import Button from "./Button.tsx";
import { useLookup } from "../context/useLookup.ts";
import { gradesOf, type Course } from "../utils/courses.ts";
import { formatRmpRating } from "../utils/format.ts";
import { medianGrade } from "../utils/grades.ts";
import type { Professor } from "../utils/gradeData.ts";

type ClassCardProps = {
  professor: Professor;
  course: Course;
  detail: string;
};

// One professor teaching one course: their name opens their page, `detail` opens the class.
export function ClassCard({ professor, course, detail }: ClassCardProps) {
  const { openProfessor, openClass } = useLookup();
  const median = medianGrade(gradesOf(course.offerings));

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3">
      <div className="flex flex-col items-start gap-0.5">
        <Button variant="link" className="font-medium" onClick={() => openProfessor(professor.name)}>
          {professor.name}
        </Button>
        <Button variant="link" className="text-sm" onClick={() => openClass(professor.name, course.code)}>
          {detail}
        </Button>
      </div>
      <div className="flex shrink-0 flex-col items-end text-sm">
        <span>Median {median ?? "—"}</span>
        <span className="text-zinc-400">{formatRmpRating(professor.rmp.rating)}</span>
      </div>
    </div>
  );
}
