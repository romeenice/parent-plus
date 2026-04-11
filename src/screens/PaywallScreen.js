import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { auth, db } from "../services/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  getCurrentOffering,
  purchaseRevenueCatPackage,
  restoreUserPurchases,
} from "../services/revenueCat";

export default function PaywallScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [continuing, setContinuing] = useState(false);

  const fromOnboarding = !!route?.params?.fromOnboarding;

  useEffect(() => {
    loadOffering();
  }, []);

  const loadOffering = async () => {
    try {
      setLoading(true);
      const currentOffering = await getCurrentOffering();
      setOffering(currentOffering);
    } catch (error) {
      console.error("Paywall load offering error:", error);
    } finally {
      setLoading(false);
    }
  };

  const finishOnboardingFlow = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, "users", user.uid),
          { hasSeenOnboarding: true },
          { merge: true }
        );
      }
    } catch (e) {
      console.log("Error finishing onboarding flow", e);
    }
  };

  const navigateAfterPaywall = async () => {
    if (fromOnboarding) {
      await finishOnboardingFlow();
      navigation.replace("MainTabs");
      return;
    }

    navigation.goBack();
  };

  const handlePurchaseSuccess = async () => {
  await finishOnboardingFlow();
};

const handleRestoreSuccess = async () => {
  await finishOnboardingFlow();
};

