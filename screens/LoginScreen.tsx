import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className='flex-1'>
            <Button
                mode='outlined'
                icon='arrow-right'
                onPress={() => navigation.replace('Dashboard')}
            >
                Next
            </Button>
        </SafeAreaView>
    );
}

export default LoginScreen;