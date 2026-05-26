import Papa from "papaparse";
import { calcS1Average, calcS2Average } from "./semesterAverage";

const HEADERS = [
  "Course Name",
  "Credits",
  "Level",
  "MP1",
  "MP2",
  "S1 Exam",
  "S1 Average",
  "MP3",
  "MP4",
  "S2 Exam",
  "S2 Average",
  "Include in GPA"
];

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

function toNumberOrBlank(value) {
  if (value === "" || value == null) return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
}

/**
 * Export courses from one tab as a CSV download.
 * @param {{name: string, courses: object[]}} tab
 */
export function exportCoursesToCSV(tab) {
  const rows = (tab.courses || []).map((course) => {
    const s1 = calcS1Average(course.mp1, course.mp2);
    const s2 = calcS2Average(course.mp3, course.mp4);
    return {
      "Course Name": course.name,
      Credits: course.credits,
      Level: course.level,
      MP1: valueOrBlank(course.mp1),
      MP2: valueOrBlank(course.mp2),
      "S1 Exam": valueOrBlank(course.s1Exam),
      "S1 Average": s1 === null ? "" : s1.toFixed(2),
      MP3: valueOrBlank(course.mp3),
      MP4: valueOrBlank(course.mp4),
      "S2 Exam": valueOrBlank(course.s2Exam),
      "S2 Average": s2 === null ? "" : s2.toFixed(2),
      "Include in GPA": course.includeInGPA ? "true" : "false"
    };
  });

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
 * @returns {Promise<object[]>}
 */
export function importCoursesFromCSV(file, createCourse) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const courses = data
          .map((row) => {
            const name = String(getByHeader(row, "Course Name") || "").trim();
            if (!name) return null;
            return createCourse({
              name,
              credits: toNumberOrBlank(getByHeader(row, "Credits")) || 1,
              level: getByHeader(row, "Level") || "Level 1",
              mp1: toNumberOrBlank(getByHeader(row, "MP1")),
              mp2: toNumberOrBlank(getByHeader(row, "MP2")),
              s1Exam: toNumberOrBlank(getByHeader(row, "S1 Exam")),
              mp3: toNumberOrBlank(getByHeader(row, "MP3")),
              mp4: toNumberOrBlank(getByHeader(row, "MP4")),
              s2Exam: toNumberOrBlank(getByHeader(row, "S2 Exam")),
              includeInGPA: String(getByHeader(row, "Include in GPA")).toLowerCase() !== "false"
            });
          })
          .filter(Boolean);
        resolve(courses);
      },
      error: reject
    });
  });
}
