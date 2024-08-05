import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Picker} from "@react-native-picker/picker";
import {RouteProp} from "@react-navigation/native";
import {AppStackParamList} from "../routes/AppStack";
import {FlashList} from "@shopify/flash-list";
import {useSurvey} from "../appwrite/SurveyContext";
import {Button, Icon} from "@rneui/base";
import {toast} from '../appwrite/toast';

type LockedRoomSurveyRouteProp = RouteProp<
    AppStackParamList,
    "LockedRoomSurvey"
>;

const LockedRoomSurvey = ({route}: { route: LockedRoomSurveyRouteProp }) => {
    const {userId} = route.params;
    const [employeeId, setEmployeeId] = React.useState(userId || "");
    const {listLockedSurvey} = useSurvey();
    const [division, setDivision] = React.useState<string>("");
    const [ward, setWard] = React.useState<string>("");
    const [area, setArea] = React.useState<string>("");
    const [building, setBuilding] = React.useState<string>("");
    const [divisions, setDivisions] = React.useState([]);
    const [wards, setWards] = React.useState([]);
    const [areas, setAreas] = React.useState([]);
    const [buildings, setBuildings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [lockedSurveyList, setLockedSurveyList] = React.useState<Document[]>([]);

    const fetchLockRoom = async () => {
        if (!division || !ward || !area || !building) {
            toast('Required (optional marked)');
        } else {

        }
        const documents = await listLockedSurvey(employeeId, division, ward, area, building);
        setLockedSurveyList(documents);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://thejunghare.github.io/survey-app/src/json/data.json"
                );
                const data = await response.json();
                setDivisions(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDivisionChange = (itemValue) => {
        setDivision(itemValue);
        const selectedDivision = divisions.find((div) => div.name === itemValue);
        if (selectedDivision) {
            setWards(selectedDivision.wards);
        } else {
            setWards([]);
        }
        setWard("");
        setArea("");
        setBuilding("");
    };

    const handleWardChange = (itemValue) => {
        setWard(itemValue);
        const selectedWard = wards.find((ward) => ward.name === itemValue);
        if (selectedWard && selectedWard.areas) {
            setAreas(selectedWard.areas);
        } else {
            setAreas([]);
        }
        setArea("");
        setBuilding("");
    };

    const handleAreaChange = (itemValue) => {
        setArea(itemValue);
        const selectedArea = areas.find((area) => area.name === itemValue);
        if (selectedArea && selectedArea.buildings) {
            setBuildings(selectedArea.buildings);
        } else {
            setBuildings([]);
        }
        setBuilding("");
    };

    const handleBuildingChange = (itemValue) => {
        setBuilding(itemValue);
    };

    return (
        <View className='flex-1 p-2 bg-white'>
            {/* division picker */}
            <View className="flex flex-row items-center justify-evenly my-5">
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={division}
                        onValueChange={handleDivisionChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Division *" value=""/>
                        {divisions.map((division) => (
                            <Picker.Item
                                key={division.id}
                                label={division.name}
                                value={division.name}
                            />
                        ))}
                    </Picker>
                </View>

                {/* ward picker */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={ward}
                        onValueChange={handleWardChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Ward *" value=""/>
                        {wards.map((ward) => (
                            <Picker.Item key={ward.id} label={ward.name} value={ward.name}/>
                        ))}
                    </Picker>
                </View>
            </View>

            {/* area picker */}
            <View className="flex flex-row items-center justify-evenly my-5">
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={area}
                        onValueChange={handleAreaChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Area *" value=""/>
                        {areas.map((area) => (
                            <Picker.Item key={area.id} label={area.name} value={area.name}/>
                        ))}
                    </Picker>
                </View>

                {/* building picker */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={building}
                        onValueChange={handleBuildingChange}
                        style={styles.picker}

                    >
                        <Picker.Item label="Building *" value=""/>
                        {buildings.map((building) => (
                            <Picker.Item
                                key={building.id}
                                label={building.name}
                                value={building.name}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            <Button
                type='solid'
                radius={"lg"}
                onPress={fetchLockRoom}
                title="Search"
                icon={{
                    name: 'search',
                    type: 'feather',
                    size: 15,
                    color: 'white',
                }}
                iconRight
                iconContainerStyle={{marginLeft: 10}}
                titleStyle={{fontWeight: '700'}}
                buttonStyle={{
                    backgroundColor: 'rgba(199, 43, 98, 1)',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 30,
                }}
                containerStyle={{
                    width: 200,
                    marginHorizontal: 'auto',
                    marginVertical: 10,
                }}
            />

            <View style={{height: 400}} className='m-2'>
                <FlashList
                    data={lockedSurveyList}
                    renderItem={
                        ({item}) =>
                            <View
                                className={'my-2 p-3 flex flex-row w-full items-center justify-start bg-gray-100 border-black-200 rounded-xl'}>
                                <Icon
                                    name='lock'
                                    type='feather'
                                    containerStyle={{
                                        marginRight: 15,
                                    }}
                                />
                                <Text className='text-base font-semibold '>

                                    Room No: {item.roomNumber}
                                </Text>
                            </View>
                    }
                    estimatedItemSize={200}
                />
            </View>

            {/*count for unlocked and locked room count*/}
            <View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        margin: 5,
    },
    picker: {

        height: 20,
        width: 170,

    },
});

export default LockedRoomSurvey;