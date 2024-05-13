import {
    View,
    Image,
    StyleSheet,

} from "react-native";
import {
    Divider,
    List,
    TouchableRipple
} from 'react-native-paper'
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";


const CustomDrawer = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{
                    marginTop: -50,
                    zIndex: 10,
                }}
            >

                <Image
                    alt="Not find"
                    source={require("./assets/digital-neta-logo.png")}
                    style={styles.image}
                />

                <Divider />

                <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View >
                <Divider />
                <TouchableRipple
                    onPress={() => console.log('Pressed')}
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
        width: 280,
        height: 68,
        marginBottom: 10,
        marginTop: 40,
    }
});