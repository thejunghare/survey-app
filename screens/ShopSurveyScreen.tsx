import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { TextInput, Button, ActivityIndicator, Icon, MD3Colors } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firebase, auth } from '../firebase';
import ActionSheet from "react-native-actions-sheet";

const ShopSurveyScreen: React.FC = () => {
    const [shopName, setShopName] = useState<string>('');
    const [shopOwnerName, setShopOwnerName] = useState<string>('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const actionSheetRef = useRef<null>(null);
    const [show, setShow] = useState<boolean>(false);

    const handleShopNameChange = (value: string) => { setShopName(value) };
    const handleShopOwnerNameChange = (value: string) => { setShopOwnerName(value) };
    const handleShopPhoneNumberChange = (value: string) => { setShopPhoneNumber(value) };

    const handleAddSurveyData = () => {
        if (!shopName && !shopOwnerName && !shopPhoneNumber) alert('* is Required field!')
        console.log(shopName, shopOwnerName, shopPhoneNumber);


        const surveyInfo = {
            createdAt: new Date(),
            shop_name: shopName,
            shop_owner_name: shopOwnerName,
            shop_phone_number: shopPhoneNumber,
        };

        if (shopName && shopOwnerName && shopPhoneNumber ) {
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
    };

    return (
        <ScrollView>
            <View className='m-2'>
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
});

export default ShopSurveyScreen;