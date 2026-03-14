import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { SafeAreaView } from "react-native-safe-area-context";


// тимчасові таски
const TASKS = [
  {
    id: "month1-development",
    month: 1,
    category: "Daily activity",
    title: "Tummy time 3–5 minutes",
    description:
      "Help your baby strengthen neck and shoulder muscles.",
    status: "not_started",
  },
  {
    id: "month1-psychology",
    month: 1,
    category: "Motor skills",
    title: "Practice sitting",
    description:
      "Support baby with pillows or your lap for balance.",
    status: "in_progress",
  },
  {
    id: "month1-health",
    month: 1,
    category: "Cognitive",
    title: "Read a board book",
    description: "Point to pictures and name common objects.",
    status: "done",
  },
  {
    id: "month1-play",
    month: 1,
    category: "Social",
    title: "Mirror play",
    description:
      "Let baby discover their reflection for social development.",
    status: "not_started",
  },
];

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const PRIMARY = "#EE2B5B";

const getStatusStyle = (status) => {
  switch (status) {
    case "in_progress":
      return {
        bg: "#EFF6FF",
        border: "#BFDBFE",
        text: "#2563EB",
        icon: "⏳",
      };
    case "done":
      return {
        bg: "#ECFDF3",
        border: "#BBF7D0",
        text: "#16A34A",
        icon: "✔",
      };
    case "not_started":
    default:
      return {
        bg: "#E2E8F0",
        border: "#CBD5E1",
        text: "#475569",
        icon: "○",
      };
  }
};

export default function TasksScreen() {
  const { currentMonth, ageLabel, child, loading } = useCurrentChild("test-user-1");

  const initialTasks = useMemo(
    () =>
      currentMonth
        ? TASKS.filter((t) => t.month === currentMonth)
        : [],
    [currentMonth]
  );

  const [tasksState, setTasksState] = useState(initialTasks);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    setTasksState(initialTasks);
  }, [initialTasks]);

  const updateTaskStatus = (taskId, newStatus) => {
    setTasksState((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
    setOpenDropdownId(null);
  };

  const renderTask = ({ item }) => {
    const statusCfg = getStatusStyle(item.status);
    const isOpen = openDropdownId === item.id;

    const isDone = item.status === "done";

    return (
      <View
        style={[
          styles.taskCard,
          isDone && styles.taskCardDone,
        ]}
      >
        <View style={styles.taskHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.taskTitle,
                isDone && styles.taskTitleDone,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.taskDescription,
                isDone && styles.taskDescriptionDone,
              ]}
            >
              {item.description}
            </Text>

            <View style={styles.tagRow}>
              <Text
                style={[
                  styles.tagText,
                  isDone && styles.tagTextMuted,
                ]}
              >
                {item.category.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.statusWrapper}>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusCfg.bg,
                  borderColor: statusCfg.border,
                },
              ]}
              onPress={() =>
                setOpenDropdownId(isOpen ? null : item.id)
              }
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: statusCfg.text },
                ]}
                numberOfLines={1}
              >
                {statusCfg.icon}{" "}
                {
                  STATUS_OPTIONS.find(
                    (o) => o.value === item.status
                  )?.label
                }
              </Text>
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.dropdown}>
                {STATUS_OPTIONS.map((option) => {
                  const optionCfg = getStatusStyle(option.value);
                  const isActive = option.value === item.status;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.dropdownItem,
                        isActive && styles.dropdownItemActive,
                      ]}
                      onPress={() =>
                        updateTaskStatus(item.id, option.value)
                      }
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isActive && {
                            color: optionCfg.text,
                            fontWeight: "700",
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {optionCfg.icon} {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text>No child profile yet.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView  style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.circleIcon}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <Text style={{ color: PRIMARY }}>👶</Text>
            </View>
            <Text style={styles.logoText}>Parents+</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.circleIcon}>
            <Text style={{ fontSize: 18 }}>⋯</Text>
          </View>
        </View>
      </View>

      <View style={styles.headerTextBlock}>
        <Text style={styles.headerTitle}>
          Tasks for Month {currentMonth || 1}
        </Text>
        <Text style={styles.headerSubtitle}>
          Focusing on small daily actions for your child&apos;s growth.
        </Text>
      </View>

      <FlatList
        data={tasksState}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView >
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
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {},
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 8,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: "rgba(238, 43, 91, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerTextBlock: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#64748B",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  taskCardDone: {
    opacity: 0.8,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  taskDescription: {
    fontSize: 14,
    color: "#64748B",
  },
  taskDescriptionDone: {
    color: "#9CA3AF",
  },
  tagRow: {
    marginTop: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: PRIMARY,
  },
  tagTextMuted: {
    color: "#9CA3AF",
  },

  statusWrapper: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  statusBadge: {
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  dropdown: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minWidth: 160,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemActive: {
    backgroundColor: "#F1F5F9",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#475569",
  },
});
