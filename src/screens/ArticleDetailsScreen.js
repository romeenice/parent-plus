// src/screens/ArticleDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { doc, getDoc, setDoc } from "firebase/firestore";


import { auth, db } from "../services/firebaseConfig";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { getLocalized } from "../utils/getLocalizedField";

export default function ArticleDetailsScreen({ route }) {
  const { t } = useTranslation();
  const { articleId } = route.params || {};

  const userId = auth.currentUser?.uid;
  const { currentChildId } = useCurrentChild(userId);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!articleId) {
        setLoading(false);
        return;
      }
      try {
        // 1. завантажуємо саму статтю
        const ref = doc(db, "articles", articleId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const loaded = { id: snap.id, ...snap.data() };
          setArticle(loaded);

          // 2. позначаємо як прочитану для поточної дитини
          if (userId && currentChildId) {
            const stateRef = doc(
              db,
              "users",
              userId,
              "children",
              currentChildId,
              "articleStates",
              articleId
            );
            await setDoc(
              stateRef,
              {
                isRead: true,
                readAt: new Date(),
              },
              { merge: true }
            );
          }
        } else {
          setArticle(null);
        }
      } catch (e) {
        console.log("Error loading article details", e);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [articleId, userId, currentChildId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.fallback} edges={["top"]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.fallback} edges={["top"]}>
        <Text style={styles.fallbackText}>{t("article_no_data")}</Text>
      </SafeAreaView>
    );
  }

  const title = getLocalized(article.title);
  const content = getLocalized(article.content);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.contentText}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  fallbackText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});
