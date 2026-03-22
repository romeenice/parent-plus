// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./src/services/firebaseConfig";
import { initI18n } from "./src/i18n";
import { auth } from "./src/services/firebaseConfig";
import { useTheme } from "./src/theme/ThemeContext";
import { ThemeProvider } from "./src/theme/ThemeContext";

import HomeScreen from "./src/screens/HomeScreen";
import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppStartScreen from "./src/screens/AppStartScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import AddChildScreen from "./src/screens/AddChildScreen";
import AuthScreen from "./src/screens/AuthScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.CARD_BG,
        },
        headerTintColor: theme.TEXT,
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArticleDetails"
        component={ArticleDetailsScreen}
        options={({ route }) => ({
          title: route.params?.articleTitle || "Article",
          headerBackTitle: "",
        })}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.PRIMARY,
        tabBarInactiveTintColor: theme.SECONDARY,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: theme.SECTION_BG,
          borderTopColor: theme.BORDER,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name="home-outline" size={size} color={color} />;
          }
          if (route.name === "Tasks") {
            return (
              <Ionicons
                name="checkmark-done-outline"
                size={size}
                color={color}
              />
            );
          }
          if (route.name === "Profile") {
            return (
              <Ionicons name="person-outline" size={size} color={color} />
            );
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Tasks" component={TasksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { themeKey } = useTheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [i18nReady, setI18nReady] = useState(false);
  const [appLanguage, setAppLanguage] = useState("en");
  const [statusBarStyle, setStatusBarStyle] = useState("dark-content");

  // ✅ Оновлюємо status bar коли змінюється тема
  useEffect(() => {
    const newStyle = themeKey === "pastel" ? "dark-content" : "light-content";
    setStatusBarStyle(newStyle);
  }, [themeKey]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const loadLanguageAndInit = async () => {
      try {
        let lang = "en";

        if (user) {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists() && snap.data().language) {
            lang = snap.data().language;
          }
        }

        await initI18n(lang);
        setAppLanguage(lang);
        setI18nReady(true);
      } catch (e) {
        console.log("Error init i18n", e);
        await initI18n("en");
        setAppLanguage("en");
        setI18nReady(true);
      }
    };

    loadLanguageAndInit();
  }, [user]);

  if (initializing || !i18nReady) {
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="AppStart" component={AppStartScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="AddChild" component={AddChildScreen} />
              <Stack.Screen name="ArticleDetails" component={ArticleDetailsScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Auth" component={AuthScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
