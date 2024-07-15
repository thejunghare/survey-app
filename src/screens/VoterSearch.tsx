import React, { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Text
} from 'react-native';
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../routes/AppStack";
import { FlashList } from "@shopify/flash-list";
import { useSurvey } from "../appwrite/SurveyContext";

type VoterSearchRouteProp = RouteProp<AppStackParamList, "VoterSearch">;

const VoterSearch: React.FC = ({ route }: { route: VoterSearchRouteProp }) => {
    const { userId } = route.params;
    const [employeeId, setEmployeeId] = useState<string>(userId || "");
    const { fetchVoterList } = useSurvey();
    const [search, setSearch] = useState<string>("");
    const [voterList, setVoterList] = React.useState<Document[]>([]);

    const updateSearch = (search) => {
        setSearch(search);
    };

    React.useEffect(() => {
        const fecthData = async() => {
            const documents = await fetchVoterList();
            setVoterList(documents);
        }
        fecthData();
    }, [])

    return (
        <SafeAreaView className='flex-1'>
            <View className={'m-2'}>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={updateSearch}
                    value={search}
                />
            </View>

            {/* TODO -> fetch flash list based on employee id */}
            <View style={{ height: 500, width: Dimensions.get("screen").width }} className='mt-2'>
                <FlashList
                    data={voterList}
                    renderItem={({ item }) => <Text className='mx-2 py-3 bg-white border border-slate-200  rounded-xl'>Name: {item.name}</Text>}
                    estimatedItemSize={200}
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