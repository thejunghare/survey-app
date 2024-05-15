import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SurveyOptionScreen from './screens/SurveyOptionScreen';
import OpinionPollOptionScreen from './screens/OpinionPollOptionScreen';
import CustomDrawer from './CustomDrawer';
import ShopSurveyScreen from './screens/ShopSurveyScreen';
import PeopleSurveyScreen from './screens/PeopleSurveyScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Dashboard'
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          drawerActiveTintColor: '#000000',
          drawerActiveBackgroundColor: '#f2f2f2',
          drawerIcon: ({ focused, size }) => (<Icon size={size} source={'home-variant-outline'} color={focused ? '#5783B9' : '#000000'} />)
        }}
      />
      <Drawer.Screen
        name="Survey"
        component={SurveyOptionScreen}
        options={{
          title: 'Survey',
          drawerActiveTintColor: '#000000',
          drawerActiveBackgroundColor: '#f2f2f2',
          drawerIcon: ({ focused, size }) => (<Icon size={size} source={'notebook-edit-outline'} color={focused ? '#5783B9' : '#000000'} />)
        }}
      />
      <Drawer.Screen
        name="Opinion"
        component={OpinionPollOptionScreen}
        options={{
          title: 'Opinion poll',
          drawerActiveTintColor: '#000000',
          drawerActiveBackgroundColor: '#f2f2f2',
          drawerIcon: ({ focused, size }) => (<Icon size={size} source={'chart-donut'} color={focused ? '#5783B9' : '#000000'} />)
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShopSurveyScreen"
          component={ShopSurveyScreen}
          options={{ title: 'Shop Survey' }}
        />
        <Stack.Screen
          name="PeopleSurveyScreen"
          component={PeopleSurveyScreen}
          options={{ title: 'People Survey' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
