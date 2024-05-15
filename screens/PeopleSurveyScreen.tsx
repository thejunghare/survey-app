import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PeopleSurveyScreen = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Text>People survey</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PeopleSurveyScreen;