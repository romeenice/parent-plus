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

const PRIMARY = "#EE2B5B";

export default function AuthScreen({ navigation }) {
  const { t } = useTranslation();

  const [mode, setMode] = useState("login"); // "login" | "signup"
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
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("auth_header_title")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("auth_header_subtitle")}
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "login" && styles.tabButtonActive,
              ]}
              onPress={() => setMode("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "login" && styles.tabTextActive,
                ]}
              >
                {t("auth_tab_login")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === "signup" && styles.tabButtonActive,
              ]}
              onPress={() => setMode("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  mode === "signup" && styles.tabTextActive,
                ]}
              >
                {t("auth_tab_signup")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t("auth_email_label")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("auth_email_placeholder")}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t("auth_password_label")}</Text>
              <TextInput
                style={styles.input}
                placeholder={t("auth_password_placeholder")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {isSignup && (
              <View style={styles.field}>
                <Text style={styles.label}>
                  {t("auth_confirm_password_label")}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t("auth_confirm_password_placeholder")}
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
                <Text style={styles.forgotLink}>
                  {t("auth_forgot_password_link")}
                </Text>
              </TouchableOpacity>
            )}

            {/* Main button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!email || !password || (isSignup && !confirm)) && {
                  opacity: 0.7,
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

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>
                {t("auth_divider_or_continue")}
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={async () => {
                try {
                  setError("");
                  setLoading(true);
                  await signInWithGoogleExpo();
                  // onAuthStateChanged в App.js сам переведе в MainTabs
                } catch (e) {
                  console.log("Google login error", e);
                  setError(t("auth_error_google"));
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Text style={styles.googleButtonText}>
                {t("auth_google_button")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* decorative blobs */}
        <View style={styles.blurTop} />
        <View style={styles.blurBottom} />

        {/* Forgot password modal */}
        <Modal
          visible={showForgot}
          transparent
          animationType="fade"
          onRequestClose={() => setShowForgot(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {t("auth_reset_title")}
              </Text>
              <Text style={styles.modalSubtitle}>
                {t("auth_reset_subtitle")}
              </Text>

              <TextInput
                style={[styles.input, { marginTop: 16 }]}
                placeholder={t("auth_reset_email_placeholder")}
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
                  <Text style={styles.modalSecondaryText}>
                    {t("auth_reset_cancel")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalPrimaryButton}
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
    backgroundColor: "#F8F6F6",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },

  card: {
    marginTop: 8,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
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
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tabText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  tabTextActive: {
    color: PRIMARY,
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
    color: "#0F172A",
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  forgotLinkWrapper: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  forgotLink: {
    fontSize: 13,
    color: PRIMARY,
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
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    shadowColor: PRIMARY,
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
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#94A3B8",
  },

  googleButton: {
    height: 50,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },

  blurTop: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.06)",
  },
  blurBottom: {
    position: "absolute",
    bottom: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.06)",
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
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
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
    color: "#64748B",
    fontWeight: "600",
  },
  modalPrimaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9999,
    backgroundColor: PRIMARY,
  },
  modalPrimaryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
