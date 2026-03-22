// src/dev/seedTasks.js
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const tasksSeed = [
 

]

export async function seedTasksOnce() {
  try {
    // Перевіри чи вже є завдання в базі
    const colRef = collection(db, "tasks");
    const q = query(colRef, where("weekIndex", "==", 1)); // перевір перше завдання
    const snapshot = await getDocs(q);
    
    if (snapshot.size > 0) {
      console.log("Tasks already seeded, skipping...");
      return;
    }
    
    // Якщо нема, додай все
    for (const task of tasksSeed) {
      await addDoc(colRef, task);
    }
    console.log("Seeded tasks:", tasksSeed.length);
  } catch (error) {
    console.error("Error seeding tasks:", error);
  }
}