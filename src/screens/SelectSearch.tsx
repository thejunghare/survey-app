import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../routes/AppStack";
import { Icon } from "@rneui/themed";
import styled from "styled-components/native";

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
    <View className={'flex flex-col w-1/2'}>
      <TouchableOpacity
        className="w-full flex flex-row items-center justify-around"
        onPress={handlePress} // Trigger navigation on press
      >
        <Icon name={icon} type="feather" color="#517fa4" className="w-1/5 bg-white rounded p-2" />
        <Text className="bg-white p-4 shadow-md m-2 rounded-lg w-4/5">
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};



const SelectSearch = ({ navigation }: SelectSearchProps) => {
  const LABEL = [
    {
      id: 1,
      title: "First Name",
      icon: "user",
      nav: "Search Screen",
    },
    {
      id: 2,
      title: "Last Name",
      icon: "users",
      nav: "Search Screen",
    },
    {
      id: 3,
      title: "Mobile Number",
      icon: "phone",
      nav: "Search Screen",
    },
    {
      id: 4,
      title: "Booth",
      icon: "home",
      nav: "Search Screen",
    },
  ];

  return (
    <View>
      <FlatList
        data={LABEL}
        renderItem={({ item }) => <Item {...item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default SelectSearch;
