// src/screens/TasksScreen.js
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { useCurrentChild } from "../hooks/useCurrentChild";
import { auth, db } from "../services/firebaseConfig";
import { formatAgeMonths } from "../utils/formatAgeMonths";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalizedField";
import { getCurrentWeekIndexFromBirthDate } from "../utils/getCurrentWeekIndexFromBirthDate";
import { getAgeInMonthsFromBirthDate } from "../utils/getAgeInMonthsFromBirthDate";


const PRIMARY = "#EE2B5B";

const STATUS_OPTIONS = [
  { value: "not_started", labelKey: "tasks_status_not_started" },
  { value: "in_progress", labelKey: "tasks_status_in_progress" },
  { value: "done", labelKey: "tasks_status_done" },
];

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
  const { t } = useTranslation();
  const userId = auth.currentUser?.uid;
  const { currentMonth, child, loading: childLoading } = useCurrentChild(userId);

  const [tasksState, setTasksState] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const currentWeekIndex = useMemo(() => {
    if (!child?.birthDate) return 1;
    return getCurrentWeekIndexFromBirthDate(child.birthDate);
  }, [child?.birthDate]);

  const childAgeMonths = useMemo(() => {
  if (!child?.birthDate) return currentMonth ?? 0;
  return getAgeInMonthsFromBirthDate(child.birthDate);
}, [child?.birthDate, currentMonth]);


  // Load tasks templates and user statuses
  useEffect(() => {
    const loadTasks = async () => {
      if (!currentMonth || !userId) {
        setTasksState([]);
        setLoadingTasks(false);
        return;
      }

      try {
        setLoadingTasks(true);

        // 1) Load templates for this month
        const tasksRef = collection(db, "tasks");
        const qTasks = query(tasksRef, where("month", "==", currentMonth));
        const snapTasks = await getDocs(qTasks);

        const templates = [];
        snapTasks.forEach((d) => {
          templates.push({ id: d.id, ...d.data() });
        });

        // 2) Load user statuses for these taskIds
        const userTasksRef = collection(db, "users", userId, "tasks");
        const result = [];

        for (const tTask of templates) {
          const userTaskDocRef = doc(userTasksRef, tTask.id);
          const userTaskSnap = await getDoc(userTaskDocRef);

          let status = "not_started";
          if (userTaskSnap.exists()) {
            const data = userTaskSnap.data();
            if (data.status) status = data.status;
          }

          result.push({ ...tTask, status });
        }

        // 3) показуємо тільки ті тижні, які ≤ поточного тижня дитини[web:51]
        const filteredByWeek = result.filter((task) => {
          if (typeof task.weekIndex !== "number") return true;
          return task.weekIndex <= currentWeekIndex;
        });

        setTasksState(filteredByWeek);
      } catch (e) {
        console.log("Error loading tasks for month", currentMonth, e);
        setTasksState([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [currentMonth, userId, currentWeekIndex]);

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!userId) return;

    setTasksState((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    setOpenDropdownId(null);

    try {
      const userTaskRef = doc(db, "users", userId, "tasks", taskId);
      await setDoc(
        userTaskRef,
        {
          status: newStatus,
        },
        { merge: true }
      );
    } catch (e) {
      console.log("Error updating task status", e);
    }
  };

  // --- ЛОГІКА СПИСКУ ---
  const notDoneTasks = useMemo(
    () => tasksState.filter((t) => t.status !== "done"),
    [tasksState]
  );
  const doneTasks = useMemo(
    () => tasksState.filter((t) => t.status === "done"),
    [tasksState]
  );

  // розбиваємо по поточному тижню та попередніх
  const currentNotDone = useMemo(
    () => notDoneTasks.filter((t) => t.weekIndex === currentWeekIndex),
    [notDoneTasks, currentWeekIndex]
  );
  const previousNotDone = useMemo(
    () => notDoneTasks.filter((t) => t.weekIndex < currentWeekIndex),
    [notDoneTasks, currentWeekIndex]
  );

  const currentDone = useMemo(
    () => doneTasks.filter((t) => t.weekIndex === currentWeekIndex),
    [doneTasks, currentWeekIndex]
  );
  const previousDone = useMemo(
    () => doneTasks.filter((t) => t.weekIndex < currentWeekIndex),
    [doneTasks, currentWeekIndex]
  );

  // сортування всередині одного тижня по order (зростання)
  const sortAscByOrder = (arr) =>
    [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // сортування попередніх тижнів: від більшого тижня до меншого, всередині — по order
  const sortDescByWeekThenOrder = (arr) =>
    [...arr].sort((a, b) => {
      const aWeek = a.weekIndex ?? 0;
      const bWeek = b.weekIndex ?? 0;
      if (aWeek !== bWeek) return bWeek - aWeek; // 4,3,2,1
      const aOrder = a.order ?? 0;
      const bOrder = b.order ?? 0;
      return aOrder - bOrder;
    });

  const sortedNotDone = useMemo(
    () => [
      ...sortAscByOrder(currentNotDone),           // поточний тиждень
      ...sortDescByWeekThenOrder(previousNotDone) // попередні: 4,3,2,1
    ],
    [currentNotDone, previousNotDone]
  );

  const sortedDone = useMemo(
    () => [
      ...sortAscByOrder(currentDone),
      ...sortDescByWeekThenOrder(previousDone)
    ],
    [currentDone, previousDone]
  );

  const listData = useMemo(
    () => [...sortedNotDone, ...sortedDone],
    [sortedNotDone, sortedDone]
  );


  const allDone =
    tasksState.length > 0 && tasksState.every((t) => t.status === "done");

  const renderTask = ({ item, index }) => {
    const statusCfg = getStatusStyle(item.status);
    const isOpen = openDropdownId === item.id;
    const isDone = item.status === "done";

    const title = getLocalized(item.title);
    const description = getLocalized(item.description);

    const isPreviousWeek = item.weekIndex < currentWeekIndex;

    const showPreviousSeparator =
      isPreviousWeek &&
      (index === 0 || listData[index - 1].weekIndex === currentWeekIndex);

    const isFirstDone =
      item.status === "done" &&
      (index === 0 || listData[index - 1].status !== "done");

    return (
      <>
        {showPreviousSeparator && (
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>
  {t("tasks_previous_tasks_title")}
</Text>

            <View style={styles.separatorLine} />
          </View>
        )}

        {isFirstDone && (
          <View style={styles.separatorRow}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>
              {t("tasks_done_block_title", "Виконані завдання")}
            </Text>
            <View style={styles.separatorLine} />
          </View>
        )}

        <View style={[styles.taskCard, isDone && styles.taskCardDone]}>
          <View style={styles.taskHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.taskTitle, isDone && styles.taskTitleDone]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  isDone && styles.taskDescriptionDone,
                ]}
              >
                {description}
              </Text>

              <View style={styles.tagRow}>
                <Text
                  style={[
                    styles.tagText,
                    isDone && styles.tagTextMuted,
                  ]}
                >
                  {item.category?.toUpperCase?.() || ""}
                </Text>

                <Text
                  style={[
                    styles.ageTagText,
                    isDone && styles.tagTextMuted,
                  ]}
                >
                  {t("task_week_label", {
                    week: item.weekIndex,
                  })}
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
                    ) &&
                      t(
                        STATUS_OPTIONS.find(
                          (o) => o.value === item.status
                        ).labelKey
                      )
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
                          {optionCfg.icon} {t(option.labelKey)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  // Loading states
  if (childLoading || loadingTasks) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text>{t("tasks_no_child")}</Text>
      </View>
    );
  }

  if (!tasksState || tasksState.length === 0) {
    return (
      <SafeAreaView style={styles.screen} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.circleIcon}>
              <Text style={{ fontSize: 20 }}>←</Text>
            </View>

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
            {t("tasks_header_title", {
              age: formatAgeMonths(childAgeMonths),
            })}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t("tasks_empty_subtitle")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.circleIcon}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </View>

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
          {t("tasks_header_title", {
            age: formatAgeMonths(currentMonth),
          })}
        </Text>
        <Text style={styles.headerSubtitle}>
          {allDone
            ? t("tasks_all_done_subtitle")
            : t("tasks_focus_subtitle")}
        </Text>
      </View>

      <FlatList
        data={listData}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
      />
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
  ageTagText: {
    marginTop: 4,
    fontSize: 11,
    color: "#64748B",
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

  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
