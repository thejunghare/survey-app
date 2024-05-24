import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import { useUser } from '../appwrite/UserContext';
import { Button, Icon } from '@rneui/themed';

export default function Login() {
    const user = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        user.login(email, password)
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/cn-logo.png')}
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
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
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
