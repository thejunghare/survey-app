import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Button, Input, Icon } from '@rneui/base'
import { Picker } from '@react-native-picker/picker'
import { useSurvey } from '../appwrite/SurveyContext';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../routes/AppStack';

type DoorToDoorSurveyRouteProp = RouteProp<AppStackParamList, 'DoorToDoorSurvey'>;

interface SurveyData {
    employeeId: string;
    division: string;
    ward: string;
    type: string;
    area: string;
    building: string;
    surveyData: string;
}

const DoorToDoorSurvey = ({ route }: { route: DoorToDoorSurveyRouteProp }) => {
    const { add } = useSurvey();
    const { userId } = route.params;

    const [employeeId, setEmployeeId] = useState(userId || '');
    const [division, setDivision] = useState('');
    const [ward, setWard] = useState('');
    const [type, setType] = useState('');
    const [area, setArea] = useState('');
    const [building, setBuilding] = useState('');
    const [familyHeadName, setFamilyHeadName] = useState('')
    const [familyHeadBirthdate, setFamilyHeadBirthdate] = useState('')
    const [familyHeadMobileNumber, setFamilyHeadMobileNumber] = useState('')
    const [caste, setCaste] = useState('')
    const [familyHeadEducation, setFamilyHeadEducation] = useState('')
    const [voter, setVoter] = useState('')
    const [voterPoll, setVoterPoll] = useState('')
    const [surveyData, setSurveyData] = useState({});


    useEffect(() => {
        setSurveyData({
            familyHeadName,
            familyHeadBirthdate,
            familyHeadMobileNumber,
            familyHeadEducation,
            caste,
            voter,
            voterPoll,
        });
    }, [familyHeadName, familyHeadBirthdate, familyHeadEducation, familyHeadMobileNumber, caste, voter, voterPoll]);

    const handleSurveyDataChange = (newData: object) => {
        setSurveyData(newData);
    };

    const handleSubmit = async () => {
        const data: SurveyData = {
            employeeId,
            division,
            ward,
            type,
            area,
            building,
            surveyData: JSON.stringify(surveyData),
        };
        await add(data);
        setEmployeeId('');
        setDivision('');
        setWard('');
        setType('');
        setFamilyHeadName('');
        setFamilyHeadMobileNumber('');
        setFamilyHeadBirthdate('');
        setFamilyHeadEducation('');
        setCaste('');
        setVoter('');
        setVoterPoll('');
        setSurveyData({});
    };

    return (
        <SafeAreaView className='flex-1 p-2'>
            <ScrollView>
                <Picker selectedValue={type} onValueChange={setType}>
                    <Picker.Item label="Door to door survey" value="door to door" />
                </Picker>
                <Input
                    leftIcon={{ type: 'material-community', name: 'account-outline' }}
                    // disabled={true}
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
                <Button containerStyle={{ margin: 'auto', }} size="md" type="solid" onPress={handleSubmit} disabled={employeeId === '' || division === '' || ward === '' || type === '' || Object.keys(surveyData).length === 0}
                >Submit
                    <Icon name="save" color="white" containerStyle={{ marginLeft: 5, }} />
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DoorToDoorSurvey;
