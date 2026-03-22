import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ArticleDetailsScreen({ route }) {
  const { articleId } = route.params;
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language;

  useEffect(() => {
    loadArticle();
  }, [articleId]);

  const loadArticle = async () => {
    try {
      const articleRef = doc(db, "articles", articleId);
      const articleSnap = await getDoc(articleRef);

      if (articleSnap.exists()) {
        setArticle({ id: articleSnap.id, ...articleSnap.data() });
        await markAsRead();
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const currentChildId = userDoc.data()?.currentChildId;

      if (currentChildId) {
        const stateRef = doc(
          db,
          `users/${user.uid}/children/${currentChildId}/articleStates`,
          articleId
        );

        await setDoc(
          stateRef,
          {
            isRead: true,
            readAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error marking article as read:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.BG },
        ]}
      >
        <ActivityIndicator size="large" color={theme.PRIMARY} />
      </View>
    );
  }

  if (!article) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.BG },
        ]}
      >
        <Text style={[styles.errorText, { color: theme.TEXT }]}>
          {t("article_not_found") || "Article not found"}
        </Text>
      </View>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      psychology: "💬",
      health: "🍎",
      development: "🧠",
      play: "🎲",
    };
    return icons[category] || "📄";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      psychology: "home_category_label_psychology",
      health: "home_category_label_health",
      development: "home_category_label_development",
      play: "home_category_label_play",
    };
    return t(labels[category] || "home_category_label_general");
  };

  const getLocalizedText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[currentLang] || field.en || field.uk || "";
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.BG }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Image */}
      {article.imageUrl && (
        <Image
          source={{ uri: article.imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}

      {/* Content Container */}
      <View style={styles.content}>
        {/* Category Chip */}
        <View
          style={[
            styles.categoryChip,
            { backgroundColor: theme.CHIP_BG },
          ]}
        >
          <Text style={styles.categoryIcon}>
            {getCategoryIcon(article.category)}
          </Text>
          <Text style={[styles.categoryText, { color: theme.TEXT }]}>
            {getCategoryLabel(article.category)}
          </Text>
        </View>

        {/* Summary */}
        {article.summary && (
          <Text style={[styles.summary, { color: theme.SECONDARY }]}>
            {getLocalizedText(article.summary)}
          </Text>
        )}

        {/* Main Content */}
        <Text style={[styles.text, { color: theme.TEXT }]}>
          {getLocalizedText(article.content)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  heroImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  summary: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
