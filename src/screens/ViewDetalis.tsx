import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";
import { Button, Icon } from "@rneui/themed";

const ViewDetails = () => {
  const route = useRoute();
  const { id } = route.params;
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const DATABASEID = "66502c6e0015d7be8526";
  const MEMBERCOLLECTIONID = "6797ac980023a75b2c98";

  useEffect(() => {
    async function getMemberDetails() {
      try {
        const result = await databases.listDocuments(
          DATABASEID,
          MEMBERCOLLECTIONID,
          [Query.equal("$id", id)]
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
    <View>
      <View className="flex flex-row justify-around p-2">
        <Button title="Text Message" type={"outline"} size="md" radius={"lg"}>
          <Icon name="message-square" color="black" type="feather" />
        </Button>

        <Button title="Whatsapp" type={"outline"} size="md" radius={"lg"}>
          <Icon name="message-circle" color="black" type="feather" />
        </Button>

        <Button title="Bluetooth" type={"outline"} size="md" radius={"lg"}>
          <Icon name="bluetooth" color="black" type="feather" />
        </Button>

        <Button title="Print" type={"outline"} size="md" radius={"lg"}>
          <Icon name="printer" color="black" type="feather" />
        </Button>

        <Button title="call" type={"outline"} size="md" radius={"lg"}>
          <Icon name="phone" color="black" type="feather" />
        </Button>

        <Button title="Whatsapp" type={"outline"} size="md" radius={"lg"}>
          <Icon name="save" color="black" type="feather" />
        </Button>
      </View>

      <View className="flex flex-row justify-around p-2">
        <Button type={"solid"} size="lg" radius={"lg"}>
          Survey
          <Icon name="book" color="white" type="feather" />
        </Button>
        <Button type={"solid"} size="lg" radius={"lg"}>
          Color
          <Icon name="chevron-up" color="white" type="feather" />
        </Button>
        <Button type={"solid"} size="lg" radius={"lg"}>
          Save
          <Icon name="save" color="white" type="feather" />
        </Button>
      </View>

      <Text className="border-b border-slate-200 p-2">
        Ac NO: {member?.ac_no}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        Part No: {member?.part_no}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        SlNoin: {member?.slnoin_part}
      </Text>

      <Text className="border-b border-slate-200 p-2">
        English First Name: {member?.applicant_first_name}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        Marathi First Name: {member?.applicant_first_name_l1}
      </Text>

      <Text className="border-b border-slate-200 p-2">
        English Last Name: {member?.applicant_last_name}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        Marathi Last Name: {member?.applicant_last_name_l1}
      </Text>

      <Text className="border-b border-slate-200 p-2">
        Card Number: {member?.epic_number}
      </Text>

      <Text className="border-b border-slate-200 p-2">Age: {member?.age}</Text>
      <Text className="border-b border-slate-200 p-2">
        Gender: {member?.gender}
      </Text>

      <Text className="border-b border-slate-200 p-2">
        Voter address: {member?.v_address}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        Voter address(marathi): {member?.v_address_l1}
      </Text>

      <Text className="border-b border-slate-200 p-2">
        Booth address(marathi): {member?.booth_address}
      </Text>
      <Text className="border-b border-slate-200 p-2">
        Booth address(marathi): {member?.booth_address_l1}
      </Text>
    </View>
  );
};

export default ViewDetails;
