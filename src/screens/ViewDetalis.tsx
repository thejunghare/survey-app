import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";
import { Button, Icon } from "@rneui/themed";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';

const ViewDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState();

  const DATABASEID = "66502c6e0015d7be8526";
  const MEMBERCOLLECTIONID = "6797ac980023a75b2c98";

  useEffect(() => {
    async function getMemberDetails() {
      try {
        const result = await databases.listDocuments(
          DATABASEID,
          MEMBERCOLLECTIONID,
          [Query.equal("$id", id)],
        );

        if (result?.documents.length > 0) {
          setMember(result.documents[0]); // Set the first document directly
        } else {
          throw new Error("No member found.");
        }
      } catch (error) {
        console.log("Error fetching member:", error);
        setError("Failed to load member details.");
      } finally {
        setLoading(false);
      }
    }

    getMemberDetails();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View className="p-2">
            {/* Action Buttons Row */}
            <View className="flex flex-row justify-around mb-6">
              <Button
                type="outline"
                size="md"
                radius="lg"
                buttonStyle={{
                  borderColor: "#FF9933",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFF3E0",
                }}
              >
                <Icon name="message-square" color="#FF9933" type="feather" />
                <Text className="text-[#FF9933] ml-2">Text</Text>
              </Button>

              <Button
                type="outline"
                size="md"
                radius="lg"
                buttonStyle={{
                  borderColor: "#FF9933",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFF3E0",
                }}
              >
                <Icon name="message-circle" color="#FF9933" type="feather" />
                <Text className="text-[#FF9933] ml-2">WhatsApp</Text>
              </Button>

              <Button
                type="outline"
                size="md"
                radius="lg"
                buttonStyle={{
                  borderColor: "#FF9933",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFF3E0",
                }}
              >
                <Icon name="bluetooth" color="#FF9933" type="feather" />
                <Text className="text-[#FF9933] ml-2">Bluetooth</Text>
              </Button>

              <Button
                type="outline"
                size="md"
                radius="lg"
                buttonStyle={{
                  borderColor: "#FF9933",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFF3E0",
                }}
              >
                <Icon name="printer" color="#FF9933" type="feather" />
                <Text className="text-[#FF9933] ml-2">Print</Text>
              </Button>
            </View>

            {/* Primary Actions Row */}
            <View className="flex flex-row justify-around mb-8">
              <Button
                type="solid"
                size="lg"
                radius="lg"
                color={'secondary'}
              >
                <Icon name="book" color="white" type="feather" />
                <Text className="text-white ml-2">Survey</Text>
              </Button>

              <View style={{ padding: 10 }} className="flex flex-row">
                {/* Label for the Picker */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
              Color:
                </Text>

                <Picker
                  selectedValue={selectedLanguage}
                  onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
                  mode="dropdown"
                  style={{ height: 50, width: '100%' }}
                >
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
              </View>

              <Button
                type="solid"
                size="lg"
                radius="lg"
                  color={'secondary'}
              >
                <Icon name="save" color="white" type="feather" />
                <Text className="text-white ml-2">Save</Text>
              </Button>
            </View>

            {/* Member Details Section */}
            <View className="p-6">
              <Text className="text-xl font-bold text-[#FF9933] mb-4">
                Voter Details
              </Text>

              {/* Personal Info */}
              <View className="mb-6">
                <Text className="text-[#FF9933] font-semibold mb-2">
                  Personal Info
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-bold">AC No:</Text> {member?.ac_no}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">Part No:</Text>{" "}
                    {member?.part_no}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">SlNo in Part:</Text>{" "}
                    {member?.slnoin_part}
                  </Text>
                </View>
              </View>

              {/* Name Section */}
              <View className="mb-6">
                <Text className="text-[#FF9933] font-semibold mb-2">Name</Text>
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-bold">First Name:</Text>{" "}
                    {member?.applicant_first_name}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">मतदाराचे पहिले नाव:</Text>{" "}
                    {member?.applicant_first_name_l1}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">Last Name:</Text>{" "}
                    {member?.applicant_last_name}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">मतदार आडनाव:</Text>{" "}
                    {member?.applicant_last_name_l1}
                  </Text>
                </View>
              </View>

              {/* Other Details */}
              <View className="mb-6">
                <Text className="text-[#FF9933] font-semibold mb-2">
                  Other Details
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-bold">Card Number:</Text>{" "}
                    {member?.epic_number}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">Age:</Text> {member?.age}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">Gender:</Text> {member?.gender}
                  </Text>
                </View>
              </View>

              {/* Address Section */}
              <View className="mb-6">
                <Text className="text-[#FF9933] font-semibold mb-2">
                  Address
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-700">
                    <Text className="font-bold">Voter Address:</Text>{" "}
                    {member?.v_address}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">मतदाराचा पत्ता:</Text>{" "}
                    {member?.v_address_l1}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">Booth Address:</Text>{" "}
                    {member?.booth_address}
                  </Text>
                  <Text className="text-gray-700">
                    <Text className="font-bold">मतदार केंद्राचा पत्ता:</Text>{" "}
                    {member?.booth_address_l1}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ViewDetails;