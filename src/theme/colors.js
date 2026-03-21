export const THEMES = {
  pastel: {
    name: "theme_pastel_pink",
    PRIMARY: "#EE2B5B",
    BG: "#F8F6F6",
    TEXT: "#0F172A",
    SECONDARY: "#64748B",
    CARD_BG: "#FFFFFF",
    BANNER_BG: "#FEF3C7",
    BANNER_TEXT: "#92400E",
    BORDER: "#E2E8F0",
    CHIP_BG: "#E2E8F0",
    CHIP_ACTIVE: "#1D4ED8",
    STATUS_NEW_BG: "#DBEAFE",
    STATUS_NEW_TEXT: "#1D4ED8",
    STATUS_READ_BG: "#E2E8F0",
    STATUS_READ_TEXT: "#475569",
    CHILD_CARD_BG: "#FFE4EC",
    SECTION_BG: "#FFFFFF",
    DROPDOWN_BG: "#FFFFFF", // ДОДАНО
    COUNTDOWN_BG: "rgba(238, 43, 91, 0.08)", // ДОДАНО
  },
  sadGrey: {
    name: "theme_depressive_grey",
    PRIMARY: "#9CA3AF",
    BG: "#1F2937",
    TEXT: "#F3F4F6",
    SECONDARY: "#9CA3AF",
    CARD_BG: "#374151",
    BANNER_BG: "#4B5563",
    BANNER_TEXT: "#E5E7EB",
    BORDER: "#4B5563",
    CHIP_BG: "#4B5563",
    CHIP_ACTIVE: "#6B7280",
    STATUS_NEW_BG: "#5A6A7A",
    STATUS_NEW_TEXT: "#D1D5DB",
    STATUS_READ_BG: "#4B5563",
    STATUS_READ_TEXT: "#E5E7EB",
    CHILD_CARD_BG: "#374151",
    SECTION_BG: "#2D3748",
    DROPDOWN_BG: "#374151", // ДОДАНО - світліше
    COUNTDOWN_BG: "rgba(156, 163, 175, 0.2)", // ДОДАНО - світліше
  },
  cosmic: {
    name: "theme_cosmic_dust",
    PRIMARY: "#A78BFA",
    BG: "#0F0F1E",
    TEXT: "#F5F5F7",
    SECONDARY: "#A0A0A0",
    CARD_BG: "#1A1A2E",
    BANNER_BG: "#2D2D44",
    BANNER_TEXT: "#E0AAFF",
    BORDER: "#3A3A5C",
    CHIP_BG: "#3A3A5C",
    CHIP_ACTIVE: "#9D4EDD",
    STATUS_NEW_BG: "#3A2E5C",
    STATUS_NEW_TEXT: "#E0AAFF",
    STATUS_READ_BG: "#2D2D44",
    STATUS_READ_TEXT: "#B8A8D8",
    CHILD_CARD_BG: "#2D2D44",
    SECTION_BG: "#1A1A2E",
    DROPDOWN_BG: "#2D2D44", // ДОДАНО - світліше
    COUNTDOWN_BG: "rgba(167, 139, 250, 0.2)", // ДОДАНО - світліше
  },
};


export const getTheme = (themeKey) => THEMES[themeKey] || THEMES.pastel;
