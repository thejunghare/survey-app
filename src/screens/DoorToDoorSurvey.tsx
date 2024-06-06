import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import {Button, Input, Icon, CheckBox} from '@rneui/base';
import {useSurvey} from '../appwrite/SurveyContext';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../routes/AppStack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

type DoorToDoorSurveyRouteProp = RouteProp<AppStackParamList, 'DoorToDoorSurvey'>;

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
}

interface Ward {
    id: number;
    name: string;
}

interface Division {
    id: number;
    name: string;
    wards: Ward[];
}

const DoorToDoorSurvey = ({route}: { route: DoorToDoorSurveyRouteProp }) => {
    const {add} = useSurvey();
    const {userId} = route.params;

    const [employeeId, setEmployeeId] = useState(userId || '');
    const [division, setDivision] = useState('');
    const [ward, setWard] = useState('');
    const [type, setType] = useState('Door To Door');
    const [area, setArea] = useState('');
    const [building, setBuilding] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [native, setNativePlace] = useState('');
    const [familyHeadName, setFamilyHeadName] = useState('');
    const [familyHeadBirthdate, setFamilyHeadBirthdate] = useState('');
    const [familyHeadMobileNumber, setFamilyHeadMobileNumber] = useState('');
    const [caste, setCaste] = useState('');
    const [familyHeadEducation, setFamilyHeadEducation] = useState('');
    const [voter, setVoter] = useState('');
    const [voterPoll, setVoterPoll] = useState('');
    const [members, setMembers] = useState([]);
    const [divisions, setDivisions] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [voterPollArea, setVoterPollArea] = useState('');
    const [newVoterRegistration, setNewVoterRegistration] = useState('');
    const [familyHeadDate, setFamilyHeadDate] = useState(new Date());
    const [familyHeadShowPicker, setFamilyHeadShowPicker] = useState(false);
    const [familyHeadAge, setFamilyHeadAge] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(Array(members.length).fill(false));
    const [isLoading, setIsLoading] = useState(false);
    const [isRoomLocked, setIsRoomLocked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://thejunghare.github.io/survey-app/src/json/data.json');
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

    const calculateAge = (birthdate) => {
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        const ageInYears = today.getFullYear() - birthDateObj.getFullYear();
        return ageInYears;
    };

    const handleDivisionChange = (itemValue) => {
        setDivision(itemValue);
        const selectedDivision = divisions.find(div => div.name === itemValue);
        setWards(selectedDivision ? selectedDivision.wards : []);
        setWard('');
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
        setShowDatePicker(showDatePicker.map((show, i) => (i === index ? true : show)));
    };

    const handleDateChange = (index, event, selectedDate) => {
        const currentDate = selectedDate || new Date(members[index].memberBirthdate);
        setShowDatePicker(showDatePicker.map((show, i) => (i === index ? false : show)));
        const birthdate = new Date(currentDate);
        const newMembers = [...members]; // create a copy of the members array
        newMembers[index].memberBirthdate = birthdate.toISOString().split('T')[0]; // update the birthdate
        const age = new Date().getFullYear() - birthdate.getFullYear();
        newMembers[index].memberAge = age.toString(); // update the age
        setMembers(newMembers); // update the state variable
    };

    


    const handleAddMember = () => {
        const newMember = {
            memberId: (members.length + 1).toString(),
            memberName: '',
            memberBirthdate: '',
            memberMobileNumber: '',
            memberEducation: '',
            voter: '',
            memberAge: '',
            voterPoll: '',
            voterPollArea: '',
            newVoterRegistration: '',
        };
        setMembers([...members, newMember]);
        setShowDatePicker([...showDatePicker, false]);
    };

    const handleUpdateMember = (index, key, value) => {
        const updatedMembers = members.map((member, i) => i === index ? {...member, [key]: value} : member);
        setMembers(updatedMembers);
    };

    const handleDeleteMember = (index) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
        setShowDatePicker(showDatePicker.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsLoading(true); // start loading
        if (!employeeId || !division || !ward || !type) {
            alert('All fileds are required unless marked optional.');
            setIsLoading(false); // stop loading
            return;
        }

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
            familyHeadAge
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
            familyhead: JSON.stringify(familyDataObject),
            members: JSON.stringify(members)
        };

        await add(data);

        setDivision('');
        setWard('');
        setType('Door To Door');
        setArea('');
        setBuilding('');
        setRoomNumber('');
        setFamilyHeadName('');
        setFamilyHeadBirthdate('');
        setFamilyHeadMobileNumber('');
        setFamilyHeadEducation('');
        setCaste('');
        setVoter('');
        setVoterPoll('');
        setVoterPollArea('');
        setNewVoterRegistration('');
        setMembers([]);
        setNativePlace('');
        setFamilyHeadAge('');
        setIsRoomLocked(false);
        setIsLoading(false); // stop loading
    };


    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff"/>;
    }

    return (
        <SafeAreaView style={{flex: 1, padding: 10}}>
            <ScrollView>
                <TextInput
                    value={type}
                    onChangeText={setType}
                    placeholder="Survey type"
                    style={styles.textInput}
                    editable={false}
                />
                <TextInput
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="Employee ID"
                    style={styles.textInput}
                    editable={false}
                />
                <Picker
                    selectedValue={division}
                    onValueChange={(itemValue) => handleDivisionChange(itemValue)}
                >
                    <Picker.Item label="Division name" value=""/>
                    {divisions.map((div) => (
                        <Picker.Item key={div.id} label={div.name} value={div.name}/>
                    ))}
                </Picker>

                <Picker
                    selectedValue={ward}
                    onValueChange={(itemValue) => setWard(itemValue)}
                >
                    <Picker.Item label="Ward name" value=""/>
                    {wards.map((ward) => (
                        <Picker.Item key={ward.id} label={ward.name} value={ward.name}/>
                    ))}
                </Picker>
                <TextInput
                    value={area}
                    onChangeText={setArea}
                    placeholder="Area name"
                    style={styles.textInput}
                />
                <TextInput
                    value={building}
                    onChangeText={setBuilding}
                    placeholder="Building name"
                    style={styles.textInput}
                />
                <TextInput
                    value={roomNumber}
                    onChangeText={setRoomNumber}
                    placeholder="Room number"
                    style={styles.textInput}
                />
                <CheckBox
                    style={{flex: 1, padding: 10, borderRadius: 4}}
                    title="Room locked"
                    checkedTitle={'Room is locked'}
                    checked={isRoomLocked}
                    onPress={() => setIsRoomLocked(!isRoomLocked)}
                />
                <TextInput
                    value={familyHeadName}
                    onChangeText={setFamilyHeadName}
                    placeholder="Family head name"
                    style={styles.textInput}
                    editable={!isRoomLocked}
                    //required={!isRoomLocked}
                />
                <TextInput
                    value={familyHeadMobileNumber}
                    onChangeText={setFamilyHeadMobileNumber}
                    placeholder="Family head mobile number"
                    inputMode={'decimal'}
                    maxLength={10}
                    style={styles.textInput}
                    editable={!isRoomLocked}
                />

                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{width: '60%'}}>
                        {familyHeadShowPicker && (
                            <DateTimePicker
                                mode={'date'}
                                display={'spinner'}
                                value={familyHeadDate}
                                onChange={onFamilyHeadDateChange}
                            />
                        )}
                        {!familyHeadShowPicker && (
                            <Pressable onPress={toggleFamilyHeadDatePicker}>
                                <TextInput
                                    value={familyHeadBirthdate}
                                    placeholder="Family Head Birthdate"
                                    style={styles.textInput}
                                    editable={false}
                                />
                            </Pressable>
                        )}
                    </View>
                    <View style={{width: '35%'}}>
                        <TextInput
                            value={familyHeadAge}
                            editable={false}
                            placeholder="Age"
                            style={styles.textInput}
                            editable={!isRoomLocked}
                        />
                    </View>
                </View>

                <TextInput
                    value={familyHeadEducation}
                    onChangeText={setFamilyHeadEducation}
                    placeholder="Family head education"
                    style={styles.textInput}
                    editable={!isRoomLocked}
                />
                <TextInput
                    value={caste}
                    onChangeText={setCaste}
                    placeholder="Caste"
                    style={styles.textInput}
                    editable={!isRoomLocked}
                />
                <TextInput
                    value={native}
                    onChangeText={setNativePlace}
                    placeholder="Native place"
                    style={styles.textInput}
                    editable={!isRoomLocked}
                />
                <View style={{width: '100%'}}>
                    <Picker
                        enabled={!isRoomLocked}
                        selectedValue={voter}
                        onValueChange={(itemValue) => setVoter(itemValue)}
                    >
                        <Picker.Item label="Are you a voter" value=""/>
                        <Picker.Item label="Yes" value="yes"/>
                        <Picker.Item label="No" value="no"/>
                    </Picker>

                    {voter === 'yes' && (
                        <>
                            <TextInput
                                value={voterPoll}
                                onChangeText={setVoterPoll}
                                placeholder="Voter poll"
                                style={styles.textInput}
                            />
                            <TextInput
                                value={voterPollArea}
                                onChangeText={setVoterPollArea}
                                placeholder="Voter poll area"
                                style={styles.textInput}
                            />
                        </>
                    )}

                    {voter === 'no' && (
                        <Picker
                            selectedValue={newVoterRegistration}
                            onValueChange={(itemValue) => setNewVoterRegistration(itemValue)}
                        >
                            <Picker.Item label="Do you want to register as a new voter?" value=""/>
                            <Picker.Item label="Yes" value="yes"/>
                            <Picker.Item label="No" value="no"/>
                        </Picker>
                    )}
                </View>
                {members.map((member, index) => (
                    <View key={index} style={{padding: 10, marginVertical: 5}}
                          className={'border border-dashed rounded-xl border-slate-400'}>
                        <Text className={'text-center text-sm font-semibold my-4'}>Member {index + 1}</Text>
                        <TextInput
                            value={member.memberName}
                            onChangeText={(text) => handleUpdateMember(index, 'memberName', text)}
                            placeholder="Name"
                            style={styles.textInput}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View style={{width: '60%'}}>
                                {showDatePicker[index] && (
                                    <DateTimePicker
                                        mode={'date'}
                                        display={'spinner'}
                                        value={new Date(members[index].memberBirthdate)}
                                        onChange={(event, selectedDate) => handleDateChange(index, event, selectedDate)}

                                    />
                                )}
                                {!showDatePicker[index] && (
                                    <Pressable onPress={() => showDatePickerModal(index)}>
                                        <TextInput
                                            value={members[index].memberBirthdate}
                                            placeholder="Family Head Birthdate"
                                            style={styles.textInput}

                                        />
                                    </Pressable>
                                )}
                            </View>
                            <View style={{width: '35%'}}>
                                <TextInput
                                    value={members[index].memberAge}
                                    placeholder="Age"
                                    style={styles.textInput}
                                     editable={false}
                                />
                            </View>
                        </View>

                        <TextInput
                            value={member.memberMobileNumber}
                            onChangeText={(text) => handleUpdateMember(index, 'memberMobileNumber', text)}
                            placeholder="Mobile number"
                            inputMode={'decimal'}
                            maxLength={10}
                            style={styles.textInput}
                        />
                        <TextInput
                            value={member.memberEducation}
                            onChangeText={(text) => handleUpdateMember(index, 'memberEducation', text)}
                            placeholder="Education"
                            style={styles.textInput}
                        />
                        <View style={{width: '100%'}}>
                            <Picker
                                enabled={!isRoomLocked}
                                selectedValue={member.voter}
                                onValueChange={(itemValue) => handleUpdateMember(index, 'voter', itemValue)}
                            >
                                <Picker.Item label="Are you a voter" value=""/>
                                <Picker.Item label="Yes" value="yes"/>
                                <Picker.Item label="No" value="no"/>
                            </Picker>

                            {member.voter === 'yes' && (
                                <>
                                    <TextInput
                                        value={member.voterPoll}
                                        onChangeText={(text) => handleUpdateMember(index, 'voterPoll', text)}
                                        placeholder="Voter poll"
                                        style={styles.textInput}
                                    />
                                    <TextInput
                                        value={member.voterPollArea}
                                        onChangeText={(text) => handleUpdateMember(index, 'voterPollArea', text)}
                                        placeholder="Voter poll area"
                                        style={styles.textInput}
                                    />
                                </>
                            )}

                            {member.voter === 'no' && (
                                <Picker
                                    enabled={!isRoomLocked}
                                    selectedValue={member.newVoterRegistration}
                                    onValueChange={(itemValue) => handleUpdateMember(index, 'newVoterRegistration', itemValue)}
                                >
                                    <Picker.Item label="Do you want to register as a new voter?" value=""/>
                                    <Picker.Item label="Yes" value="yes"/>
                                    <Picker.Item label="No" value="no"/>
                                </Picker>
                            )}
                        </View>
                        <Button
                            title="Remove member"
                            onPress={() => handleDeleteMember(index)}
                            buttonStyle={{
                                backgroundColor: 'red',
                                borderRadius: 99,
                            }}
                            containerStyle={{
                                width: 150,
                                marginVertical: 10,
                                marginHorizontal: 'auto'
                            }}
                        />
                    </View>
                ))}
                <View className='my-3 w-screen flex flex-row items-center justify-around'>
                    <Button
                        title="Add member"
                        disabled={isRoomLocked}
                        onPress={handleAddMember}
                        size="md"
                        type="solid"
                        buttonStyle={{
                            backgroundColor: 'rgba(78, 116, 289, 1)',
                            borderRadius: 99,
                        }}
                        containerStyle={{
                            width: 120,
                        }}
                    />
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff"/>
                    ) : (
                        <Button
                            title="Submit data"
                            size="md"
                            type="solid"
                            onPress={handleSubmit}
                            disabled={!isRoomLocked}
                            buttonStyle={{
                                backgroundColor: 'rgba(127, 220, 103, 1)',
                                borderRadius: 99,
                            }}
                            containerStyle={{
                                width: 120,
                            }}
                        />
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: '#ffffff',
        padding: 12,
        marginHorizontal: 0,
        marginVertical: 5,
        borderRadius: 6,
    },
    submitButton: {
        borderRadius: 99,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    pickerContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#333',
    },
})

export default DoorToDoorSurvey;