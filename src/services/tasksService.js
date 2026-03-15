// src/services/tasksService.js
import { db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getTasksForMonth(month) {
  if (!month) return [];

  const tasksRef = collection(db, "tasks");
  const q = query(tasksRef, where("month", "==", month));

  const snap = await getDocs(q);
  const tasks = [];
  snap.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });

  return tasks;
}
