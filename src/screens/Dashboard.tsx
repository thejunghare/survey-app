import React from 'react';
import { View, Text } from 'react-native';
import { useUser } from '../appwrite/UserContext';


export default function Dashboard() {
    const user = useUser();

    console.log(user.current);
    return (
        <View>
           <Text>
                Welcome, {user.current ? user.current.email : 'Please login'}
           </Text>
        </View>
    );
}
