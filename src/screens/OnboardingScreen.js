// src/screens/OnboardingScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useTheme } from "../theme/ThemeContext";

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleContinue = () => {
    navigation.navigate("AddChild");
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.logoText, { color: theme.PRIMARY }]}>
          Parents+
        </Text>
      </View>

      <View style={styles.illustrationWrapper}>
        <View style={[styles.blurOuter, { backgroundColor: `${theme.PRIMARY}05` }]} />
        <View style={[
          styles.imageCard,
          {
            backgroundColor: `${theme.PRIMARY}10`,
            borderColor: `${theme.PRIMARY}10`,
            shadowColor: theme.PRIMARY,
          }
        ]}>
          <Image
            source={require("../../assets/12.png")}
            style={styles.babyImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: theme.TEXT }]}>
          {t("onboarding_title_line1")}
          {"\n"}
          <Text style={[styles.titleAccent, { color: theme.PRIMARY }]}>
            {t("onboarding_title_accent")}
          </Text>
        </Text>

        <Text style={[styles.subtitle, { color: theme.SECONDARY }]}>
          {t("onboarding_subtitle")}
        </Text>
      </View>

      <View style={styles.bottomBlock}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.PRIMARY,
              shadowColor: theme.PRIMARY,
            },
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            {t("onboarding_continue_button")}
          </Text>
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          <View style={[styles.dotActive, { backgroundColor: theme.PRIMARY }]} />
          <View style={[styles.dot, { backgroundColor: theme.BORDER }]} />
          <View style={[styles.dot, { backgroundColor: theme.BORDER }]} />
        </View>
      </View>

      <View style={[styles.blurSmall, { backgroundColor: `${theme.PRIMARY}06` }]} />
      <View style={[styles.blurBig, { backgroundColor: `${theme.PRIMARY}08` }]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
  },
  illustrationWrapper: {
    alignItems: "center",
    marginTop: 16,
  },
  blurOuter: {
    position: "absolute",
    width: 326,
    height: 326,
    borderRadius: 9999,
  },
  imageCard: {
    width: 326,
    height: 326,
    borderRadius: 48,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
  babyImage: {
    width: "100%",
    height: "100%",
  },
  textBlock: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
  },
  titleAccent: {
    // колір застосовується в JSX
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomBlock: {
    marginTop: 40,
    paddingHorizontal: 8,
  },
  button: {
    height: 56,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.45,
  },
  dotsRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dotActive: {
    width: 16,
    height: 8,
    borderRadius: 9999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  blurSmall: {
    position: "absolute",
    top: 120,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 9999,
  },
  blurBig: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 9999,
  },
});
