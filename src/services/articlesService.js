import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Всі статті (як було)
export async function getAllArticles() {
  const snapshot = await getDocs(collection(db, "articles"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Статті, актуальні для віку в місяцях
export async function getArticlesForAge(currentAgeMonths) {
  const q = query(
    collection(db, "articles"),
    where("age_min_months", "<=", currentAgeMonths)
    // за бажанням можна додати ще один фільтр по тому самому полю
    // where("age_max_months", ">=", currentAgeMonths)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
