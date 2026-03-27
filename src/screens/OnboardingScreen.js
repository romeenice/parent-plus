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
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    titleKey: "onboarding_slide1_title",
    descriptionKey: "onboarding_slide1_description",
    features: [
      { iconKey: "onboarding_feature1_articles" },
      { iconKey: "onboarding_feature1_categories" },
      { iconKey: "onboarding_feature1_languages" },
    ],
  },
  {
    id: "2",
    titleKey: "onboarding_slide2_title",
    descriptionKey: "onboarding_slide2_description",
    features: [
      { iconKey: "onboarding_feature2_reminders" },
      { iconKey: "onboarding_feature2_checkups" },
      { iconKey: "onboarding_feature2_milestones" },
    ],
  },
  {
    id: "3",
    titleKey: "onboarding_slide3_title",
    descriptionKey: "onboarding_slide3_description",
    features: [
      { iconKey: "onboarding_feature3_languages" },
      { iconKey: "onboarding_feature3_themes" },
      { iconKey: "onboarding_feature3_multiple_children" },
      { iconKey: "onboarding_feature3_notifications" },
      { iconKey: "onboarding_feature3_support" },
    ],
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const flatListRef = useRef(null);

  const handleFinishOnboarding = async () => {
    try {
      setFinishing(true);
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          { hasSeenOnboarding: true },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error finishing onboarding:", error);
      setFinishing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinishOnboarding();
    }
  };

  const handleSkip = () => {
    handleFinishOnboarding();
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
        {/* Number Badge */}
        <View style={[styles.badge, { backgroundColor: `${theme.PRIMARY}20` }]}>
          <Text style={[styles.badgeText, { color: theme.PRIMARY }]}>
            {index + 1} / 3
          </Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.TEXT }]}>
          {t(item.titleKey)}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.SECONDARY }]}>
          {t(item.descriptionKey)}
        </Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          {item.features.map((feature, idx) => (
            <View
              key={idx}
              style={[styles.featureItem, { backgroundColor: theme.CARD_BG }]}
            >
              <View style={[styles.featureDot, { backgroundColor: theme.PRIMARY }]} />
              <Text style={[styles.featureText, { color: theme.TEXT }]}>
                {t(feature.iconKey)}
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
      {/* Header with Skip */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} disabled={finishing}>
          <Text style={[styles.skipText, { color: theme.SECONDARY }]}>
            {t("onboarding_skip")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
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
        scrollEnabled={!finishing}
      />

      {/* Footer with Pagination and Button */}
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
                  width: index === currentIndex ? 32 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.PRIMARY }]}
          onPress={handleNext}
          disabled={finishing}
        >
          <Text style={styles.buttonText}>
            {finishing
              ? t("common_loading")
              : currentIndex === SLIDES.length - 1
              ? t("onboarding_get_started")
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
    paddingBottom: 16,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 16,
    lineHeight: 42,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
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
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});