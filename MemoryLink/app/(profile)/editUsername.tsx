import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useAuthStore } from '@/store/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function EditUsername() {
    const { user, token } = useAuthStore();
    const [userName, setUserName] = useState(user?.username);
    const [loading, setLoading] = useState(false);
    const [tick, setTick] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const debounceTimeoutRef = useRef<number | null>(null);
    const [selected, setSelected] = useState(false);

    const router = useRouter();

    const debouncedValidate = useCallback((username: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            validateUsername({ username });
        }, 500); // 500ms debounce
    }, []);

    const validateUsername = async ({ username }: { username: string }) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/usernameValidate/${user.id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                })
            })

            let data;
            try {
                data = await response.json();
            } catch (error) {
                data = { message: `Server error: ${response.status} ${response.statusText}` };
            }

            if (!response.ok) throw new Error(data.message || "Something went wrong");
            setLoading(false);
            if (data.success) {
                setTick(true);
                // Alert.alert("Success", `${data.message}`);
            }

        } catch (error) {
            setLoading(false)
            console.log("Error validating username: ", error);
            // Alert.alert("Error", `${error}`);
            setTick(false);

        }
    }

    const handleBack = () => {
        router.navigate('/(profile)/editprofile');
    }
    return (
        <View className='flex-1 mx-6'>
            <View className='flex-row gap-3 items-center mt-3 w-full'>
                <Pressable onPress={handleBack}><Ionicons name='arrow-back-outline' size={26} /></Pressable>
                <Text className='text-2xl font-semibold'>Edit Username</Text>
            </View>
            <View className='gap-1 mt-6'>
                <View><Text className='text-gray-600 font-semibold'>Username</Text></View>
                <View className={selected ? 'flex-row items-center justify-between px-4 py-3 border  border-black-300 rounded-lg bg-white' : 'flex-row items-center justify-between px-4 py-3 border border-neutral-300 rounded-lg bg-white'}>
                    <Text className='w-full'>
                        <TextInput
                            className=''
                            value={userName}
                            onChangeText={(text) => {
                                setUserName(text);
                                if (!hasEdited) setHasEdited(true);
                                debouncedValidate(text);
                            }}
                            autoCapitalize='none'
                            onFocus={() => setSelected(true)}
                            onBlur={() => setSelected(false)}

                            editable={!loading}
                        />

                        {hasEdited && (
                            loading ? (
                                <ActivityIndicator />
                            ) : (
                                <Ionicons name={tick ? 'checkmark-circle-outline' : 'close-circle-outline'} size={24} />
                            )
                        )}
                    </Text>
                </View>
            </View>
        </View>
    )
}