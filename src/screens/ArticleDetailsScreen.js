// src/screens/ArticleDetailsScreen.js
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const SECTION_CONFIG = {
  development: { labelKey: "article_section_development", field: "development" },
  psychology: { labelKey: "article_section_psychology", field: "psychology" },
  health: { labelKey: "article_section_health", field: "health" },
  play: { labelKey: "article_section_play", field: "play" },
};

export default function ArticleDetailsScreen({ route }) {
  const { t } = useTranslation();
  const { article, section } = route.params || {};

  if (!article) {
    return (
      <SafeAreaView style={styles.fallback} edges={["top"]}>
        <Text style={styles.fallbackText}>{t("article_no_data")}</Text>
      </SafeAreaView>
    );
  }

  const renderSection = (key) => {
    const config = SECTION_CONFIG[key];
    if (!config) return null;

    const text = article[config.field];
    if (!text) return null;

    return (
      <View key={key} style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>{t(config.labelKey)}</Text>
        <Text style={styles.sectionText}>{text}</Text>
      </View>
    );
  };

  const sectionKeys = section
    ? [section] // тільки одна секція
    : ["development", "psychology", "health", "play"]; // всі секції

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      {sectionKeys.map(renderSection)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});
