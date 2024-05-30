import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Dashboard from '../screens/Dashboard';
import DoorToDoorSurvey from '../screens/DoorToDoorSurvey';
import VoterSearch from '../screens/VoterSearch';

export type AppStackParamList = {
    Dashboard: undefined;
    'DoorToDoorSurvey': { userId: string };
    'Voter Search': undefined;
}

const Stack = createNativeStackNavigator<AppStackParamList>();


export const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerBackTitleVisible: false
            }}
        >
            <Stack.Screen name='Dashboard' component={Dashboard}/>
            <Stack.Screen name='DoorToDoorSurvey' component={DoorToDoorSurvey}/>
            <Stack.Screen name={'Voter Search'} component={VoterSearch}/>
        </Stack.Navigator>
    )
}