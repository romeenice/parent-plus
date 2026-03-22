// src/utils/formatAgeMonths.js
import i18n from "../i18n";

export function formatAgeMonths(months) {
  const t = i18n.t.bind(i18n);

  if (months < 12) {
    const monthWord = months === 1 ? t("month") : t("months");
    return `${months} ${monthWord}`;
  }

  const years = Math.floor(months / 12);
  const restMonths = months % 12;

  const yearWord = years === 1 ? t("year") : t("years");

  if (restMonths === 0) {
    return `${years} ${yearWord}`;
  }

  const monthWord = restMonths === 1 ? t("month") : t("months");

  return `${years} ${yearWord} ${t("and")} ${restMonths} ${monthWord}`;
}
