// src/utils/getAgeInWeeksFromBirthDate.js
export function getAgeInWeeksFromBirthDate(birthDate) {
  if (!birthDate) return 1;

  const birth = new Date(birthDate);
  const now = new Date();

  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const fullWeeks = Math.floor(diffDays / 7);

  const weekIndex = fullWeeks + 1; // 0–6 днів → 1, 7–13 → 2, ...

  return weekIndex < 1 ? 1 : weekIndex;
}
