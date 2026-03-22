// src/dev/seedContent.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";


const articlesSeed = [
 

]


export async function seedArticlesOnce() {
  const colRef = collection(db, "articles");
  for (const art of articlesSeed) {
    await addDoc(colRef, art);
  }
  console.log("Seeded articles:", articlesSeed.length);
}
