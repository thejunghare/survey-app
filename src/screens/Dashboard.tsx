import React from 'react';
import { View, Text } from 'react-native';
import { useUser } from '../appwrite/UserContext';
import { Button, Icon } from '@rneui/themed';

export default function Dashboard() {
    const user = useUser();

    const handleLogout = () => {
        user.logout(user.current)
    }

    // console.log(user.current);
    return (
        <View>
            <Text>
                Welcome, {user.current ? user.current.email : 'Please login'}
            </Text>

            <Button
                onPress={
                    handleLogout
                }
                radius={"sm"}
                type="solid"
                iconPosition='right'
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                }}>
                Logout
                <Icon
                    name="logout"
                    color="white"
                    containerStyle={{
                        marginRight: 10,
                    }}
                />
            </Button>
        </View>
    );
}
