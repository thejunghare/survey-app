import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../screens/Login'

export type AuthStackParamList = {
    Login: undefined;
}

const Stack = createNativeStackNavigator<AuthStackParamList>();


export const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'left',
                headerBackTitleVisible: false,

            }}>
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}
