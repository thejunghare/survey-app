import React, {useContext, useState, useEffect, useCallback} from 'react'
import {
    SafeAreaView,
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Dimensions,
    Image
} from 'react-native';
import {AppwriteContext} from '../appwrite/UserContext';
import {Icon, Avatar} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {toast} from "../appwrite/toast";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../routes/AppStack';
import {useSurvey} from '../appwrite/SurveyContext';
import { StatusBar } from 'expo-status-bar';

type DashboardScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

type UserObj = {
    name: String;
    email: String;
    id: String;
}
const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

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
            <SafeAreaView className='bg-white h-screen justify-evenly'>
                <ScrollView horizontal={true} className={'h-2/4 content-evenly'}>
                    <View className='border-r items-center justify-around bg-slate-200'
                          style={{width: screenWidth}}>
                        <Image source={require('../../assets/mla-1.png')} style={{width: screenWidth, height: 298}}/>

                        <View className='flex flex-row items-center'>
                            <Text className=' p-2 rounded font-semibold text-base'>
                                विश्वनाथ भोईर कल्याण पश्चिम आमदार
                            </Text>
                        </View>

                    </View>
                    <View className='items-center justify-around bg-slate-200 '
                          style={{width: screenWidth}}>
                        <Avatar
                            size={'xlarge'}
                            rounded
                            title="PJ"
                            containerStyle={{backgroundColor: "#d97706"}}
                        />

                        <View className='flex flex-row items-center'>
                            {userData && (
                                <Text className='bg-white p-2 font-semibold text-base'>
                                    {userData.name}
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
                </ScrollView>

                <View className={'h-1/6 mx-3 justify-center'}>
                    <Text style={{backgroundColor: '#264653'}}
                          className={'bg-app-white m-3 p-3 text-center text-white rounded font-semibold text-base'}>Statistics</Text>
                </View>

                <View className='h-2/5 justify-start'>
                    <ScrollView>
                        <View className='w-full flex flex-row items-start justify-evenly'>
                            <View
                                style={{backgroundColor: '#E76F51'}}

                                className='w-5/12 flex items-center justify-evenly text-white rounded shadow-sm p-2.5'>
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
                                style={{backgroundColor: '#F4A261'}}
                                className='w-5/12 flex items-center justify-evenly bg-app-white rounded shadow-sm p-2.5'>
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
                                style={{backgroundColor: '#2A9D8F'}}
                                className='w-5/12 flex items-center justify-evenly bg-app-white rounded shadow-sm p-2.5'>
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
                                style={{backgroundColor: '#E9C46A'}}
                                className='w-5/12 flex items-center justify-evenly bg-app-white rounded shadow-sm p-2.5'>
                                <TouchableOpacity
                                >
                                    <View className='items-center'>
                                        <Icon name='chart-box-outline' type='material-community' size={35}/>
                                    </View>
                                    <View className='mt-2 flex items-center'>
                                        <Text className='font-bold text-lg text-center'>
                                            0
                                        </Text>
                                        <Text className="font-semibold text-base text-center">Opinion Poll</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

{/*                        <View className='mt-3 w-full flex flex-row items-start justify-evenly'>
                            <View
                                style={{backgroundColor: '#2A9D8F'}}
                                className='w-5/12 flex items-center justify-evenly bg-app-white rounded shadow-sm p-2.5'>
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
                                style={{backgroundColor: '#E9C46A'}}
                                className='w-5/12 flex items-center justify-evenly bg-app-white rounded shadow-sm p-2.5'>
                                <TouchableOpacity
                                >
                                    <View className='items-center'>
                                        <Icon name='chart-box-outline' type='material-community' size={35}/>
                                    </View>
                                    <View className='mt-2 flex items-center'>
                                        <Text className='font-bold text-lg text-center'>
                                            0
                                        </Text>
                                        <Text className="font-semibold text-base text-center">Opinion Poll</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>*/}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <StatusBar style="dark" />
        </ScrollView>
    );
}

export default Dashboard;
