// src/utils/getDaysUntilNextWeek.js
export function getDaysUntilNextWeek(birthDate) {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // дні до наступного тижня (7 днів = 1 тиждень)
  const daysInCurrentWeek = diffDays % 7;
  const daysUntilNextWeek = 7 - daysInCurrentWeek;
  
  return daysUntilNextWeek;
}
