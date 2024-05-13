import * as React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className='h-screen flex-1'>
            <View className='h-1/2 m-auto flex items-center justify-around'>
                <Image
                    source={require('../assets/digital-neta-logo.png')}
                    className='w-52 h-14'
                />
                <Button
                    mode='contained'
                    buttonColor='#5783B9'
                    icon='arrow-right'
                    compact={true}
                    onPress={() => navigation.navigate('Login')}
                >
                </Button>
            </View>
        </SafeAreaView>
    );
}

export default WelcomeScreen;