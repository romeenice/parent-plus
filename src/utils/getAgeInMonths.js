export function getAgeInMonths(birthDateString) {
  if (!birthDateString) return 0;

  const birthDate = new Date(birthDateString);
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  const totalMonths = years * 12 + months;

  // якщо день місяця ще не настав — віднімаємо один місяць
  if (now.getDate() < birthDate.getDate()) {
    return Math.max(totalMonths - 1, 0);
  }

  return Math.max(totalMonths, 0);
}
