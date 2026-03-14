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
import { useCurrentChild } from "../hooks/useCurrentChild";

const PRIMARY = "#EE2B5B";

export default function ProfileScreen({ navigation }) {
  const {
    child,
    children = [],
    ageLabel,
    currentChildId,
    setCurrentChildId,
    deleteChild,
    loading,
  } = useCurrentChild("test-user-1");

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} edges={["top"]}>
        <Text>Loading...</Text>
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
      "Delete child",
      `Are you sure you want to delete ${childToDelete.name || "this child"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteChild(childToDelete.id),
        },
      ]
    );
  };

  const handlePremiumPress = () => {
    // поки заглушка
    Alert.alert(
      "Premium+ coming soon",
      "Unlock extra content, expert tips and more. Stay tuned!"
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
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
                {ageLabel ? `${ageLabel} old` : "Age not set yet."}
              </Text>

              <TouchableOpacity
                style={styles.addAnotherButton}
                onPress={handleAddChild}
              >
                <Text style={styles.addAnotherText}>Add another child</Text>
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
          <Text style={styles.sectionTitle}>Children</Text>

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
                      {c.birthDate || "Birth date not set"}
                    </Text>
                  </View>
                  {isActive && <Text style={styles.activeDot}>●</Text>}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteChild(c)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Settings / My Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {/* Notifications */}
          <View style={styles.settingsRow}>
            <View>
              <Text style={styles.settingsTitle}>Notifications</Text>
              <Text style={styles.settingsSubtitle}>
                Daily reminders & updates
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
              <Text style={styles.settingsTitle}>App Theme</Text>
              <Text style={styles.settingsSubtitle}>Pastel Pink</Text>
            </View>
            <Text style={styles.chevron}>{">"}</Text>
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity style={styles.settingsRow}>
            <View>
              <Text style={styles.settingsTitle}>Help & Support</Text>
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
                Premium+
              </Text>
              <Text style={styles.settingsSubtitle}>
                Extra content & features
              </Text>
            </View>
            <Text style={[styles.chevron, { color: PRIMARY }]}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* Log out */}
        <TouchableOpacity style={styles.logoutRow}>
          <Text style={styles.logoutText}>Log Out</Text>
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
