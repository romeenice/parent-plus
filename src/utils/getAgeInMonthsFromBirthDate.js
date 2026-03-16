// src/utils/getAgeInMonthsFromBirthDate.js
export function getAgeInMonthsFromBirthDate(birthDateString) {
  if (!birthDateString) return 0;

  const birth = new Date(birthDateString);
  const now = new Date();

  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }

  if (months < 0) months = 0;

  return months;
}
