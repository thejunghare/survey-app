import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { AppwriteContext } from "../appwrite/UserContext";
import { Icon } from "@rneui/themed";
import { toast } from "../appwrite/toast";

const Settings = () => {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const handleLogout = async () => {
    try {
      await appwrite.logout();
      setIsLoggedIn(false);
      toast("Logout");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View className="flex-1 w-full bg-gray-50">
      <Text className="text-xs font-bold px-5 mt-5 ">App settings</Text>
      <View className="bg-white border border-slate-200 m-5 rounded-xl">
        <TouchableOpacity className="border-slate-400 flex flex-row items-center px-3" onPress={handleLogout}>
          <Icon name="logout"  type='antdesign' />
          <Text className="p-5 font-semibold">Logout</Text>
        </TouchableOpacity>
        <View className="border-slate-400 flex flex-row items-center px-3">
          <Icon name="info"  type='antdesign' />
          <Text className="p-5 font-semibold">1.5.0</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;