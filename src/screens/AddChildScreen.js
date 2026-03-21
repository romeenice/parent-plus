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

import { useTheme } from "../theme/ThemeContext";
import { auth } from "../services/firebaseConfig";

export default function AddChildScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
      const iso = selectedDate.toISOString().slice(0, 10);
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
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.TEXT }]}>
          {isEdit ? t("add_child_header_edit") : t("add_child_header_add")}
        </Text>
      </View>

      <View style={styles.hero}>
        <Text style={[styles.heroTitle, { color: theme.TEXT }]}>
          {isEdit
            ? t("add_child_hero_title_edit")
            : t("add_child_hero_title_add")}
        </Text>
        <Text style={[styles.heroSubtitle, { color: theme.SECONDARY }]}>
          {t("add_child_hero_subtitle")}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.TEXT }]}>
            {t("add_child_name_label")}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.BORDER,
                backgroundColor: theme.CARD_BG,
                color: theme.TEXT,
              },
            ]}
            placeholder={t("add_child_name_placeholder")}
            placeholderTextColor={theme.SECONDARY}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.TEXT }]}>
            {t("add_child_gender_label")}
          </Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                {
                  borderColor: gender === "male" ? theme.PRIMARY : theme.BORDER,
                  backgroundColor: gender === "male" ? `${theme.PRIMARY}10` : theme.CARD_BG,
                },
              ]}
              onPress={() => setGender("male")}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color: gender === "male" ? theme.PRIMARY : theme.SECONDARY,
                    fontWeight: gender === "male" ? "700" : "500",
                  },
                ]}
              >
                ♂ {t("add_child_gender_male")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.genderButton,
                {
                  borderColor: gender === "female" ? theme.PRIMARY : theme.BORDER,
                  backgroundColor: gender === "female" ? `${theme.PRIMARY}10` : theme.CARD_BG,
                },
              ]}
              onPress={() => setGender("female")}
            >
              <Text
                style={[
                  styles.genderText,
                  {
                    color: gender === "female" ? theme.PRIMARY : theme.SECONDARY,
                    fontWeight: gender === "female" ? "700" : "500",
                  },
                ]}
              >
                ♀ {t("add_child_gender_female")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.TEXT }]}>
            {t("add_child_birthdate_label")}
          </Text>

          <TouchableOpacity
            style={[
              styles.datePickerButton,
              {
                borderColor: theme.BORDER,
                backgroundColor: theme.CARD_BG,
              },
            ]}
            onPress={() => setShowPicker(true)}
          >
            <Text
              style={[
                styles.datePickerText,
                {
                  color: birthDate ? theme.TEXT : theme.SECONDARY,
                },
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

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: theme.PRIMARY,
              shadowColor: theme.PRIMARY,
              opacity: !name || !birthDate ? 0.6 : 1,
            },
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
            <Text style={[styles.skipText, { color: theme.SECONDARY }]}>
              {t("add_child_skip")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.blurTop, { backgroundColor: `${theme.PRIMARY}06` }]} />
      <View style={[styles.blurMiddle, { backgroundColor: `${theme.PRIMARY}06` }]} />
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
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  stepBlock: {
    marginTop: 8,
    marginBottom: 16,
  },
  stepText: {
    fontSize: 13,
    marginBottom: 8,
  },
  progressBg: {
    height: 4,
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "40%",
    borderRadius: 9999,
  },
  hero: {
    marginTop: 8,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "left",
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
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
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
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
    justifyContent: "center",
    alignItems: "center",
  },
  genderText: {
    fontSize: 15,
  },
  datePickerButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  datePickerText: {
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    paddingVertical: 24,
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
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
  blurMiddle: {
    position: "absolute",
    top: "45%",
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 9999,
  },
});
