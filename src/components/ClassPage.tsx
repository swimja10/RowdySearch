import Button from "./Button.tsx";
import { GradeBars } from "./GradeBars.tsx";
import { ProfessorStats } from "./ProfessorStats.tsx";
import { Reviews } from "./Reviews.tsx";
import { Section } from "./Section.tsx";
import { SyllabusLinks } from "./SyllabusLinks.tsx";
import { useLookup } from "../context/useLookup.ts";
import { findCourse, gradesOf, type Course } from "../utils/courses.ts";
import { medianGrade } from "../utils/grades.ts";
import type { ClassOffering } from "../utils/gradeData.ts";

type ClassPageProps = {
  professorName: string;
  courseCode: string;
};

export function ClassPage({ professorName, courseCode }: ClassPageProps) {
  const { professors, openProfessor, openCourse } = useLookup();
  const professor = professors[professorName];
  const course = findCourse(professor, courseCode)!;
  const grades = gradesOf(course.offerings);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-bold">
          <Button variant="link" onClick={() => openCourse(course.code)}>{course.code}</Button> · {course.title}
        </h2>
        <span className="text-zinc-400">
          with{" "}
          <Button variant="link" onClick={() => openProfessor(professor.name)}>{professor.name}</Button>
        </span>
      </div>

      <ProfessorStats rmp={professor.rmp} grades={grades} medianLabel={`Median Grade in ${course.code}`} />

      <Section title="Latest syllabus">
        <LatestSyllabus course={course} />
      </Section>

      <Section title={`Grades in ${course.code}`}>
        <GradeBars grades={grades} />
      </Section>

      <Section title="What students say">
        <Reviews reviews={professor.rmp.reviews} />
      </Section>

      <Section title="Every semester">
        {course.offerings.map(offering => (
          <SemesterRow key={`${offering.semester} ${offering.title}`} offering={offering} />
        ))}
      </Section>

      <div className="flex flex-col items-start gap-1">
        <Button variant="link" onClick={() => openCourse(course.code)}>
          Compare every professor who teaches {course.code}
        </Button>
        <Button variant="link" onClick={() => openProfessor(professor.name)}>
          See all of {professor.name}'s classes
        </Button>
      </div>
    </div>
  );
}

type LatestSyllabusProps = {
  course: Course;
};

function LatestSyllabus({ course }: LatestSyllabusProps) {
  const latest = course.offerings.find(offering => offering.syllabi.length > 0);

  if (latest === undefined) {
    return <span className="text-sm text-zinc-500">No syllabus on Simple Syllabus</span>;
  }

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-zinc-800 p-3">
      <span className="font-medium">{latest.semester}</span>
      <SyllabusLinks syllabi={latest.syllabi} />
    </div>
  );
}

type SemesterRowProps = {
  offering: ClassOffering;
};

function SemesterRow({ offering }: SemesterRowProps) {
  const median = medianGrade(offering.grades);

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-zinc-800 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{offering.semester}</span>
        <span className="text-sm">{median === null ? "No grades yet" : `Median ${median}`}</span>
      </div>
      <SyllabusLinks syllabi={offering.syllabi} />
    </div>
  );
}
