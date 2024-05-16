import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from 'react-native';
import { Text, Avatar, Icon } from 'react-native-paper';
import { firebase, auth } from '../firebase';

const DashboardScreen = () => {
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const employee = firebase.auth().currentUser;

            if (employee) {
                const userRef = firebase.firestore().collection('employee').doc(employee.uid);
                try {
                    const docSnapshot = await userRef.get();

                    if (docSnapshot.exists) {
                        setCurrentEmployee(docSnapshot.data());
                    } else console.error('employee document do not exist')
                }
                catch (error) {
                    console.error('error fetching employee: ', error);
                }
            }
        }
        fetchUserDetails();
        return () => { }
    });

    return (
        <SafeAreaView className='flex-1 h-screen'>
            <View className='h-2/4 bg-app-blue flex items-center justify-evenly'>
                <Avatar.Image className='bg-transparent' size={200} source={require('../assets/avatar.jpg')} />
                <Text className='bg-white shadow-sm py-2 px-5 rounded-lg text-base'>{currentEmployee && currentEmployee.fname} {currentEmployee && currentEmployee.lname}</Text>
            </View>

            <View className='h-2/4 mt-2'>
                <View className='bg-white p-3 m-5 rounded-lg'>
                    <Text className='text-center font-bold text-base'>Statistics</Text>
                </View>

                <View className='flex flex-row items-center justify-around m-2'>
                    <View className='w-5/12 flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/shop-50.png')} />
                        <View className='mt-2 flex items-center'>
                            <Text className='font-bold text-lg'>477</Text>
                            <Text className='font-semibold text-base'>Shop survey</Text>
                        </View>
                    </View>


                    <View className='w-5/12 flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/human.png')} />
                        <View className='mt-2 flex items-center'>
                            <Text className='font-bold text-lg'>157</Text>
                            <Text className='font-semibold text-base'>People survey</Text>
                        </View>
                    </View>
                </View>

                <View className='flex flex-row items-center justify-around m-2'>
                    <View className='w-5/12 flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/call.png')} />
                        <View className='mt-2 flex items-center'>
                            <Text className='font-bold text-lg'>477</Text>
                            <Text className='font-semibold text-base'>Call survey</Text>
                        </View>
                    </View>


                    <View className='w-5/12 flex items-center justify-evenly bg-white rounded-lg shadow-sm p-2.5'>
                        <Icon size={40} source={require('../assets/other.png')} />
                        <View className='mt-2 flex items-center'>
                            <Text className='font-bold text-lg'>157</Text>
                            <Text className='font-semibold text-base'>Other survey</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default DashboardScreen;