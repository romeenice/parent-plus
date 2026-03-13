// src/screens/ArticleDetailsScreen.js
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const SECTION_TITLES = {
  development: "🧠 Development",
  psychology: "💬 Psychology",
  health: "🍎 Health",
  play: "🎲 Play",
};

export default function ArticleDetailsScreen({ route }) {
  const { article, section } = route.params || {};

  const sectionTitle = section ? SECTION_TITLES[section] : null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      {sectionTitle && <Text style={styles.section}>{sectionTitle}</Text>}
      <Text style={styles.content}>{article.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
