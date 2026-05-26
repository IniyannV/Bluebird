import { calcS1Average, calcS2Average } from "../../utils/semesterAverage";
import Tooltip from "../ui/Tooltip";

const editableFields = ["name", "credits", "level", "mp1", "mp2", "s1Exam", "mp3", "mp4", "s2Exam", "includeInGPA"];

function clampGrade(value) {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return Math.min(100, Math.max(0, parsed));
}

function sanitizeCredits(value) {
  if (value === "") return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(0.01, parsed);
}

function blockInvalidNumberKeys(event) {
  if (["e", "E", "+", "-"].includes(event.key)) event.preventDefault();
}

function cellInputClass(extra = "") {
  return `w-full rounded border border-transparent bg-transparent px-2 py-2 font-mono text-sm text-app-text outline-none transition-all duration-150 focus:border-app-accent focus:bg-app-bg focus:shadow-focus ${extra}`;
}

export default function CourseRow({ tabId, course, index, onUpdate, onDelete }) {
  const s1 = calcS1Average(course.mp1, course.mp2);
  const s2 = calcS2Average(course.mp3, course.mp4);

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
          onKeyDown={(event) => {
            blockInvalidNumberKeys(event);
            handleTab(event, "credits");
          }}
          onChange={(event) => update("credits", sanitizeCredits(event.target.value))}
          onBlur={() => course.credits === "" && update("credits", 1)}
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
      {["mp1", "mp2", "s1Exam"].map((field) => (
        <td className="px-1 py-1" key={field}>
          <label className="sr-only" htmlFor={`${course.id}-${field}`}>
            {field}
          </label>
          <input
            id={`${course.id}-${field}`}
            aria-label={field}
            data-course-id={course.id}
            data-field={field}
            type="number"
            min="0"
            max="100"
            value={course[field]}
            onKeyDown={(event) => {
              blockInvalidNumberKeys(event);
              handleTab(event, field);
            }}
            onChange={(event) => update(field, clampGrade(event.target.value))}
            className={cellInputClass()}
          />
        </td>
      ))}
      <td className="px-1 py-1">
        <div className="rounded bg-app-bg px-2 py-2 font-mono text-sm italic text-app-muted">
          {s1 === null ? "-" : s1.toFixed(2)}
        </div>
      </td>
      {["mp3", "mp4", "s2Exam"].map((field) => (
        <td className="px-1 py-1" key={field}>
          <label className="sr-only" htmlFor={`${course.id}-${field}`}>
            {field}
          </label>
          <input
            id={`${course.id}-${field}`}
            aria-label={field}
            data-course-id={course.id}
            data-field={field}
            type="number"
            min="0"
            max="100"
            value={course[field]}
            onKeyDown={(event) => {
              blockInvalidNumberKeys(event);
              handleTab(event, field);
            }}
            onChange={(event) => update(field, clampGrade(event.target.value))}
            className={cellInputClass()}
          />
        </td>
      ))}
      <td className="px-1 py-1">
        <div className="rounded bg-app-bg px-2 py-2 font-mono text-sm italic text-app-muted">
          {s2 === null ? "-" : s2.toFixed(2)}
        </div>
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
