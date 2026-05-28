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
  const avg = Math.round(average);
  const row = GPA_SCALE.find((scaleRow) => avg >= scaleRow.min && avg <= scaleRow.max);
  if (!row) return 0;
  return row[level] ?? 0;
}

// Returns effective credits for a course given which semesters are filled
export function getEffectiveCredits(course) {
  const hasBoth = course.s1 !== "" && course.s2 !== "";
  const hasOne = (course.s1 !== "") !== (course.s2 !== "");
  if (course.credits !== "" && course.credits !== null) return Number(course.credits);
  if (hasBoth) return 1.0;
  if (hasOne) return 0.5;
  return 0;
}

// Returns array of {points, weight} for each valid semester in a course
export function getCourseContributions(course, { rankedOnly = false } = {}) {
  if (!course.includeInGPA) return [];
  if (rankedOnly && course.ranked === false) return [];
  const effectiveCredits = getEffectiveCredits(course);
  if (effectiveCredits === 0) return [];

  const semesters = [];
  if (course.s1 !== "" && course.s1 !== null) semesters.push(Number(course.s1));
  if (course.s2 !== "" && course.s2 !== null) semesters.push(Number(course.s2));
  if (semesters.length === 0) return [];

  const weightPerSemester = effectiveCredits / semesters.length;
  return semesters.map((grade) => ({
    points: getGPAPoints(Math.floor(grade), course.level),
    weight: weightPerSemester
  }));
}

export function calcCumulativeGPA(allTabs, options = {}) {
  let totalWeighted = 0;
  let totalWeight = 0;
  for (const tab of allTabs) {
    for (const course of tab.courses || []) {
      for (const { points, weight } of getCourseContributions(course, options)) {
        totalWeighted += points * weight;
        totalWeight += weight;
      }
    }
  }
  return totalWeight === 0 ? null : totalWeighted / totalWeight;
}

export function getGPAStats(allTabs, options = {}) {
  let credits = 0;
  let courses = 0;
  for (const tab of allTabs) {
    for (const course of tab.courses || []) {
      const contribs = getCourseContributions(course, options);
      if (contribs.length > 0) {
        credits += contribs.reduce((s, c) => s + c.weight, 0);
        courses += 1;
      }
    }
  }
  return { credits, courses };
}

export function calcRankedGPA(allTabs) {
  return calcCumulativeGPA(allTabs, { rankedOnly: true });
}

export function getRankedGPAStats(allTabs) {
  return getGPAStats(allTabs, { rankedOnly: true });
}