const handleContinueFree = async () => {
  try {
    setContinuing(true);
    await finishOnboardingFlow();
  } catch (e) {
    console.log("handleContinueFree error", e);
  } finally {
    setContinuing(false);
  }
};

  const packages = offering?.availablePackages || [];

  const getPackageLabel = (pkg) => {
    const id = (pkg?.identifier || "").toLowerCase();
    const title = (pkg?.product?.title || "").toLowerCase();

    if (id.includes("month") || title.includes("month")) {
      return t("paywall_monthly");
    }

    if (id.includes("year") || title.includes("year")) {
      return t("paywall_yearly");
    }

    if (id.includes("life") || title.includes("lifetime")) {
      return t("paywall_lifetime");
    }

    return pkg?.product?.title || t("paywall_plan");
  };

  const getPackageBadge = (pkg) => {
    const id = (pkg?.identifier || "").toLowerCase();
    const title = (pkg?.product?.title || "").toLowerCase();

    if (id.includes("year") || title.includes("year")) {
      return t("paywall_best_value");
    }

    if (id.includes("month") || title.includes("month")) {
      return t("paywall_most_flexible");
    }

    if (id.includes("life") || title.includes("lifetime")) {
      return t("paywall_one_time");
    }

    return null;
  };

  const handlePurchase = async (pkg) => {
    try {
      setPurchasingId(pkg.identifier);

      const result = await purchaseRevenueCatPackage(pkg);

      if (result?.cancelled) {
        return;
      }

      if (result?.success && result?.isActive) {
        Alert.alert(
          t("paywall_success_title"),
          t("paywall_success_message")
        );
        await handlePurchaseSuccess();
        return;
      }

      Alert.alert(
        t("paywall_inactive_title"),
        t("paywall_inactive_message")
      );
    } catch (error) {
      console.error("handlePurchase error:", error);
      Alert.alert(t("paywall_error_title"), t("paywall_purchase_error"));
    } finally {
      setPurchasingId(null);
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      const result = await restoreUserPurchases();

      if (result?.success && result?.isActive) {
        Alert.alert(
          t("paywall_restore_success_title"),
          t("paywall_restore_success_message")
        );
        await handleRestoreSuccess();
        return;
      }

      Alert.alert(
        t("paywall_restore_empty_title"),
        t("paywall_restore_empty_message")
      );
    } catch (error) {
      console.error("handleRestore error:", error);
      Alert.alert(t("paywall_error_title"), t("paywall_restore_error"));
    } finally {
      setRestoring(false);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.BG }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.heroCard,
          { backgroundColor: theme.CARD_BG, borderColor: theme.BORDER },
        ]}
      >
        <View
          style={[
            styles.trialBadge,
            { backgroundColor: `${theme.PRIMARY}18` },
          ]}
        >
          <Text style={[styles.trialBadgeText, { color: theme.PRIMARY }]}>
            {t("paywall_trial_badge")}
          </Text>
        </View>

        <Text style={[styles.title, { color: theme.TEXT }]}>
          {t("paywall_title")}
        </Text>

        <Text style={[styles.subtitle, { color: theme.SECONDARY }]}>
          {t("paywall_subtitle")}
        </Text>

        <View style={styles.heroMiniRow}>
          <View
            style={[
              styles.heroMiniPill,
              { backgroundColor: theme.SECTION_BG, borderColor: theme.BORDER },
            ]}
          >
            <Text style={[styles.heroMiniPillText, { color: theme.TEXT }]}>
              {t("paywall_trial_badge")}
            </Text>
          </View>

          <View
            style={[
              styles.heroMiniPill,
              { backgroundColor: theme.SECTION_BG, borderColor: theme.BORDER },
            ]}
          >
            <Text style={[styles.heroMiniPillText, { color: theme.TEXT }]}>
              {t("paywall_cancel_anytime")}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.featuresBox,
          { backgroundColor: theme.SECTION_BG, borderColor: theme.BORDER },
        ]}
      >
        <Text style={[styles.feature, { color: theme.TEXT }]}>
          • {t("paywall_feature_1")}
        </Text>
        <Text style={[styles.feature, { color: theme.TEXT }]}>
          • {t("paywall_feature_2")}
        </Text>
        <Text style={[styles.feature, { color: theme.TEXT }]}>
          • {t("paywall_feature_3")}
        </Text>
        <Text style={[styles.feature, { color: theme.TEXT }]}>
          • {t("paywall_feature_4")}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={theme.PRIMARY} />
          <Text style={[styles.loadingText, { color: theme.SECONDARY }]}>
            {t("paywall_loading")}
          </Text>
        </View>
      ) : packages.length === 0 ? (
        <View style={styles.loaderWrap}>
          <Text style={[styles.emptyTitle, { color: theme.TEXT }]}>
            {t("paywall_no_plans_title")}
          </Text>

          <Text style={[styles.emptyText, { color: theme.SECONDARY }]}>
            {t("paywall_no_plans_message")}
          </Text>

          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.PRIMARY }]}
            onPress={loadOffering}
          >
            <Text style={styles.retryButtonText}>{t("paywall_retry")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.packagesWrap}>
          {packages.map((pkg) => {
            const product = pkg.product;
            const isBusy = purchasingId === pkg.identifier;
            const badge = getPackageBadge(pkg);

            return (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageCard,
                  {
                    backgroundColor: theme.CARD_BG,
                    borderColor: theme.BORDER,
                  },
                ]}
                onPress={() => handlePurchase(pkg)}
                disabled={isBusy}
                activeOpacity={0.9}
              >
                {!!badge && (
                  <View
                    style={[
                      styles.packageBadge,
                      { backgroundColor: `${theme.PRIMARY}16` },
                    ]}
                  >
                    <Text
                      style={[styles.packageBadgeText, { color: theme.PRIMARY }]}
                    >
                      {badge}
                    </Text>
                  </View>
                )}

                <Text style={[styles.packageTitle, { color: theme.TEXT }]}>
                  {getPackageLabel(pkg)}
                </Text>

                {!!product?.description && (
                  <Text
                    style={[
                      styles.packageDescription,
                      { color: theme.SECONDARY },
                    ]}
                  >
                    {product.description}
                  </Text>
                )}

                <Text style={[styles.packagePrice, { color: theme.PRIMARY }]}>
                  {product.priceString}
                </Text>

                <Text style={[styles.packageTrialText, { color: theme.TEXT }]}>
                  {t("paywall_trial_badge")} • {t("paywall_cancel_anytime")}
                </Text>

                <View
                  style={[
                    styles.buyButton,
                    { backgroundColor: theme.PRIMARY },
                  ]}
                >
                  {isBusy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buyButtonText}>
                      {t("paywall_plan_button")}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Text style={[styles.footerNote, { color: theme.SECONDARY }]}>
        {t("paywall_footer_note")}
      </Text>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestore}
        disabled={restoring}
      >
        <Text style={[styles.restoreButtonText, { color: theme.PRIMARY }]}>
          {restoring ? t("paywall_restoring") : t("paywall_restore")}
        </Text>
      </TouchableOpacity>

      {fromOnboarding && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueFree}
          disabled={continuing}
        >
          <Text style={[styles.continueButtonText, { color: theme.SECONDARY }]}>
            {continuing
              ? t("common_loading")
              : t("paywall_continue_without_subscription")}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      padding: 20,
      paddingTop: 28,
      paddingBottom: 40,
    },
    heroCard: {
      borderWidth: 1,
      borderRadius: 24,
      padding: 20,
      marginBottom: 16,
      alignItems: "center",
    },
    trialBadge: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      marginBottom: 14,
    },
    trialBadgeText: {
      fontSize: 13,
      fontWeight: "800",
    },
    title: {
      fontSize: 30,
      fontWeight: "800",
      marginBottom: 10,
      textAlign: "center",
      lineHeight: 36,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 14,
    },
    heroMiniRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 10,
    },
    heroMiniPill: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    heroMiniPillText: {
      fontSize: 13,
      fontWeight: "700",
    },
    featuresBox: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
      marginBottom: 18,
    },
    feature: {
      fontSize: 15,
      marginBottom: 10,
      lineHeight: 21,
    },
    loaderWrap: {
      paddingVertical: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 15,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
    },
    retryButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "700",
    },
    packagesWrap: {
      gap: 14,
      marginBottom: 18,
    },
    packageCard: {
      borderWidth: 1,
      borderRadius: 20,
      padding: 18,
    },
    packageBadge: {
      alignSelf: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 10,
    },
    packageBadgeText: {
      fontSize: 12,
      fontWeight: "800",
    },
    packageTitle: {
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 6,
      textAlign: "center",
    },
    packageDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 10,
      textAlign: "center",
    },
    packagePrice: {
      fontSize: 24,
      fontWeight: "800",
      marginBottom: 10,
      textAlign: "center",
    },
    packageTrialText: {
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
      marginBottom: 14,
      fontWeight: "600",
    },
    buyButton: {
      minHeight: 50,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
    },
    buyButtonText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "800",
    },
    footerNote: {
      fontSize: 13,
      lineHeight: 19,
      textAlign: "center",
      marginTop: 4,
      marginBottom: 10,
      paddingHorizontal: 6,
    },
    restoreButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      marginTop: 2,
    },
    restoreButtonText: {
      fontSize: 15,
      fontWeight: "700",
    },
    continueButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
    },
    continueButtonText: {
      fontSize: 14,
      fontWeight: "600",
      textDecorationLine: "underline",
    },
  });