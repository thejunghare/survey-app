import React from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../appwrite/UserContext';
import { Button, Icon, Avatar } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
    const user = useUser();
    const navigation = useNavigation();
    const handleLogout = () => {
        user.logout(user.current)
    }

    // console.log(user.current);
    return (
        <SafeAreaView className='bg-white'>
            <View className='h-screen justify-around'>
                <View className='h-2/5 bg-app-blue justify-around items-center'>
                    <Avatar
                        size={60}
                        rounded
                        title="PJ"
                        containerStyle={{ backgroundColor: "blue" }}
                    />

                    <View className='flex flex-row items-center'>
                        <Text className='bg-app-white p-3 font-semibold text-base'>
                            {user.current ? user.current.name : 'Please login'}
                        </Text>

                        <Avatar
                            size={46}
                            onPress={handleLogout}
                            icon={{ name: "logout", type: 'simple-line-icon' }}
                            containerStyle={{ backgroundColor: "#9700b9" }}
                        />
                    </View>
                </View>

                <View className='h-3/5 justify-center'>
                    <View className='flex flex-row justify-evenly items-center'>
                        <View className='bg-app-white w-2/5 rounded-lg p-3 items-center'>
                            <Icon name='handbag' type='simple-line-icon' />
                            <Text className='m-1 font-bold text-base'>0</Text>
                            <Text className='m-1 font-semibold text-base'>Shop survey</Text>
                        </View>


                        <View className='bg-app-white w-2/5 rounded-lg p-3 items-center'>
                            <TouchableOpacity onPress={() => { navigation.navigate('D2D_Survey') }}>
                                <Icon name='people' type='simple-line-icon' />
                                <Text className='m-1 font-bold text-base text-center'>0</Text>
                                <Text className='m-1 font-semibold text-base'>D2D survey</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </View>
            </View>
        </SafeAreaView>
    );
}
