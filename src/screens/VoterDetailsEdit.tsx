import React, {useState} from 'react';
import {SafeAreaView, View, Text, ScrollView, Pressable, StyleSheet} from 'react-native';
import {Input, Button, CheckBox} from '@rneui/base';
import DateTimePicker from "@react-native-community/datetimepicker";
import {useSurvey} from "../appwrite/SurveyContext";

interface VoterDetailsEditProps {
    voter: Voter;
}

interface updateVoterData {
    education: string;
    native_place: string;
    mobile_number: string;
    caste: string;
    remark: string;
}

const VoterDetailsEdit: React.FC<VoterDetailsEditProps> = ({voter}) => {
    const {update} = useSurvey();
    const [name, setName] = useState(voter.name);
    const [familyHeadDate, setFamilyHeadDate] = useState(new Date());
    const [familyHeadShowPicker, setFamilyHeadShowPicker] = useState(false);
    const [familyHeadAge, setFamilyHeadAge] = useState("");
    const [familyHeadBirthdate, setFamilyHeadBirthdate] = useState("");
    const [applicantEducation, setApplicantEducation] = useState<string>("");
    const [applicantNativePlace, setApplicantNativePlace] = useState<string>("");
    const [applicantMobileNumber, setApplicantMobileNumber] = useState<string>("");
    const [applicantCaste, setApplicantCaste] = useState<string>("");
    const [applicantRemark, setApplicantRemark] = useState<string>("");
    const [isVoter, setIsVoter] = useState<string>("");
    const [applicantFirstName, setApplicantFirstName] = useState<string>("");
    const [applicantLastName, setApplicantLastName] = useState<string>("");
    const [applicantAge, setApplicantAge] = useState<string>("");
    const [applicantGender, setApplicantGender] = useState<string>("");
    const [applicantAddress, setApplicantAddress] = useState<string>("");
    const [applicantRoomNumber, setApplicantRoomNumber] = useState<string>("");
    const [applicantEpicNumber, setApplicantEpicNumber] = useState<string>("");
    const [applicantBoothAddress, setApplicantBoothAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRoomLocked, setIsRoomLocked] = useState<boolean>(false);
    const [surveyDenied, setSurveyDenied] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isRented, setIsRented] = useState<boolean>(false);

    const calculateAge = (birthdate) => {
        const birthDateObj = new Date(birthdate);
        const today = new Date();
        const ageInYears = today.getFullYear() - birthDateObj.getFullYear();
        return ageInYears;
    };

    const toggleFamilyHeadDatePicker = () => {
        setFamilyHeadShowPicker(!familyHeadShowPicker);

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

    const handleupdate = async () => {
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

        const created_at = formatDate(new Date());
        const updated_at = formatDate(new Date());
        const documentId = voter.$id;

        const updatedData = {
            education: applicantEducation,
            native_place: applicantNativePlace,
            mobile_number: applicantMobileNumber,
            caste: applicantCaste,
            remark: applicantRemark,
            room_locked: isRoomLocked,
            survey_denied: surveyDenied,
            is_owner: isOwner,
            is_rented: isRented,
            created_at,
            updated_at,
        };

        await update(documentId, updatedData);
        setIsLoading(false);
    };

    return (
        <SafeAreaView className='flex-1 p-4'>
            <ScrollView>
                {/*first name*/}
                <Input
                    value={voter.first_name}
                    onChangeText={setApplicantFirstName}
                    label='First & Middle Name *'
                    placeholder="First name"
                    editable={false}
                />

                {/*last name*/}
                <Input
                    value={voter.last_name}
                    onChangeText={setApplicantLastName}
                    label='Last Name *'
                    placeholder="Last name"
                    editable={false}
                />

                {/*age*/}
                <Input
                    value={voter.age}
                    onChangeText={setApplicantAge}
                    label='Age *'
                    placeholder="Age"
                    editable={false}
                />

                {/*gender*/}
                <Input
                    value={voter.gender}
                    onChangeText={setApplicantGender}
                    label='Gender *'
                    placeholder="Gender"
                    editable={false}
                />

                {/*house/room number*/}
                <Input
                    value={voter.house_number}
                    onChangeText={setApplicantGender}
                    label='House/Room Number *'
                    placeholder="House/Room number"
                    editable={false}
                />

                {/*Address*/}
                <Input
                    value={voter.address}
                    onChangeText={setApplicantAddress}
                    label='Address *'
                    placeholder="Adress"
                    editable={false}
                />

                {/*Epic number*/}
                <Input
                    value={voter.epic_number}
                    onChangeText={setApplicantEpicNumber}
                    label='Epic Number *'
                    placeholder="Epic number"
                    editable={false}
                />

                {/*Booth address*/}
                <Input
                    value={voter.booth_address}
                    onChangeText={setApplicantBoothAddress}
                    label='Booth Address *'
                    placeholder="Booth address"
                    editable={false}
                />

                <View className={"flex flex-row items-center justify-evenly"}>
                    {/* room locked */}
                    <CheckBox
                        title="Room Locked"
                        checked={isRoomLocked}
                        onPress={() => setIsRoomLocked(!isRoomLocked)}
                        containerStyle={{
                            width: '50%'
                        }}
                    />
                    {/* survey denied */}
                    <CheckBox
                        title="Survey Denied"
                        checked={surveyDenied}
                        onPress={() => setSurveyDenied(!surveyDenied)}
                        checkedColor="red"
                        containerStyle={{
                            width: '50%'
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
                            width: '50%'
                        }}
                    />
                    {/* room owner */}
                    <CheckBox
                        title="Room owner"
                        checked={isOwner}
                        onPress={() => setIsOwner(!isOwner)}
                        checkedColor="green"
                        containerStyle={{
                            width: '50%'
                        }}
                    />
                </View>

                {/*education*/}
                <Input
                    value={applicantEducation}
                    onChangeText={setApplicantEducation}
                    label='Education *'
                    placeholder="Education"

                />

                {/*native place*/}
                <Input
                    value={applicantNativePlace}
                    onChangeText={setApplicantNativePlace}
                    label='Native Place *'
                    placeholder="Native place"

                />

                {/*mobile number*/}
                <Input
                    value={applicantMobileNumber}
                    onChangeText={setApplicantMobileNumber}
                    label='Mobile Number *'
                    placeholder="Mobile number"
                    keyboardType="number-pad"
                    maxLength={10}
                />

                {/*caste*/}
                <Input
                    value={applicantCaste}
                    onChangeText={setApplicantCaste}
                    label='Caste *'
                    placeholder="Caste"

                />

                {/*remark*/}
                <Input
                    value={applicantRemark}
                    onChangeText={setApplicantRemark}
                    label='Remark *'
                    placeholder="Remark"

                />
                <Button
                    radius={"sm"}
                    type="solid"
                    onPress={handleupdate}
                    disabled={isLoading}
                >
                    Submit data
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

export default VoterDetailsEdit;
