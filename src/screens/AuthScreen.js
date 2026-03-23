// src/screens/AuthScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { auth, db } from "../services/firebaseConfig";
import { useTheme } from "../theme/ThemeContext";
import { useTranslation } from "react-i18next";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Sign-In configuration
 const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});

// console.log("🔑 Web ID:", process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
// console.log("🤖 Android ID:", process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID);

  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error);
      Alert.alert(
        t("auth_error_title") || "Error",
        "Google sign-in failed. Please try again."
      );
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    try {
      setLoading(true);
      
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          createdAt: new Date(),
          language: "en",
          themeKey: "pastelPink",
        });
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      Alert.alert("Error", "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
          language: "en",
          themeKey: "pastelPink",
        });
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (error) {
      console.error("Auth error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.BG }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.logo, { color: theme.PRIMARY }]}>
              👶 Parents+
            </Text>
            <Text style={[styles.subtitle, { color: theme.SECONDARY }]}>
              {isSignUp ? "Create your account" : "Welcome back"}
            </Text>
          </View>

          {/* ТІЛЬКИ ОДНА Google кнопка */}
          <TouchableOpacity
            style={[
              styles.googleButton,
              {
                backgroundColor: theme.CARD_BG,
                borderColor: theme.BORDER,
              },
              loading && styles.buttonDisabled,
            ]}
            onPress={() => promptAsync()}
            disabled={!request || loading}
          >
            <Text style={styles.googleIcon}>🔵</Text>
            <Text style={[styles.googleButtonText, { color: theme.TEXT }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.BORDER }]} />
            <Text style={[styles.dividerText, { color: theme.SECONDARY }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.BORDER }]} />
          </View>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.CARD_BG,
                  color: theme.TEXT,
                  borderColor: theme.BORDER,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.SECONDARY}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.CARD_BG,
                  color: theme.TEXT,
                  borderColor: theme.BORDER,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={theme.SECONDARY}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.PRIMARY },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text style={[styles.toggleText, { color: theme.SECONDARY }]}>
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  googleButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 24,
  },
  googleIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  toggleText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
});
