import React from 'react';
import { Text, Searchbar, FAB } from 'react-native-paper';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';

const VoterSearch: React.FC = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    return (
        <SafeAreaView className='flex-1' >
            <ScrollView >
                <Searchbar
                    placeholder="Search"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    className='m-2'
                />
            </ScrollView>

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Pressed')}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

export default VoterSearch;