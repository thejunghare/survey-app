import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { AppwriteContext } from '../appwrite/UserContext';
import { Button, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { toast } from "../appwrite/toast";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';

type DashboardScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Dashboard'>;

type UserObj = {
    name: String;
    email: String;
    id: String;
}

const Dashboard: React.FC = () => {
    const { appwrite, setIsLoggedIn } = useContext(AppwriteContext)
    const navigation = useNavigation();
    const [userData, setUserData] = useState<UserObj>()

    const handleLogout = () => {
        appwrite.logout()
            .then(() => {
                setIsLoggedIn(false);
                toast('Logout')
            })
    }

    useEffect(() => {
        appwrite.getCurrentUser()
            .then(response => {
                if (response) {
                    const user: UserObj = {
                        name: response.name,
                        email: response.email,
                        id: response.$id
                    }
                    setUserData(user)
                }
            })
    }, [appwrite])

    return (
        <SafeAreaView className='bg-white'>
            <View className='h-screen justify-between'>
                <View className='h-2/4 bg-app-blue justify-evenly items-center'>
                    <Avatar
                        size={'xlarge'}
                        rounded
                        title="PJ"
                        containerStyle={{ backgroundColor: "blue" }}
                    />

                    <View className='flex flex-row items-center'>
                        {userData && (
                            <Text className='bg-app-white p-2 font-semibold text-base'>
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

                <View className='h-1/3 justify-start'>
                    <View className='w-full flex flex-row items-start justify-evenly'>
                        <View className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                            <TouchableOpacity >
                                <View className="items-center">
                                    <Icon name='store-outline' type='material-community' size={35} />
                                </View>
                                <View className='mt-2 flex items-center'>
                                    <Text className='font-bold text-lg text-center'>
                                        0
                                    </Text>
                                    <Text className="font-semibold text-base text-center">Shop</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                        <View className='w-5/12 flex items-center justify-evenly bg-app-white rounded-lg shadow-sm p-2.5'>
                            <TouchableOpacity onPress={() => { navigation.navigate('DoorToDoorSurvey', { userId: userData.id }) }}>
                                <View className='items-center'>
                                    <Icon name='book-outline' type='material-community' size={35} />
                                </View>
                                <View className='mt-2 flex items-center'>
                                    <Text className='font-bold text-lg text-center'>
                                        0
                                    </Text>
                                    <Text className="font-semibold text-base text-center">Survey</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </View>
        </SafeAreaView>
    );
}

export default Dashboard
