import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../routes/AppStack";
import { Icon } from "@rneui/themed";

type SelectSearchProps = NativeStackNavigationProp<
  AppStackParamList,
  "Select Search"
>;

type LabelType = {
  id: number;
  title: string;
  icon: string;
  nav: string;
};

type ItemProps = LabelType & {
  navigation: SelectSearchProps;
};

const Item: React.FC<ItemProps> = ({ id, title, icon, nav, navigation }) => {
  const handlePress = () => {
    if (nav) {
      navigation.navigate(nav);
    }
  };

  return (
    <View className="flex flex-col border-b border-slate-300 bg-white rounded-lg shadow-md my-2">
      <TouchableOpacity
        className="w-full flex flex-row items-center p-4 space-x-4 active:scale-95 transition-transform duration-150"
        onPress={handlePress}
      >
        <View className="bg-blue-100 p-3 rounded-full">
          <Icon name={icon} type="feather" color="#1E40AF" size={24} />
        </View>
        <Text className="text-lg font-semibold text-gray-800 flex-1">
          {title}
        </Text>
        <Icon name="chevron-right" type="feather" color="#64748B" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const SelectSearch = ({ navigation }: { navigation: SelectSearchProps }) => {
  const LABEL = [
    { id: 1, title: "First Name", icon: "user", nav: "Search Screen" },
    { id: 2, title: "Last Name", icon: "users", nav: "Search Screen" },
    { id: 3, title: "Mobile Number", icon: "phone", nav: "Search Screen" },
    { id: 4, title: "Booth", icon: "home", nav: "Search Screen" },
  ];

  return (
    <View className="flex-1 bg-white p-2">
      <FlatList
        data={LABEL}
        renderItem={({ item }) => <Item {...item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default SelectSearch;
