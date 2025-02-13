import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Dashboard from "../screens/Dashboard";
import DoorToDoorSurvey from "../screens/DoorToDoorSurvey";
import LockedRoomSurvey from "../screens/LockedRoomSurvey";
import EditSurvey from "../screens/EditSurvey";
import VoterSearch from "../screens/VoterSearch";
import VoterDetails from "../screens/VoterDetails";
import VoterDetailsView from "../screens/VoterDetailsView";
import VoterDetailsEdit from "../screens/VoterDetailsEdit";
import ProfileScreen from "../screens/ProfileScreen";
import Settings from "../screens/Settings";
import { Icon } from "@rneui/themed";
import SearchScreen from "../screens/SearchScreen";
import SelectSearch from "../screens/SelectSearch";
import ViewDetails from "../screens/ViewDetalis";

export type AppStackParamList = {
  Dashboard: undefined;
  "Survey form": { userId: string };
  "Voter Search": { userId: string };
  "Voter Details": { voter: any }; // Ensure the voter parameter is defined here
  "New Dashboard": undefined;
  Profile: undefined;
  Settings: undefined;
  "Edit Survey": undefined;
  "Locked Room": { userId: string };
  "Search Screen": undefined;
  "Select Search Option": undefined;
  Details: { id: any };
};

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

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
      <Stack.Screen name="Voter Details" component={VoterDetails} />
      <Stack.Screen name="Search Screen" component={SearchScreen} />
      <Stack.Screen name="Select Search Option" component={SelectSearch} />
      <Stack.Screen name="Details" component={ViewDetails} />
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
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontWeight: 900,
          fontSize: 11,
          padding: 10,
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          height: 80,
          padding: 15,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} type="feather" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} type="feather" />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings" color={color} size={size} type="feather" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
