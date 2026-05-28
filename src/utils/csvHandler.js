import Papa from "papaparse";

const HEADERS = [
  "Course Name",
  "Credits",
  "Level",
  "Semester 1 Grade",
  "Semester 2 Grade",
  "Include in GPA",
  "Ranked"
];
const LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4"];

function slugFileName(name) {
  return `${name || "courses"}_courses.csv`.replace(/[^\w.-]+/g, "_");
}

function valueOrBlank(value) {
  return value === null || value === undefined ? "" : value;
}

function getByHeader(row, header) {
  const key = Object.keys(row).find((candidate) => candidate.trim().toLowerCase() === header.toLowerCase());
  return key ? row[key] : "";
}

function parseGrade(value) {
  if (value === "" || value == null) return { valid: true, value: "" };
  const trimmed = String(value).trim();
  if (trimmed === "") return { valid: true, value: "" };
  if (!/^\d+$/.test(trimmed)) return { valid: false, value: "" };
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 100) return { valid: false, value: "" };
  return { valid: true, value: parsed };
}

function parseCredits(value) {
  if (value === "" || value == null) return "";
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : "";
}

/**
 * Export courses from one tab as a CSV download.
 * @param {{name: string, courses: object[]}} tab
 */
export function exportCoursesToCSV(tab) {
  const rows = (tab.courses || []).map((course) => ({
    "Course Name": course.name,
    Credits: valueOrBlank(course.credits),
    Level: course.level,
    "Semester 1 Grade": valueOrBlank(course.s1),
    "Semester 2 Grade": valueOrBlank(course.s2),
    "Include in GPA": course.includeInGPA ? "true" : "false",
    Ranked: course.ranked === false ? "false" : "true"
  }));

  const csv = Papa.unparse(rows, { columns: HEADERS });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = slugFileName(tab.name);
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV file and map rows to course objects.
 * @param {File} file
 * @param {(course: Partial<object>) => object} createCourse
 * @returns {Promise<{courses: object[], skipped: number}>}
 */
export function importCoursesFromCSV(file, createCourse) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        let skipped = 0;
        const courses = [];

        for (const row of data) {
          const name = String(getByHeader(row, "Course Name") || "").trim();
          if (!name) {
            skipped += 1;
            continue;
          }

          const level = String(getByHeader(row, "Level") || "").trim();
          if (!LEVELS.includes(level)) {
            skipped += 1;
            continue;
          }

          const s1 = parseGrade(getByHeader(row, "Semester 1 Grade"));
          const s2 = parseGrade(getByHeader(row, "Semester 2 Grade"));
          if (!s1.valid || !s2.valid) {
            skipped += 1;
            continue;
          }

          courses.push(
            createCourse({
              name,
              credits: parseCredits(getByHeader(row, "Credits")),
              level,
              s1: s1.value,
              s2: s2.value,
              includeInGPA: String(getByHeader(row, "Include in GPA")).trim().toLowerCase() !== "false",
              ranked: String(getByHeader(row, "Ranked")).trim().toLowerCase() !== "false"
            })
          );
        }

        resolve({ courses, skipped });
      },
      error: reject
    });
  });
}
