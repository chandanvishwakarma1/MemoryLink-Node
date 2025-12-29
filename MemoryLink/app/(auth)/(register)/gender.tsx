import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GenderBubble from '@/components/GenderBubble';

export default function Gender() {
    const [selectedGender, setSelectedGender] = useState('');
    const params = useLocalSearchParams();
    const router = useRouter();

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
        router.push({
            pathname: '/(auth)/(register)/review',
            params: { ...params, gender }
        });
    };
    return (
        <View className='flex-1 mx-6'>
            <View className='flex-row items-center gap-3  w-full mt-3'>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name='chevron-back-outline' size={24} /></TouchableOpacity>
                <Text className='text-2xl font-semibold'>Create account</Text>
            </View>

            <View className='mt-16'>
                <Text className='text-3xl font-bold'>What's your gender?</Text>
            </View>

            <View className='flex-row flex-wrap rounded-lg mt-3 gap-3'>
                <GenderBubble title='Female' handleNext={() => handleGenderSelect('Female')} isSelected={selectedGender === 'Female'} />
                <GenderBubble title='Male' handleNext={() => handleGenderSelect('Male')} isSelected={selectedGender === 'Male'} />
                <GenderBubble title='Other' handleNext={() => handleGenderSelect('Other')} isSelected={selectedGender === 'Other'} />
                <GenderBubble title='Prefer not to say' handleNext={() => handleGenderSelect('Prefer not to say')} isSelected={selectedGender === 'Prefer not to say'} />
            </View>

        </View>
    )
}
