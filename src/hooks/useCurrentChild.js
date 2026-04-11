// src/hooks/useCurrentChild.js
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getFirestore,
  collection,
  doc,
  deleteDoc,
  setDoc,
  onSnapshot,
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

  const childrenRefState = useRef([]);
  const userDocState = useRef(null);
  const initializedRef = useRef(false);

  const applyDerivedState = useCallback(async () => {
    const list = childrenRefState.current || [];
    const userData = userDocState.current || null;

    const savedId = userData?.currentChildId || null;

    const effectiveId =
      savedId && list.find((c) => c.id === savedId)
        ? savedId
        : list[0]?.id || null;

    setChildren(list);
    setCurrentChildIdState(effectiveId);

    const current = list.find((x) => x.id === effectiveId) || null;

    if (current) {
      const months = current.birthDate ? getAgeInMonths(current.birthDate) : null;
      setChild(current);
      setAgeMonths(months);
    } else {
      setChild(null);
      setAgeMonths(null);
    }

    if (
      userId &&
      initializedRef.current &&
      savedId !== effectiveId
    ) {
      await setDoc(
        doc(db, "users", userId),
        { currentChildId: effectiveId || null },
        { merge: true }
      );
    }

    setLoading(false);
    initializedRef.current = true;
  }, [db, userId]);

  useEffect(() => {
    if (!userId) {
      childrenRefState.current = [];
      userDocState.current = null;
      initializedRef.current = false;

      setChildren([]);
      setCurrentChildIdState(null);
      setChild(null);
      setAgeMonths(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    initializedRef.current = false;

    const unsubUser = onSnapshot(
      doc(db, "users", userId),
      async (snap) => {
        userDocState.current = snap.exists() ? snap.data() : null;
        await applyDerivedState();
      },
      (e) => {
        console.log("User snapshot error", e);
        setLoading(false);
      }
    );

    const unsubChildren = onSnapshot(
      collection(db, "users", userId, "children"),
      async (snap) => {
        childrenRefState.current = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        await applyDerivedState();
      },
      (e) => {
        console.log("Children snapshot error", e);
        setLoading(false);
      }
    );

    return () => {
      unsubUser();
      unsubChildren();
    };
  }, [userId, db, applyDerivedState]);

  const refreshChildren = useCallback(async () => {
    return;
  }, []);

  const deleteChild = useCallback(
    async (id) => {
      try {
        const ref = doc(db, "users", userId, "children", id);
        await deleteDoc(ref);

        const updated = childrenRefState.current.filter((c) => c.id !== id);

        if (currentChildId === id) {
          const next = updated[0]?.id || null;

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
    [currentChildId, db, userId]
  );

  const setCurrentChildId = useCallback(
    async (id) => {
      try {
        if (userId) {
          await setDoc(
            doc(db, "users", userId),
            { currentChildId: id || null },
            { merge: true }
          );
        }
      } catch (e) {
        console.log("Error setting current child", e);
      }
    },
    [userId, db]
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
    refreshChildren,
    loading,
  };
}