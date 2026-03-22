// src/screens/TasksScreen.js
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
import { useTranslation } from "react-i18next";

import { useTheme } from "../theme/ThemeContext";
import { useCurrentChild } from "../hooks/useCurrentChild";
import { auth, db } from "../services/firebaseConfig";
import { formatAgeMonths } from "../utils/formatAgeMonths";
import { getLocalized } from "../utils/getLocalizedField";
import { getAgeInWeeksFromBirthDate } from "../utils/getAgeInWeeksFromBirthDate";
import { getAgeInMonthsFromBirthDate } from "../utils/getAgeInMonthsFromBirthDate";
import { getDaysUntilNextWeek } from "../utils/getDaysUntilNextWeek";

const CATEGORY_FILTERS = [
  { key: "all", icon: "✨", labelKey: "home_feed_filter_all" },
  { key: "development", icon: "🧠", labelKey: "home_feed_filter_development" },
  { key: "psychology", icon: "💬", labelKey: "home_feed_filter_psychology" },
  { key: "health", icon: "🍎", labelKey: "home_feed_filter_health" },
  { key: "play", icon: "🎲", labelKey: "home_feed_filter_play" },
];

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

export default function TasksScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const userId = auth.currentUser?.uid;
  const { currentMonth, child, loading: childLoading } = useCurrentChild(userId);

  const [tasksState, setTasksState] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const currentWeekIndex = useMemo(() => {
    if (!child?.birthDate) return 1;
    return getAgeInWeeksFromBirthDate(child.birthDate);
  }, [child?.birthDate]);

  const childAgeMonths = useMemo(() => {
    if (!child?.birthDate) return currentMonth ?? 0;
    return getAgeInMonthsFromBirthDate(child.birthDate);
  }, [child?.birthDate, currentMonth]);

  const daysUntilNextWeek = useMemo(() => {
    if (!child?.birthDate) return 0;
    return getDaysUntilNextWeek(child.birthDate);
  }, [child?.birthDate]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!userId) {
        setTasksState([]);
        setLoadingTasks(false);
        return;
      }

      try {
        setLoadingTasks(true);

        const WEEKS_WINDOW = 8;
        const maxWeek = currentWeekIndex;
        const minWeek = Math.max(1, maxWeek - WEEKS_WINDOW + 1);

        const tasksRef = collection(db, "tasks");
        const qTasks = query(
          tasksRef,
          where("weekIndex", ">=", minWeek),
          where("weekIndex", "<=", maxWeek)
        );
        const snapTasks = await getDocs(qTasks);

        const templates = [];
        snapTasks.forEach((d) => {
          templates.push({ id: d.id, ...d.data() });
        });

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

        setTasksState(result);
      } catch (e) {
        console.log("Error loading tasks", e);
        setTasksState([]);
      } finally {
        setLoadingTasks(false);
      }
    };

    loadTasks();
  }, [userId, currentWeekIndex]);

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

  const filteredTasks = tasksState.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.category === selectedCategory;
  });

  const notDoneTasks = useMemo(
    () => filteredTasks.filter((t) => t.status !== "done"),
    [filteredTasks]
  );
  const doneTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === "done"),
    [filteredTasks]
  );

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

  const sortAscByOrder = (arr) =>
    [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sortDescByWeekThenOrder = (arr) =>
    [...arr].sort((a, b) => {
      const aWeek = a.weekIndex ?? 0;
      const bWeek = b.weekIndex ?? 0;
      if (aWeek !== bWeek) return bWeek - aWeek;
      const aOrder = a.order ?? 0;
      const bOrder = b.order ?? 0;
      return aOrder - bOrder;
    });

  const sortedNotDone = useMemo(() => {
    const current = sortAscByOrder(currentNotDone);
    const previous = sortDescByWeekThenOrder(previousNotDone);
    return [...current, ...previous];
  }, [currentNotDone, previousNotDone]);

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
    filteredTasks.length > 0 && filteredTasks.every((t) => t.status === "done");

  const renderTask = ({ item, index }) => {
    const statusCfg = getStatusStyle(item.status);
    const isOpen = openDropdownId === item.id;
    const isDone = item.status === "done";

    const title = getLocalized(item.title);
    const description = getLocalized(item.description);

    const isPreviousWeek = item.weekIndex < currentWeekIndex;
    const isCurrentWeek = item.weekIndex === currentWeekIndex;

    const showNewSeparator =
      isCurrentWeek &&
      item.status !== "done" &&
      (index === 0 || listData[index - 1].weekIndex !== currentWeekIndex || listData[index - 1].status === "done");

    const showPreviousSeparator =
      isPreviousWeek &&
      (index === 0 || listData[index - 1].weekIndex === currentWeekIndex);

    const isFirstDone =
      item.status === "done" &&
      (index === 0 || listData[index - 1].status !== "done");

    return (
      <>
        {showNewSeparator && (
          <View style={styles.separatorRow}>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
            <Text style={[styles.separatorText, { color: theme.PRIMARY }]}>
              ✨ {t("home_article_status_new")}
            </Text>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
          </View>
        )}

        {showPreviousSeparator && (
          <View style={styles.separatorRow}>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
            <Text style={[styles.separatorText, { color: theme.SECONDARY }]}>
              {t("tasks_previous_tasks_title")}
            </Text>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
          </View>
        )}

        {isFirstDone && (
          <View style={styles.separatorRow}>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
            <Text style={[styles.separatorText, { color: theme.SECONDARY }]}>
              {t("tasks_done_block_title")}
            </Text>
            <View style={[styles.separatorLine, { backgroundColor: theme.BORDER }]} />
          </View>
        )}

        <View style={[
          styles.taskCard,
          isDone && styles.taskCardDone,
          { 
            backgroundColor: theme.CARD_BG,
            borderColor: theme.BORDER,
          }
        ]}>
          <View style={styles.taskHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.taskTitle,
                  { color: theme.TEXT },
                  isDone && styles.taskTitleDone,
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.taskDescription,
                  { color: theme.SECONDARY },
                  isDone && styles.taskDescriptionDone,
                ]}
              >
                {description}
              </Text>

              <View style={styles.tagRow}>
                <Text
                  style={[
                    styles.tagText,
                    { color: theme.PRIMARY },
                    isDone && styles.tagTextMuted,
                  ]}
                >
                  {t(`categories.${item.category}`) || ""}
                </Text>

                <Text
                  style={[
                    styles.ageTagText,
                    { color: theme.SECONDARY },
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
                <View style={[
                  styles.dropdown,
                  {
                    backgroundColor: theme.DROPDOWN_BG,
                    borderColor: theme.BORDER,
                  }
                ]}>
                  {STATUS_OPTIONS.map((option) => {
                    const optionCfg = getStatusStyle(option.value);
                    const isActive = option.value === item.status;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.dropdownItem,
                          isActive && {
                            backgroundColor: `${theme.PRIMARY}20`,
                          },
                        ]}
                        onPress={() =>
                          updateTaskStatus(item.id, option.value)
                        }
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            { color: theme.TEXT },
                            isActive && {
                              color: theme.PRIMARY,
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

  if (childLoading || loadingTasks) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor: theme.BG }]}>
        <ActivityIndicator size="large" color={theme.PRIMARY} />
      </View>
    );
  }

  if (!child) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor: theme.BG }]}>
        <Text style={{ color: theme.TEXT }}>{t("tasks_no_child")}</Text>
      </View>
    );
  }

  if (!tasksState || tasksState.length === 0) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => navigation.navigate("Home")}
          >
            <View style={[
              styles.avatarCircle,
              { backgroundColor: `${theme.PRIMARY}15` }
            ]}>
              <Text style={[styles.avatarText, { color: theme.PRIMARY }]}>
                {child.name ? child.name[0].toUpperCase() : "P"}
              </Text>
            </View>
            <Text style={[styles.appTitle, { color: theme.TEXT }]}>Parents+</Text>
          </TouchableOpacity>

          {daysUntilNextWeek > 0 && (
            <View style={[
              styles.countdownBlock,
              { backgroundColor: theme.COUNTDOWN_BG }
            ]}>
              <Text style={[styles.countdownText, { color: theme.PRIMARY }]}>
                📅 {t("tasks_new_tasks_in", {
                  days: daysUntilNextWeek,
                })}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.headerTextBlock}>
          <Text style={[styles.headerTitle, { color: theme.TEXT }]}>
            {t("tasks_header_title", {
              age: formatAgeMonths(childAgeMonths),
            })}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.SECONDARY }]}>
            {t("tasks_empty_subtitle")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.BG }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate("Home")}
        >
          <View style={[
            styles.avatarCircle,
            { backgroundColor: `${theme.PRIMARY}15` }
          ]}>
            <Text style={[styles.avatarText, { color: theme.PRIMARY }]}>
              {child.name ? child.name[0].toUpperCase() : "P"}
            </Text>
          </View>
          <Text style={[styles.appTitle, { color: theme.TEXT }]}>Parents+</Text>
        </TouchableOpacity>

        {daysUntilNextWeek > 0 && (
          <View style={[
            styles.countdownBlock,
            { backgroundColor: theme.COUNTDOWN_BG }
          ]}>
            <Text style={[styles.countdownText, { color: theme.PRIMARY }]}>
              📅 {t("tasks_new_tasks_in", {
                days: daysUntilNextWeek,
              })}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.headerTextBlock}>
        <Text style={[styles.headerTitle, { color: theme.TEXT }]}>
          {t("tasks_header_title", {
            age: formatAgeMonths(childAgeMonths),
          })}
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.SECONDARY }]}>
          {allDone
            ? t("tasks_all_done_subtitle")
            : t("tasks_focus_subtitle")}
        </Text>
      </View>

      {/* ✅ ФІЛЬТРИ */}
       <View style={styles.chipsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
      >
        {CATEGORY_FILTERS.map((chip) => {
          const isActive = selectedCategory === chip.key;
          return (
            <TouchableOpacity
              key={chip.key}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? theme.CHIP_ACTIVE
                    : theme.CHIP_BG,
                },
                isActive && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(chip.key)}
              activeOpacity={0.9}
            >
              <Text style={styles.chipIcon}>{chip.icon}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: isActive ? "#FFFFFF" : theme.TEXT,
                    fontWeight: isActive ? "600" : "400",
                  },
                  isActive && styles.chipLabelActive,
                ]}
              >
                {t(chip.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  headerTextBlock: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  chipsContainer: {
    height: 60, 
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  chipsRow: {
    paddingVertical: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    marginRight: 8,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 14,
  },
  chipLabelActive: {
    fontWeight: "600",
  },
  chipActive: {
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 12,
  },
  taskCard: {
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
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
    marginBottom: 4,
  },
  taskTitleDone: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  taskDescription: {
    fontSize: 14,
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
  },
  tagTextMuted: {
    color: "#9CA3AF",
  },
  ageTagText: {
    marginTop: 4,
    fontSize: 11,
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
    borderWidth: 1,
    minWidth: 160,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 13,
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
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 12,
    fontWeight: "500",
  },
  countdownBlock: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 6,
    alignItems: "center",
  },
  countdownText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
