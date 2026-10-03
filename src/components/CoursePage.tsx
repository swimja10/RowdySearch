import { ClassCard } from "./ClassCard.tsx";
import { GradeBars } from "./GradeBars.tsx";
import { Section } from "./Section.tsx";
import { useLookup } from "../context/useLookup.ts";
import { gradesOf, teachersOf } from "../utils/courses.ts";

type CoursePageProps = {
  courseCode: string;
};

// Everyone who has taught a course, so you can compare them side by side.
export function CoursePage({ courseCode }: CoursePageProps) {
  const { professors, searchIndex } = useLookup();
  const teachers = teachersOf(courseCode, professors, searchIndex);

  if (teachers.length === 0) {
    return <p className="py-12 text-center text-zinc-500">No one has taught {courseCode} yet.</p>;
  }

  const everyonesGrades = gradesOf(teachers.flatMap(teacher => teacher.course.offerings));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{courseCode} · {teachers[0].course.title}</h2>
        <span className="text-sm text-zinc-400">
          {teachers.length} {teachers.length === 1 ? "professor has" : "professors have"} taught this class
        </span>
      </div>

      <Section title={`Grades in ${courseCode} (every professor)`}>
        <GradeBars grades={everyonesGrades} />
      </Section>

      <Section title="Professors, most recent first">
        {teachers.map(teacher => (
          <ClassCard
            key={teacher.professor.name}
            professor={teacher.professor}
            course={teacher.course}
            detail={`Last taught ${teacher.course.offerings[0].semester}`}
          />
        ))}
      </Section>
    </div>
  );
}
