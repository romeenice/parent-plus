// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "./src/services/firebaseConfig";
import { initI18n } from "./src/i18n";
import { useTheme, ThemeProvider } from "./src/theme/ThemeContext";
import { initRevenueCat } from "./src/services/revenueCat";
import Purchases from "react-native-purchases";

import HomeScreen from "./src/screens/HomeScreen";
import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import AddChildScreen from "./src/screens/AddChildScreen";
import AuthScreen from "./src/screens/AuthScreen";
import PaywallScreen from "./src/screens/PaywallScreen";

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
            return <Ionicons name="person-outline" size={size} color={color} />;
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
  const { theme, themeKey } = useTheme();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [checkingData, setCheckingData] = useState(true);
  const [statusBarStyle, setStatusBarStyle] = useState("dark-content");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [revenueCatReady, setRevenueCatReady] = useState(false);

  const refreshSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const isActive = !!customerInfo?.entitlements?.active?.["Parents+ Pro"];
      setHasSubscription(isActive);
    } catch (error) {
      console.error("refreshSubscriptionStatus error:", error);
      setHasSubscription(false);
    }
  };

  useEffect(() => {
    const newStyle = themeKey === "pastel" ? "dark-content" : "light-content";
    setStatusBarStyle(newStyle);
  }, [themeKey]);

  useEffect(() => {
    const initializeI18n = async () => {
      try {
        await initI18n("en");
      } catch (e) {
        console.error("Error initializing i18n:", e);
      }
    };

    initializeI18n();
  }, []);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser || null);

      if (firebaseUser) {
        const { getDoc } = await import("firebase/firestore");
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().language) {
            await initI18n(userSnap.data().language);
          }
        } catch (e) {
          console.error("Error loading language:", e);
        }
      }

      setInitializing(false);
    });

    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!user) {
      setHasSeenOnboarding(false);
      setHasChild(false);
      setHasSubscription(false);
      setCheckingData(false);
      return;
    }

    setCheckingData(true);

    const userRef = doc(db, "users", user.uid);

    const unsubUser = onSnapshot(
      userRef,
      (snap) => {
        const data = snap.data();

        setHasSeenOnboarding(!!data?.hasSeenOnboarding);
        setHasChild(!!data?.currentChildId);
        setCheckingData(false);
      },
      (error) => {
        console.error("User snapshot error:", error);
        setHasSeenOnboarding(false);
        setHasChild(false);
        setCheckingData(false);
      }
    );

    return () => unsubUser();
  }, [user]);

  useEffect(() => {
    const setupRevenueCat = async () => {
      if (!user) {
        setRevenueCatReady(false);
        setHasSubscription(false);
        return;
      }

      const ok = await initRevenueCat(user.uid);
      setRevenueCatReady(ok);
    };

    setupRevenueCat();
  }, [user]);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) return;
      if (!revenueCatReady) return;

      try {
        await refreshSubscriptionStatus();
      } catch (e) {
        console.error("loadSubscription error:", e);
      }
    };

    loadSubscription();
  }, [user, revenueCatReady]);

  useEffect(() => {
    if (!user || !revenueCatReady) return;

    const handleCustomerInfoUpdate = (customerInfo) => {
      const isActive = !!customerInfo?.entitlements?.active?.["Parents+ Pro"];
      setHasSubscription(isActive);
    };

    Purchases.addCustomerInfoUpdateListener(handleCustomerInfoUpdate);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handleCustomerInfoUpdate);
    };
  }, [user, revenueCatReady]);

  if (initializing || checkingData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.BG,
        }}
      >
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={theme.BG}
          translucent={false}
        />
        <ActivityIndicator size="large" color={theme.PRIMARY} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={theme.BG}
        translucent={false}
      />

      <NavigationContainer
        key={`${user ? "auth" : "guest"}-${hasChild ? "has-child" : "no-child"}-${hasSeenOnboarding ? "seen" : "new"}`}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : !hasSeenOnboarding ? (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Paywall" component={PaywallScreen} />
            </>
          ) : !hasChild ? (
            <Stack.Screen name="ManageChild" component={AddChildScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="ManageChild" component={AddChildScreen} />
              <Stack.Screen name="Paywall" component={PaywallScreen} />
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