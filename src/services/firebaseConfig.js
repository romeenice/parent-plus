// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_GOOGLE_API_KEY_HERE",
  authDomain: "parents-plus-9eeda.firebaseapp.com",
  projectId: "parents-plus-9eeda",
  storageBucket: "parents-plus-9eeda.firebasestorage.app",
  messagingSenderId: "623215589148",
  appId: "1:623215589148:web:7e4588f931a09793d56cd9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
