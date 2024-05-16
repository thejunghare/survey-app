import * as React from 'react';
import { View, Image, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className='bg-white h-screen flex-1'>
            <View className='h-1/2 m-auto flex items-center justify-around'>
                <Image
                    source={require('../assets/digital-neta-logo.png')}
                    className='w-52 h-12'
                />
                <Button
                    title='Get Started'
                    color={'#5783B9'}
                    onPress={() => navigation.replace('Login')}
                    
                />
            </View>
        </SafeAreaView>
    );
}

export default WelcomeScreen;