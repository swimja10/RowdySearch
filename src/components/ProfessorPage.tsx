import Button from "./Button.tsx";
import { GradeBars } from "./GradeBars.tsx";
import { ProfessorStats } from "./ProfessorStats.tsx";
import { Reviews } from "./Reviews.tsx";
import { Section } from "./Section.tsx";
import { useLookup } from "../context/useLookup.ts";
import { allOfferings, bluebookOf, gradesOf } from "../utils/courses.ts";
import { formatRating } from "../utils/format.ts";
import { medianGrade } from "../utils/grades.ts";
import type { Course } from "../utils/gradeData.ts";

type ProfessorPageProps = {
  professorName: string;
};

export function ProfessorPage({ professorName }: ProfessorPageProps) {
  const { professors } = useLookup();
  const professor = professors[professorName];
  const offerings = allOfferings(professor);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{professor.name}</h2>
        {professor.department !== null && (
          <span className="text-sm text-zinc-400">{professor.department} department</span>
        )}
      </div>

      <ProfessorStats rmp={professor.rmp} offerings={offerings} medianLabel="Median Grade (all classes)" />

      <Section title="Grades in all classes">
        <GradeBars grades={gradesOf(offerings)} />
      </Section>

      <Section title={`Classes (${professor.courses.length})`}>
        {professor.courses.map(course => (
          <CourseRow key={course.code} professorName={professor.name} course={course} />
        ))}
      </Section>

      <Section title="What students say">
        <Reviews reviews={professor.rmp.reviews} />
      </Section>
    </div>
  );
}

type CourseRowProps = {
  professorName: string;
  course: Course;
};

function CourseRow({ professorName, course }: CourseRowProps) {
  const { openClass } = useLookup();
  const median = medianGrade(gradesOf(course.offerings));
  const bluebook = bluebookOf(course.offerings);
  const semesterCount = course.offerings.length;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3">
      <div className="flex flex-col items-start gap-0.5">
        <Button variant="link" className="font-medium" onClick={() => openClass(professorName, course.code)}>
          {course.code} · {course.title}
        </Button>
        <span className="text-xs text-zinc-400">
          Latest {course.offerings[0].semester} · {semesterCount} {semesterCount === 1 ? "semester" : "semesters"}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end text-sm">
        <span>Median {median ?? "—"}</span>
        {bluebook.sectionCount > 0 && <span className="text-zinc-400">{formatRating("Bluebook", bluebook.instructor)}</span>}
      </div>
    </div>
  );
}
