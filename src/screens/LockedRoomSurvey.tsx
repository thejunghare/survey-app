import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../routes/AppStack";
import { FlashList } from "@shopify/flash-list";
import { useSurvey } from "../appwrite/SurveyContext";
import { Button, Icon } from "@rneui/base";
import { toast } from '../appwrite/toast';

type LockedRoomSurveyRouteProp = RouteProp<
    AppStackParamList,
    "LockedRoomSurvey"
>;

const LockedRoomSurvey = ({ route }: { route: LockedRoomSurveyRouteProp }) => {
    const { userId } = route.params;
    const [employeeId, setEmployeeId] = React.useState(userId || "");
    const { listLockedSurvey } = useSurvey();
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
        <View className='flex-1 p-2 '>
            {/* division picker */}
            <View className="flex flex-row items-center justify-evenly my-5">
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={division}
                        onValueChange={handleDivisionChange}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Division *" value="" />
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
                        <Picker.Item label="Ward *" value="" />
                        {wards.map((ward) => (
                            <Picker.Item key={ward.id} label={ward.name} value={ward.name} />
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
                        <Picker.Item label="Area *" value="" />
                        {areas.map((area) => (
                            <Picker.Item key={area.id} label={area.name} value={area.name} />
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
                        <Picker.Item label="Building *" value="" />
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
                color="secondary"
                onPress={fetchLockRoom}
                buttonStyle={{
                    width: '50%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 12,
                }}
                title='fetch'
            />

            {/* TODO -> fetch flash list based on employee id */}
            <View style={{ height: 500, width: Dimensions.get("screen").width }} className='mt-2'>
                <FlashList
                    data={lockedSurveyList}
                    renderItem={({ item }) => <Text className='mx-2 py-3 bg-white border border-slate-200  rounded-xl'>Room No: {item.roomNumber}</Text>}
                    estimatedItemSize={200}
                />
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