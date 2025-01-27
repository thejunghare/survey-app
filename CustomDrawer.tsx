import * as React from 'react';
import {
    View,
    Image,
    StyleSheet,
} from "react-native";
import {
    Divider,
    List,
    TouchableRipple,
    Avatar
} from 'react-native-paper'
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";
import {
    firebase,
    auth
} from './firebase';
import { useNavigation } from "@react-navigation/native";


const CustomDrawer = (props) => {
    const navigation = useNavigation();

    const handleLogout = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace('Login')
                console.info('Logout');
            })
            .catch((error) => alert(error.message))
    }
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    marginTop: -50,
                    zIndex: 10,
                }}
            >
                <View style={styles.container}>
                    <Image
                        alt="app-logo"
                        source={require("./assets/digital-neta-logo.png")}
                        style={styles.image}
                    />

                    <Avatar.Text size={40} label="PJ" style={styles.avatarText} />
                </View>
                <Divider />

                <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View >
                <Divider />
                <TouchableRipple
                    onPress={handleLogout}
                    rippleColor="rgba(0, 0, 0, .32)">

                    <List.Item
                        title="Logout"
                        left={props => <List.Icon {...props} icon="logout-variant" />}
                    />
                </TouchableRipple>
            </View>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    image: {
        width: 192,
        height: 50,
        marginTop: 40,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 4,
    },
    avatarText: {

        marginTop: 40,
    },
});