// src/theme/ThemeContext.js
import React, { createContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { getTheme, THEMES } from "../theme/colors";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState("pastel");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.themeKey && THEMES[data.themeKey]) {
            setThemeKey(data.themeKey);
          }
        }
      } catch (e) {
        console.log("Error loading theme", e);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [userId]);

  const changeTheme = async (newThemeKey) => {
    if (!THEMES[newThemeKey]) return;
    
    setThemeKey(newThemeKey);
    
    try {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { themeKey: newThemeKey }, { merge: true });
    } catch (e) {
      console.log("Error saving theme", e);
    }
  };

  const theme = getTheme(themeKey);

  return (
    <ThemeContext.Provider value={{ theme, themeKey, changeTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
