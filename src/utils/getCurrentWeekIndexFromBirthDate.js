// src/utils/getCurrentWeekIndexFromBirthDate.js
export function getCurrentWeekIndexFromBirthDate(birthDateString) {
  if (!birthDateString) return 1;

  const birth = new Date(birthDateString);
  const now = new Date();

  const diffMs = now.getTime() - birth.getTime();
  const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)); // повні тижні[web:31]

  const weekIndex = diffWeeks + 1; // 0 тижнів → 1-й тиждень

  return weekIndex < 1 ? 1 : weekIndex;
}
