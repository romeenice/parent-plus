// src/services/articlesService.js
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Всі статті (як було)
export async function getAllArticles() {
  const snapshot = await getDocs(collection(db, "articles"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Статті, актуальні для конкретного місяця (1,2,3…)
export async function getArticlesForAge(currentMonth) {
  const q = query(
    collection(db, "articles"),
    where("month", "==", currentMonth),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
