import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, Avatar, Icon } from 'react-native-paper';

const DashboardScreen = () => {
    return (
        <SafeAreaView className='flex-1 h-screen'>
            <View className='h-2/4 bg-app-blue flex items-center justify-evenly'>
                <Avatar.Image className='bg-transparent' size={200} source={require('../assets/noun-avatar.png')} />
                <Text className='bg-white shadow-sm py-2 px-5 rounded-lg text-base'>Prasad Junghare</Text>
            </View>

            <View className='h-2/4 mt-2'>
                <View className='flex flex-row items-center justify-around m-2'>
                    <View className='flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/shop-50.png')} />
                        <View className='flex items-center'>
                            <Text className='font-bold text-base'>477</Text>
                            <Text>Shop survey</Text>
                        </View>
                    </View>


                    <View className='flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/human.png')} />
                        <View className='flex items-center'>
                            <Text className='font-bold text-base'>157</Text>
                            <Text>People survey</Text>
                        </View>
                    </View>
                </View>

                <View className='flex flex-row items-center justify-around m-2'>
                    <View className='flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/call.png')} />
                        <View className='flex items-center'>
                            <Text className='font-bold text-base'>477</Text>
                            <Text>Call survey</Text>
                        </View>
                    </View>


                    <View className='flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/other.png')} />
                        <View className='flex items-center'>
                            <Text className='font-bold text-base'>157</Text>
                            <Text>Other survey</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default DashboardScreen;