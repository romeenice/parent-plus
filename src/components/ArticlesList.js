import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ArticlesListItem from "./ArticlesListItem";

export default function ArticlesList({ articles }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticlesListItem item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
});
