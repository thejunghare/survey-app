import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View, Text, Alert, TextInput, StyleSheet} from 'react-native';
import {Button, Input, Icon} from '@rneui/base';
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
    voter: string;
    voterPoll: string;
}

interface SurveyData {
    employeeId: string;
    division: string;
    ward: string;
    type: string;
    area: string;
    building: string;
    familyHead: string;
    members: string;
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
    const [familyHeadName, setFamilyHeadName] = useState('');
    const [familyHeadBirthdate, setFamilyHeadBirthdate] = useState('');
    const [familyHeadMobileNumber, setFamilyHeadMobileNumber] = useState('');
    const [caste, setCaste] = useState('');
    const [familyHeadEducation, setFamilyHeadEducation] = useState('');
    const [voter, setVoter] = useState('');
    const [voterPoll, setVoterPoll] = useState('');
    const [members, setMembers] = useState<MemberData[]>([]);

    const [selectedLanguage, setSelectedLanguage] = useState();

    const handleAddMember = () => {
        const newMember: MemberData = {
            memberId: (members.length + 1).toString(),
            memberName: '',
            memberBirthdate: '',
            memberMobileNumber: '',
            memberEducation: '',
            voter: '',
            voterPoll: ''
        };
        setMembers([...members, newMember]);
    };

    const handleUpdateMember = (index: number, key: string, value: string) => {
        const updatedMembers = members.map((member, i) => i === index ? {...member, [key]: value} : member);
        setMembers(updatedMembers);
    };

    const handleDeleteMember = (index: number) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
    };

    const handleSubmit = async () => {
        if (!employeeId || !division || !ward || !type || !familyHeadName) {
            Alert.alert('Please fill in all required fields.');
            return;
        }

        const familyDataObject = {
            familyHeadName,
            familyHeadBirthdate: familyHeadBirthdate.toISOString(),
            familyHeadMobileNumber,
            familyHeadEducation,
            caste,
            voter,
            voterPoll
        };

        const data: SurveyData = {
            employeeId,
            division,
            ward,
            type,
            area,
            building,
            familyHead: JSON.stringify(familyDataObject),
            members: JSON.stringify(members)
        };

        await add(data);

        setEmployeeId('');
        setDivision('');
        setWard('');
        setType('Door To Door');
        setArea('');
        setBuilding('');
        setFamilyHeadName('');
        setFamilyHeadBirthdate(new Date());
        setFamilyHeadMobileNumber('');
        setFamilyHeadEducation('');
        setCaste('');
        setVoter('');
        setVoterPoll('');
        setMembers([]);
    };

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
                <TextInput
                    value={division}
                    onChangeText={setDivision}
                    placeholder="Division name"
                    style={styles.textInput}
                />
                <TextInput
                    value={ward}
                    onChangeText={setWard}
                    placeholder="Ward name"
                    style={styles.textInput}
                />
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
                    value={familyHeadName}
                    onChangeText={setFamilyHeadName}
                    placeholder="Family head name"
                    style={styles.textInput}
                />
                <TextInput
                    value={familyHeadMobileNumber}
                    onChangeText={setFamilyHeadMobileNumber}
                    placeholder="Family head mobile number"
                    style={styles.textInput}
                />
                <TextInput
                    value={familyHeadBirthdate}
                    style={styles.textInput}
                    editable={false}
                    placeholder="Family head birthday"
                    onChangeText={setFamilyHeadBirthdate}
                />
                <TextInput
                    value={familyHeadEducation}
                    onChangeText={setFamilyHeadEducation}
                    placeholder="Family head education"
                    style={styles.textInput}
                />
                <TextInput
                    value={caste}
                    onChangeText={setCaste}
                    placeholder="Caste"
                    style={styles.textInput}
                />
                <View className={'w-full'}>
                    <Picker
                        selectedValue={voter}
                        onValueChange={(itemValue, itemIndex) =>
                            setVoter(itemValue)
                        }>
                        <Picker.Item label="Are you a voter" value=""/>
                        <Picker.Item label="Yes" value="yes"/>
                        <Picker.Item label="No" value="no"/>
                    </Picker>
                </View>
                <TextInput
                    value={voterPoll}
                    onChangeText={setVoterPoll}
                    placeholder="Voter poll"
                    style={styles.textInput}
                />
                {members.map((member, index) => (
                    <View key={index}
                          style={{padding: 10, marginVertical: 5,}}
                          className={'border border-dashed rounded-xl border-slate-400'}>
                        <Text className={'text-center text-sm font-semibold my-4}'}>Member {index + 1}</Text>
                        <TextInput
                            value={member.memberName}
                            onChangeText={(text) => handleUpdateMember(index, 'memberName', text)}
                            placeholder="Name"
                            style={styles.textInput}
                        />
                        <TextInput
                            value={member.memberBirthdate}
                            onChangeText={(text) => handleUpdateMember(index, 'memberBirthdate', text)}
                            placeholder="Birthdate"
                            style={styles.textInput}
                        />
                        <TextInput
                            value={member.memberMobileNumber}
                            onChangeText={(text) => handleUpdateMember(index, 'memberMobileNumber', text)}
                            placeholder="Mobile number"
                            style={styles.textInput}
                        />
                        <TextInput
                            value={member.memberEducation}
                            onChangeText={(text) => handleUpdateMember(index, 'memberEducation', text)}
                            placeholder="Education"
                            style={styles.textInput}
                        />
                        <View className={'w-full'}>
                            <Picker
                                selectedValue={voter}
                                onValueChange={(itemValue, itemIndex) =>
                                    setVoter(itemValue)
                                }>
                                <Picker.Item label="Are you a voter" value=""/>
                                <Picker.Item label="Yes" value="yes"/>
                                <Picker.Item label="No" value="no"/>
                            </Picker>
                        </View>
                        <TextInput
                            value={member.voterPoll}
                            onChangeText={(text) => handleUpdateMember(index, 'voterPoll', text)}
                            placeholder="Voter poll"
                            style={styles.textInput}
                        />
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
                    <Button
                        title={'Submit data'}
                        size="md"
                        type="solid"
                        onPress={handleSubmit}
                        disabled={employeeId === '' || division === '' || ward === '' || type === ''}
                        buttonStyle={{
                            backgroundColor: 'rgba(127, 220, 103, 1)',
                            borderRadius: 99,
                        }}
                        containerStyle={{
                            width: 120,
                        }}
                    />
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
    }
})

export default DoorToDoorSurvey;