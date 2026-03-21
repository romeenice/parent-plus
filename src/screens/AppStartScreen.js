// src/screens/AppStartScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useTheme } from "../theme/ThemeContext";

export default function AppStartScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkChild() {
      try {
        const db = getFirestore();
        const childrenRef = collection(db, "children");
        const snap = await getDocs(childrenRef);

        if (!snap.empty) {
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          });
        }
      } catch (e) {
        console.log("Error checking child", e);
        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        });
      } finally {
        setChecking(false);
      }
    }

    checkChild();
  }, [navigation]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.BG }]}
      edges={["top"]}
    >
      <ActivityIndicator size="large" color={theme.PRIMARY} />
      <Text style={[styles.text, { color: theme.TEXT }]}>
        {t("app_start_loading")}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
  },
});
