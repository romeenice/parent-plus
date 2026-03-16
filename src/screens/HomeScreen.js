import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getArticlesForAge } from "../services/articlesService";
import { auth } from "../services/firebaseConfig";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalizedField";
import { getAgeInMonthsFromBirthDate } from "../utils/getAgeInMonthsFromBirthDate";
import { formatAgeMonths } from "../utils/formatAgeMonths";

const PRIMARY = "#EE2B5B";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [article, setArticle] = useState(null);

  const userId = auth.currentUser?.uid;
  const { currentMonth, ageLabel, child, loading } = useCurrentChild(userId);

  const childAgeMonths = useMemo(() => {
    if (!child?.birthDate) return currentMonth ?? 0;
    return getAgeInMonthsFromBirthDate(child.birthDate);
  }, [child?.birthDate, currentMonth]);

  useEffect(() => {
    const load = async () => {
      try {
        if (currentMonth == null) return;
        const articles = await getArticlesForAge(currentMonth);
        if (articles.length > 0) {
          setArticle(articles[0]);
        } else {
          setArticle(null);
        }
      } catch (e) {
        console.log("Error loading article for month", e);
      }
    };

    load();
  }, [currentMonth]);

  if (loading) {
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

  if (!article) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.emptyText}>
          {t("home_no_articles_for_age")}
        </Text>
      </View>
    );
  }

  const localizedTitle = getLocalized(article.title);
  const [titlePrefix, titleRest] = localizedTitle.split(": ");

  const handleOpenSection = (sectionKey) => {
    navigation.navigate("ArticleDetails", {
      article,
      section: sectionKey,
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
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
        {/* Month block */}
        <View style={styles.monthBlock}>
          {/* Прибрали "Місяць 2: довший час ..." */}
          {/* <Text style={styles.monthLabel}>{t("home_this_month_label")}</Text> */}

          <Text style={styles.monthSubtitle}>
            {t("home_month_subtitle", {
              age: formatAgeMonths(childAgeMonths),
            })}
          </Text>
        </View>

        {/* Sections */}
        <View style={styles.cardsBlock}>
          <SectionCard
            iconBg="#E0ECFF"
            iconText="🧠"
            title={t("home_section_development_title")}
            description={t("home_section_development_description")}
            onPress={() => handleOpenSection("development")}
          />
          <SectionCard
            iconBg="#E9D5FF"
            iconText="💬"
            title={t("home_section_psychology_title")}
            description={t("home_section_psychology_description")}
            onPress={() => handleOpenSection("psychology")}
          />
          <SectionCard
            iconBg="#DCFCE7"
            iconText="🍎"
            title={t("home_section_health_title")}
            description={t("home_section_health_description")}
            onPress={() => handleOpenSection("health")}
          />
          <SectionCard
            iconBg="#FFEDD5"
            iconText="🎲"
            title={t("home_section_play_title")}
            description={t("home_section_play_description")}
            onPress={() => handleOpenSection("play")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionCard({ iconBg, iconText, title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.cardIconWrapper, { backgroundColor: iconBg }]}>
        <Text style={styles.cardIcon}>{iconText}</Text>
      </View>
      <View style={styles.cardTextBlock}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F6",
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
  monthBlock: {
    marginTop: 8,
    marginBottom: 20,
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: PRIMARY,
  },
  monthTitle: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  monthTitleAccent: {
    color: PRIMARY,
  },
  monthSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },

  cardsBlock: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 4,
  },
  cardIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  chevron: {
    fontSize: 24,
    color: "#CBD5E1",
    marginLeft: 8,
  },
});
