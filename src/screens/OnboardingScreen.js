// src/screens/OnboardingScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen({ navigation }) {
  const handleContinue = () => {
    navigation.navigate("AddChild");
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Верхній логотип */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Parents+</Text>
      </View>

      {/* Блок з картинкою */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.blurOuter} />
        <View style={styles.imageCard}>
          {/* Постав свій локальний ресурс */}
          <Image
            source={require("../../assets/12.png")}
            style={styles.babyImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Текст під картинкою */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          Every step{"\n"}
          <Text style={styles.titleAccent}>together.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Simple monthly tips and tasks for{"\n"}
          your baby up to 3 years.
        </Text>
      </View>

      {/* Кнопка + індикатор сторінок */}
      <View style={styles.bottomBlock}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.dotsRow}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Легкі розмиті “плями” на фоні */}
      <View style={styles.blurSmall} />
      <View style={styles.blurBig} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FCFAFA",
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#EE2B5B",
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
    backgroundColor: "rgba(238, 43, 91, 0.05)",
  },
  imageCard: {
    width: 326,
    height: 326,
    borderRadius: 48,
    backgroundColor: "#FDF2F4",
    borderWidth: 1,
    borderColor: "rgba(238, 43, 91, 0.1)",
    shadowColor: "#EE2B5B",
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
    color: "#0F172A",
  },
  titleAccent: {
    color: "#EE2B5B",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
  },

  bottomBlock: {
    marginTop: 40,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#EE2B5B",
    height: 56,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EE2B5B",
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
});

