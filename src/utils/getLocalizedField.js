// src/utils/getLocalizedField.js
import i18n from "../i18n";

export function getLocalized(fieldObject) {
  const lang = i18n.language || "en";
  if (!fieldObject) return "";
  return fieldObject[lang] || fieldObject.en || "";
}
