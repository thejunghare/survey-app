import React, {useContext, useState} from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Pressable,
    SafeAreaView,
} from "react-native";
import {AppwriteContext} from "../appwrite/UserContext";

import {StatusBar} from "expo-status-bar";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Input, Icon, Button} from '@rneui/themed';
import {toast} from "../appwrite/toast";

import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "../routes/AuthStack";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const Login = ({navigation}: LoginScreenProps) => {
    const {appwrite, setIsLoggedIn} = useContext(AppwriteContext);

    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);
    const toggleSecureText = () => {
        setSecureText(!secureText);
    };

    const handleLogin = () => {
        if (!email || !password) {
            setError("All fields are required");

            if (!email) {
                alert("Email address is required");
            }

            if (!password) {
                alert("Password is required");
            }
        } else {
            setLoading(true);
            const user = {email, password};

            appwrite
                .login(user)
                .then((response) => {
                    if (response) {
                        setIsLoggedIn(true);
                        toast("Login success");
                    }
                })
                .catch((e) => {
                    console.error(e);
                    setError("Incorrect email or password");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    return (
        <KeyboardAwareScrollView>
            <SafeAreaView className="bg-white h-screen flex-1">
                <View className="h-4/5 m-5 justify-center">
                    <Image
                        source={require("../../assets/dem-logo-new.png")}
                        style={{
                            width: 200,
                            height: 150,
                            marginRight: "auto",
                            marginLeft: "auto",
                        }}
                    />
                    <Input
                        leftIcon={{type: 'feather', name: 'user'}}
                        placeholder="User email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType={"email-address"}
                    />
                    <Input
                        leftIcon={<Icon type="feather" name={secureText ? 'eye-off' : 'eye'}
                                        onPress={toggleSecureText}/>}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureText}
                    />
                    <Button
                        onPress={handleLogin}
                        title={loading ? 'Logging In...' : 'Log In'}
                        loading={loading}
                        size="md"
                        radius={"sm"}
                    />
                    <Pressable
                        onPress={handleLogin}
                        className="mt-5 p-3 rounded justify-center items-center"
                    >
                        <Text
                            className={
                                "text-black underline text-sm font-bold tracking-wide leading-6"
                            }
                        >
                            Need help?
                        </Text>
                    </Pressable>
                </View>

                <StatusBar style="dark"/>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    );
};

export default Login;