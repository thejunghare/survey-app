import * as React from 'react';
import { SafeAreaView, View, Image, Keyboard } from 'react-native';
import { Button, Text, TextInput, TouchableRipple, Divider, ActivityIndicator, } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'

const LoginScreen = () => {
    const navigation = useNavigation();
    const [userEmail, setUserEmail] = React.useState('');
    const [userPassword, setUserPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const passwordInputRef = React.createRef();

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.replace('Dashboard');
            }
        });

        return unsubscribe;
    }, []);

    const handleLogin = () => {
        setLoading(true);

        if (!userEmail) {
            alert('Username is required');
            return;
        }

        if (!userPassword) {
            alert('Password is required');
            return;
        }

        auth
            .signInWithEmailAndPassword(userEmail, userPassword)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(`logged in with:`, user.email);
                setLoading(false);
            })
            .catch((error) => {
                alert(error.message);
                setLoading(false);
            });


    };

    return (
        <SafeAreaView className='h-screen bg-white flex-1 justify-around'>
            <View className='h-2/5 flex items-center justify-end'>
                <Image
                    source={require('../assets/digital-neta-logo.png')} className='w-52 h-12'
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

                    onChangeText={(text) => setUserEmail(text)}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    returnKeyType='next'
                    value={userEmail}
                />

                <TextInput
                    mode="outlined"
                    label="Password"
                    secureTextEntry
                    right={<TextInput.Icon icon="eye" />}
                    className='my-2'

                    keyboardType='default'
                    ref={passwordInputRef}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    returnKeyType='next'
                    onChangeText={(text) => setUserPassword(text)}
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
                    // icon='arrow-right'
                    onPress={handleLogin}
                >
                    {loading ? (
                        <ActivityIndicator animating={true} color={"white"} />
                    ) : (
                        "Login"
                    )}
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