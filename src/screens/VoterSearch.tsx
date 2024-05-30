import React, {useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';

const VoterSearch: React.FC = () => {
    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <SafeAreaView className='flex-1'>
            <View className={'m-2'}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={updateSearch}
                    value={search}
                />
            </View>
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