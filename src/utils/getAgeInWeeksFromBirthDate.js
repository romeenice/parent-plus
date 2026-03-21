// src/utils/getAgeInWeeksFromBirthDate.js
export function getAgeInWeeksFromBirthDate(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // 0-6 днів → тиждень 1, 7-13 → тиждень 2, 14-20 → тиждень 3, 21-27 → тиждень 4, 28-34 → тиждень 4 (не 5!)
  // Щоб 28-34 дні = 4-й тиждень:
  const weekIndex = Math.floor(diffDays / 7) + 1;
  
  // Але якщо хочеш, щоб 4 тижні = 28 днів точно, і тільки на 35-й день починався 5-й:
  const fullWeeks = Math.floor(diffDays / 7);
  const currentWeek = fullWeeks < 4 ? fullWeeks + 1 : Math.ceil((diffDays + 1) / 7);
  
  return currentWeek < 1 ? 1 : currentWeek;
}
