// src/screens/OnboardingScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    titleKey: "onboarding_slide1_title",
    descriptionKey: "onboarding_slide1_description",
    emoji: "📚",
    gradient: ["#FFE5E5", "#FFF0F0"],
  },
  {
    id: "2",
    titleKey: "onboarding_slide2_title",
    descriptionKey: "onboarding_slide2_description",
    emoji: "✅",
    gradient: ["#E5F4FF", "#F0F8FF"],
  },
  {
    id: "3",
    titleKey: "onboarding_slide3_title",
    descriptionKey: "onboarding_slide3_description",
    emoji: "🎯",
    gradient: ["#F0E5FF", "#F8F0FF"],
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
      {/* Hero Section with Emoji/Image */}
      <View
        style={[
          styles.heroSection,
          {
            backgroundColor:
              index === 0
                ? `${theme.PRIMARY}10`
                : index === 1
                ? `${theme.PRIMARY}08`
                : `${theme.PRIMARY}12`,
          },
        ]}
      >
       <Image
  source={
    index === 0 
      ? require("../../assets/onboarding/home-screen.webp")
      : index === 1
      ? require("../../assets/onboarding/tasks-screen.webp")
      : require("../../assets/onboarding/profile-screen.webp")
  }
  style={styles.heroImage}
  resizeMode="contain"
/>

      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={[styles.title, { color: theme.TEXT }]}>
          {t(item.titleKey)}
        </Text>

        <Text style={[styles.description, { color: theme.SECONDARY }]}>
          {t(item.descriptionKey)}
        </Text>

        {/* Feature List */}
        {index === 0 && (
          <View style={styles.featureList}>
            <FeatureItem
              icon="📖"
              text={t("onboarding_feature1_articles")}
              theme={theme}
            />
            <FeatureItem
              icon="🧠"
              text={t("onboarding_feature1_categories")}
              theme={theme}
            />
            <FeatureItem
              icon="🌍"
              text={t("onboarding_feature1_languages")}
              theme={theme}
            />
          </View>
        )}

        {index === 1 && (
          <View style={styles.featureList}>
            <FeatureItem
              icon="⏰"
              text={t("onboarding_feature2_reminders")}
              theme={theme}
            />
            <FeatureItem
              icon="🏥"
              text={t("onboarding_feature2_checkups")}
              theme={theme}
            />
            <FeatureItem
              icon="📅"
              text={t("onboarding_feature2_milestones")}
              theme={theme}
            />
          </View>
        )}

        {index === 2 && (
          <View style={styles.featureList}>
            <FeatureItem
              icon="📊"
              text={t("onboarding_feature3_tracking")}
              theme={theme}
            />
            <FeatureItem
              icon="🎨"
              text={t("onboarding_feature3_personalized")}
              theme={theme}
            />
            <FeatureItem
              icon="🔒"
              text={t("onboarding_feature3_private")}
              theme={theme}
            />
          </View>
        )}
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
            {t("onboarding_skip") || "Skip"}
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
                  width: index === currentIndex ? 24 : 8,
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
              ? t("onboarding_loading") || "Loading..."
              : currentIndex === SLIDES.length - 1
              ? t("onboarding_get_started") || "Get Started"
              : t("onboarding_next") || "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Helper component for feature items
function FeatureItem({ icon, text, theme }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={[styles.featureText, { color: theme.TEXT }]}>{text}</Text>
    </View>
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
    paddingBottom: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  slide: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    height: height * 0.4,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
     overflow: "hidden",
  },

   heroImage: {
    width: width * 0.45,
  height: height * 0.55,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.2,
  shadowRadius: 15,
  elevation: 10,
  },
  emoji: {
    fontSize: 120,
  },
  contentSection: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    lineHeight: 38,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 24,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
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
