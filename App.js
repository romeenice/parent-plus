import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import ArticleDetailsScreen from "./src/screens/ArticleDetailsScreen";
import TasksScreen from "./src/screens/TasksScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#111",
          tabBarInactiveTintColor: "#999",
          tabBarLabelStyle: { fontSize: 12 },
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Home") {
              return (
                <Ionicons name="home-outline" size={size} color={color} />
              );
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
    </NavigationContainer>
  );
}
