import { useState, useMemo, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SearchBar, Button, Avatar } from "@rneui/themed";
import { databases } from "../appwrite/service";
import { Query } from "appwrite";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";

const BoldText = styled.Text`
  font-weight: bold;
`;

const NormalText = styled.Text`
  font-weight: normal;
`;

type Member = {
  id: string;
  applicant_first_name: string;
  v_address: string;
  phone_number: string;
  epic_number: string;
};

const MemberItem: React.FC<Member & { onPress: () => void }> = ({
  applicant_first_name,
  v_address,
  phone_number,
  epic_number,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View className="w-full flex flex-row items-center justify-around p-4 border-b border-slate-200">
      <View className="w">
        <Avatar
          size={32}
          rounded
          title="Rd"
          containerStyle={{ backgroundColor: "blue" }}
        />
      </View>
      <View className="w-3/4">
        <BoldText>
          Name:
          <NormalText> {applicant_first_name}</NormalText>
        </BoldText>

        <BoldText>
          Address:
          <NormalText>{v_address}</NormalText>
        </BoldText>

        <BoldText>
          Mobile:
          <NormalText>{phone_number}</NormalText>
        </BoldText>

        <BoldText>
          Card number:
          <NormalText>{epic_number}</NormalText>
        </BoldText>
      </View>
    </View>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const navigation = useNavigation();
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const DATABASEID = "66502c6e0015d7be8526";
  const MEMBERCOLLECTIONID = "6797ac980023a75b2c98";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    async function getMembersList() {
      try {
        setLoading(true);
        const queries = [];

        // ➡️ Use server-side search with indexes
        if (debouncedSearch.trim()) {
          queries.push(
            Query.or([
              Query.search("applicant_first_name", debouncedSearch),
              Query.search("phone_number", debouncedSearch),
            ])
          );
        }

        // ➡️ Add pagination parameters
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        const result = await databases.listDocuments(
          DATABASEID,
          MEMBERCOLLECTIONID,
          [
            ...queries,
            Query.limit(limit),
            Query.offset(offset),
            Query.orderDesc("$createdAt"),
          ]
        );

        if (result?.documents) {
          setMembers(
            result.documents.map((doc) => ({
              id: doc.$id,
              applicant_first_name: doc.applicant_first_name || "N/A",
              v_address: doc.v_address || "N/A",
              phone_number: doc.phone_number || "N/A",
              epic_number: doc.epic_number || "N/A",
            }))
          );
          // ➡️ Set pagination totals
          setTotalPages(Math.ceil(result.total / limit));
        }
      } catch (error) {
        console.log(error);
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    }

    getMembersList();
  }, [currentPage, debouncedSearch]);

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
        placeholder="Search by name or phone..."
        onChangeText={setSearch}
        value={search}
      />

      {/* ➡️ Add pagination controls */}
      <View className="flex flex-row justify-between items-center p-4">
        <Button
          title="Previous"
          onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        />
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        />
      </View>

      {/* reset & search button */}
      {/* <View className="w-full flex flex-row items-center justify-between p-2">
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
      </View> */}

      {/* flat list of search result and preloaded people fname, lname, mname, bhooth */}
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberItem
            {...item}
            onPress={() => navigation.navigate("Details", { id: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default SearchScreen;
