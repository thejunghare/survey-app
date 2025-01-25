import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { supabase } from "../lib/supabase";

const Dashboard = ({ navigation }) => {
  // const navigation = useNavigation();

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [fetchUserData, fetchSurveyCount, session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const getInitials = () => {
    let initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1">
        {/* avatar with employee name and id */}
        <View className="p-3 flex flex-row items-center justify-start bg-blue-700 h-30">
          <Avatar
            size={50}
            rounded
            title={getInitials(username)}
            containerStyle={{
              backgroundColor: "#fff",
            }}
            titleStyle={{
              color: "#000",
            }}
          />
          <View className="mx-5">
            <Text className="text-xl font-medium text-white">
              {/* {userData.name} */}
            </Text>
            <Text className="text-xs font-normal text-white">
              {/* ID: {userData.id} */}
            </Text>
          </View>
        </View>

        {/* client image */}
        <View className="items-center justify-around bg-gray-50 m-3 bg-white border border-slate-200 rounded-xl">
          <Image
            source={{ uri: clientImageUri }}
            style={{ height: 250 }}
            className="w-full"
          />

          <Text className="p-2 font-semibold text-base">{clientId}</Text>
        </View>

        {/* daily counter */}
        <Text className="text-xs font-bold px-5">My Daily Count</Text>
        <View className="bg-white border border-slate-200 m-4 rounded-xl flex flex-row items-center justify-around p-3">
          <View>
            <Text className="bg-green-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              0
            </Text>
            <Text className="font-bold py-2">Survey</Text>
          </View>

          <View>
            <Text className="bg-blue-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              0
            </Text>
            <Text className="font-bold py-2">Locked</Text>
          </View>

          <View>
            <Text className="bg-red-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              0
            </Text>
            <Text className="font-bold py-2">Denied</Text>
          </View>
        </View>

        {/* form navigation container */}
        <Text className="text-xs font-bold px-5 ">Survey Options</Text>
        <View className="flex items-start justify-center bg-white border border-slate-200 m-4 rounded-xl">
          <TouchableOpacity
            className={"border-b border-slate-200 "}
            /*   onPress={() => {
              navigation.navigate("Survey form", { userId: userData.id });
            }} */
          >
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly ">
              <Icon name="edit" type="feather" color="#517fa4" />
              <Text className="text-base font-semibold w-10/12">
                Survey Form
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={"border-b border-slate-200 "}
            /*  onPress={() => {
              navigation.navigate("Locked Room", { userId: userData.id });
            }} */
          >
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              <Icon name="lock" type="feather" color="#517fa4" />
              <Text className="text-base font-semibold w-10/12">
                Locked Room
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className={"border-b border-slate-200 "}>
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              {/* <AntDesign name="edit" size={24} color="blue" className="w-1/4" /> */}
              <Icon name="feather" type="feather" color="#517fa4" />
              <Text className="text-base font-semibold w-10/12">
                Edit forms
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              {/* <AntDesign name="edit" size={24} color="blue" className="w-1/4" /> */}
              <Icon name="search" type="feather" color="#517fa4" />
              <Text className="text-base font-semibold w-10/12">
                Search Voter
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default Dashboard;
