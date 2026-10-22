import Button from "./Button.tsx";
import { GradeBars } from "./GradeBars.tsx";
import { ProfessorStats } from "./ProfessorStats.tsx";
import { Reviews } from "./Reviews.tsx";
import { Section } from "./Section.tsx";
import { SyllabusLinks } from "./SyllabusLinks.tsx";
import { useLookup } from "../context/useLookup.ts";
import { bluebookOf, findCourse, gradesOf } from "../utils/courses.ts";
import { formatRating } from "../utils/format.ts";
import { medianGrade } from "../utils/grades.ts";
import type { ClassOffering, Course, Review } from "../utils/gradeData.ts";

type ClassPageProps = {
  professorName: string;
  courseCode: string;
};

export function ClassPage({ professorName, courseCode }: ClassPageProps) {
  const { professors, openProfessor, openCourse } = useLookup();
  const professor = professors[professorName];
  const course = findCourse(professor, courseCode)!;

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

      <ProfessorStats rmp={professor.rmp} offerings={course.offerings} medianLabel={`Median Grade in ${course.code}`} />

      <Section title="Latest syllabus">
        <LatestSyllabus course={course} />
      </Section>

      <Section title={`Grades in ${course.code}`}>
        <GradeBars grades={gradesOf(course.offerings)} />
      </Section>

      <Section title="What students say">
        <Reviews reviews={thisCourseFirst(professor.rmp.reviews, course.code)} />
      </Section>

      <Section title="Every semester">
        {course.offerings.map(offering => (
          <SemesterRow key={offering.semester} offering={offering} courseTitle={course.title} />
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

// Reviews of this course before reviews of the professor's other courses. RMP keeps the course
// the way the student typed it ("ACC2013", or just "2013"), so only the course number is compared.
function thisCourseFirst(reviews: Review[], courseCode: string): Review[] {
  const courseNumber = courseCode.split(" ")[1];
  const isThisCourse = (review: Review) => review.course.match(/\d{4}/)?.[0] === courseNumber;
  return [...reviews].sort((first, second) => Number(isThisCourse(second)) - Number(isThisCourse(first)));
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
  courseTitle: string;
};

// A semester the class was listed under another name (an older one, or another topic) says so.
function SemesterRow({ offering, courseTitle }: SemesterRowProps) {
  const median = medianGrade(offering.grades);
  const bluebook = bluebookOf([offering]);
  const otherTitles = offering.titles.filter(title => title !== courseTitle);

  return (
    <div className="flex flex-col gap-1 rounded-xl bg-zinc-800 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="font-medium">{offering.semester}</span>
          {otherTitles.length > 0 && <span className="text-sm text-zinc-400">{otherTitles.join(" · ")}</span>}
        </div>
        <div className="flex flex-col items-end text-sm">
          <span>{median === null ? "No grades yet" : `Median ${median}`}</span>
          {bluebook.sectionCount > 0 && <span className="text-zinc-400">{formatRating("Bluebook", bluebook.instructor)}</span>}
        </div>
      </div>
      <SyllabusLinks syllabi={offering.syllabi} />
    </div>
  );
}
