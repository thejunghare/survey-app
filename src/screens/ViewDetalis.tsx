import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";

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
    <View>
      <Text>Full Name: {member?.applicant_first_name}</Text>
      <Text>Phone: {member?.phone_number}</Text>
      <Text>ID: {member?.$id}</Text>
    </View>
  );
};

export default ViewDetails;
