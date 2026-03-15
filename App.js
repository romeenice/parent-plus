// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./src/services/firebaseConfig";
import { initI18n } from "./src/i18n";


import HomeScreen from "./src/screens/HomeScreen";
import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppStartScreen from "./src/screens/AppStartScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import AddChildScreen from "./src/screens/AddChildScreen";
import AuthScreen from "./src/screens/AuthScreen";
import { auth } from "./src/services/firebaseConfig";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArticleDetails"
        component={ArticleDetailsScreen}
        options={{ title: "Article" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: { fontSize: 12 },
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

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const [i18nReady, setI18nReady] = useState(false);
  const [appLanguage, setAppLanguage] = useState("en");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      // console.log("AUTH STATE CHANGED >>>", firebaseUser?.uid);
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
  return null; // тут можна буде зробити SplashScreen
}


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              {/* залогінений користувач */}
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="AppStart" component={AppStartScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="AddChild" component={AddChildScreen} />
              <Stack.Screen name="ArticleDetails" component={ArticleDetailsScreen} />
            </>
          ) : (
            <>
              {/* не залогінений */}
              <Stack.Screen name="Auth" component={AuthScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
