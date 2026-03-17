// src/screens/HomeScreen.js
import React, { useEffect, useMemo, useState } from "react";
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
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { auth, db } from "../services/firebaseConfig";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { getLocalized } from "../utils/getLocalizedField";
import { getAgeInMonthsFromBirthDate } from "../utils/getAgeInMonthsFromBirthDate";
import { formatAgeMonths } from "../utils/formatAgeMonths";
import { getAgeInWeeksFromBirthDate } from "../utils/getAgeInWeeksFromBirthDate";

const PRIMARY = "#EE2B5B";
const BG = "#F8F6F6";

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

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const userId = auth.currentUser?.uid;

  const {
    currentMonth,
    child,
    loading,
  } = useCurrentChild(userId);

  const [feedItems, setFeedItems] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const childAgeMonths = useMemo(() => {
    if (!child?.birthDate) return currentMonth ?? 0;
    return getAgeInMonthsFromBirthDate(child.birthDate);
  }, [child?.birthDate, currentMonth]);

  const ageInWeeks = useMemo(() => {
    if (!child?.birthDate) return 0;
    return getAgeInWeeksFromBirthDate(child.birthDate);
  }, [child?.birthDate]);

  useEffect(() => {
    const loadFeed = async () => {
      if (!userId || currentMonth == null) {
        setFeedItems([]);
        setLoadingFeed(false);
        return;
      }

      try {
        setLoadingFeed(true);

        // читаємо актуальний currentChildId з users
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const currentChildId = userSnap.exists()
          ? userSnap.data().currentChildId
          : null;

        if (!currentChildId) {
          setFeedItems([]);
          return;
        }

        // 1) статті для поточного місяця
        const articlesRef = collection(db, "articles");
        const qArticles = query(
          articlesRef,
          where("month", "==", currentMonth)
        );
        const snapArticles = await getDocs(qArticles);

        const articles = [];
        snapArticles.forEach((d) => {
          articles.push({ id: d.id, ...d.data() });
        });

        // 2) стани читання для цієї дитини
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
          const month = art.month || currentMonth || 0;

          const globalWeekIndex =
            week > 0 && month > 0 ? (month - 1) * 4 + (week - 1) : null;

          return {
            id: art.id,
            articleId: art.id,
            title: getLocalized(art.title, locale),
            week,
            month,
            globalWeekIndex,
            order: art.order || 0,
            category: art.category || "general",
            isRead: state.isRead,
            readAt: state.readAt,
          };
        });

        const visibleItems = items.filter((item) => {
          if (item.globalWeekIndex == null) return true;
          return item.globalWeekIndex <= ageInWeeks;
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
    };

    loadFeed();
  }, [userId, currentMonth, i18n.language, ageInWeeks]);

  if (loading || loadingFeed) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.emptyText}>{t("home_no_child_text")}</Text>
        <TouchableOpacity
          style={{ marginTop: 16 }}
          onPress={() => navigation.navigate("AddChild")}
        >
          <Text style={{ color: PRIMARY, fontWeight: "700" }}>
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

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.articleCard}
        activeOpacity={0.9}
        onPress={() => handleOpenArticle(item)}
      >
        <View style={styles.articleCardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.articleCategoryRow}>
              <Text style={styles.articleCategoryIcon}>{categoryIcon}</Text>
              <Text style={styles.articleCategoryText}>{categoryLabel}</Text>
            </View>

            <Text style={styles.articleTitle}>{title}</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              item.isRead ? styles.statusPillRead : styles.statusPillNew,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                item.isRead
                  ? styles.statusPillTextRead
                  : styles.statusPillTextNew,
              ]}
            >
              {item.isRead
                ? t("home_article_status_read")
                : t("home_article_status_new")}
            </Text>
          </View>
        </View>

        {item.week ? (
          <View style={styles.weekTagRow}>
            <View style={styles.weekTag}>
              <Text style={styles.weekTagText}>
                {t("home_week_label", { week: item.week })}
              </Text>
            </View>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {child.name ? child.name[0].toUpperCase() : "P"}
            </Text>
          </View>
          <Text style={styles.appTitle}>Parents+</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.iconButton}>
            <Text style={styles.iconText}>🔍</Text>
          </View>
          <View style={styles.iconButton}>
            <Text style={styles.iconText}>🔔</Text>
            <View style={styles.badgeDot} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.feedHeaderBlock}>
          <Text style={styles.feedTitle}>{t("home_feed_title")}</Text>
          <Text style={styles.feedSubtitle}>
            {t("home_month_subtitle", {
              age: formatAgeMonths(childAgeMonths),
            })}
          </Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>✨</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              {t("home_this_week_new_articles")}
            </Text>
            <Text style={styles.bannerText}>
              {t("home_this_week_new_articles_subtitle")}
            </Text>
          </View>
        </View>

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
                style={[
                  styles.chip,
                  isActive && styles.chipActive,
                ]}
                onPress={() => setSelectedCategory(chip.key)}
                activeOpacity={0.9}
              >
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text
                  style={[
                    styles.chipLabel,
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
          <Text style={styles.sectionTitle}>
            {t("home_new_articles_title")}
          </Text>
          {unreadItems.length === 0 ? (
            <Text style={styles.sectionEmptyText}>
              {t("home_no_new_articles")}
            </Text>
          ) : (
            unreadItems.map(renderArticleCard)
          )}
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>
            {t("home_read_articles_title")}
          </Text>
          {readItems.length === 0 ? (
            <Text style={styles.sectionEmptyText}>
              {t("home_no_read_articles")}
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
    backgroundColor: BG,
    paddingTop: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: PRIMARY,
    fontWeight: "700",
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
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
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: PRIMARY,
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
    color: "#0F172A",
  },
  feedSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    marginBottom: 16,
  },
  bannerEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
  },
  bannerText: {
    marginTop: 2,
    fontSize: 13,
    color: "#92400E",
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
    backgroundColor: "#E2E8F0",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#1D4ED8",
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 14,
    color: "#0F172A",
  },
  chipLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  sectionEmptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  articleCard: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
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
    color: "#0F172A",
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  statusPillNew: {
    backgroundColor: "#DBEAFE",
  },
  statusPillRead: {
    backgroundColor: "#E2E8F0",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusPillTextNew: {
    color: "#1D4ED8",
  },
  statusPillTextRead: {
    color: "#475569",
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
    color: "#64748B",
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
    backgroundColor: "rgba(238, 43, 91, 0.08)",
  },
  weekTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY,
  },
});
