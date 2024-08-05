import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { List } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    DoorToDoorSurvey: undefined;
    ShopSurvey: undefined;
};

type SurveyOptionScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'DoorToDoorSurvey' | 'ShopSurvey'
>;

type Props = {
    navigation: SurveyOptionScreenNavigationProp;
};

const SurveyOption: React.FC<Props> = ({ navigation }) => {
    return (
        <SafeAreaView>
            <List.Item
                title="Door to door survey"
                onPress={() => navigation.navigate('DoorToDoorSurvey')}
                left={(props) => <List.Icon {...props} icon="account-group-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
                title="Shop survey"
                onPress={() => navigation.navigate('ShopSurvey')}
                left={(props) => <List.Icon {...props} icon="shopping-outline" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
        </SafeAreaView>
    );
};

export default SurveyOption;
