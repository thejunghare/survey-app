import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ShopSurveyScreen = () => {
    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Text>Shop survey</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ShopSurveyScreen;