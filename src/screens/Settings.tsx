import React, {useContext, useState, useEffect, useCallback} from "react";
import {View, TouchableOpacity, Text, Switch, ScrollView} from "react-native";
import {AppwriteContext} from "../appwrite/UserContext";
import {Icon} from "@rneui/themed";
import {toast} from "../appwrite/toast";
import {useSurvey} from "../appwrite/SurveyContext";
import {RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "../routes/AppStack";
import * as Location from 'expo-location';

type SettingsRouteProp = RouteProp<
    AppStackParamList,
    "Settings"
>;

type UserObj = {
    name: String;
    email: String;
    id: String;
};

interface AttendanceData {
    employeeId: String;
    dateTime: string;
    location: string;
    type: string;
}


const Settings = ({route}: { route: SettingsRouteProp }) => {
    const {appwrite, setIsLoggedIn} = useContext(AppwriteContext);
    const [userData, setUserData] = useState<UserObj>();
    const [loading, setLoading] = useState<boolean>(true);
    const {punchIn, punchOut} = useSurvey();
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isLightModeEnabled, setIsLightModeEnabled] = useState(false);
    const toggleLightModeSwitch = () => setIsLightModeEnabled(previousState => !previousState);


    const handleLogout = async () => {
        try {
            await appwrite.logout();
            setIsLoggedIn(false);
            toast("Logout");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handlePunchIn = async () => {
        if (!location) console.error('Location not available');

        const formatDate = (date: Date) => {
            const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            };
            let dateString = date.toLocaleString("en-US", options);
            dateString = dateString.replace(",", "");
            let [datePart, timePart] = dateString.split(" ");
            let [month, day, year] = datePart.split("/");
            dateString = `${year}-${month}-${day}:${timePart}`;
            return dateString;
        };
        const date = formatDate(new Date());
        const dateTime = formatDate(new Date());
        const punchInlocation = `${location.coords.latitude},${location.coords.longitude}`;
        const user = await fetchUserData();

        if (!user || !user.id) {
            console.error("No user data found, skipping employee and client fetch.");
            return;
        } else {
            console.log(user.id);
        }

        const employeeId = user.id;

        const punchInData: AttendanceData = {
            employeeId: employeeId,
            dateTime: dateTime,
            location: punchInlocation,
            type: 'In'
        };


        try {
            await punchIn(punchInData);
            console.log('Punched in successfully!');
        } catch (error) {
            console.error('Unable to punch in:', error);
        }
    };

    const handlePunchOut = async () => {
        if (!location) console.error('Location not available');

        const formatDate = (date: Date) => {
            const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            };
            let dateString = date.toLocaleString("en-US", options);
            dateString = dateString.replace(",", "");
            let [datePart, timePart] = dateString.split(" ");
            let [month, day, year] = datePart.split("/");
            dateString = `${year}-${month}-${day}:${timePart}`;
            return dateString;
        };
        const date = formatDate(new Date());
        const dateTime = formatDate(new Date());
        const punchoutlocation = `${location.coords.latitude},${location.coords.longitude}`;
        const user = await fetchUserData();

        if (!user || !user.id) {
            console.error("No user data found, skipping employee and client fetch.");
            return;
        } else {
            console.log(user.id);
        }

        const employeeId = user.id;

        const punchOutData: AttendanceData = {
            employeeId: employeeId,
            dateTime: dateTime,
            location: punchoutlocation,
            type: 'out'
        };

        try {
            await punchOut(punchOutData);
            console.log('Punched out successfully!');
        } catch (error) {
            console.error('Unable to punch in:', error);
        }
    }

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

    const toggleSwitch = async () => {
        if (!isEnabled) {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setIsEnabled(true);
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } else {
                setIsEnabled(false);
                console.error('Permission to access location was denied');
            }
        } else {
            setIsEnabled(false);
        }
    };


    useEffect(() => {
        fetchUserData();

        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setIsEnabled(true);
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            } else {
                setIsEnabled(false);
                console.error('Permission to access location was denied');
            }
        })();
    }, []);


    return (
        <ScrollView className="flex-1 w-full bg-gray-50">
            {/*attendance*/}
            <Text className="text-xs font-bold px-5 mt-5 ">Attendance</Text>
            <View className="bg-white border border-slate-200 m-5 rounded-xl">
                <TouchableOpacity
                    className="border-b border-slate-200 flex flex-row items-center px-3"
                    onPress={handlePunchIn}
                >
                    <Icon name="log-in" type='feather'/>
                    <Text className="p-5 font-semibold">Punch In</Text>
                </TouchableOpacity>
                <View className="border-slate-400 flex flex-row items-center">
                    <TouchableOpacity
                        className="border-b border-slate-200 flex flex-row items-center px-3"
                        onPress={handlePunchOut}
                    >
                        <Icon name="log-out" type='feather'/>
                        <Text className="p-5 font-semibold">Punch Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/*app permission*/}
            <Text className="text-xs font-bold px-5 mt-5 ">App permissions</Text>
            <View className="bg-white border border-slate-200 m-5 rounded-xl">
                <TouchableOpacity
                    className="border-slate-400 flex flex-row items-center justify-between px-3"

                >
                    <View className={'flex flex-row items-center'}>
                        <Icon name="map-pin" type='feather'/>
                        <Text className="p-5 font-semibold">Location</Text>
                    </View>

                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabled ? '#1D4ED8' : '#f4f3f4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </TouchableOpacity>
            </View>

            {/*app settings*/}
            <Text className="text-xs font-bold px-5 mt-5 ">App settings</Text>
            <View className="bg-white border border-slate-200 m-5 rounded-xl">
                <TouchableOpacity
                    className="border-b border-slate-200  flex flex-row items-center px-3"
                    onPress={handleLogout}
                >
                    <Icon name="log-out" type='feather'/>
                    <Text className="p-5 font-semibold">Logout</Text>
                </TouchableOpacity>
                <View className="border-b border-slate-200 flex flex-row items-center justify-between px-3">
                    <View className={'flex flex-row items-center'}>
                        <Icon name="moon" type='feather'/>
                        <Text className="p-5 font-semibold">Dark Mode</Text>
                    </View>

                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabled ? '#1D4ED8' : '#f4f3f4'}

                        disabled={true}
                    />
                </View>
                <View className="border-slate-400 flex flex-row items-center justify-between px-3">
                    <View className={'flex flex-row items-center'}>
                        <Icon name="sun" type='feather'/>
                        <Text className="p-5 font-semibold">Light Mode</Text>
                    </View>

                    <View>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isLightModeEnabled ? '#1D4ED8' : '#f4f3f4'}
                            onValueChange={toggleLightModeSwitch}
                            value={isLightModeEnabled}
                            disabled={true}
                        />
                    </View>
                </View>
            </View>

            {/*about app*/}
            <Text className="text-xs font-bold px-5 mt-5 ">About app</Text>
            <View className="bg-white border border-slate-200 m-5 rounded-xl">
                <TouchableOpacity
                    className="border-b border-slate-200 flex flex-row items-center px-3"
                    onPress={handlePunchIn}
                >
                    <Icon name="info" type='feather'/>
                    <Text className="p-5 font-semibold">v.2.0.0</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Settings;