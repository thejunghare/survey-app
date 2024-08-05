import React from 'react';
import {SafeAreaView, Text, View, Button, Alert} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {Icon} from '@rneui/themed';
import {toast} from "../appwrite/toast";

interface VoterDetailsViewProps {
    voter: Voter;
}

const VoterDetailsView: React.FC<VoterDetailsViewProps> = ({voter}) => {
    const handleCopy = (text: string) => {
        Clipboard.setString(text);
        toast('copied');
    };


    return (
        <SafeAreaView className='flex-1 p-4'>
            <View>
                <Text className='text-xl font-bold'>Voter Details</Text>
                {/*appplicant first name*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>First name: {voter.first_name}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.first_name)}/>
                </View>

                {/*applicant last name*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Last name: {voter.last_name}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.last_name)}/>
                </View>

                {/*applicant age*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Age: {voter.age}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.age)}/>
                </View>

                {/*applicant gender*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Gender: {voter.gender}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.gender)}/>
                </View>

                {/*applicant address*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Address: {voter.address}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.address)}/>
                </View>

                {/*applicant house number*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>House/Room number: {voter.house_number}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.house_number)}/>
                </View>

                {/*applicant epic number*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Epic number: {voter.epic_number}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.epic_number)}/>
                </View>

                {/*applicant booth address*/}
                <View className={'flex flex-row items-center'}>
                    <Text className='mt-4'>Booth address: {voter.booth_address}</Text>
                    <Icon name='copy' size={16} type={'feather'} onPress={() => handleCopy(voter.booth_address)}/>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default VoterDetailsView;
