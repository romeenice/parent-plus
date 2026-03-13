// src/components/ArticlesListItem.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ArticlesListItem({ item }) {
  const navigation = useNavigation();

  const shortContent =
    item.content && item.content.length > 80
      ? item.content.slice(0, 80) + "..."
      : item.content || "";

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ArticleDetails", { article: item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{shortContent}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
});
