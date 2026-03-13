import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Tasks</Text>
      <Text style={styles.text}>
        Premium age-specific tasks will appear here later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});