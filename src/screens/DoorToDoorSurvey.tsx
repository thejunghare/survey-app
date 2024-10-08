import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    Pressable,
    ActivityIndicator,
    ScrollView,
    View,
    Text,
    Alert,
    TextInput,
    StyleSheet,
    Platform,
    KeyboardType,
    TouchableOpacity,
} from "react-native";
import { Button, Input, Icon, CheckBox, SearchBar } from "@rneui/base";
import { useSurvey } from "../appwrite/SurveyContext";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../routes/AppStack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Clipboard from 'expo-clipboard';
import { toast } from "../appwrite/toast";

type DoorToDoorSurveyRouteProp = RouteProp<
    AppStackParamList,
    "DoorToDoorSurvey"
>;

interface MemberData {
    memberId: string;
    memberName: string;
    memberBirthdate: string;
    memberMobileNumber: string;
    memberEducation: string;
    memberAge: string;
    voter: string;
    voterPoll: string;
    voterPollArea: string;
    newVoterRegistration: string;
}

interface SurveyData {
    employeeId: string;
    division: string;
    ward: string;
    type: string;
    area: string;
    building: string;
    familyhead: string;
    members: string;
    roomNumber: string;
    native: string;
    isRoomLocked: boolean;
    surveyRemark: string;
    surveyDenied: boolean;
    createdAt: string;
    isOwner: boolean;
    isRented: boolean;
    roomOwnerMobileNumber: string;
    memberCount: string;
    // nameSource: string;
    //selectedColor: number;
}

interface Ward {
    id: number;
    name: string;
    areas: Area[];
}

interface Division {
    id: number;
    name: string;
    wards: Ward[];
}

interface Area {
    id: number;
    name: string;
    buildings: Building[];
}

interface Building {
    id: number;
    name: string;
}

