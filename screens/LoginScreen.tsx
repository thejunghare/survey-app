import * as React from 'react';
import { SafeAreaView, View, Image } from 'react-native';
import { Button, Text, TextInput, TouchableRipple, Divider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const navigation = useNavigation();
    const [text, setText] = React.useState('');

    return (
        <SafeAreaView className='h-screen bg-white flex-1 justify-around'>
            <View className='h-2/5 flex items-center justify-end'>
                <Image
                    source={require('../assets/digital-neta-logo.png')} className='w-52 h-14'
                />
                <Text className='text-base font-semibold my-1'>Welcome Back!</Text>
                <Text className='text-sm font-medium text-slate-400 my-1'>lorem ipsum dolor sit amet consectetur</Text>
            </View>

            <View className='h-2/5 flex m-5'>
                <TextInput
                    mode="outlined"
                    label="Username"
                    placeholder="Username/Email"
                    right={<TextInput.Icon icon="account" />}
                    className='my-2'
                />

                <TextInput
                    mode="outlined"
                    label="Password"
                    secureTextEntry
                    right={<TextInput.Icon icon="eye" />}
                    className='my-2'
                />

                <TouchableRipple
                    onPress={() => console.log('Pressed')}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <Text className='text-base font-bold text-slate-400 text-center m-5 text-app-blue'>Forgot password?</Text>
                </TouchableRipple>

                <Button
                    mode='contained'
                    buttonColor='#5783B9'
                    icon='arrow-right'
                    onPress={() => navigation.replace('Dashboard')}
                >
                    Login
                </Button>
            </View>

            <View className='h-1/5 flex justify-end'>
                <Divider />

                <TouchableRipple
                    onPress={() => console.log('Pressed')}
                    rippleColor="rgba(0, 0, 0, .32)"
                >
                    <Text className='text-base font-medium text-slate-400 text-center m-5'>Don’t have an account ? <Text className='text-app-blue font-bold'> Sign Up</Text></Text>
                </TouchableRipple>
            </View>


        </SafeAreaView>
    );
}

export default LoginScreen;