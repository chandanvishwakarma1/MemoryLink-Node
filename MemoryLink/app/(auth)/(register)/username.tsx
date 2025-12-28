import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Username() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(false);
    const [errors, setErrors] = useState<{ error?: string }>({});
    const [isDisabled, setIsDisabled] = useState(true);
    const params = useLocalSearchParams();

    const [nameloading, setNameLoading] = useState(false);
    const [tick, setTick] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const debounceTimeoutRef = useRef<number | null>(null);

    const router = useRouter();

    const handleNext = () => {
        if (!errors.error) {
            router.push({
                pathname: '/(auth)/(register)/birthdate',
                params: { ...params, username }
            })
        } else {
            Alert.alert("Error", errors.error)
        }
    }

    const debouncedValidate = useCallback((text: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            validateUsername({ text });
        }, 300); 
    }, []);

    const validateUsername = async ({ text }: { text: string }) => {
        const lowerCaseUsername = text.toLowerCase();
        setUsername(lowerCaseUsername);

        // Reset validation states
        setTick(false);
        setErrors({});
        setIsDisabled(true);

        try {
            // Client-side validation first
            if (lowerCaseUsername.length < 3) {
                setErrors({ error: "Username must be at least 3 characters long." });
                return;
            }

            if (lowerCaseUsername.length > 20) {
                setErrors({ error: "Username must be no more than 20 characters long." });
                return;
            }

            // Only allow lowercase letters, numbers, underscores, and periods
            const usernameRegex = /^[a-z0-9_.]+$/;
            if (!usernameRegex.test(lowerCaseUsername)) {
                setErrors({ error: "Username can only contain letters, numbers, underscores, and periods." });
                return;
            }

            // Check for consecutive special characters
            if (lowerCaseUsername.includes('__') || lowerCaseUsername.includes('..') || lowerCaseUsername.includes('_.') || lowerCaseUsername.includes('._')) {
                setErrors({ error: "Username cannot contain consecutive special characters." });
                return;
            }

            // Username cannot start or end with special characters
            if (lowerCaseUsername.startsWith('_') || lowerCaseUsername.startsWith('.') ||
                lowerCaseUsername.endsWith('_') || lowerCaseUsername.endsWith('.')) {
                setErrors({ error: "Username cannot start or end with special characters." });
                return;
            }

            // If all client-side validation passes, make API call
            setNameLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/usernameValidate`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: lowerCaseUsername,
                })
            });

            let data;
            try {
                data = await response.json();
            } catch (error) {
                data = { message: `Server error: ${response.status} ${response.statusText}` };
            }

            if (!response.ok) throw new Error(data.message || "Something went wrong");

            setNameLoading(false);
            if (data.success) {
                setTick(true);
                setErrors({});
                setIsDisabled(false);
            }
        } catch (error) {
            setNameLoading(false);
            setErrors({ error: String(error) });
            setIsDisabled(true);
            console.log("Error validating username: ", error);
            setTick(false);
        }
    }
    return (
        <View className='flex-1 mx-6 '>
            <View className='flex-row items-center gap-3  w-full mt-3'>
                <TouchableOpacity onPress={() => router.back()}><Ionicons name='chevron-back-outline' size={24} /></TouchableOpacity>
                <Text className='text-2xl font-semibold'>Create account</Text>
            </View>

            <View className='mt-16'>
                <Text className='text-3xl font-bold'>Create a username</Text>
                <Text className='text-neutral-600 '>You can change this at any time.</Text>
            </View>

            <View className={selected ? 'flex-row items-center justify-between px-4 py-3 border  border-black-300 rounded-lg bg-white' : 'flex-row items-center justify-between px-4 py-3 border border-neutral-300 rounded-lg bg-white'}>
                <TextInput
                    placeholder='johndoe'
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text);
                        if (!hasEdited) setHasEdited(true);

                        // Reset validation states when input changes significantly
                        if (tick || errors.error) {
                            setTick(false);
                            setErrors({});
                            setIsDisabled(true);
                        }

                        debouncedValidate(text);
                    }}
                    editable={!loading}
                    onFocus={() => setSelected(true)}
                    onBlur={() => setSelected(false)}
                    autoCapitalize='none'
                    maxLength={20} 
                />
                {hasEdited && (
                    nameloading ? (
                        <ActivityIndicator />
                    ) : (
                        <Ionicons name={tick ? 'checkmark-circle-outline' : 'close-circle-outline'} size={24} />
                    )
                )}
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
