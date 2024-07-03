import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Avatar, Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { AppwriteContext } from "../appwrite/UserContext";
import { useNavigation } from "@react-navigation/native";
import { toast } from "../appwrite/toast";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../routes/AppStack";
import { useSurvey } from "../appwrite/SurveyContext";
import { StatusBar } from "expo-status-bar";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  "Dashboard"
>;

type UserObj = {
  name: String;
  email: String;
  id: String;
};

const Dashboard = () => {
  const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserObj>();
  const { countDocument } = useSurvey();
  const { roomLockedDocumentCount } = useSurvey();
  const { surveyDeniedDocumentCount } = useSurvey();
  const [surveyCount, setSurveyCount] = useState<number>(0);
  const [LockedRoomSurveyCount, setLockedRoomSurveyCount] = useState<number>(0);
  const [deniedSurveyCount, setDeniedSurveyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [employee, setEmployee] = useState(null);
  const [clientImageUri, setClientImageUri] = useState<string>('');
  const [clientId, setClientId] = useState<string>('')

  const handleLogout = async () => {
    try {
      await appwrite.logout();
      setIsLoggedIn(false);
      toast("Logout");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await appwrite.getCurrentUser();
      if (response) {
        const user: UserObj = {
          name: response.name,
          email: response.email,
          id: response.$id,
        };
        setUserData(user);
        return user;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  }, [appwrite]);

  const fetchLockefRoomSurveyCount = useCallback(
    async (userId: string) => {
      setLoading(true);
      setRefreshing(true);

      try {
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const count = await roomLockedDocumentCount(userId, true, currentDate);
        setLockedRoomSurveyCount(count);
      } catch (error) {
        console.error("Error fetching survey count:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [roomLockedDocumentCount]
  );

  const fetchDeniedSurveyCount = useCallback(
    async (userId: string) => {
      setLoading(true);
      setRefreshing(true);

      try {
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const count = await surveyDeniedDocumentCount(
          userId,
          true,
          currentDate
        );
        setDeniedSurveyCount(count);
      } catch (error) {
        console.error("Error fetching survey count:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [surveyDeniedDocumentCount]
  );

  const fetchSurveyCount = useCallback(
    async (userId: string) => {
      setLoading(true);
      setRefreshing(true);

      try {
        const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const count = await countDocument(userId, currentDate);

        setSurveyCount(count);
      } catch (error) {
        console.error("Error fetching survey count:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [countDocument]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (userData?.id) {
      fetchSurveyCount(userData.id);
      fetchLockefRoomSurveyCount(userData.id); // Call the function here
      fetchDeniedSurveyCount(userData.id); // Call the function here
    } else {
      fetchUserData().then((user) => {
        if (user?.id) {
          fetchSurveyCount(user.id);
          fetchLockefRoomSurveyCount(user.id); // And here
          fetchDeniedSurveyCount(user.id); // And here
        }
      });
    }
  }, [
    fetchUserData,
    fetchSurveyCount,
    fetchLockefRoomSurveyCount,
    fetchDeniedSurveyCount,
    userData,
  ]);

  useEffect(() => {
    fetchUserData().then((user) => {
      if (user?.id) {
        fetchSurveyCount(user.id);
        fetchLockefRoomSurveyCount(user.id);
        fetchDeniedSurveyCount(user.id);
      }
    });

    const fetchEmployeeAndClient = async () => {
      const user = await fetchUserData();

      if (!user || !user.id) {
        console.error("No user data found, skipping employee and client fetch.");
        return;
      }

      const employeeResponse = await databases.listDocuments(
        "66502c6e0015d7be8526",
        "666fe230001152bad565",
        [Query.equal("employeeId", [user.id])]
      );
      console.log(employeeResponse);

      const clientData = employeeResponse.documents[0].client;
      //console.log(clientData);

      setEmployee(clientData);

      if (clientData) {
        console.info("Employee working for:", clientData)
        const imgUrl = clientData.imgurl
        const clientName = clientData.client_name

        //console.log('client image uri: ', imgUrl)
        //console.log('client id: ', clientId)
        setClientImageUri(imgUrl)
        setClientId(clientName)
      }
      else console.error("not found");
    };

    fetchEmployeeAndClient();
  }, [fetchUserData, fetchSurveyCount]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const getInitials = (name: string) => {
    let initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  const fairSurveyCount = surveyCount - LockedRoomSurveyCount - deniedSurveyCount;
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
            title={userData ? getInitials(userData.name) : ""}
            containerStyle={{
              backgroundColor: "#fff",
            }}
            titleStyle={{
              color: "#000",
            }}
          />
          <View className="mx-5">
            <Text className="text-xl font-medium text-white">
              {userData.name}
            </Text>
            <Text className="text-xs font-normal text-white">
              ID: {userData.id}
            </Text>
          </View>
        </View>

        {/* client image */}
        <View className="rounded-md items-center justify-around bg-gray-50 m-3">
          <Image
            source={{ uri: clientImageUri }}
            style={{ height: 250 }}
            className="w-full"
          />

          <Text className="p-2 font-semibold text-base">
            {clientId}
          </Text>
        </View>

        {/* daily counter */}
        <View className="bg-gray-50 m-3 rounded-md flex flex-row items-center justify-around p-3">
          <View>
            <Text className="bg-green-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              {fairSurveyCount}
            </Text>
            <Text className="font-bold py-2">Survey</Text>
          </View>

          <View>
            <Text className="bg-blue-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              {LockedRoomSurveyCount}
            </Text>
            <Text className="font-bold py-2">Locked</Text>
          </View>

          <View>
            <Text className="bg-red-500 text-center rounded-full p-2 font-bold text-2xl text-white">
              {deniedSurveyCount}
            </Text>
            <Text className="font-bold py-2">Denied</Text>
          </View>
        </View>

        {/* form navigation container */}
        <View className="bg-gray-50 m-3 rounded-md flex items-start justify-center">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Survey form", { userId: userData.id });
            }}
          >
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              <AntDesign name="form" size={24} color="blue" className="w-1/4" />
              <Text className="text-base font-semibold w-10/12">
                Survey Form
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Locked Room");
            }}
          >
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              <AntDesign name="lock" size={24} color="blue" className="w-1/4" />
              <Text className="text-base font-semibold w-10/12">
                Locked Survey Form
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Edit Survey");
            }}
          >
            <View className="h-10 m-2 w-full flex flex-row items-center justify-evenly">
              <AntDesign name="edit" size={24} color="blue" className="w-1/4" />
              <Text className="text-base font-semibold w-10/12">
                Edit Survey Form
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
