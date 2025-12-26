import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import GenderBubble from '@/components/GenderBubble';

export default function Gender() {
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState('');
    const params = useLocalSearchParams();

    const router = useRouter();

    return (
        <View className='flex-1 mx-6'>
            <View className='flex-row items-center gap-3  w-full mt-3'>
                <Ionicons name='chevron-back-outline' size={24} />
                <Text className='text-2xl font-semibold'>Create account</Text>
            </View>

            <View className='mt-16'>
                <Text className='text-3xl font-bold'>What's your gender?</Text>
            </View>

            <View className='flex-row flex-wrap rounded-lg mt-3 gap-3'>
                <GenderBubble title='Female' />
                <GenderBubble title='Male' />
                <GenderBubble title='Other' />
                <GenderBubble title='Prefer not to say' />
            </View>

        </View>
    )
}