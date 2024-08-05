import React, {useState, useEffect} from 'react';
import {SearchBar, Icon} from '@rneui/themed';
import {
    SafeAreaView,
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';
import {RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "../routes/AppStack";
import {FlashList} from "@shopify/flash-list";
import {useSurvey} from "../appwrite/SurveyContext";
import {useNavigation} from '@react-navigation/native';

type VoterSearchRouteProp = RouteProp<AppStackParamList, "VoterSearch">;

const VoterSearch: React.FC = ({route}: { route: VoterSearchRouteProp }) => {
    const {userId} = route.params;
    const [employeeId, setEmployeeId] = useState<string>(userId || "");
    const {fetchVoterList} = useSurvey();
    const [search, setSearch] = useState<string>("");
    const [voterList, setVoterList] = useState<Document[]>([]);
    const [filteredVoterList, setFilteredVoterList] = useState<Document[]>([]);
    const navigation = useNavigation();

    const updateSearch = (search: string) => {
        setSearch(search);
    };

    useEffect(() => {
        const fetchData = async () => {
            const documents = await fetchVoterList();
            setVoterList(documents);
        };

        fetchData();
    }, [fetchVoterList]);

    useEffect(() => {
        setFilteredVoterList(
            voterList.filter((voter) =>
                voter.first_name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, voterList]);

    const handlePress = (voter: Voter) => {
        navigation.navigate('Voter Details', {voter});
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


            <View style={{height: 500, width: Dimensions.get("screen").width}} className='mt-2'>
                <FlashList
                    data={filteredVoterList}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handlePress(item)}>
                            <View className='flex flex-row justify-start items-center m-2 p-3 bg-white border border-slate-200 rounded-xl w-full'>
                                <View className='w-10'>
                                    <Icon name='user' type='feather' size={30} />
                                </View>

                                <View className='flex-1 ml-3'>
                                    <View className='flex flex-row items-center mb-2'>
                                        <Text className='flex-1'>
                                            Name: {`${item.first_name} ${item.last_name}`}
                                        </Text>
                                        <Text>
                                            Age: {item.age}
                                        </Text>
                                    </View>
                                    <View className='flex flex-row items-center mb-2'>
                                        <Text className='flex-1'>
                                            Gender: {item.gender}
                                        </Text>
                                        <Text>
                                            Epic: {item.epic_number}
                                        </Text>
                                    </View>
                                    <View className='flex flex-row items-center'>
                                        <Text className='flex-1'>
                                            Address: {item.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
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