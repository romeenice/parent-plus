// src/hooks/useCurrentChild.js
import { useEffect, useState, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAgeInMonths } from "../utils/getAgeInMonths";
import { formatAgeMonths } from "../utils/formatAgeMonths";

const CURRENT_CHILD_KEY = "current_child_id";

export function useCurrentChild(userId ) {
  const [children, setChildren] = useState([]);
  const [currentChildId, setCurrentChildIdState] = useState(null);
  const [child, setChild] = useState(null);
  const [ageMonths, setAgeMonths] = useState(null);
  const [loading, setLoading] = useState(true);

  const deleteChild = useCallback(
  async (id) => {
    try {
      const db = getFirestore();
      const ref = doc(db, "children", id);
      await deleteDoc(ref);

      // оновлюємо локальний список
      const updated = children.filter((c) => c.id !== id);
      setChildren(updated);

      // якщо видалили активну дитину — пересунемо currentChildId
      if (currentChildId === id) {
        const next = updated[0]?.id || null;
        setCurrentChildIdState(next);
        if (next) {
          await AsyncStorage.setItem(CURRENT_CHILD_KEY, next);
        } else {
          await AsyncStorage.removeItem(CURRENT_CHILD_KEY);
        }
      }
    } catch (e) {
      console.log("Error deleting child", e);
    }
  },
  [children, currentChildId]
);


  // завантажуємо список дітей
  useEffect(() => {
    async function loadChildren() {
      try {
        setLoading(true);
        const db = getFirestore();
        const childrenRef = collection(db, "children");
        const q = query(childrenRef, where("userId", "==", userId));
        const snap = await getDocs(q);

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setChildren(list);

        // читаємо збережений currentChildId
        let storedId = await AsyncStorage.getItem(CURRENT_CHILD_KEY);

        // якщо збереженого нема або такої дитини вже немає — беремо першу
        if (!storedId || !list.find((c) => c.id === storedId)) {
          storedId = list[0]?.id || null;
        }

        setCurrentChildIdState(storedId);
      } catch (e) {
        console.log("Error loading children", e);
        setChildren([]);
        setCurrentChildIdState(null);
      } finally {
        setLoading(false);
      }
    }

    loadChildren();
  }, [userId]);

  // при зміні currentChildId оновлюємо child + вік
  useEffect(() => {
    if (!currentChildId || children.length === 0) {
      setChild(null);
      setAgeMonths(null);
      return;
    }

    const c = children.find((x) => x.id === currentChildId);
    if (!c) {
      setChild(null);
      setAgeMonths(null);
      return;
    }

    const months = c.birthDate ? getAgeInMonths(c.birthDate) : null;
    setChild(c);
    setAgeMonths(months);
  }, [currentChildId, children]);

  // функція для зміни currentChildId + зберегти в AsyncStorage
  const setCurrentChildId = useCallback(async (id) => {
    setCurrentChildIdState(id);
    if (id) {
      await AsyncStorage.setItem(CURRENT_CHILD_KEY, id);
    } else {
      await AsyncStorage.removeItem(CURRENT_CHILD_KEY);
    }
  }, []);

  const currentMonth =
    ageMonths != null
      ? Math.min(Math.max(ageMonths + 1, 1), 36)
      : null;

  const ageLabel =
    ageMonths != null ? formatAgeMonths(ageMonths) : null;

  return {
    child,
    children,
    ageMonths,
    currentMonth,
    ageLabel,
    currentChildId,
    setCurrentChildId,
    deleteChild,
    loading,
  };
}
