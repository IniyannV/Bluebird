/**
 * Calculate Coppell semester 1 average from marking periods.
 * @param {number|string} mp1
 * @param {number|string} mp2
 * @returns {number|null}
 */
export function calcS1Average(mp1, mp2) {
  if (mp1 === "" || mp2 === "" || mp1 == null || mp2 == null) return null;
  return (Math.round(Number(mp1)) + Math.round(Number(mp2))) / 2;
}

/**
 * Calculate Coppell semester 2 average from marking periods.
 * @param {number|string} mp3
 * @param {number|string} mp4
 * @returns {number|null}
 */
export function calcS2Average(mp3, mp4) {
  if (mp3 === "" || mp4 === "" || mp3 == null || mp4 == null) return null;
  return (Math.round(Number(mp3)) + Math.round(Number(mp4))) / 2;
}
