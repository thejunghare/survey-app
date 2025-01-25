import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Alert,
} from "react-native";
import { supabase } from "../lib/supabase";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Input, Icon, Button } from "@rneui/themed";

const Login = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [secureText, setSecureText] = useState(true);
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  const handleLogin = async () => {
    setLoading(true);

    const { error, session } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error);
      setLoading(false);
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
            leftIcon={{ type: "feather", name: "user" }}
            placeholder="User email"
            value={email}
            onChangeText={setEmail}
            keyboardType={"email-address"}
          />
          <Input
            leftIcon={
              <Icon
                type="feather"
                name={secureText ? "eye-off" : "eye"}
                onPress={toggleSecureText}
              />
            }
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
          />
          <Button
            onPress={handleLogin}
            title={loading ? "Logging In..." : "Log In"}
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

        <StatusBar style="dark" />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default Login;
