// src/screens/AppStartScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function AppStartScreen({ navigation }) {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkChild() {
      try {
        const db = getFirestore();
        const childrenRef = collection(db, "children");
        const snap = await getDocs(childrenRef); // поки без userId

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{t("app_start_loading")}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { marginTop: 12 },
});
