// src/screens/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useCurrentChild } from "../hooks/useCurrentChild";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import i18n from "../i18n";

const PRIMARY = "#EE2B5B";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const userId = auth.currentUser?.uid;

  const {
    child,
    children = [],
    ageLabel,
    currentChildId,
    setCurrentChildId,
    deleteChild,
    loading,
  } = useCurrentChild(userId);

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");
  const [languageOpen, setLanguageOpen] = React.useState(false);

  const currentLanguage = LANGUAGE_OPTIONS.find(
    (l) => l.code === selectedLanguage
  );

  // Load language from Firestore
  React.useEffect(() => {
    const loadLanguage = async () => {
      try {
        if (!userId) return;
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.language) {
            setSelectedLanguage(data.language);
          }
        }
      } catch (e) {
        console.log("Error loading user language", e);
      }
    };

    loadLanguage();
  }, [userId]);

  const handleLanguagePress = (code) => {
    if (code === selectedLanguage) {
      setLanguageOpen(false);
      return;
    }

    Alert.alert(
      t("language_change_title"),
      t("language_change_message"),
      [
        { text: t("common_cancel"), style: "cancel" },
        {
          text: t("language_change_confirm"),
          style: "destructive",
          onPress: () => confirmLanguageChange(code),
        },
      ]
    );
  };

  const confirmLanguageChange = async (code) => {
    setSelectedLanguage(code);
    setLanguageOpen(false);

    try {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { language: code }, { merge: true });

      i18n.changeLanguage(code);
    } catch (e) {
      console.log("Error saving language", e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log("Logout error", e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={["top"]}>
        <Text>{t("common_loading")}</Text>
      </SafeAreaView>
    );
  }

  const handleAddChild = () => {
    navigation.navigate("AddChild");
  };

  const handleEditChild = () => {
    if (!child) return;
    navigation.navigate("AddChild", {
      mode: "edit",
      childId: currentChildId,
      child,
    });
  };

  const handleDeleteChild = (childToDelete) => {
    Alert.alert(
      t("delete_child_title"),
      t("delete_child_message", {
        name: childToDelete.name || t("delete_child_fallback_name"),
      }),
      [
        { text: t("common_cancel"), style: "cancel" },
        {
          text: t("delete_child_confirm"),
          style: "destructive",
          onPress: () => deleteChild(childToDelete.id),
        },
      ]
    );
  };

  const handlePremiumPress = () => {
    Alert.alert(
      t("premium_title"),
      t("premium_message")
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("profile_title")}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Current child card */}
        {child && (
          <View style={styles.childCard}>
            <View style={styles.childAvatar}>
              <Text style={styles.childAvatarText}>
                {child.name ? child.name[0].toUpperCase() : "B"}
              </Text>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childSubtitle}>
                {ageLabel
                  ? t("current_child_age", { age: ageLabel })
                  : t("current_child_age_not_set")}
              </Text>

              <TouchableOpacity
                style={styles.addAnotherButton}
                onPress={handleAddChild}
              >
                <Text style={styles.addAnotherText}>
                  {t("add_another_child")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.childEditIcon}
              onPress={handleEditChild}
            >
              <Text style={styles.childEditIconText}>✎</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Children list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("children_section_title")}</Text>

          {children.map((c) => {
            const isActive = c.id === currentChildId;
            return (
              <View
                key={c.id}
                style={[
                  styles.childRow,
                  isActive && styles.childRowActive,
                ]}
              >
                <TouchableOpacity
                  style={styles.childRowMain}
                  onPress={() => setCurrentChildId(c.id)}
                >
                  <View style={styles.childRowAvatar}>
                    <Text style={styles.childRowAvatarText}>
                      {c.name ? c.name[0].toUpperCase() : "B"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.childRowName}>{c.name}</Text>
                    <Text style={styles.childRowSubtitle}>
                      {c.birthDate || t("birthdate_not_set")}
                    </Text>
                  </View>
                  {isActive && <Text style={styles.activeDot}>●</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteChild(c)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>{t("delete_child_button")}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Settings / My Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("settings_section_title")}</Text>

          {/* Notifications */}
          <View style={styles.settingsRow}>
            <View>
              <Text style={styles.settingsTitle}>
                {t("settings_notifications_title")}
              </Text>
              <Text style={styles.settingsSubtitle}>
                {t("settings_notifications_subtitle")}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#E2E8F0", true: "rgba(238,43,91,0.4)" }}
              thumbColor={notificationsEnabled ? PRIMARY : "#FFFFFF"}
            />
          </View>

          {/* App Theme */}
          <TouchableOpacity style={styles.settingsRow}>
            <View>
              <Text style={styles.settingsTitle}>
                {t("settings_theme_title")}
              </Text>
              <Text style={styles.settingsSubtitle}>
                {t("settings_theme_value")}
              </Text>
            </View>
            <Text style={styles.chevron}>{">"}</Text>
          </TouchableOpacity>

          {/* Language */}
          <View>
            <TouchableOpacity
              style={styles.settingsRow}
              onPress={() => setLanguageOpen((prev) => !prev)}
            >
              <View>
                <Text style={styles.settingsTitle}>
                  {t("settings_language_title")}
                </Text>
                <Text style={styles.settingsSubtitle}>
                  {currentLanguage
                    ? `${currentLanguage.flag} ${currentLanguage.label}`
                    : t("settings_language_placeholder")}
                </Text>
              </View>
              <Text style={styles.chevron}>
                {languageOpen ? "˄" : "˅"}
              </Text>
            </TouchableOpacity>

            {languageOpen && (
              <View style={styles.languageDropdown}>
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isActive = lang.code === selectedLanguage;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        isActive && styles.languageOptionActive,
                      ]}
                      onPress={() => handleLanguagePress(lang.code)}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text
                        style={[
                          styles.languageLabel,
                          isActive && styles.languageLabelActive,
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Help & Support */}
          <TouchableOpacity style={styles.settingsRow}>
            <View>
              <Text style={styles.settingsTitle}>
                {t("settings_help_title")}
              </Text>
            </View>
            <Text style={styles.chevron}>{">"}</Text>
          </TouchableOpacity>

          {/* Premium+ */}
          <TouchableOpacity
            style={styles.settingsRow}
            onPress={handlePremiumPress}
          >
            <View>
              <Text style={[styles.settingsTitle, { color: PRIMARY }]}>
                {t("settings_premium_title")}
              </Text>
              <Text style={styles.settingsSubtitle}>
                {t("settings_premium_subtitle")}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: PRIMARY }]}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* Log out */}
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t("logout_button")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F6F6",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  content: {
    paddingHorizontal: 16,
  },

  // top card
  childCard: {
    marginTop: 8,
    marginBottom: 20,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFE4EC",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  childAvatar: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  childAvatarText: {
    fontSize: 26,
    fontWeight: "800",
    color: PRIMARY,
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  childSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },
  addAnotherButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  addAnotherText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  childEditIcon: {
    position: "absolute",
    right: 18,
    top: 18,
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  childEditIconText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "700",
  },

  // sections
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 12,
    letterSpacing: 1,
  },

  // children list
  childRow: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 8,
  },
  childRowActive: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
  },
  childRowMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  childRowAvatar: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  childRowAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },
  childRowName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  childRowSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  activeDot: {
    fontSize: 14,
    color: PRIMARY,
    marginLeft: 8,
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  deleteText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  // settings rows
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  settingsSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: "#CBD5F5",
  },

  languageDropdown: {
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  languageOptionActive: {
    backgroundColor: "#EFF6FF",
  },
  languageFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  languageLabel: {
    fontSize: 14,
    color: "#0F172A",
  },
  languageLabelActive: {
    fontWeight: "700",
    color: PRIMARY,
  },

  // logout
  logoutRow: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
