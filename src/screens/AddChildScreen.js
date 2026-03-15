// src/screens/AddChildScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { auth } from "../services/firebaseConfig";

const PRIMARY = "#EE2B5B";

export default function AddChildScreen({ navigation, route }) {
  const { t } = useTranslation();

  const params = route?.params || {};
  const isEdit = params.mode === "edit";
  const editingChild = params.child || null;
  const editingChildId = params.childId || null;

  const [name, setName] = useState(editingChild?.name || "");
  const [birthDate, setBirthDate] = useState(editingChild?.birthDate || "");
  const [birthDateObj, setBirthDateObj] = useState(
    editingChild?.birthDate ? new Date(editingChild.birthDate) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState(editingChild?.gender || "male");
  const [saving, setSaving] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setBirthDateObj(selectedDate);
      const iso = selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
      setBirthDate(iso);
    }
  };

  const handleSave = async () => {
    if (!name || !birthDate) return;

    try {
      setSaving(true);
      const db = getFirestore();

      if (isEdit && editingChildId) {
        const childRef = doc(db, "children", editingChildId);
        await updateDoc(childRef, {
          name,
          birthDate,
          gender: gender || null,
        });
      } else {
        const childrenRef = collection(db, "children");

        const user = auth.currentUser;
        if (!user) {
          console.log("No auth user");
          return;
        }
        await addDoc(childrenRef, {
          name,
          birthDate,
          gender: gender || null,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (e) {
      console.log("Error saving child", e);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isEdit ? t("add_child_header_edit") : t("add_child_header_add")}
        </Text>
      </View>

      {/* Step + progress */}
      <View style={styles.stepBlock}>
        <Text style={styles.stepText}>{t("add_child_step_text")}</Text>
        <View style={styles.progressBg}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* Hero text */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          {isEdit
            ? t("add_child_hero_title_edit")
            : t("add_child_hero_title_add")}
        </Text>
        <Text style={styles.heroSubtitle}>
          {t("add_child_hero_subtitle")}
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("add_child_name_label")}</Text>
          <TextInput
            style={styles.input}
            placeholder={t("add_child_name_placeholder")}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Gender */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("add_child_gender_label")}</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "male" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("male")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "male" && styles.genderTextActive,
                ]}
              >
                ♂ {t("add_child_gender_male")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === "female" && styles.genderButtonActive,
              ]}
              onPress={() => setGender("female")}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === "female" && styles.genderTextActive,
                ]}
              >
                ♀ {t("add_child_gender_female")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Birth date */}
        <View style={styles.field}>
          <Text style={styles.label}>{t("add_child_birthdate_label")}</Text>

          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowPicker(true)}
          >
            <Text
              style={[
                styles.datePickerText,
                !birthDate && { color: "#94A3B8" },
              ]}
            >
              {birthDate || t("add_child_birthdate_placeholder")}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={birthDateObj}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
            />
          )}
        </View>
      </View>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !name || !birthDate ? { opacity: 0.6 } : null,
          ]}
          onPress={handleSave}
          disabled={!name || !birthDate || saving}
        >
          <Text style={styles.primaryButtonText}>
            {saving
              ? t("add_child_primary_saving")
              : isEdit
              ? t("add_child_primary_save_changes")
              : t("add_child_primary_save_continue")}
          </Text>
        </TouchableOpacity>

        {!isEdit && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>{t("add_child_skip")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* decorative blobs */}
      <View style={styles.blurTop} />
      <View style={styles.blurMiddle} />
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
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  stepBlock: {
    marginTop: 8,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },
  progressBg: {
    height: 4,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.15)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "40%",
    backgroundColor: PRIMARY,
    borderRadius: 9999,
  },
  hero: {
    marginTop: 8,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "left",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#64748B",
  },
  form: {
    marginTop: 8,
    gap: 20,
  },
  field: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  genderButtonActive: {
    borderColor: PRIMARY,
    backgroundColor: "rgba(238, 43, 91, 0.05)",
  },
  genderText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
  genderTextActive: {
    color: PRIMARY,
    fontWeight: "700",
  },
  datePickerButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: "#0F172A",
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 24,
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 9999,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
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
  skipText: {
    textAlign: "center",
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
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
  blurMiddle: {
    position: "absolute",
    top: "45%",
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.06)",
  },
});
