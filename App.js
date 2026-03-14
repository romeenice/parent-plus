import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./src/screens/HomeScreen";
import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AppStartScreen from "./src/screens/AppStartScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import AddChildScreen from "./src/screens/AddChildScreen";


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
  return (
    <SafeAreaProvider>  
   <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AppStart" component={AppStartScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="AddChild" component={AddChildScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
