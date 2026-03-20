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
  setDoc,
} from "firebase/firestore";
import { getAgeInMonths } from "../utils/getAgeInMonths";
import { formatAgeMonths } from "../utils/formatAgeMonths";

export function useCurrentChild(userId) {
  const [children, setChildren] = useState([]);
  const [currentChildId, setCurrentChildIdState] = useState(null);
  const [child, setChild] = useState(null);
  const [ageMonths, setAgeMonths] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const db = getFirestore();

  // видалення дитини
  const deleteChild = useCallback(
    async (id) => {
      try {
        const ref = doc(db, "children", id);
        await deleteDoc(ref);

        const updated = children.filter((c) => c.id !== id);
        setChildren(updated);

        if (currentChildId === id) {
          const next = updated[0]?.id || null;
          setCurrentChildIdState(next);

          if (userId) {
            await setDoc(
              doc(db, "users", userId),
              { currentChildId: next || null },
              { merge: true }
            );
          }
        }
      } catch (e) {
        console.log("Error deleting child", e);
      }
    },
    [children, currentChildId, db, userId]
  );

  // завантаження дітей + currentChildId з users/{userId}
  useEffect(() => {
    if (!userId) {
      setChildren([]);
      setCurrentChildIdState(null);
      setChild(null);
      setAgeMonths(null);
      setLoading(false);
      return;
    }

    const loadChildren = async () => {
      try {
        setLoading(true);

        // 1) всі діти користувача
        const childrenRef = collection(db, "children");
        const q = query(childrenRef, where("userId", "==", userId));
        const snap = await getDocs(q);

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setChildren(list);

        // 2) читаємо currentChildId з users/{userId}
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const savedId = userSnap.exists()
          ? userSnap.data().currentChildId
          : null;

        let effectiveId =
          savedId && list.find((c) => c.id === savedId)
            ? savedId
            : list[0]?.id || null;

        setCurrentChildIdState(effectiveId);

        if (effectiveId) {
          const c = list.find((x) => x.id === effectiveId) || null;
          if (c) {
            const months = c.birthDate ? getAgeInMonths(c.birthDate) : null;
            setChild(c);
            setAgeMonths(months);
          } else {
            setChild(null);
            setAgeMonths(null);
          }
        } else {
          setChild(null);
          setAgeMonths(null);
        }
      } catch (e) {
        console.log("Error loading children", e);
        setChildren([]);
        setCurrentChildIdState(null);
        setChild(null);
        setAgeMonths(null);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [userId, db]);

  // зміна поточної дитини + запис у users/{userId}
  const setCurrentChildId = useCallback(
    async (id) => {
      setCurrentChildIdState(id);

      const c = children.find((x) => x.id === id) || null;
      if (c) {
        const months = c.birthDate ? getAgeInMonths(c.birthDate) : null;
        setChild(c);
        setAgeMonths(months);
      } else {
        setChild(null);
        setAgeMonths(null);
      }

      if (userId) {
        await setDoc(
          doc(db, "users", userId),
          { currentChildId: id || null },
          { merge: true }
        );
      }
    },
    [children, userId, db]
  );

  const currentMonth =
    ageMonths != null ? Math.min(Math.max(ageMonths + 1, 1), 36) : null;

  const ageLabel = ageMonths != null ? formatAgeMonths(ageMonths) : null;

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
