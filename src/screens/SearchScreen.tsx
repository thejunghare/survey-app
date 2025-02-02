import { useState, useMemo, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { SearchBar, Button } from "@rneui/themed";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";

type Member = {
  id: string;
  applicant_first_name: string;
  phone_number: string;
};

const MemberItem: React.FC<Member> = ({
  applicant_first_name,
  phone_number,
}) => (
  <View className="bg-white p-4 shadow-md m-2 rounded">
    <Text className="font-bold">Full Name: {applicant_first_name}</Text>
    <Text>Phone: {phone_number}</Text>
  </View>
);

const SearchScreen = () => {
  const [search, setSearch] = useState<string>("");
  const [activeButtons, setActiveButtons] = useState<boolean[]>([
    true,
    false,
    false,
    false,
  ]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const DATABASEID = "66502c6e0015d7be8526";
  const MEMBERCOLLECTIONID = "6797ac980023a75b2c98";

  useEffect(() => {
    async function getMembersList() {
      try {
        const result = await databases.listDocuments(
          DATABASEID,
          MEMBERCOLLECTIONID,
          [Query.limit(10)],
        );
        if (result?.documents) {
          setMembers(
            result.documents.map((doc) => ({
              id: doc.$id,
              applicant_first_name: doc.applicant_first_name || "N/A",
              phone_number: doc.phone_number || "N/A",
            })),
          );
        } else {
          throw new Error("Invalid data received.");
        }
      } catch (error) {
        console.log(error);
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    }

    getMembersList();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading members...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 font-bold">{error}</Text>
      </View>
    );
  }

  const filteredMembers = search.trim()
    ? members.filter((member) => {
        const lowerCaseSearch = search.toLowerCase();
        const lowerCaseName = member.applicant_first_name
          ?.toLowerCase()
          .includes(lowerCaseSearch);
        const lowerCasePhone = member.phone_number
          ?.toLowerCase()
          .includes(lowerCaseSearch);
        return lowerCaseName || lowerCasePhone;
      })
    : members;

  const handleActiveButton = (index: number) => {
    const newActiveButtons = activeButtons.map((_, i) => i === index);
    setActiveButtons(newActiveButtons);
  };

  const buttonType = activeButtons[0] ? "solid" : "outline";

  return (
    <View>
      {/* search bar and filters */}
      <SearchBar
        placeholder="Type Here..."
        onChangeText={setSearch}
        value={search}
      />

      {/* reset & search button */}
      <View className="w-full flex flex-row items-center justify-between p-2">
        <Button
          title="First Name"
          onPress={() => handleActiveButton(0)}
          size="md"
          radius={"sm"}
          type={buttonType}
        />
        <Button
          title="Last Name"
          onPress={() => handleActiveButton(1)}
          type={buttonType}
          size="md"
          radius={"sm"}
        />
        <Button
          title="Middle Name"
          onPress={() => handleActiveButton(2)}
          type={buttonType}
          size="md"
          radius={"sm"}
        />
        <Button
          title="Bhooth"
          onPress={() => handleActiveButton(3)}
          type={buttonType}
          size="md"
          radius={"sm"}
        />
      </View>

      {/* flat list of search result and preloaded people fname, lname, mname, bhooth */}
      <FlatList
        data={filteredMembers}
        renderItem={({ item }) => <MemberItem {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default SearchScreen;
