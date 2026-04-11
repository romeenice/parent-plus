// src/screens/OnboardingScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    titleKey: "onboarding_slide1_title",
    descriptionKey: "onboarding_slide1_description",
    features: [
      { textKey: "onboarding_slide1_feature1" },
      { textKey: "onboarding_slide1_feature2" },
      { textKey: "onboarding_slide1_feature3" },
    ],
  },
  {
    id: "2",
    titleKey: "onboarding_slide2_title",
    descriptionKey: "onboarding_slide2_description",
    features: [
      { textKey: "onboarding_slide2_feature1" },
      { textKey: "onboarding_slide2_feature2" },
      { textKey: "onboarding_slide2_feature3" },
    ],
  },
  {
    id: "3",
    titleKey: "onboarding_slide3_title",
    descriptionKey: "onboarding_slide3_description",
    features: [
      { textKey: "onboarding_slide3_feature1" },
      { textKey: "onboarding_slide3_feature2" },
      { textKey: "onboarding_slide3_feature3" },
    ],
  },
  {
    id: "4",
    titleKey: "onboarding_slide4_title",
    descriptionKey: "onboarding_slide4_description",
    features: [
      { textKey: "onboarding_slide4_feature1" },
      { textKey: "onboarding_slide4_feature2" },
      { textKey: "onboarding_slide4_feature3" },
    ],
  },
  {
    id: "5",
    titleKey: "onboarding_slide5_title",
    descriptionKey: "onboarding_slide5_description",
    features: [
      { textKey: "onboarding_slide5_feature1" },
      { textKey: "onboarding_slide5_feature2" },
      { textKey: "onboarding_slide5_feature3" },
    ],
  },
  {
    id: "6",
    titleKey: "onboarding_slide6_title",
    descriptionKey: "onboarding_slide6_description",
    features: [
      { textKey: "onboarding_slide6_feature1" },
      { textKey: "onboarding_slide6_feature2" },
      { textKey: "onboarding_slide6_feature3" },
      { textKey: "onboarding_slide6_feature4" },
    ],
  },
];

export default function OnboardingScreen({ navigation }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace("Paywall");
    }
  };

  const handleSkip = () => {
    navigation.replace("Paywall");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item, index }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.contentSection}>
        <View style={[styles.badge, { backgroundColor: `${theme.PRIMARY}18` }]}>
          <Text style={[styles.badgeText, { color: theme.PRIMARY }]}>
            {index + 1} / 6
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.TEXT }]}>
          {t(item.titleKey)}
        </Text>

        <Text style={[styles.description, { color: theme.SECONDARY }]}>
          {t(item.descriptionKey)}
        </Text>

        <View style={styles.featureList}>
          {item.features.map((feature, idx) => (
            <View
              key={idx}
              style={[
                styles.featureItem,
                {
                  backgroundColor: theme.CARD_BG,
                  borderColor: theme.BORDER,
                },
              ]}
            >
              <View
                style={[styles.featureDot, { backgroundColor: theme.PRIMARY }]}
              />
              <Text style={[styles.featureText, { color: theme.TEXT }]}>
                {t(feature.textKey)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.BG }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.SECONDARY }]}>
            {t("onboarding_skip")}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? theme.PRIMARY : theme.BORDER,
                  width: index === currentIndex ? 28 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.PRIMARY }]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1
              ? t("onboarding_continue_to_paywall")
              : t("onboarding_next")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  contentSection: {
    flex: 1,
    justifyContent: "center",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 28,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 23,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});