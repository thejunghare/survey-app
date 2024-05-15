import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    DoorToDoorSurveyScreen: undefined;
    ShopSurveyScreen: undefined;
};

type SurveyOptionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'DoorToDoorSurveyScreen' | 'ShopSurveyScreen'
>;

type Props = {
    navigation: SurveyOptionScreenNavigationProp;
};

const SurveyOptionScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <SafeAreaView>
            <List.Item
                title="Door to door survey"
                onPress={() => navigation.navigate('DoorToDoorSurveyScreen')}
                left={(props) => <List.Icon {...props} icon="account-group-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
                title="Shop survey"
                onPress={() => navigation.navigate('ShopSurveyScreen')}
                left={(props) => <List.Icon {...props} icon="shopping-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
        </SafeAreaView>
    );
};

export default SurveyOptionScreen;
