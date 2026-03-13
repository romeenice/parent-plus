// src/screens/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getArticlesForAge } from "../services/articlesService";
import { formatAgeMonths } from "../utils/formatAgeMonths";


export default function HomeScreen({ navigation }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // тимчасово: вік дитини в місяцях
        const currentAgeMonths = 1; // TODO: потім рахуємо з дати народження
        const articles = await getArticlesForAge(currentAgeMonths);
        // поки що беремо першу статтю для цього віку
        if (articles.length > 0) {
          setArticle(articles[0]);
        }
      } catch (e) {
        console.log("Error loading article for month", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>
          Поки що немає статей для цього віку.
        </Text>
      </View>
    );
  }

  const currentMonth = article.month; // у тебе в документі є поле "month"

  const openSection = (sectionKey) => {
    navigation.navigate("ArticleDetails", {
      article,
      section: sectionKey,
    });
  };

  const currentAgeMonths = 31; // тимчасово

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.greetingText}>This month</Text>
        <Text style={styles.monthTitle}>{article.title}</Text>

        <Text style={styles.monthSubtitle}>
          Your child is about {formatAgeMonths(currentAgeMonths)} old.
        </Text>
      </View>

      <View style={styles.sectionsBlock}>
        <SectionCard
          icon="🧠"
          title="Development"
          description="Що дитина вчиться робити цього місяця."
          onPress={() => openSection("development")}
        />
        <SectionCard
          icon="💬"
          title="Psychology"
          description="Емоції, привʼязаність і поведінка."
          onPress={() => openSection("psychology")}
        />
        <SectionCard
          icon="🍎"
          title="Health"
          description="Сон, годування, здоровʼя та безпека."
          onPress={() => openSection("health")}
        />
        <SectionCard
          icon="🎲"
          title="Play"
          description="Ігри й активності для цього віку."
          onPress={() => openSection("play")}
        />
      </View>
    </ScrollView>
  );
}

function SectionCard({ icon, title, description, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View style={styles.cardTextBlock}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#F5F5F7",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  headerBlock: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  monthSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  sectionsBlock: {
    marginTop: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  cardTextBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});
