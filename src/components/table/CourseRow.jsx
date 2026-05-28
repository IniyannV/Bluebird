import Tooltip from "../ui/Tooltip";

const editableFields = ["name", "credits", "level", "s1", "s2", "includeInGPA", "ranked"];

function clampGrade(value) {
  if (value === "") return "";
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) return "";
  return Math.min(100, Math.max(0, parsed));
}

function sanitizeCredits(value) {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return "";
  return parsed;
}

function getAutoCreditsPlaceholder(course) {
  const hasBoth = course.s1 !== "" && course.s2 !== "";
  return hasBoth ? "1" : "0.5";
}

function blockInvalidNumberKeys(event) {
  if (["e", "E", "+", "-"].includes(event.key)) event.preventDefault();
}

function cellInputClass(extra = "") {
  return `w-full rounded border border-transparent bg-transparent px-2 py-2 font-mono text-sm text-app-text outline-none transition-all duration-150 focus:border-app-accent focus:bg-app-bg focus:shadow-focus ${extra}`;
}

export default function CourseRow({ tabId, course, index, onUpdate, onDelete }) {
  function update(field, value) {
    onUpdate(tabId, course.id, field, value);
  }

  function handleTab(event, field) {
    if (event.key !== "Tab" || event.shiftKey) return;
    const current = editableFields.indexOf(field);
    if (current === -1 || current === editableFields.length - 1) return;
    const next = document.querySelector(`[data-course-id="${course.id}"][data-field="${editableFields[current + 1]}"]`);
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  const rowBg = index % 2 === 0 ? "bg-app-surface" : "bg-app-surfaceAlt";

  return (
    <tr className={`${rowBg} animate-row-in border-l-2 border-transparent transition-all duration-150 hover:border-app-accent`}>
      <td className="px-1 py-1">
        <label className="sr-only" htmlFor={`${course.id}-name`}>
          Course Name
        </label>
        <input
          id={`${course.id}-name`}
          aria-label="Course Name"
          data-course-id={course.id}
          data-field="name"
          value={course.name}
          onChange={(event) => update("name", event.target.value)}
          onKeyDown={(event) => handleTab(event, "name")}
          className={cellInputClass("min-w-64 font-sans")}
          placeholder="Course name"
        />
      </td>
      <td className="px-1 py-1">
        <label className="sr-only" htmlFor={`${course.id}-credits`}>
          Credits
        </label>
        <input
          id={`${course.id}-credits`}
          aria-label="Credits"
          data-course-id={course.id}
          data-field="credits"
          type="number"
          min="0.01"
          step="0.5"
          value={course.credits}
          placeholder={getAutoCreditsPlaceholder(course)}
          onKeyDown={(event) => {
            blockInvalidNumberKeys(event);
            handleTab(event, "credits");
          }}
          onChange={(event) => update("credits", sanitizeCredits(event.target.value))}
          onBlur={(event) => {
            if (event.target.value === "") update("credits", "");
          }}
          className={cellInputClass()}
        />
      </td>
      <td className="px-1 py-1">
        <label className="sr-only" htmlFor={`${course.id}-level`}>
          Course Level
        </label>
        <select
          id={`${course.id}-level`}
          aria-label="Course Level"
          data-course-id={course.id}
          data-field="level"
          value={course.level}
          onChange={(event) => update("level", event.target.value)}
          onKeyDown={(event) => handleTab(event, "level")}
          className={cellInputClass("font-sans")}
        >
          <option>Level 1</option>
          <option>Level 2</option>
          <option>Level 3</option>
          <option>Level 4</option>
        </select>
      </td>
      <td className="px-1 py-1">
        <label className="sr-only" htmlFor={`${course.id}-s1`}>
          Semester 1 Grade
        </label>
        <input
          id={`${course.id}-s1`}
          aria-label="Semester 1 Grade"
          data-course-id={course.id}
          data-field="s1"
          type="number"
          min="0"
          max="100"
          step="1"
          value={course.s1}
          onKeyDown={(event) => {
            blockInvalidNumberKeys(event);
            handleTab(event, "s1");
          }}
          onChange={(event) => update("s1", clampGrade(event.target.value))}
          className={cellInputClass()}
        />
      </td>
      <td className="px-1 py-1">
        <label className="sr-only" htmlFor={`${course.id}-s2`}>
          Semester 2 Grade
        </label>
        <input
          id={`${course.id}-s2`}
          aria-label="Semester 2 Grade"
          data-course-id={course.id}
          data-field="s2"
          type="number"
          min="0"
          max="100"
          step="1"
          value={course.s2}
          onKeyDown={(event) => {
            blockInvalidNumberKeys(event);
            handleTab(event, "s2");
          }}
          onChange={(event) => update("s2", clampGrade(event.target.value))}
          className={cellInputClass()}
        />
      </td>
      <td className="px-1 py-1 text-center">
        <label className="sr-only" htmlFor={`${course.id}-include`}>
          Include in GPA
        </label>
        <input
          id={`${course.id}-include`}
          aria-label="Include in GPA"
          data-course-id={course.id}
          data-field="includeInGPA"
          type="checkbox"
          checked={course.includeInGPA}
          onChange={(event) => update("includeInGPA", event.target.checked)}
          onKeyDown={(event) => handleTab(event, "includeInGPA")}
          className="h-4 w-4 accent-app-accent"
        />
      </td>
      <td className="px-1 py-1 text-center">
        <label className="sr-only" htmlFor={`${course.id}-ranked`}>
          Ranked
        </label>
        <input
          id={`${course.id}-ranked`}
          aria-label="Ranked"
          data-course-id={course.id}
          data-field="ranked"
          type="checkbox"
          checked={course.ranked !== false}
          onChange={(event) => update("ranked", event.target.checked)}
          onKeyDown={(event) => handleTab(event, "ranked")}
          className="h-4 w-4 accent-app-accent"
        />
      </td>
      <td className="px-1 py-1 text-center">
        <Tooltip label="Delete row">
          <button
            aria-label={`Delete ${course.name || "course"}`}
            onClick={() => onDelete(tabId, course.id)}
            className="rounded-md px-2 py-2 text-app-muted transition-all duration-150 hover:bg-app-danger/10 hover:text-app-danger"
          >
            x
          </button>
        </Tooltip>
      </td>
    </tr>
  );
}
