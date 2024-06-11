import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { AppwriteContext } from "../appwrite/UserContext";
import { Icon } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";

import { toast } from "../appwrite/toast";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../routes/AuthStack";

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const Login = ({ navigation }: LoginScreenProps) => {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);

  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const user = { email, password };

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
        });
    }
  };

  return (
    <SafeAreaView className="bg-white h-screen flex-1 justify-between">
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
        <TextInput
          placeholder="Registered email address"
          value={email}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          className={
            "p-3 bg-white border border-slate-300 rounded font-semibold text-base shadwo-sm tracking-wide leading-6"
          }
        />
        <TextInput
          placeholder="Given password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className={
            "my-2.5 p-3 bg-white border border-slate-300 rounded font-semibold text-base shadwo-sm tracking-wide leading-6"
          }
        />
        <Pressable
          onPress={handleLogin}
          className="bg-black p-3 rounded justify-center items-center"
        >
          <Text
            className={"text-white text-base font-bold tracking-wide leading-6"}
          >
            Submit
          </Text>
        </Pressable>
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

      <View
        className={
          "border h-11 flex flex-row justify-between items-center px-4 bg-white border-t border-slate-300"
        }
      >
        <Text className="text-sm font-semibold tracking-wide leading-6">
          About
        </Text>
        <Text className="text-sm font-semibold underline decoration-dotted tracking-wide leading-6">
          v0.8.0
        </Text>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Login;
