import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WelcomeScreen from './screens/WelcomScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SurveyOptionScreen from './screens/SurveyOptionScreen';
import OpinionPollOptionScreen from './screens/OpinionPollOptionScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => {
  return (
    <Drawer.Navigator initialRouteName='Dashboard'>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Survey" component={SurveyOptionScreen} />
      <Drawer.Screen name="Opinion" component={OpinionPollOptionScreen} />
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
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
