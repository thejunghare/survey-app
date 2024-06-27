import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";
import DoorToDoorSurvey from "../screens/DoorToDoorSurvey";
import LockedRoomSurvey from "../screens/LockedRoomSurvey";
import EditSurvey from "../screens/EditSurvey";
import VoterSearch from "../screens/VoterSearch";
import ProfileScreen from "../screens/ProfileScreen";
import Settings from "../screens/Settings";
import Icon from "react-native-vector-icons/Ionicons"; // or any other icon set you prefer

export type AppStackParamList = {
  Dashboard: undefined;
  "Survey form": { userId: string };
  "Voter Search": undefined;
  "New Dashboard": undefined;
  Profile: undefined;
  Settings: undefined;
  "Edit Survey": undefined;
  "Locked Room": undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Survey form" component={DoorToDoorSurvey} />
      <Stack.Screen name="Voter Search" component={VoterSearch} />
      <Stack.Screen name="Locked Room" component={LockedRoomSurvey} />
      <Stack.Screen name="Edit Survey" component={EditSurvey} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
