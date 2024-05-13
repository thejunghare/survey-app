import * as React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem,
} from '@react-navigation/drawer';

const CustomDrawer = () => {
    return (
        <SafeAreaView className='flex-1'>
            <Image
                style={style.image}
                source={require('./assets/digital-neta-logo.png')}
            />

            <Divider />

        </SafeAreaView>
    );
};

const style = StyleSheet.create({

    image: {
        width: 275,
        height: 60,
        margin: 5
    }
})

export default CustomDrawer;