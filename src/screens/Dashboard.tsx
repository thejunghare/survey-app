import React, {useContext, useState, useEffect, useCallback} from 'react'
import {SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, ScrollView, RefreshControl} from 'react-native';
import {AppwriteContext} from '../appwrite/UserContext';
import {Icon, Avatar} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {toast} from "../appwrite/toast";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../routes/AppStack';
import {useSurvey} from '../appwrite/SurveyContext';

type DashboardScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

type UserObj = {
    name: String;
    email: String;
    id: String;
}

const Dashboard: React.FC = () => {
    const {appwrite, setIsLoggedIn} = useContext(AppwriteContext)
    const navigation = useNavigation();
    const [userData, setUserData] = useState<UserObj>()
    const {countDocument} = useSurvey();
    const [surveyCount, setSurveyCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const handleLogout = async () => {
        try {
            await appwrite.logout();
            setIsLoggedIn(false);
            toast('Logout');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const fetchUserData = useCallback(async () => {
        try {
            const response = await appwrite.getCurrentUser();
            if (response) {
                const user: UserObj = {
                    name: response.name,
                    email: response.email,
                    id: response.$id
                };
                setUserData(user);
                return user;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        setLoading(false);
    }, [appwrite]);

    const fetchSurveyCount = useCallback(async (userId: string) => {
        try {
            const count = await countDocument(userId);
            setSurveyCount(count);
        } catch (error) {
            console.error('Error fetching survey count:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [countDocument]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (userData?.id) {
            fetchSurveyCount(userData.id);
        } else {
            fetchUserData().then((user) => {
                if (user?.id) {
                    fetchSurveyCount(user.id);
                }
            });
        }
    }, [fetchUserData, fetchSurveyCount, userData]);

    useEffect(() => {
        fetchUserData().then((user) => {
            if (user?.id) {
                fetchSurveyCount(user.id);
            }
        });
    }, [fetchUserData, fetchSurveyCount]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
            <SafeAreaView className='bg-white'>
                <View className='h-screen justify-evenly'>
                    <View className='h-2/5 justify-evenly items-center bg-slate-200'>
                        <Avatar
                            size={'xlarge'}
                            rounded
                            title="PJ"
                            containerStyle={{backgroundColor: "#d97706"}}
                        />

                        <View className='flex flex-row items-center'>
                            {userData && (
                                <Text className='bg-white p-2 font-semibold text-base'>
                                    {userData.id}
                                </Text>
                            )}
                            <Icon
                                onPress={handleLogout}
                                name="logout"
                                type='material-community'
                                color={'white'}
                                containerStyle={{
                                    backgroundColor: "#9700b9",
                                    padding: 8,
                                }}
                            />
                        </View>
                    </View>

                    <View className={'h-1/6 items-center justify-center'}>
                        <Text
                            className={'bg-app-white m-3 rounded-xl p-3 text-center font-semibold text-base'}>Statistics</Text>
                    </View>

                    <View className=' h-2/5 justify-start'>
                        <ScrollView>
                            <View className='w-full flex flex-row items-start justify-evenly'>
                                <View
                                    className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                                    <TouchableOpacity>
                                        <View className="items-center">
                                            <Icon name='store-outline' type='material-community' size={35}/>
                                        </View>
                                        <View className='mt-2 flex items-center'>
                                            <Text className='font-bold text-lg text-center'>
                                                0
                                            </Text>
                                            <Text className="font-semibold text-base text-center">Shop</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>


                                <View
                                    className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('Survey form', {userId: userData.id})
                                    }}>
                                        <View className='items-center'>
                                            <Icon name='book-outline' type='material-community' size={35}/>
                                        </View>
                                        <View className='mt-2 flex items-center'>
                                            <Text className='font-bold text-lg text-center'>
                                                {surveyCount}
                                            </Text>
                                            <Text className="font-semibold text-base text-center">Survey</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className='mt-3 w-full flex flex-row items-start justify-evenly'>
                                <View
                                    className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                                    <TouchableOpacity onPress={() => navigation.navigate('Voter Search')}>
                                        <View className="items-center">
                                            <Icon name='account-search-outline' type='material-community' size={35}/>
                                        </View>
                                        <View className='mt-2 flex items-center'>
                                            <Text className='font-bold text-lg text-center'>
                                                0
                                            </Text>
                                            <Text className="font-semibold text-base text-center">Voter Search</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View
                                    className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                                    <TouchableOpacity
                                    >
                                        <View className='items-center'>
                                            <Icon name='call-made' type='material-community' size={35}/>
                                        </View>
                                        <View className='mt-2 flex items-center'>
                                            <Text className='font-bold text-lg text-center'>
                                                0
                                            </Text>
                                            <Text className="font-semibold text-base text-center">Call</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

export default Dashboard;
