import Button from "../ui/Button";
import CourseRow from "./CourseRow";
import TableHeader from "./TableHeader";

export default function CourseTable({ tab, onAddCourse, onUpdateCourse, onDeleteCourse }) {
  if (!tab.courses.length) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-app-border bg-app-surface p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-app-border bg-app-bg font-mono text-2xl text-app-accent">
          +
        </div>
        <h2 className="text-lg font-bold text-app-text">No courses yet - add one to get started</h2>
        <Button aria-label="Add course" variant="primary" className="mt-5" onClick={() => onAddCourse(tab.id)}>
          Add Course
        </Button>
      </section>
    );
  }

  return (
    <div className="animate-fade overflow-hidden rounded-lg border border-app-border bg-app-surface">
      <div className="max-h-[62vh] overflow-auto">
        <table className="w-full min-w-[1500px] border-collapse">
          <TableHeader />
          <tbody>
            {tab.courses.map((course, index) => (
              <CourseRow
                key={course.id}
                tabId={tab.id}
                course={course}
                index={index}
                onUpdate={onUpdateCourse}
                onDelete={onDeleteCourse}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
