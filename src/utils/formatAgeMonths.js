// src/utils/formatAgeMonths.js
export function formatAgeMonths(months) {
  if (months < 12) {
    const monthWord = months === 1 ? "month" : "months";
    return `${months} ${monthWord}`;
  }

  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  const yearWord = years === 1 ? "year" : "years";

  if (restMonths === 0) {
    return `${years} ${yearWord}`;
  }

  const monthWord = restMonths === 1 ? "month" : "months";

  return `${years} ${yearWord} and ${restMonths} ${monthWord}`;
}
