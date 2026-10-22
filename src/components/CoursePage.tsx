import { ClassCard } from "./ClassCard.tsx";
import { GradeBars } from "./GradeBars.tsx";
import { Section } from "./Section.tsx";
import { useLookup } from "../context/useLookup.ts";
import { courseName, gradesOf, teachersOf, type Teacher } from "../utils/courses.ts";

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
  const name = courseName(teachers);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{courseCode}{name !== null && ` · ${name}`}</h2>
        <span className="text-sm text-zinc-400">
          {teachers.length} {teachers.length === 1 ? "professor has" : "professors have"} taught this class
          {name === null && ", each with their own topic"}
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
            detail={classDetail(teacher, name)}
          />
        ))}
      </Section>
    </div>
  );
}

// When a professor's title for the course isn't the course's name (it's their topic, or an older
// name for the course), it goes before when they last taught it.
function classDetail({ course }: Teacher, name: string | null): string {
  const lastTaught = `Last taught ${course.offerings[0].semester}`;
  return course.title === name ? lastTaught : `${course.title} · ${lastTaught}`;
}
