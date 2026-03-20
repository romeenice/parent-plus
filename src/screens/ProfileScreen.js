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
import { useTheme } from "../theme/ThemeContext";
import { THEMES } from "../theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useCurrentChild } from "../hooks/useCurrentChild";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebaseConfig";
import i18n from "../i18n";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme, themeKey, changeTheme } = useTheme();
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
  const [themeOpen, setThemeOpen] = React.useState(false);

  const currentLanguage = LANGUAGE_OPTIONS.find(
    (l) => l.code === selectedLanguage
  );

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
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]}>
        <Text style={{ color: theme.TEXT }}>{t("common_loading")}</Text>
      </SafeAreaView>
    );
  }

  const handleAddChild = () => {
    navigation.navigate("AddChild");
  };

  const handleEditChild = (childToEdit) => {
    if (!childToEdit) return;
    navigation.navigate("AddChild", {
      mode: "edit",
      childId: childToEdit.id,
      child: childToEdit,
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
    Alert.alert(t("premium_title"), t("premium_message"));
  };

  const renderChildCard = (c) => {
    const isActive = c.id === currentChildId;

    return (
      <TouchableOpacity
        key={c.id}
        activeOpacity={0.9}
        onPress={async () => {
          await setCurrentChildId(c.id);
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }}
        style={[
          styles.childCard,
          isActive && styles.childCardActive,
          {
            backgroundColor: theme.CHILD_CARD_BG,
            borderColor: theme.PRIMARY,
          },
        ]}
      >
        <View style={[styles.childAvatar, { backgroundColor: theme.CARD_BG }]}>
          <Text style={[styles.childAvatarText, { color: theme.PRIMARY }]}>
            {c.name ? c.name[0].toUpperCase() : "B"}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.childName, { color: theme.TEXT }]}>
            {c.name}
          </Text>
          <Text style={[styles.childSubtitle, { color: theme.SECONDARY }]}>
            {c.id === currentChildId && ageLabel
              ? t("current_child_age", { age: ageLabel })
              : c.birthDate || t("birthdate_not_set")}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.childEditIcon, { backgroundColor: theme.CARD_BG }]}
          onPress={() => handleEditChild(c)}
        >
          <Text style={[styles.childEditIconText, { color: theme.PRIMARY }]}>
            ✎
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.childDeleteIcon, { backgroundColor: theme.CARD_BG }]}
          onPress={() => handleDeleteChild(c)}
        >
          <Text style={styles.childDeleteIconText}>🗑</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.BG }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.TEXT }]}>
          {t("profile_title")}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <TouchableOpacity
          style={[styles.addAnotherButtonTop, { backgroundColor: theme.PRIMARY,shadowColor: theme.PRIMARY, }]}
          onPress={handleAddChild}
        >
          <Text style={styles.addAnotherButtonTopText}>
            {t("add_another_child")}
          </Text>
        </TouchableOpacity>

        {children && children.length > 0 && (
          <View style={styles.childrenCardsWrapper}>
            {children.map(renderChildCard)}
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.SECTION_BG }]}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.SECONDARY },
            ]}
          >
            {t("settings_section_title")}
          </Text>

          <View style={[styles.settingsRow, { borderTopColor: theme.BORDER }]}>
            <View>
              <Text style={[styles.settingsTitle, { color: theme.TEXT }]}>
                {t("settings_notifications_title")}
              </Text>
              <Text style={[styles.settingsSubtitle, { color: theme.SECONDARY }]}>
                {t("settings_notifications_subtitle")}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.BORDER,
                true: `${theme.PRIMARY}40`,
              }}
              thumbColor={notificationsEnabled ? theme.PRIMARY : "#FFFFFF"}
            />
          </View>

          {/* App Theme */}
