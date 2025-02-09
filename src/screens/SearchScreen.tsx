import { useState, useEffect } from "react";
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

// Define colors
const saffron = "#FF9933";
const shadowColor = "#D48F17"; // Slightly darker shade for shadow effects

const BoldText = styled.Text`
  font-weight: bold;
  color: ${saffron};
`;

const NormalText = styled.Text`
  font-weight: normal;
  color: #333;
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
    <View
      style={{
        backgroundColor: "#fff",
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Avatar
        size={40}
        rounded
        title={applicant_first_name.charAt(0)}
        containerStyle={{ backgroundColor: saffron }}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <BoldText>
          Name: <NormalText>{applicant_first_name}</NormalText>
        </BoldText>
        <BoldText>
          Address: <NormalText>{v_address}</NormalText>
        </BoldText>
        <BoldText>
          Mobile: <NormalText>{phone_number}</NormalText>
        </BoldText>
        <BoldText>
          Card Number: <NormalText>{epic_number}</NormalText>
        </BoldText>
      </View>
    </View>
  </TouchableOpacity>
);

const SearchScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>("");
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
        const limit = 10;

        // ✅ Search filters (if search query exists)
        if (debouncedSearch.trim()) {
          queries.push(
            Query.or([
              Query.search("applicant_first_name", debouncedSearch),
              Query.search("phone_number", debouncedSearch),
            ])
          );
        }

        // ✅ Cursor-based pagination (Fixes 5000 limit issue)
        if (lastDocumentId) {
          queries.push(Query.cursorAfter(lastDocumentId));
        }

        queries.push(Query.limit(limit), Query.orderDesc("$createdAt"));

        // ✅ Fetch members
        const result = await databases.listDocuments(
          DATABASEID,
          MEMBERCOLLECTIONID,
          queries
        );

        if (result?.documents) {
          // ✅ Store last document ID for pagination
          if (result.documents.length > 0) {
            setLastDocumentId(
              result.documents[result.documents.length - 1].$id
            );
          }

          // ✅ Map fetched members
          setMembers((prevMembers) => [
            ...prevMembers,
            ...result.documents.map((doc) => ({
              id: doc.$id,
              applicant_first_name: doc.applicant_first_name || "N/A",
              v_address: doc.v_address || "N/A",
              phone_number: doc.phone_number || "N/A",
              epic_number: doc.epic_number || "N/A",
            })),
          ]);

          // ✅ Update total pages dynamically
          setTotalPages(Math.ceil(result.total / limit));
        }
      } catch (error) {
        console.error("❌ Error fetching members:", error);
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    }

    getMembersList();
  }, [currentPage, debouncedSearch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={saffron} />
        <Text style={{ color: saffron }}>Loading members...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontWeight: "bold" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: 10 }}>
      {/* Search bar */}
      <SearchBar
        placeholder="Search by name or phone..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={{
          backgroundColor: "transparent",
          borderBottomWidth: 0,
          borderTopWidth: 0,
        }}
        inputContainerStyle={{
          backgroundColor: "#FFF",
          borderRadius: 10,
          shadowColor: shadowColor,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }}
      />

      {/* Pagination Controls */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Button
          title="Previous"
          onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          buttonStyle={{ backgroundColor: saffron }}
        />
        <Text style={{ color: "#333", fontWeight: "bold" }}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
          buttonStyle={{ backgroundColor: saffron }}
        />
      </View>

      {/* Members List */}
      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberItem
            {...item}
            onPress={() => navigation.navigate("Details", { id: item.id })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default SearchScreen;
