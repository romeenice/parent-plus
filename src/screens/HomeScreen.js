// src/screens/HomeScreen.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

import { useTheme } from "../theme/ThemeContext";
import { auth, db } from "../services/firebaseConfig";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { getLocalized } from "../utils/getLocalizedField";
import { getAgeInMonthsFromBirthDate } from "../utils/getAgeInMonthsFromBirthDate";
import { formatAgeMonths } from "../utils/formatAgeMonths";
import { getAgeInWeeksFromBirthDate } from "../utils/getAgeInWeeksFromBirthDate";
import { getDaysUntilNextWeek } from "../utils/getDaysUntilNextWeek";

const CATEGORY_FILTERS = [
  { key: "all", icon: "✨", labelKey: "home_feed_filter_all" },
  { key: "development", icon: "🧠", labelKey: "home_feed_filter_development" },
  { key: "psychology", icon: "💬", labelKey: "home_feed_filter_psychology" },
  { key: "health", icon: "🍎", labelKey: "home_feed_filter_health" },
  { key: "play", icon: "🎲", labelKey: "home_feed_filter_play" },
];

const CATEGORY_ICONS = {
  development: "🧠",
  psychology: "💬",
  health: "🍎",
  play: "🎲",
  general: "📘",
};

const STATUS_OPTIONS = [
  { value: "new", labelKey: "home_article_status_new" },
  { value: "read", labelKey: "home_article_status_read" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "read":
      return {
        bg: "#E2E8F0",
        border: "#CBD5E1",
        text: "#475569",
        icon: "✔",
      };
    case "new":
    default:
      return {
        bg: "#DBEAFE",
        border: "#BFDBFE",
        text: "#1D4ED8",
        icon: "✨",
      };
  }
};

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const userId = auth.currentUser?.uid;

  const {
    currentMonth,
    child,
    loading,
  } = useCurrentChild(userId);

  const [feedItems, setFeedItems] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const daysUntilNextWeek = useMemo(() => {
    if (!child?.birthDate) return 0;
    return getDaysUntilNextWeek(child.birthDate);
  }, [child?.birthDate]);

  const childAgeMonths = useMemo(() => {
    if (!child?.birthDate) return currentMonth ?? 0;
    return getAgeInMonthsFromBirthDate(child.birthDate);
  }, [child?.birthDate, currentMonth]);

  const ageInWeeks = useMemo(() => {
    if (!child?.birthDate) return 1;
    return getAgeInWeeksFromBirthDate(child.birthDate);
  }, [child?.birthDate]);

  const loadFeed = useCallback(async () => {
    if (!userId) {
      setFeedItems([]);
      setLoadingFeed(false);
      return;
    }

    try {
      setLoadingFeed(true);

      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const currentChildId = userSnap.exists()
        ? userSnap.data().currentChildId
        : null;

      if (!currentChildId) {
        setFeedItems([]);
        return;
      }

      const articlesRef = collection(db, "articles");
      const snapArticles = await getDocs(articlesRef);

      const articles = [];
      snapArticles.forEach((d) => {
        articles.push({ id: d.id, ...d.data() });
      });

      const statesRef = collection(
        db,
        "users",
        userId,
        "children",
        currentChildId,
        "articleStates"
      );
      const snapStates = await getDocs(statesRef);
      const statesById = {};
      snapStates.forEach((d) => {
        const data = d.data() || {};
        statesById[d.id] = {
          isRead: !!data.isRead,
          readAt: data.readAt || null,
        };
      });

      const locale = i18n.language || "en";

      const items = articles.map((art) => {
        const state = statesById[art.id] || { isRead: false, readAt: null };
        const week = art.weekIndex || 0;

        return {
          id: art.id,
          articleId: art.id,
          title: getLocalized(art.title, locale),
          week,
          order: art.order || 0,
          category: art.category || "general",
          isRead: state.isRead,
          readAt: state.readAt,
        };
      });

      const WEEKS_WINDOW = 8;
      const visibleItems = items.filter((item) => {
        if (!item.week) return true;

        const maxWeek = ageInWeeks;
        const minWeek = Math.max(1, maxWeek - WEEKS_WINDOW + 1);

        return item.week >= minWeek && item.week <= maxWeek;
      });

      visibleItems.sort((a, b) => {
        if (a.isRead === b.isRead) {
          if (a.week === b.week) {
            return a.order - b.order;
          }
          return a.week - b.week;
        }
        return a.isRead ? 1 : -1;
      });

      setFeedItems(visibleItems);
    } catch (e) {
      console.log("Error loading feed", e);
      setFeedItems([]);
    } finally {
      setLoadingFeed(false);
    }
  }, [userId, i18n.language, ageInWeeks]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useFocusEffect(
    useCallback(() => {
      loadFeed();
    }, [loadFeed])
  );

  const handleToggleReadStatus = async (item, newIsRead) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const currentChildId = userSnap.exists()
        ? userSnap.data().currentChildId
        : null;

      if (!currentChildId) return;

      const stateRef = doc(
        db,
        "users",
        userId,
        "children",
        currentChildId,
        "articleStates",
        item.id
      );

      await setDoc(
        stateRef,
        {
          isRead: newIsRead,
          readAt: newIsRead ? new Date() : null,
        },
        { merge: true }
      );

      const updatedItems = feedItems.map((art) =>
        art.id === item.id ? { ...art, isRead: newIsRead } : art
      );
      setFeedItems(updatedItems);
      setOpenDropdownId(null);
    } catch (e) {
      console.log("Error toggling read status", e);
    }
  };

  if (loading || loadingFeed) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor: theme.BG }]}>
        <Text style={[styles.emptyText, { color: theme.SECONDARY }]}>
          {t("home_no_child_text")}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate("AddChild")}
        >
          <Text style={{ color: theme.PRIMARY, fontWeight: "700" }}>
            {t("home_add_first_child_button")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredFeed = feedItems.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const unreadItems = filteredFeed.filter((item) => !item.isRead);
  const readItems = filteredFeed.filter((item) => item.isRead);

  const handleOpenArticle = (item) => {
    navigation.navigate("ArticleDetails", {
      articleId: item.articleId,
      articleTitle: item.title,
    });
  };

  const renderCategoryLabel = (categoryKey) => {
    switch (categoryKey) {
      case "development":
        return t("home_category_label_development");
      case "psychology":
        return t("home_category_label_psychology");
      case "health":
        return t("home_category_label_health");
      case "play":
        return t("home_category_label_play");
      default:
        return t("home_category_label_general");
    }
  };

  const renderArticleCard = (item) => {
    const categoryLabel = renderCategoryLabel(item.category);
    const categoryIcon =
      CATEGORY_ICONS[item.category] || CATEGORY_ICONS.general;
    const title = item.title;
    const statusCfg = getStatusStyle(item.isRead ? "read" : "new");
    const isOpen = openDropdownId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.articleCard, { backgroundColor: theme.CARD_BG }]}
        activeOpacity={0.9}
        onPress={() => handleOpenArticle(item)}
      >
        <View style={styles.articleCardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.articleCategoryRow}>
              <Text style={styles.articleCategoryIcon}>{categoryIcon}</Text>
              <Text style={[styles.articleCategoryText, { color: theme.SECONDARY }]}>
                {categoryLabel}
              </Text>
            </View>

            <Text style={[styles.articleTitle, { color: theme.TEXT }]}>
              {title}
            </Text>
          </View>

          <View style={styles.statusWrapper}>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusCfg.bg,
                  borderColor: statusCfg.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setOpenDropdownId(isOpen ? null : item.id)}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusCfg.text },
                ]}
                numberOfLines={1}
              >
                {statusCfg.icon}{" "}
                {item.isRead
                  ? t("home_article_status_read")
                  : t("home_article_status_new")}
              </Text>
            </TouchableOpacity>

            {isOpen && (
              <View
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: theme.SECTION_BG,
                    borderColor: theme.BORDER,
                  },
                ]}
              >
                {STATUS_OPTIONS.map((option) => {
                  const optionCfg = getStatusStyle(option.value);
                  const isActive =
                    (option.value === "read" && item.isRead) ||
                    (option.value === "new" && !item.isRead);

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        isActive && {
                          backgroundColor: `${theme.PRIMARY}20`,
                        },
                      ]}
                      onPress={() =>
                        handleToggleReadStatus(
                          item,
                          option.value === "read"
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                           { color: theme.TEXT },
                          isActive && {
                            color: theme.PRIMARY,
                            fontWeight: "700",
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {optionCfg.icon} {t(option.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {item.week ? (
          <View style={styles.weekTagRow}>
            <View style={[styles.weekTag, { backgroundColor: `${theme.PRIMARY}15` }]}>
              <Text style={[styles.weekTagText, { color: theme.PRIMARY }]}>
                {t("home_week_label", { week: item.week })}
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.BG }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate("Profile")}
        >
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: `${theme.PRIMARY}15` },
            ]}
          >
            <Text style={[styles.avatarText, { color: theme.PRIMARY }]}>
              {child.name ? child.name[0].toUpperCase() : "P"}
            </Text>
          </View>
          <Text style={[styles.appTitle, { color: theme.TEXT }]}>
            Parents+
          </Text>
        </TouchableOpacity>

        {daysUntilNextWeek > 0 && (
          <View
            style={[
              styles.countdownBlock,
              { backgroundColor: `${theme.PRIMARY}15` },
            ]}
          >
            <Text style={[styles.countdownText, { color: theme.PRIMARY }]}>
              📅 {t("home_new_articles_in", {
                days: daysUntilNextWeek,
              })}
            </Text>
          </View>
        )}
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
       <View style={styles.feedHeaderBlock}>
  <Text style={[styles.feedTitle, { color: theme.TEXT }]}>
    {t("home_feed_title")}
  </Text>
  
  <View style={[styles.ageBlock, 
     { backgroundColor: theme.STATUS_NEW_BG,
       borderRadius: 5
      }]
  }>
    <Text style={[styles.ageBlockText, { color: theme.STATUS_NEW_TEXT }]}>
      {t("home_month_subtitle", {
        age: formatAgeMonths(childAgeMonths),
      })}
    </Text>
  </View>
</View>



        {/* Банер показується тільки якщо є непрочитані статті */}
        {unreadItems.length > 0 && (
  <View style={[styles.banner, { backgroundColor: theme.BANNER_BG }]}>
    <Text style={styles.bannerEmoji}>✨</Text>
    <View style={{ flex: 1 }}>
      <Text style={[styles.bannerTitle, { color: theme.BANNER_TEXT }]}>
        {t("home_this_week_new_articles")}
      </Text>
      <Text style={[styles.bannerText, { color: theme.BANNER_TEXT }]}>
        {t("home_this_week_new_articles_subtitle")}
      </Text>
    </View>
  </View>
)}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsRow}
        >
          {CATEGORY_FILTERS.map((chip) => {
            const isActive = selectedCategory === chip.key;
            return (
              <TouchableOpacity
                key={chip.key}
                style={[styles.chip,{
          backgroundColor: isActive ? theme.CHIP_ACTIVE : theme.CHIP_BG,
        }, isActive && styles.chipActive]}
                onPress={() => setSelectedCategory(chip.key)}
                activeOpacity={0.9}
              >
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text
                  style={[
                    styles.chipLabel,
                    {
            color: isActive ? "#FFFFFF" : theme.TEXT,
            fontWeight: isActive ? "600" : "400",
          },
                    isActive && styles.chipLabelActive,
                  ]}
                >
                  {t(chip.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
            {t("home_new_articles_title")}
          </Text>
          {unreadItems.length === 0 ? (
            <Text style={[styles.sectionEmptyText, { color: theme.SECONDARY }]}>
              {t("home_no_new_articles")}
            </Text>
          ) : (
            unreadItems.map(renderArticleCard)
          )}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: theme.TEXT }]}>
            {t("home_read_articles_title")}
          </Text>
          {readItems.length === 0 ? (
            <Text style={[styles.sectionEmptyText, { color: theme.SECONDARY }]}>
              {t
("home_no_read_articles")}
            </Text>
          ) : (
            readItems.map(renderArticleCard)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
     paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 50,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    fontSize: 18,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: "relative",
  },
  iconText: {
    fontSize: 18,
  },
  badgeDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 9999,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  feedHeaderBlock: {
    marginTop: 8,
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  feedSubtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerEmoji: {
    fontSize: 24,
    marginRight: 12,

  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  bannerText: {
    marginTop: 2,
    fontSize: 13,
  },
  chipsRow: {
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginRight: 8,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 14,
  },
  chipLabelActive: {
    fontWeight: "600",
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionEmptyText: {
    fontSize: 14,
  },
  articleCard: {
    padding: 14,
    borderRadius: 16,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 8,
  },
  articleCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
    statusWrapper: {
    marginLeft: 12,
    alignItems: "flex-end",
    position: "relative",
  },
  statusBadge: {
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dropdown: {
     position: "absolute",
    top: -5,
    right: 0,
    marginTop: 0,
    borderRadius: 16,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
    borderWidth: 1,
    minWidth: 160,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  dropdownItemText: {
    fontSize: 13,
  },

  articleCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  articleCategoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  articleCategoryText: {
    fontSize: 13,
    fontWeight: "600",
  },
  weekTagRow: {
    marginTop: 8,
    flexDirection: "row",
  },
  weekTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  weekTagText: {
    fontSize: 12,
    fontWeight: "600",
  },
    countdownBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 6,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 13,
    fontWeight: "600",
  },

    feedHeaderBlock: {
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: "800",
    flex: 1,
  },
  ageBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 12,
  },
  ageBlockText: {
    fontSize: 13,
    fontWeight: "600",
    whiteSpace: "nowrap",
  },


});