<View>
  <TouchableOpacity
    style={[styles.settingsRow, { borderTopColor: theme.BORDER }]}
    onPress={() => setThemeOpen((prev) => !prev)}
  >
    <View>
      <Text style={[styles.settingsTitle, { color: theme.TEXT }]}>
        {t("settings_theme_title")}
      </Text>
      <Text style={[styles.settingsSubtitle, { color: theme.SECONDARY }]}>
        {t(THEMES[themeKey]?.name || "theme_pastel_pink")}
      </Text>
    </View>
    <Text style={[styles.chevron, { color: theme.SECONDARY }]}>
      {themeOpen  ? "˄" : "˅"}
    </Text>
  </TouchableOpacity>

  {themeOpen  && (
    <View
      style={[
        styles.themeDropdown,
        {
          backgroundColor: theme.SECTION_BG,
          borderColor: theme.BORDER,
        },
      ]}
    >
      {Object.entries(THEMES).map(([key, themeObj]) => {
        const isActive = themeKey === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.themeDropdownItem,
              isActive && {
                backgroundColor: `${theme.PRIMARY}20`,
              },
            ]}
            onPress={() => {
              changeTheme(key);
              setThemeOpen(false);
            }}
          >
            <View
              style={[
                styles.themeDropdownPreview,
                { backgroundColor: themeObj.PRIMARY },
              ]}
            />
            <Text
              style={[
                styles.themeDropdownLabel,
                { color: theme.TEXT },
                isActive && {
                  fontWeight: "700",
                  color: theme.PRIMARY,
                },
              ]}
            >
               {t(themeObj.name)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )}
</View>

          {/* Language */}
          <View>
            <TouchableOpacity
              style={[styles.settingsRow, { borderTopColor: theme.BORDER }]}
              onPress={() => setLanguageOpen((prev) => !prev)}
            >
              <View>
                <Text style={[styles.settingsTitle, { color: theme.TEXT }]}>
                  {t("settings_language_title")}
                </Text>
                <Text style={[styles.settingsSubtitle, { color: theme.SECONDARY }]}>
                  {currentLanguage
                    ? `${currentLanguage.flag} ${currentLanguage.label}`
                    : t("settings_language_placeholder")}
                </Text>
              </View>
              <Text style={[styles.chevron, { color: theme.SECONDARY }]}>
                {languageOpen ? "˄" : "˅"}
              </Text>
            </TouchableOpacity>

            {languageOpen && (
              <View
                style={[
                  styles.languageDropdown,
                  {
                    backgroundColor: theme.SECTION_BG,
                    borderColor: theme.BORDER,
                  },
                ]}
              >
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isActive = lang.code === selectedLanguage;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        isActive && {
                          backgroundColor: `${theme.PRIMARY}20`,
                        },
                      ]}
                      onPress={() => handleLanguagePress(lang.code)}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text
                        style={[
                          styles.languageLabel,
                          { color: theme.TEXT },
                          isActive && {
                            fontWeight: "700",
                            color: theme.PRIMARY,
                          },
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

          <TouchableOpacity
            style={[styles.settingsRow, { borderTopColor: theme.BORDER }]}
          >
            <View>
              <Text style={[styles.settingsTitle, { color: theme.TEXT }]}>
                {t("settings_help_title")}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.SECONDARY }]}>
              {">"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsRow, { borderTopColor: theme.BORDER }]}
            onPress={handlePremiumPress}
          >
            <View>
              <Text style={[styles.settingsTitle, { color: theme.PRIMARY }]}>
                {t("settings_premium_title")}
              </Text>
              <Text style={[styles.settingsSubtitle, { color: theme.SECONDARY }]}>
                {t("settings_premium_subtitle")}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: theme.PRIMARY }]}>
              {">"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Text style={[styles.logoutText, { color: theme.SECONDARY }]}>
            {t("logout_button")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  },
  content: {
    paddingHorizontal: 16,
  },
  addAnotherButtonTop: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 10,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  addAnotherButtonTopText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  childrenCardsWrapper: {
    marginBottom: 20,
    gap: 12,
  },

  childCard: {
    padding: 16,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  childCardActive: {
    borderWidth: 1,
  },
  childAvatar: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  childAvatarText: {
    fontSize: 26,
    fontWeight: "800",
  },
  childName: {
    fontSize: 18,
    fontWeight: "700",
  },
  childSubtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  childEditIcon: {
    position: "absolute",
    right: 18,
    top: 18,
    width: 28,
    height: 28,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  childEditIconText: {
    fontSize: 14,
    fontWeight: "700",
  },
  childDeleteIcon: {
    position: "absolute",
    right: 18,
    bottom: 16,
    width: 28,
    height: 28,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  childDeleteIconText: {
    fontSize: 14,
    color: "#EF4444",
  },

  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 1,
  },

  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingsSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
  },

  themeDropdown: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  themeDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
  },
  themeDropdownPreview: {
    width: 24,
    height: 24,
    borderRadius: 9999,
  },
  themeDropdownLabel: {
    fontSize: 14,
  },

  languageDropdown: {
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  languageFlag: {
    fontSize: 18,
    marginRight: 8,
  },
  languageLabel: {
    fontSize: 14,
  },

  logoutRow: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
