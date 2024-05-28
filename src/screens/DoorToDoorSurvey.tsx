import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { Button, Input, Icon } from '@rneui/base';
import { useSurvey } from '../appwrite/SurveyContext';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../routes/AppStack';

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

const DoorToDoorSurvey = ({ route }: { route: DoorToDoorSurveyRouteProp }) => {
    const { add } = useSurvey();
    const { userId } = route.params;

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
        const updatedMembers = members.map((member, i) => i === index ? { ...member, [key]: value } : member);
        setMembers(updatedMembers);
    };

    const handleDeleteMember = (index: number) => {
        const updatedMembers = members.filter((_, i) => i !== index);
        setMembers(updatedMembers);
    };

    const handleSubmit = async () => {
        if (!employeeId || !division || !ward || !type || !familyHeadName) {
            alert('Please fill in all required fields.');
            return;
        }

        const familyDataObject = {
            familyHeadName,
            familyHeadBirthdate,
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
            familyHead: JSON.stringify(familyDataObject), // Convert to JSON string
            members: JSON.stringify(members) // Convert members array to JSON string
        };

        await add(data);

        // Reset form
        setEmployeeId('');
        setDivision('');
        setWard('');
        setType('');
        setArea('');
        setBuilding('');
        setFamilyHeadName('');
        setFamilyHeadBirthdate('');
        setFamilyHeadMobileNumber('');
        setFamilyHeadEducation('');
        setCaste('');
        setVoter('');
        setVoterPoll('');
        setMembers([]);
    };


    return (
        <SafeAreaView className='flex-1 p-2'>
            <ScrollView>
                <Input
                    disabled={true}
                    value={type}
                    onChangeText={setType}
                    placeholder="Survey type"
                    className='bg-white p-3 m-3'
                />
                <Input
                    disabled={true}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="Employee ID"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={division}
                    onChangeText={setDivision}
                    placeholder="Division Name"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={ward}
                    onChangeText={setWard}
                    placeholder="Ward name"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={area}
                    onChangeText={setArea}
                    placeholder="Area Name"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={building}
                    onChangeText={setBuilding}
                    placeholder="Building Name"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={familyHeadName}
                    onChangeText={setFamilyHeadName}
                    placeholder="Family Head Name"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={familyHeadMobileNumber}
                    onChangeText={setFamilyHeadMobileNumber}
                    placeholder="Family Head Mobile Number"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={familyHeadBirthdate}
                    onChangeText={setFamilyHeadBirthdate}
                    placeholder="Family Head Birthdate"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={familyHeadEducation}
                    onChangeText={setFamilyHeadEducation}
                    placeholder="Family Head Education"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={caste}
                    onChangeText={setCaste}
                    placeholder="Caste"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={voter}
                    onChangeText={setVoter}
                    placeholder="Are you a voter"
                    className='bg-white p-3 m-3'
                />
                <Input
                    value={voterPoll}
                    onChangeText={setVoterPoll}
                    placeholder="Voter Poll"
                    className='bg-white p-3 m-3'
                />
                {members.map((member, index) => (
                    <View key={index} className='p-2 m-2 border border-gray-300'>
                        <Text>Member {index + 1}</Text>
                        <Input
                            value={member.memberName}
                            onChangeText={text => handleUpdateMember(index, 'memberName', text)}
                            placeholder="Member Name"
                            className='bg-white p-3 m-3'
                        />
                        <Input
                            value={member.memberBirthdate}
                            onChangeText={text => handleUpdateMember(index, 'memberBirthdate', text)}
                            placeholder="Member Birthdate"
                            className='bg-white p-3 m-3'
                        />
                        <Input
                            value={member.memberMobileNumber}
                            onChangeText={text => handleUpdateMember(index, 'memberMobileNumber', text)}
                            placeholder="Member Mobile Number"
                            className='bg-white p-3 m-3'
                        />
                        <Input
                            value={member.memberEducation}
                            onChangeText={text => handleUpdateMember(index, 'memberEducation', text)}
                            placeholder="Member Education"
                            className='bg-white p-3 m-3'
                        />
                        <Button
                            title="Remove Member"
                            onPress={() => handleDeleteMember(index)}
                            containerStyle={{ marginTop: 10, marginBottom: 10 }}
                            buttonStyle={{ backgroundColor: 'red' }}
                        />
                    </View>
                ))}
                <Button
                    title="Add Member"
                    onPress={handleAddMember}
                    containerStyle={{ marginTop: 10, marginBottom: 10 }}
                />
                <Button
                    containerStyle={{ margin: 'auto' }}
                    size="md"
                    type="solid"
                    onPress={handleSubmit}
                    disabled={employeeId === '' || division === '' || ward === '' || type === ''}
                >
                    Submit
                    <Icon name="save" color="white" containerStyle={{ marginLeft: 5 }} />
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoorToDoorSurvey;
