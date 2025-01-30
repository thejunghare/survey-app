import {useState, useMemo} from 'react';
import {View, FlatList, Text} from 'react-native';
import {SearchBar, Button, ListItem} from '@rneui/themed';

const SearchScreen = () => {
    const [search, setSearch] = useState<string>("");
    const [activeButtons, setActiveButtons] = useState<boolean[]>([true, false, false, false]);

    const DATA = [
        {
            id: 1,
            name: 'First item',
            address: 'Some address here',
            phone_number: '1234567890',
            card_number: '1234567890'
        },
        {
            id: 2,
            name: 'Second item',
            address: 'Some address here',
            phone_number: '1234567890',
            card_number: '1234567890'
        },
    ];

    type ItemProps = { name: string, address: string, number: string, card_number: string }

    const Item = ({name, address, number, card_number}: ItemProps) => (
        <View className='bg-white p-2 shadow-md m-2 rounded'>
            <Text>Full Name: {name}</Text>
            <Text>Address: {address}</Text>
            <Text>Number: {number}</Text>
            <Text>Card No: {card_number}</Text>
        </View>
    );

    const handleActiveButton = (index: number) => {
        const newActiveButtons = activeButtons.map((_, i) => i === index);
        setActiveButtons(newActiveButtons);
    };

    const buttonType = activeButtons[0] ? 'solid' : 'outline'

    const filteredData = useMemo(() => {
        const lowerCaseSearch = search.toLowerCase();
        return DATA.filter(item => {
            const lowerCaseName = item.name.toLowerCase();
            const lowerCaseCategory = item.name.toLowerCase();
            return (
                lowerCaseName.includes(lowerCaseSearch) ||
                lowerCaseCategory.includes(lowerCaseSearch)
            );
        });
    }, [search, DATA]);

    return (
        <View>
            {/* search bar and filetrs */}
            <SearchBar
                placeholder="Type Here..."
                onChangeText={setSearch}
                value={search}
            />

            {/* reset & search button */}
            <View className='w-full flex flex-row items-center justify-between p-2'>
                <Button
                    title="First Name"
                    onPress={() => handleActiveButton(0)}
                    size='md'
                    radius={'sm'}
                    type={buttonType}
                />
                <Button title="Last Name" onPress={() => handleActiveButton(1)} type={buttonType} size='md' radius={'sm'}/>
                <Button title="Middle Name" onPress={() => handleActiveButton(2)} type={buttonType} size='md' radius={'sm'}/>
                <Button title="Bhooth" onPress={() => handleActiveButton(3)} type={buttonType} size='md' radius={'sm'}/>
            </View>

            {/* flat list of search result and preloaded people fname, lname, mname, bhooth */}
            <FlatList
                data={filteredData}
                renderItem={
                    ({item}) =>
                        (
                            <Item
                                name={item.name}
                                address={item.address}
                                number={item.phone_number}
                                card_number={item.card_number}
                            />
                        )
                }
                keyExtractor={item => item.id}
            />
        </View>
    )
}

export default SearchScreen;