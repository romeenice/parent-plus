// src/screens/AuthScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { signInWithGoogleExpo } from "../services/googleAuthSession";
import { useTranslation } from "react-i18next";

import { useTheme } from "../theme/ThemeContext";

export default function AuthScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (isSignup && !confirm)) {
      setError(t("auth_error_fill_all_fields"));
      return;
    }
    if (isSignup && password !== confirm) {
      setError(t("auth_error_passwords_mismatch"));
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e) {
      console.log("Auth error", e);
      if (e.code === "auth/invalid-email") {
        setError(t("auth_error_invalid_email"));
      } else if (e.code === "auth/user-not-found") {
        setError(t("auth_error_user_not_found"));
      } else if (e.code === "auth/wrong-password") {
        setError(t("auth_error_wrong_password"));
      } else if (e.code === "auth/email-already-in-use") {
        setError(t("auth_error_email_in_use"));
      } else if (e.code === "auth/weak-password") {
        setError(t("auth_error_weak_password"));
      } else {
        setError(t("auth_error_generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    setError("");
    if (!forgotEmail) {
      setError(t("auth_error_reset_no_email"));
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setShowForgot(false);
    } catch (e) {
      console.log("Reset error", e);
      if (e.code === "auth/user-not-found") {
        setError(t("auth_error_reset_user_not_found"));
      } else if (e.code === "auth/invalid-email") {
        setError(t("auth_error_invalid_email"));
      } else {
        setError(t("auth_error_reset_generic"));
      }
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.TEXT }]}>
            {t("auth_header_title")}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.SECONDARY }]}>
            {t("auth_header_subtitle")}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.CARD_BG }]}>
          <View style={[styles.tabsRow, { backgroundColor: theme.BG }]}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "login" && {
                  backgroundColor: theme.CARD_BG,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                },
              ]}
              onPress={() => setMode("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: mode === "login" ? theme.PRIMARY : theme.SECONDARY,
                    fontWeight: mode === "login" ? "700" : "600",
                  },
                ]}
              >
                {t("auth_tab_login")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "signup" && {
                  backgroundColor: theme.CARD_BG,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                },
              ]}
              onPress={() => setMode("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: mode === "signup" ? theme.PRIMARY : theme.SECONDARY,
                    fontWeight: mode === "signup" ? "700" : "600",
                  },
                ]}
              >
                {t("auth_tab_signup")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.TEXT }]}>
                {t("auth_email_label")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.BORDER,
                    backgroundColor: theme.BG,
                    color: theme.TEXT,
                  },
                ]}
                placeholder={t("auth_email_placeholder")}
                placeholderTextColor={theme.SECONDARY}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.TEXT }]}>
                {t("auth_password_label")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.BORDER,
                    backgroundColor: theme.BG,
                    color: theme.TEXT,
                  },
                ]}
                placeholder={t("auth_password_placeholder")}
                placeholderTextColor={theme.SECONDARY}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {isSignup && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.TEXT }]}>
                  {t("auth_confirm_password_label")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: theme.BORDER,
                      backgroundColor: theme.BG,
                      color: theme.TEXT,
                    },
                  ]}
                  placeholder={t("auth_confirm_password_placeholder")}
                  placeholderTextColor={theme.SECONDARY}
                  value={confirm}
                  onChangeText={setConfirm}
                  secureTextEntry
                />
              </View>
            )}

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            {!isSignup && (
              <TouchableOpacity
                style={styles.forgotLinkWrapper}
                onPress={() => {
                  setForgotEmail(email);
                  setShowForgot(true);
                }}
              >
                <Text style={[styles.forgotLink, { color: theme.PRIMARY }]}>
                  {t("auth_forgot_password_link")}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: theme.PRIMARY,
                  shadowColor: theme.PRIMARY,
                  opacity: (!email || !password || (isSignup && !confirm)) ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading
                  ? t("auth_primary_loading")
                  : isSignup
                  ? t("auth_primary_signup")
                  : t("auth_primary_login")}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.BORDER }]} />
              <Text style={[styles.dividerText, { color: theme.SECONDARY }]}>
                {t("auth_divider_or_continue")}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.BORDER }]} />
            </View>

            <TouchableOpacity
              style={[
                styles.googleButton,
                {
                  borderColor: theme.BORDER,
                  backgroundColor: theme.CARD_BG,
                },
              ]}
              onPress={async () => {
                try {
                  setError("");
                  setLoading(true);
                  await signInWithGoogleExpo();
                } catch (e) {
                  console.log("Google login error", e);
                  setError(t("auth_error_google"));
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text style={[styles.googleButtonText, { color: theme.TEXT }]}>
                {t("auth_google_button")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.blurTop, { backgroundColor: `${theme.PRIMARY}06` }]} />
        <View style={[styles.blurBottom, { backgroundColor: `${theme.PRIMARY}06` }]} />

        <Modal
          visible={showForgot}
          transparent
          animationType="fade"
          onRequestClose={() => setShowForgot(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.CARD_BG }]}>
              <Text style={[styles.modalTitle, { color: theme.TEXT }]}>
                {t("auth_reset_title")}
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.SECONDARY }]}>
                {t("auth_reset_subtitle")}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    marginTop: 16,
                    borderColor: theme.BORDER,
                    backgroundColor: theme.BG,
                    color: theme.TEXT,
                  },
                ]}
                placeholder={t("auth_reset_email_placeholder")}
                placeholderTextColor={theme.SECONDARY}
                value={forgotEmail}
                onChangeText={setForgotEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setShowForgot(false)}
                >
                  <Text style={[styles.modalSecondaryText, { color: theme.SECONDARY }]}>
                    {t("auth_reset_cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalPrimaryButton,
                    { backgroundColor: theme.PRIMARY },
                  ]}
                  onPress={handleForgotSubmit}
                >
                  <Text style={styles.modalPrimaryText}>
                    {t("auth_reset_send_link")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  card: {
    marginTop: 8,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  tabsRow: {
    flexDirection: "row",
    borderRadius: 9999,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    borderRadius: 9999,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
  },
  form: {
    marginTop: 4,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  forgotLinkWrapper: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 8,
  },
  primaryButton: {
    height: 54,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
  },

  googleButton: {
    height: 50,
    borderRadius: 9999,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  blurTop: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 9999,
  },
  blurBottom: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 9999,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 12,
  },
  modalSecondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalPrimaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
  },
  modalPrimaryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
