import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, ActivityIndicator, Icon, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase, auth } from '../firebase';
import ActionSheet from "react-native-actions-sheet";
import { Dropdown } from 'react-native-element-dropdown';

interface DataItem {
    label: string;
    value: string;
}

const ShopSurveyScreen: React.FC = () => {
    const [shopName, setShopName] = useState<string>('');
    const [shopOwnerName, setShopOwnerName] = useState<string>('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState<string>('');
    const [division, setDivision] = useState<string>('');
    const [ward, setWard] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const actionSheetRef = useRef<null>(null);
    const [show, setShow] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [checked, setChecked] = React.useState(false);
    const [divisionData, setDivisionData] = useState<DataItem[]>([]);
    const [wardData, setWardData] = useState<DataItem[]>([]);

    useEffect(() => {
        const fetchDivisionData = async () => {
            try {
                const divisionSnapshot = await employeeRef.doc(currentUser.uid).collection('divisions').get();
                const divisionData: DataItem[] = divisionSnapshot.docs.map(doc => ({
                    label: doc.data().name,
                    value: doc.data()._id,
                }));
                setDivisionData(divisionData);
            } catch (error) {
                console.error("Error fetching division data: ", error);
            }
        };

        const fetchWardData = async () => {
            try {
                const divisionSnapshot = await employeeRef.doc(currentUser.uid).collection('divisions').get();
                const wardData: DataItem[] = [];

                await Promise.all(divisionSnapshot.docs.map(async divisionDoc => {
                    const wardSnapshot = await divisionDoc.ref.collection('wards').get();
                    wardSnapshot.forEach(wardDoc => {
                        wardData.push({
                            label: wardDoc.data().name,
                            value: wardDoc.data()._id,
                        });
                    });
                }));

                setWardData(wardData);
            } catch (error) {
                console.error("Error fetching ward data: ", error);
            }
        };

        const currentUser = firebase.auth().currentUser;
        const employeeRef = firebase.firestore().collection('employee');

        if (currentUser) {
            fetchDivisionData();
            fetchWardData();
        }
    }, [firebase.auth().currentUser]);



    const handleShopNameChange = (value: string) => { setShopName(value) };
    const handleShopOwnerNameChange = (value: string) => { setShopOwnerName(value) };
    const handleShopPhoneNumberChange = (value: string) => { setShopPhoneNumber(value) };
    const handleDivisionChange = (value: string) => { setDivision(value) };
    const handleWardChange = (value: string) => { setWard(value) };

    const handleAddSurveyData = () => {
        if (!shopName && !shopOwnerName && !shopPhoneNumber) alert('* is Required field!')
        console.log(shopName, shopOwnerName, shopPhoneNumber, division, ward);


        const surveyInfo = {
            createdAt: new Date(),
            shop_name: shopName,
            shop_owner_name: shopOwnerName,
            shop_phone_number: shopPhoneNumber,
        };

        if (shopName && shopOwnerName && shopPhoneNumber) {
            addSurveyDataToFirestore(surveyInfo);
        }
    };

    const addSurveyDataToFirestore = async (surveyInfo: any) => {
        setLoading(true);

        try {
            const currentEmployee = firebase.auth().currentUser;
            if (currentEmployee) {
                const shopSurveyRef = firebase
                    .firestore()
                    .collection('employee')
                    .doc(currentEmployee.uid)
                    .collection('divisions')
                    .doc(division)
                    .collection('wards')
                    .doc(ward)
                    .collection('shop-survey');

                await shopSurveyRef.add(surveyInfo);
                console.log('Data added');

                actionSheetRef.current?.show();
                resetFormOptions();
                setLoading(false);
            } else {
                console.error('No employee is currently authenticated');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error adding data: ', error);
            setLoading(false);
        }
    };

    const resetFormOptions = () => {
        setShopName('');
        setShopOwnerName('');
        setShopPhoneNumber('');
        setDivision('');
        setWard('');
    };

    return (
        <ScrollView>
            <View className='m-2'>
                <View className='w-full flex flex-row justify-around'>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={divisionData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select division' : '...'}
                        searchPlaceholder="Search..."
                        value={division}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setDivision(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <View className='mr-1.5'>
                                <Icon
                                    source="map-marker-outline"
                                    size={20}
                                />
                            </View>

                        )}
                    />

                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={wardData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select ward' : '...'}
                        searchPlaceholder="Search..."
                        value={ward}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setWard(item.value);
                            setIsFocus(false);
                        }}
                        renderLeftIcon={() => (
                            <View className='mr-1.5'>
                                <Icon
                                    source="map-marker-multiple-outline"
                                    size={20}
                                />
                            </View>

                        )}
                    />
                </View>
                <TextInput
                    label='Shop name'
                    mode='outlined'
                    value={shopName}
                    onChangeText={handleShopNameChange}
                    right={<TextInput.Icon icon="shopping-outline" />}
                    className='m-2'
                />
                <TextInput
                    label='Shop owner name'
                    mode='outlined'
                    value={shopOwnerName}
                    onChangeText={handleShopOwnerNameChange}
                    className='m-2'
                    right={<TextInput.Icon icon="account-circle-outline" />}
                />
                <TextInput
                    label='Shop phone number'
                    mode='outlined'
                    value={shopPhoneNumber}
                    onChangeText={handleShopPhoneNumberChange}
                    className='m-2'
                    right={<TextInput.Icon icon="phone-outline" />}
                />

                <View className='w-full flex flex-row items-center p-3.5'>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                    <Text className='mx-2'>I affirm that all provided information is accurate, and there are no typos in the submitted form.</Text>
                </View>



                <Button
                    mode='contained'
                    textColor='#f2f2f2'
                    buttonColor='#5783B9'
                    onPress={handleAddSurveyData}
                    className='m-1.5'
                >
                    {loading ? (
                        <ActivityIndicator animating={true} color={'white'} />
                    ) : (
                        'Submit'
                    )}
                </Button>
            </View>

            <ActionSheet ref={actionSheetRef}>
                <View style={styles.notificationContainer}>
                    <Icon
                        source='check-circle-outline'
                        color={'#5783B9'}
                        size={70}
                    />
                    <Text></Text>
                </View>
            </ActionSheet>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    notificationContainer: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 5,
        width: '48%',
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default ShopSurveyScreen;