import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Password() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const [selected, setSelected] = useState(false);
    const [errors, setErrors] = useState<{ error?: string }>({});
    const [isDisabled, setIsDisabled] = useState(true);
    const params = useLocalSearchParams();

    const router = useRouter();
    const handleNext = () => {
        if (!errors.error) {
            router.push({
                pathname: ('/(auth)/(register)/fullName'),
                params: { ...params, password }
            })
        } else {
            Alert.alert("Error", errors.error)
        }
    }
    const validatePassword = (text: string) => {
        setPassword(text);
        if (!text) {
            setErrors({ error: "Password is required." });
            setIsDisabled(true);
        } else if (text.length < 10) {
            setErrors({ error: "Password must be atleast 10 characters." });
            setIsDisabled(true);
        } else if (!/\d/.test(text)) {
            setErrors({ error: "Password must contain atleast one number." });
            setIsDisabled(true);
        } else if (!/[A-Z]/.test(text)) {
            setErrors({ error: "Password must contain atleast one Uppercase letter." });
            setIsDisabled(true);
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
            setErrors({ error: "Password must contain atleast one Special character." });
            setIsDisabled(true);
        } else {
            setErrors({});
            setIsDisabled(false);
        }

    }
    return (
        <View className='flex-1 mx-6 '>
            <View className='flex-row items-center gap-3  w-full mt-3'>
                <Ionicons name='chevron-back-outline' size={24} />
                <Text className='text-2xl font-semibold'>Create account</Text>
            </View>

            <View className='mt-16'>
                <Text className='text-3xl font-bold'>Create a password</Text>
                <Text className='text-neutral-600 '>Use atleast 10 characters.</Text>
            </View>

            <View className={selected ? 'border border-black-300 rounded-lg mt-3 px-4 py-3' : 'border border-neutral-300 rounded-lg mt-3 px-4 py-3'}>
                <TextInput
                    placeholder='**********'
                    value={password}
                    onChangeText={validatePassword}
                    editable={!loading}
                    onFocus={() => setSelected(true)}
                    onBlur={() => setSelected(false)}
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
                <TouchableOpacity onPress={handleNext} className={isDisabled ? 'px-6 py-4 rounded-lg bg-gray-300 items-center' : 'px-6 py-4 rounded-lg bg-blue-600 items-center'} disabled={isDisabled}>
                    <Text className='text-white text-xl font-semibold'>Next</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}