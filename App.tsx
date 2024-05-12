import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from './screens/WelcomScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Welcome'
          component={WelcomeScreen}
        />

        <Stack.Screen
          name='Login'
          component={LoginScreen}
        />

        <Stack.Screen
          name='Dashboard'
          component={DashboardScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