const DoorToDoorSurvey = ({ route }: { route: DoorToDoorSurveyRouteProp }) => {
    const { add, fetchVoterList } = useSurvey();
    const { userId } = route.params;
    const [search, setSearch] = useState("");
    const [employeeId, setEmployeeId] = useState(userId || "");
    const [division, setDivision] = useState("");
    const [ward, setWard] = useState("");
    const [type, setType] = useState("Door To Door");
    const [area, setArea] = useState("");
    const [building, setBuilding] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [native, setNativePlace] = useState("");
    const [familyHeadName, setFamilyHeadName] = useState("");
    const [familyHeadBirthdate, setFamilyHeadBirthdate] = useState("");
    const [familyHeadMobileNumber, setFamilyHeadMobileNumber] = useState("");
    const [caste, setCaste] = useState("");
    const [familyHeadEducation, setFamilyHeadEducation] = useState("");
    const [voter, setVoter] = useState("");
    const [voterPoll, setVoterPoll] = useState("");
    const [members, setMembers] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [wards, setWards] = useState([]);
    const [areas, setAreas] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voterPollArea, setVoterPollArea] = useState("");
    const [newVoterRegistration, setNewVoterRegistration] = useState("");
    const [familyHeadDate, setFamilyHeadDate] = useState(new Date());
    const [familyHeadShowPicker, setFamilyHeadShowPicker] = useState(false);
    const [familyHeadAge, setFamilyHeadAge] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(
        Array(members.length).fill(false)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isRoomLocked, setIsRoomLocked] = useState(false);
    const [surveyDenied, setSurveyDenied] = useState(false);

    // const [isGreen, setIsGreen] = useState<boolean>(false);
    //const [isYellow, setIsYellow] = useState<boolean>(false);
    //const [isRed, setIsRed] = useState<boolean>(false);
    //const [selectedColor, setSelectedColor] = useState(3);

    const [isOwner, setIsOwner] = useState(false);
    const [isRented, setIsRented] = useState(false);
    const [roomOwnerMobileNumber, setRoomOwnerMobileNumber] = useState("");
    const [surveyRemark, setSurveyRemark] = useState("");
    const [memberCount, setMemberCount] = useState("");

    //const [nameSource, setNameSource] = React.useState<string | undefined>();
    const radioButtons: RadioButtonProps[] = React.useMemo(() => ([
        {
            id: 'dnp',
            label: 'DNP',
            value: 'dnp'
        }, {
            id: 'bnp',
            label: 'BNP',
            value: 'bnp'
        }
    ]), [])
    const [searchResults, setSearchResults] = useState([]);
    const [selectedVoter, setSelectedVoter] = useState(null);

    const calculateAge = (birthdate) => {
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        const ageInYears = today.getFullYear() - birthDateObj.getFullYear();
        return ageInYears;
    };

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

    const toggleFamilyHeadDatePicker = () => {
        setFamilyHeadShowPicker(!familyHeadShowPicker);
        if (!isRoomLocked) {
            setFamilyHeadShowPicker(!familyHeadShowPicker);
        }
    };

    const onFamilyHeadDateChange = (event, selectedDate) => {
        if (event.type === "set") {
            const currentDate = selectedDate || familyHeadDate;
            setFamilyHeadDate(currentDate);
            setFamilyHeadShowPicker(false);
            setFamilyHeadBirthdate(currentDate.toDateString());
            setFamilyHeadAge(calculateAge(currentDate).toString());
        } else {
            setFamilyHeadShowPicker(false);
        }
    };

    const showDatePickerModal = (index) => {
        setShowDatePicker(
            showDatePicker.map((show, i) => (i === index ? true : show))
        );
    };

    const handleDateChange = (index, event, selectedDate) => {
        const currentDate =
            selectedDate || new Date(members[index].memberBirthdate || new Date());
        setShowDatePicker(
            showDatePicker.map((show, i) => (i === index ? false : show))
        );
        const birthdate = new Date(currentDate);
        const newMembers = [...members]; // create a copy of the members array
        newMembers[index].memberBirthdate = birthdate.toISOString().split("T")[0]; // update the birthdate
        const age = new Date().getFullYear() - birthdate.getFullYear();
        newMembers[index].memberAge = age.toString(); // update the age
        setMembers(newMembers); // update the state variable
    };

    const handleAddMember = () => {
        const newMember = {
            memberId: (members.length + 1).toString(),
            memberName: "",
            memberBirthdate: "",
            memberMobileNumber: "",
            memberEducation: "",
            voter: "",
            memberAge: "",
            voterPoll: "",
            voterPollArea: "",
            newVoterRegistration: "",
        };
        setMembers([...members, newMember]);
        setShowDatePicker([...showDatePicker, false]);
    };

    const handleUpdateMember = (index, key, value) => {
        const updatedMembers = members.map((member, i) =>
            i === index ? { ...member, [key]: value } : member
        );
        setMembers(updatedMembers);
    };

    const handleDeleteMember = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
        setShowDatePicker(showDatePicker.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsLoading(true); // start loading
        if (!employeeId || !division || !ward || !type || !roomNumber) {
            alert("All fields are required unless marked optional.");
            setIsLoading(false); // stop loading
            return;
        }

        // Function to format the date to "YYYY-MM-DD:HH:MM:SS:AM/PM"
        const formatDate = (date) => {
            const options = {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            };
            let dateString = date.toLocaleString("en-US", options);
            dateString = dateString.replace(",", "");
            let [datePart, timePart] = dateString.split(" ");
            let [month, day, year] = datePart.split("/");
            dateString = `${year}-${month}-${day}:${timePart}`;
            return dateString;
        };

        // Generate current datetime in the required format
        const createdAt = formatDate(new Date());

        const familyDataObject = {
            familyHeadName,
            familyHeadBirthdate,
            familyHeadMobileNumber,
            familyHeadEducation,
            caste,
            voter,
            voterPoll,
            voterPollArea,
            newVoterRegistration,
            familyHeadAge,
        };

        const data = {
            employeeId,
            division,
            ward,
            type,
            area,
            building,
            roomNumber,
            native,
            isRoomLocked,
            surveyDenied,
            surveyRemark,
            memberCount,
            isOwner,
            isRented,
            roomOwnerMobileNumber,
            //        isGreen,
            //          isYellow,
            //            isRed,
            //     selectedColor,
            //  nameSource,
            createdAt, // Include the formatted createdAt field
            familyhead: JSON.stringify(familyDataObject),
            members: JSON.stringify(members),
        };

        await add(data);
        setMemberCount("");
        setDivision("");
        setWard("");
        setType("Door To Door");
        setArea("");
        setBuilding("");
        setRoomNumber("");
        setFamilyHeadName("");
        setFamilyHeadBirthdate("");
        setFamilyHeadMobileNumber("");
        setFamilyHeadEducation("");
        setCaste("");
        setVoter("");
        setVoterPoll("");
        setVoterPollArea("");
        setNewVoterRegistration("");
        setMembers([]);
        setNativePlace("");
        setFamilyHeadAge("");
        setIsRoomLocked(false);
        setSurveyDenied(false);
        //  setIsGreen(false);
        //setIsYellow(false);
        //setIsRed(false);
        // selectedColor(3);
        setIsOwner(false);
        setIsRented(false);
        setSurveyRemark("");
        setRoomOwnerMobileNumber("");
        //setNameSource('');
        setIsLoading(false); // stop loading
    };


    //const [search, setSearch] = useState('');
    const handleCopy = (text: string) => {
        Clipboard.setString(text);
        toast('copied');
    };

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://thejunghare.github.io/survey-app/src/json/data.json"
                );
                const data = await response.json();
                setDivisions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch search results
    useEffect(() => {
        const fetchResults = async () => {
            if (search.length > 2) {
                const response = await fetchVoterList(search);
                setSearchResults(response);
            } else {
                setSearchResults([]);
            }
        };

        fetchResults();
    }, [search]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView
            className={'flex-1 p-2'}
        >
            <ScrollView>
                <SearchBar
                    placeholder="Type Here..."
                    onChangeText={setSearch}
                    value={search}
                    platform={'android'}
                    className={'my-2'}
                    containerStyle={{
                        borderRadius: 12
                    }}
                />

                <View className={'p-3 my-3 bg-white rounded-lg shadow-app-white'}>
                    {searchResults.length > 0 ? (
                        <View>
                            <Text className='text-xl font-bold'>Search Results</Text>
                            {searchResults.map((voter) => (
                                <TouchableOpacity key={voter.$id} onPress={() => setSelectedVoter(voter)}>
                                    <View className={'flex flex-row items-center'}>
                                        <Text
                                            className='mt-4'>{voter.first_name} {voter.last_name} ({voter.age}, {voter.address})</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : search.length > 2 ? (
                        <Text className='text-center'>No results found</Text>
                    ) : (
                        <Text className='text-center font-semibold'>Please enter at least 3 characters to search</Text>
                    )}
                </View>


                {selectedVoter && (
                    <View className={'p-5 my-3 bg-white rounded-lg shadow-app-white'}>
                        <Text className='text-xl font-bold'>Voter Details</Text>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>First name: {selectedVoter.first_name}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.first_name)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Last name: {selectedVoter.last_name}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.last_name)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Age: {selectedVoter.age}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.age)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Gender: {selectedVoter.gender}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.gender)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Address: {selectedVoter.address}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.address)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>House/Room number: {selectedVoter.house_number}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.house_number)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Epic number: {selectedVoter.epic_number}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.epic_number)} />
                        </View>
                        <View className={'flex flex-row items-center'}>
                            <Text className='mt-4'>Booth address: {selectedVoter.booth_address}</Text>
                            <Icon name='clipboard' size={16} type={'feather'}
                                onPress={() => handleCopy(selectedVoter.booth_address)} />
                        </View>
                    </View>
                )}

                {/* survey type */}
                <Input
                    value={type}
                    onChangeText={setType}
                    label='Survey Type *'
                    placeholder="Survey type"
                    editable={false}
                />

                {/* employee id */}
                <Input
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="Employee ID"
                    label='Employee ID *'
                    editable={false}
                />

                {/* division picker */}
                <View className="flex flex-row items-center justify-evenly m-2">
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
                <View className="flex flex-row items-center justify-evenly m-2">
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

                {/*TODO: Look at this after wards*/}
                {/* Radio Buttons */}
                {/*                <View className="m-3 flex flex-row items-center justify-between">
                    <Text className="font-base font-semibold">Name Source *</Text>
                    <RadioGroup
                        radioButtons={radioButtons}
                        onPress={setNameSource}
                        selectedId={nameSource}
                        layout='row'
                        containerStyle={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                        }}
                    />
                </View>*/}

                <View className={"flex flex-row items-center justify-evenly"}>
                    {/* room locked */}
                    <CheckBox
                        title="Room Locked"
                        checked={isRoomLocked}
                        onPress={() => setIsRoomLocked(!isRoomLocked)}
                        containerStyle={{
                            width: '43%',

                            borderRadius: 12
                        }}
                    />
                    {/* survey denied */}
                    <CheckBox
                        title="Survey Denied"
                        checked={surveyDenied}
                        onPress={() => setSurveyDenied(!surveyDenied)}
                        checkedColor="red"
                        containerStyle={{
                            width: '43%',

                            borderRadius: 12
                        }}
                    />
                </View>

                <View className={"flex flex-row items-center justify-evenly mb-2"}>
                    {/* room rented */}
                    <CheckBox
                        title="Room Rented"
                        checked={isRented}
                        onPress={() => setIsRented(!isRented)}
                        checkedColor="orange"
                        containerStyle={{
                            width: '43%',

                            borderRadius: 12
                        }}
                    />
                    {/* room owner */}
                    <CheckBox
                        title="Room owner"
                        checked={isOwner}
                        onPress={() => setIsOwner(!isOwner)}
                        checkedColor="green"
                        containerStyle={{
                            width: '43%',

                            borderRadius: 12
                        }}
                    />
                </View>

                {/* Room Number */}
                <Input
                    value={roomNumber}
                    onChangeText={setRoomNumber}
                    placeholder="Enter room number"
                    label='Room Number *'
                />


                {/* Room  owner mobile number */}
                {isRented && (
                    <Input
                        value={roomOwnerMobileNumber}
                        onChangeText={setRoomOwnerMobileNumber}
                        placeholder="Enter mobile number"
                        label='Room Owner Mobile Number *'
                        keyboardType="number-pad"
                    />
                )}

                {/* member count */}
                <Input
                    value={memberCount}
                    onChangeText={setMemberCount}
                    placeholder="Enter total Members of family"
                    label='Member Count'
                    keyboardType="number-pad"
                />

                {/* native place */}
                <Input
                    value={native}
                    onChangeText={setNativePlace}
                    placeholder="Enter native place"
                    label='Native Place'
                />

                {/* Family head name */}
                <Input
                    value={familyHeadName}
                    onChangeText={setFamilyHeadName}
                    placeholder="Enter family head name"
                    label='Family Head Name'
                />

                {/* birthdate */}
                <View>
                    <Pressable onPress={toggleFamilyHeadDatePicker}>
                        <Input
                            value={familyHeadBirthdate}
                            placeholder="Enter birthdate"
                            editable={false}
                            label='Family Head Birthdate'
                        />
                    </Pressable>
                    {familyHeadShowPicker && (
                        <DateTimePicker
                            value={familyHeadDate}
                            mode="date"
                            display="spinner"
                            onChange={onFamilyHeadDateChange}
                        />
                    )}
                </View>

                {/* family head age */}
                <Input
                    value={familyHeadAge}
                    onChangeText={setFamilyHeadAge}
                    placeholder="Age (Auto-Fill)"
                    keyboardType="numeric"
                    label='Age'
                    editable={false}
                />

                {/* family head mobile number */}
                <Input
                    value={familyHeadMobileNumber}
                    onChangeText={setFamilyHeadMobileNumber}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    label='Family Head Mobile number'
                />

                {/* education */}
                <Input
                    value={familyHeadEducation}
                    onChangeText={setFamilyHeadEducation}
                    placeholder="Enter education"
                    label='Family Head Education'
                />

                {/* family caste */}
                <Input
                    value={caste}
                    onChangeText={setCaste}
                    placeholder="Enter caste"
                    label='Caste'
                />

                {/* voter picker */}
                <View style={{ width: "100%" }}>
                    <View style={styles.pickerContainer} className="mb-2">
                        <Picker
                            enabled={!isRoomLocked}
                            selectedValue={voter}
                            onValueChange={(itemValue) => setVoter(itemValue)}
                        >
                            <Picker.Item label="Are you a voter" value="" />
                            <Picker.Item label="Yes" value="yes" />
                            <Picker.Item label="No" value="no" />
                        </Picker>
                    </View>
                    {voter === "yes" && (
                        <>
                            {/* family head voter poll */}
                            <Input
                                value={voterPoll}
                                onChangeText={setVoterPoll}
                                placeholder="Enter voter poll"
                                label='Family head Voter poll'
                            />
                            <Input
                                value={voterPollArea}
                                onChangeText={setVoterPollArea}
                                placeholder="Enter voter poll area"
                                label='Family head Voter poll area'
                            />
                        </>
                    )}

                    {voter === "no" && (
                        <View style={styles.pickerContainer} className="mb-2">
                            <Picker
                                selectedValue={newVoterRegistration}
                                onValueChange={(itemValue) => setNewVoterRegistration(itemValue)}
                            >
                                <Picker.Item
                                    label="Do you want to register as a new voter?"
                                    value=""
                                />
                                <Picker.Item label="Yes" value="yes" />
                                <Picker.Item label="No" value="no" />
                            </Picker>
                        </View>
                    )}
                </View>

                {/*color option*/}
                {/*  <View className={"flex flex-row items-center justify-evenly"}>
                   
                    <CheckBox
                        title="Green"
                        checked={selectedColor === 0}
                        onPress={() => setSelectedColor(0)}
                        checkedColor="green"
                        containerStyle={{
                            width: '30%',
                            borderRadius: 12
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />
                  
                    <CheckBox
                        title="Yellow"

                        checked={selectedColor === 1}
                        onPress={() => setSelectedColor(1)}

                        checkedColor="yellow"
                        containerStyle={{
                            width: '30%',
                            backgroundColor: 'white',
                            borderRadius: 12
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"

                    />
                    
                    <CheckBox
                        title="Red"
                        checked={selectedColor === 3}
                        onPress={() => setSelectedColor(3)}



                        checkedColor="red"
                        containerStyle={{
                            width: '30%',
                            borderRadius: 12
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                    />

                </View>*/}

                {/* survey remark */}
                <Input
                    value={surveyRemark}
                    onChangeText={setSurveyRemark}
                    placeholder="Enter survey remark"
                    label='Survey Remark'
                />

                <View>
                    {members.map((member, index) => (
                        <View key={index} style={styles.memberContainer}>
                            <Input
                                value={member.memberName}
                                onChangeText={(text) =>
                                    handleUpdateMember(index, "memberName", text)
                                }
                                placeholder={`Member ${index + 1} Name`}
                                label='Full Name'
                            />
                            <Pressable onPress={() => showDatePickerModal(index)}>
                                <Input
                                    value={member.memberBirthdate}
                                    placeholder={`Member ${index + 1} Birthdate`}
                                    label='Birthdate'
                                    editable={false}
                                />
                            </Pressable>
                            {showDatePicker[index] && (
                                <DateTimePicker
                                    value={new Date(member.memberBirthdate || new Date())}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) =>
                                        handleDateChange(index, event, date)
                                    }
                                />
                            )}
                            <Input
                                value={member.memberAge}
                                onChangeText={(text) =>
                                    handleUpdateMember(index, "memberAge", text)
                                }
                                placeholder={`Member ${index + 1} Age`}
                                label='Age'
                                keyboardType="numeric"
                                editable={false}
                            />
                            <Input
                                value={member.memberMobileNumber}
                                onChangeText={(text) =>
                                    handleUpdateMember(index, "memberMobileNumber", text)
                                }
                                placeholder={`Member ${index + 1} Mobile Number`}
                                label='Mobile Number'
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                            <Input
                                value={member.memberEducation}
                                onChangeText={(text) =>
                                    handleUpdateMember(index, "memberEducation", text)
                                }
                                placeholder={`Member ${index + 1} Education`}
                                label='Education'
                            />
                            <View style={{ width: "100%" }}>
                                <View style={styles.pickerContainer} className="mb-2">
                                    <Picker
                                        enabled={!isRoomLocked}
                                        selectedValue={member.voter}
                                        onValueChange={(itemValue) =>
                                            handleUpdateMember(index, "voter", itemValue)
                                        }
                                    >
                                        <Picker.Item label="Are you a voter" value="" />
                                        <Picker.Item label="Yes" value="yes" />
                                        <Picker.Item label="No" value="no" />
                                    </Picker>
                                </View>
                                {member.voter === "yes" && (
                                    <>
                                        <Input
                                            value={member.voterPoll}
                                            onChangeText={(text) =>
                                                handleUpdateMember(index, "voterPoll", text)
                                            }
                                            placeholder="Enter voter poll"
                                            label='Voter Poll'
                                        />
                                        <Input
                                            value={member.voterPollArea}
                                            onChangeText={(text) =>
                                                handleUpdateMember(index, "voterPollArea", text)
                                            }
                                            placeholder="Enter voter poll area"
                                            label='Voter Poll Area'
                                        />
                                    </>
                                )}

                                {member.voter === "no" && (
                                    <View style={styles.pickerContainer} className="mb-2">
                                        <Picker
                                            enabled={!isRoomLocked}
                                            selectedValue={member.newVoterRegistration}
                                            onValueChange={(itemValue) =>
                                                handleUpdateMember(
                                                    index,
                                                    "newVoterRegistration",
                                                    itemValue
                                                )
                                            }
                                        >
                                            <Picker.Item
                                                label="Do you want to register as a new voter?"
                                                value=""
                                            />
                                            <Picker.Item label="Yes" value="yes" />
                                            <Picker.Item label="No" value="no" />
                                        </Picker>
                                    </View>
                                )}
                            </View>
                            <Button
                                radius={"sm"}
                                type="solid"
                                color="error"
                                onPress={() => handleDeleteMember(index)}
                            >
                                Delete Member
                            </Button>
                        </View>
                    ))}
                </View>
                <View className={"flex flex-row items-center justify-evenly"}>
                    <Button
                        radius={"sm"}
                        type="solid"
                        onPress={handleAddMember}
                        color="warning"


                        title="MEMBER"
                        icon={{
                            name: 'users',
                            type: 'feather',
                            size: 15,
                            color: 'white',
                        }}
                        iconRight
                        iconContainerStyle={{ marginLeft: 10 }}
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 'auto',
                            marginVertical: 10,
                        }}
                    />
                    <Button
                        radius={"sm"}
                        type="solid"
                        onPress={handleSubmit}
                        disabled={isLoading}

                        title="SUBMIT"
                        icon={{
                            name: 'save',
                            type: 'feather',
                            size: 15,
                            color: 'white',
                        }}
                        iconRight
                        iconContainerStyle={{ marginLeft: 10 }}
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{
                            backgroundColor: 'rgba(90, 154, 230, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 'auto',
                            marginVertical: 10,
                        }}
                    />
                    {/* {isLoading && <ActivityIndicator size="large" color="#0000ff" />} */}
                </View>
                <StatusBar style="dark" />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
    },
    pickerContainer: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        height: 42,
        width: 170,
    },
    memberContainer: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginVertical: 5,
    },
});

export default DoorToDoorSurvey;
