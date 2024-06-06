import React, { useContext, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { AppwriteContext } from '../appwrite/UserContext';
import { Button, Icon } from '@rneui/themed';

import { toast } from "../appwrite/toast";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthStack';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>


const Login = ({ navigation }: LoginScreenProps) => {
    const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);

    const [error, setError] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



    const handleLogin = () => {
        if (email.length < 1 || password.length < 1) {
            setError('All fields are required')
        } else {
            const user = {
                email,
                password
            }
            appwrite
                .login(user)
                .then((response) => {
                    if (response) {
                        setIsLoggedIn(true);
                        toast('Login sucess')
                    }
                })
                .catch(e => {
                    console.log(e);
                    setEmail('Incorrect email or password')

                })
        }
    }
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/dem-logo.png')}
                style={{
                    width: 250,
                    height: 250,
                    marginRight: 'auto',
                    marginLeft: 'auto',
                }}
            />
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType={'email-address'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
//                    keyboardType='visible-password'
                />
                <Button
                    onPress={handleLogin}
                    radius={"md"}
                    type="solid"
                    iconPosition='left'
                    containerStyle={{
                        width: 100,
                        marginVertical: 10,
                    }}
                >
                    Login
                    <Icon
                        name="login"
                        color="white"
                        containerStyle={{
                            marginLeft: 5,
                        }}
                    />
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        backgroundColor: "#fff",
    },
    input: {
        height: 55,
        borderRadius: 8,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f2f2f2'
    },
});


export default Login
