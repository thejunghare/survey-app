import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import DoorToDoorSurvey from '../screens/DoorToDoorSurvey';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../appwrite/UserContext';

const Stack = createNativeStackNavigator();
export function Router() {
    const user = useUser();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user.current == null ? (
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{ title: 'Login' }}
                    />
                ) : (
                    <Stack.Screen
                        name="Home"
                        component={Dashboard}
                        options={{ title: 'Home' }}
                    />

                )}
                <Stack.Screen
                    name="D2D_Survey"
                    component={DoorToDoorSurvey}
                    options={{ title: 'Door To Door Survey' }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
