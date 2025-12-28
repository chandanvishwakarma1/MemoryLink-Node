import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Email() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [errors, setErrors] = useState<{ error?: string }>({});
    const [isDisabled, setIsDisabled] = useState(true);
    const params = useLocalSearchParams();

    const router = useRouter();

    const handleNext = () => {
        if (!errors.error) {
            router.push({
                pathname: '/(auth)/(register)/password',
                params: { ...params, email }
            })
        } else {
            Alert.alert("Error", errors.error)
        }
    } 
    const validateEmail = (text: string) => {
        setEmail(text);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!text) {
            setErrors({ error: "Email is required." });
            setIsDisabled(true);
        } else if (!emailRegex.test(text)) {
            setErrors({ error: "Please enter a valid email format." });
            setIsDisabled(true);
        } else {
            setErrors({});
            setIsDisabled(false);
        }
    };

    return (
        <View className='flex-1 mx-6 '>
            <View className='flex-row items-center gap-3  w-full mt-3'>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name='chevron-back-outline' size={24} /></TouchableOpacity>
                <Text className='text-2xl font-semibold'>Create account</Text>
            </View>

            <View className='mt-16'>
                <Text className='text-3xl font-bold'>What's your email?</Text>
                <Text className='text-neutral-600 '>You'll need to confirm this email later.</Text>
            </View>

            <View className={selected ? 'border border-black-300 rounded-lg mt-3 px-4 py-3' : 'border border-neutral-300 rounded-lg mt-3 px-4 py-3'}>
                <TextInput
                    placeholder='johndoe@mail.com'
                    value={email}
                    onChangeText={validateEmail}
                    editable={!loading}
                    onFocus={() => setSelected(true)}
                    onBlur={() => setSelected(false)}
                    autoCapitalize='none'
                    keyboardType='email-address'
                />
            </View>
            <View className="min-h-[6px] mt-1">
                {errors.error && (
                    <Text className="text-red-600 text-sm">
                        {errors.error}
                    </Text>
                )}
            </View>



            <View className='mt-6'>
                <TouchableOpacity onPress={handleNext} className={isDisabled ? 'px-6 py-4 rounded-lg bg-gray-300 items-center' : 'flex-row px-6 py-4 bg-blue-600  rounded-xl w-full justify-center items-center mt-6'} disabled={isDisabled}>
                    <Text className='text-white text-xl font-semibold'>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}
