import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { Text, List } from 'react-native-paper';

const SurveyOptionScreen = () => {
    return (
        <SafeAreaView className='mx-2'>

            <List.Item
                title="People survey"
                left={props => <List.Icon {...props} icon="account-group-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
            />
            <List.Item
                title="Shop survey"
                left={props => <List.Icon {...props} icon="shopping-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
            />
        </SafeAreaView>
    );
};

export default SurveyOptionScreen;