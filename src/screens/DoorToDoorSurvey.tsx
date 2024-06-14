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
} from "react-native";
import { Button, Input, Icon, CheckBox } from "@rneui/base";
import { useSurvey } from "../appwrite/SurveyContext";
import { RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../routes/AppStack";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";

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
  const { add } = useSurvey();
  const { userId } = route.params;

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
  const [isOwner, setIsOwner] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [roomOwnerMobileNumber, setRoomOwnerMobileNumber] = useState("");
  const [surveyRemark, setSurveyRemark] = useState("");
  const [memberCount, setMemberCount] = useState("");

  useEffect(() => {
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

  const calculateAge = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDateObj.getFullYear();
    return ageInYears;
  };

  /*const handleDivisionChange = (itemValue) => {
        setDivision(itemValue);
        const selectedDivision = divisions.find(div => div.name === itemValue);
        setWards(selectedDivision ? selectedDivision.wards : []);
        setWard('');
    };*/
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
    setIsOwner(false);
    setIsRented(false);
    setSurveyRemark("");
    setRoomOwnerMobileNumber("");
    setIsLoading(false); // stop loading
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView className={"bg-white"} style={{ flex: 1, padding: 10 }}>
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
        {/*<Text style={styles.label}>Division</Text>*/}
        <Picker
          selectedValue={division}
          onValueChange={handleDivisionChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Division (Required)" value="" />
          {divisions.map((division) => (
            <Picker.Item
              key={division.id}
              label={division.name}
              value={division.name}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={ward}
          onValueChange={handleWardChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Ward (Required)" value="" />
          {wards.map((ward) => (
            <Picker.Item key={ward.id} label={ward.name} value={ward.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={area}
          onValueChange={handleAreaChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Area (Required)" value="" />
          {areas.map((area) => (
            <Picker.Item key={area.id} label={area.name} value={area.name} />
          ))}
        </Picker>

        <Picker
          selectedValue={building}
          onValueChange={handleBuildingChange}
          style={styles.picker}
        >
          <Picker.Item label="Select Building (Required)" value="" />
          {buildings.map((building) => (
            <Picker.Item
              key={building.id}
              label={building.name}
              value={building.name}
            />
          ))}
        </Picker>
        <TextInput
          value={roomNumber}
          onChangeText={setRoomNumber}
          placeholder="Room Number (Required)"
          style={styles.textInput}
        />
        <View className={"flex flex-row items-center justify-evenly"}>
          <CheckBox
            title="Room Locked"
            checked={isRoomLocked}
            onPress={() => setIsRoomLocked(!isRoomLocked)}
          />
          <CheckBox
            title="Survey Denied"
            checked={surveyDenied}
            onPress={() => setSurveyDenied(!surveyDenied)}
            checkedColor="red"
          />
        </View>
        <View className={"flex flex-row items-center justify-evenly"}>
          <CheckBox
            title="Room owner"
            checked={isOwner}
            onPress={() => setIsOwner(!isOwner)}
            checkedColor="green"
          />
          <CheckBox
            title="Room Rented"
            checked={isRented}
            onPress={() => setIsRented(!isRented)}
            checkedColor="orange"
          />
        </View>
        {isRented && (
          <TextInput
            value={roomOwnerMobileNumber}
            onChangeText={setRoomOwnerMobileNumber}
            placeholder="Room Owner Mobile Number"
            style={styles.textInput}
            keyboardType="number-pad"
          />
        )}
        <TextInput
          value={memberCount}
          onChangeText={setMemberCount}
          placeholder="Total Members in family"
          style={styles.textInput}
          keyboardType="number-pad"
        />
        <TextInput
          value={native}
          onChangeText={setNativePlace}
          placeholder="Native Place"
          style={styles.textInput}
        />
        <TextInput
          value={familyHeadName}
          onChangeText={setFamilyHeadName}
          placeholder="Family Head Name"
          style={styles.textInput}
        />
        <View>
          {/*<Text>Family Head Birthdate</Text>*/}
          <Pressable onPress={toggleFamilyHeadDatePicker}>
            <TextInput
              value={familyHeadBirthdate}
              placeholder="Birthdate"
              style={styles.textInput}
              editable={false}
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
        <TextInput
          value={familyHeadAge}
          onChangeText={setFamilyHeadAge}
          placeholder="Age (Auto-Fill)"
          style={styles.textInput}
          keyboardType="numeric"
          editable={false}
        />
        <TextInput
          value={familyHeadMobileNumber}
          onChangeText={setFamilyHeadMobileNumber}
          placeholder="Mobile Number"
          style={styles.textInput}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <TextInput
          value={caste}
          onChangeText={setCaste}
          placeholder="Caste"
          style={styles.textInput}
        />
        <TextInput
          value={familyHeadEducation}
          onChangeText={setFamilyHeadEducation}
          placeholder="Education"
          style={styles.textInput}
        />
        <View style={{ width: "100%" }}>
          <Picker
            enabled={!isRoomLocked}
            selectedValue={voter}
            onValueChange={(itemValue) => setVoter(itemValue)}
          >
            <Picker.Item label="Are you a voter" value="" />
            <Picker.Item label="Yes" value="yes" />
            <Picker.Item label="No" value="no" />
          </Picker>

          {voter === "yes" && (
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

          {voter === "no" && (
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
          )}
        </View>
        <TextInput
          value={surveyRemark}
          onChangeText={setSurveyRemark}
          placeholder="Survey Remark"
          style={styles.textInput}
        />
        <View>
          {members.map((member, index) => (
            <View key={index} style={styles.memberContainer}>
              <TextInput
                value={member.memberName}
                onChangeText={(text) =>
                  handleUpdateMember(index, "memberName", text)
                }
                placeholder={`Member ${index + 1} Name`}
                style={styles.textInput}
              />
              <Pressable onPress={() => showDatePickerModal(index)}>
                <TextInput
                  value={member.memberBirthdate}
                  placeholder={`Member ${index + 1} Birthdate`}
                  style={styles.textInput}
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
              <TextInput
                value={member.memberAge}
                onChangeText={(text) =>
                  handleUpdateMember(index, "memberAge", text)
                }
                placeholder={`Member ${index + 1} Age`}
                style={styles.textInput}
                keyboardType="numeric"
                editable={false}
              />
              <TextInput
                value={member.memberMobileNumber}
                onChangeText={(text) =>
                  handleUpdateMember(index, "memberMobileNumber", text)
                }
                placeholder={`Member ${index + 1} Mobile Number`}
                style={styles.textInput}
                keyboardType="phone-pad"
                maxLength={10}
              />
              <TextInput
                value={member.memberEducation}
                onChangeText={(text) =>
                  handleUpdateMember(index, "memberEducation", text)
                }
                placeholder={`Member ${index + 1} Education`}
                style={styles.textInput}
              />
              <View style={{ width: "100%" }}>
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

                {member.voter === "yes" && (
                  <>
                    <TextInput
                      value={member.voterPoll}
                      onChangeText={(text) =>
                        handleUpdateMember(index, "voterPoll", text)
                      }
                      placeholder="Voter poll"
                      style={styles.textInput}
                    />
                    <TextInput
                      value={member.voterPollArea}
                      onChangeText={(text) =>
                        handleUpdateMember(index, "voterPollArea", text)
                      }
                      placeholder="Voter poll area"
                      style={styles.textInput}
                    />
                  </>
                )}

                {member.voter === "no" && (
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
                )}
              </View>
              <Button
                title="Delete Member"
                onPress={() => handleDeleteMember(index)}
                buttonStyle={{
                  backgroundColor: "red",
                  borderRadius: 8,
                }}
                containerStyle={{
                  width: 140,
                  marginVertical: 5,
                  marginHorizontal: "auto",
                }}
              />
            </View>
          ))}
        </View>
        <View className={"flex flex-row items-center justify-between"}>
          <Button
            title="Add Member"
            onPress={handleAddMember}
            buttonStyle={{
              backgroundColor: "rgba(78, 116, 289, 1)",
              borderRadius: 8,
            }}
            containerStyle={{
              width: 120,
            }}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={isLoading}
            buttonStyle={{
              backgroundColor: "rgba(127, 220, 103, 1)",
              borderRadius: 8,
            }}
            containerStyle={{
              width: 120,
            }}
          />
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
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
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
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
