import { calcS1Average, calcS2Average } from "./semesterAverage";

export const GPA_SCALE = [
  { min: 97, max: 100, "Level 4": 6.0, "Level 3": 5.5, "Level 2": 5.0, "Level 1": 4.0 },
  { min: 94, max: 96, "Level 4": 5.8, "Level 3": 5.3, "Level 2": 4.8, "Level 1": 3.8 },
  { min: 90, max: 93, "Level 4": 5.6, "Level 3": 5.1, "Level 2": 4.6, "Level 1": 3.6 },
  { min: 87, max: 89, "Level 4": 5.4, "Level 3": 4.9, "Level 2": 4.4, "Level 1": 3.4 },
  { min: 84, max: 86, "Level 4": 5.2, "Level 3": 4.7, "Level 2": 4.2, "Level 1": 3.2 },
  { min: 80, max: 83, "Level 4": 5.0, "Level 3": 4.5, "Level 2": 4.0, "Level 1": 3.0 },
  { min: 77, max: 79, "Level 4": 4.8, "Level 3": 4.3, "Level 2": 3.8, "Level 1": 2.8 },
  { min: 74, max: 76, "Level 4": 4.6, "Level 3": 4.1, "Level 2": 3.6, "Level 1": 2.6 },
  { min: 71, max: 73, "Level 4": 4.4, "Level 3": 3.9, "Level 2": 3.4, "Level 1": 2.4 },
  { min: 70, max: 70, "Level 4": 4.2, "Level 3": 3.7, "Level 2": 3.2, "Level 1": 2.2 },
  { min: 0, max: 69, "Level 4": 0, "Level 3": 0, "Level 2": 0, "Level 1": 0 }
];

/**
 * Look up weighted GPA points for an average and course level.
 * @param {number|null|undefined} average
 * @param {"Level 1"|"Level 2"|"Level 3"|"Level 4"} level
 * @returns {number|null}
 */
export function getGPAPoints(average, level) {
  if (average === null || average === undefined) return null;
  const avg = Math.floor(average);
  const row = GPA_SCALE.find((scaleRow) => avg >= scaleRow.min && avg <= scaleRow.max);
  if (!row) return 0;
  return row[level] ?? 0;
}

/**
 * Calculate one course's weighted GPA contribution.
 * @param {object} course
 * @returns {{points: number, credits: number}|null}
 */
export function getCourseGPAPoints(course) {
  if (!course.includeInGPA) return null;

  const s1 = calcS1Average(course.mp1, course.mp2);
  const s2 = calcS2Average(course.mp3, course.mp4);
  const pts = [];

  if (s1 !== null) pts.push(getGPAPoints(s1, course.level));
  if (s2 !== null) pts.push(getGPAPoints(s2, course.level));
  if (pts.length === 0) return null;

  const avgPoints = pts.reduce((total, point) => total + point, 0) / pts.length;
  return { points: avgPoints, credits: Number(course.credits) || 1 };
}

/**
 * Calculate cumulative weighted GPA across all school-year tabs.
 * @param {Array<{courses: object[]}>} allTabs
 * @returns {number|null}
 */
export function calcCumulativeGPA(allTabs) {
  let totalWeightedPoints = 0;
  let totalCredits = 0;

  for (const tab of allTabs) {
    for (const course of tab.courses || []) {
      const contribution = getCourseGPAPoints(course);
      if (!contribution) continue;
      totalWeightedPoints += contribution.points * contribution.credits;
      totalCredits += contribution.credits;
    }
  }

  if (totalCredits === 0) return null;
  return totalWeightedPoints / totalCredits;
}

/**
 * Count included GPA credits and courses with at least one complete semester.
 * @param {Array<{courses: object[]}>} allTabs
 * @returns {{credits: number, courses: number}}
 */
export function getGPAStats(allTabs) {
  return allTabs.reduce(
    (stats, tab) => {
      for (const course of tab.courses || []) {
        const contribution = getCourseGPAPoints(course);
        if (!contribution) continue;
        stats.credits += contribution.credits;
        stats.courses += 1;
      }
      return stats;
    },
    { credits: 0, courses: 0 }
  );
}
