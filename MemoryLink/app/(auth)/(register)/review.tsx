import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/store/authStore';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import TermsCondition from '@/components/TermsCondition';
import PrivacyPolicy from '@/components/PrivacyPolicy';

export default function Register() {
    const [hasAcceptedTermsAndPrivacy, setHasAcceptedTermsAndPrivacy] = useState(false);
    const { requestOtp, isLoading } = useAuthStore();
    const params = useLocalSearchParams();

    const snapPoints = ["40%", "90%"];

    const termsSheetRef = useRef<BottomSheet>(null);
    const policySheetRef = useRef<BottomSheet>(null);

    const openTermsSheet = () => termsSheetRef.current?.snapToIndex(1);
    const openPolicySheet = () => policySheetRef.current?.snapToIndex(1);

    const email = params.email as string;
    const password = params.password as string;
    const fullName = params.fullName as string;
    const username = params.username as string;
    const birthdate = params.birthdate as string;
    const gender = params.gender as string;


    const router = useRouter();

    const handleNext = async () => {
        if (!hasAcceptedTermsAndPrivacy) {
            Alert.alert("Hold on!", "You must accept the Terms & Privacy Policy to continue.");
            return;
        } else {
            const result = await requestOtp({ email });
            if (result && !result.success === false) {
                router.push({
                    pathname: '/(auth)/(register)/register',
                    params: { ...params, hasAcceptedTermsAndPrivacy: String(hasAcceptedTermsAndPrivacy) }
                })
            }
        }
    }

        return (
            <>
                <View className='flex-1 mx-6'>
                    <View className='flex-row items-center gap-3 w-full mt-3'>
                        <TouchableOpacity onPress={() => router.back()}><Ionicons name='chevron-back-outline' size={24} /></TouchableOpacity>
                        <Text className='text-2xl font-semibold'>Create account</Text>
                    </View>
                    <View className='mt-16'>
                        <Text className='text-3xl font-bold'>Tap Sign up to create account</Text>
                        <Text className='text-neutral-600'>Review your information and create account.</Text>
                    </View>
                    <View className='gap-3 mt-6'>
                        <View className='flex-row justify-between items-center border border-neutral-300 py-6 px-4 rounded-lg'>
                            <Text className='text-neutral-600'>Full name</Text>
                            <Text className='font-semibold'>{fullName}</Text>
                        </View>
                        <View className='flex-row justify-between items-center border border-neutral-300 py-6 px-4 rounded-lg'>
                            <Text className='text-neutral-600'>Username</Text>
                            <Text className='font-semibold'>{username}</Text>
                        </View>
                        <View className='flex-row justify-between items-center border border-neutral-300 py-6 px-4 rounded-lg'>
                            <Text className='text-neutral-600'>Email Address</Text>
                            <Text className='font-semibold'>{email}</Text>
                        </View>
                        <View className='flex-row justify-between items-center border border-neutral-300 py-6 px-4 rounded-lg'>
                            <Text className='text-neutral-600'>Date of birth</Text>
                            <Text className='font-semibold'>{birthdate}</Text>
                        </View>
                        <View className='flex-row justify-between items-center border border-neutral-300 py-6 px-4 rounded-lg'>
                            <Text className='text-neutral-600'>Gender</Text>
                            <Text className='font-semibold'>{gender}</Text>
                        </View>
                    </View>
                    <View>
                        <BouncyCheckbox
                            className='border p-3 rounded-lg border-neutral-300 mt-3'
                            fillColor='lightblue'
                            onPress={(isChecked) => {
                                setHasAcceptedTermsAndPrivacy(isChecked);
                                // console.log("Checkbox is now:", isChecked); 
                            }}
                            textStyle={{
                                textDecorationLine: 'none',
                            }}
                            textComponent={
                                <Text className='ml-4 flex-wrap'>
                                    I have read, understood and accepted the
                                    <Text className='underline text-blue-600' onPress={openTermsSheet}> Terms of Use </Text>
                                    •
                                    <Text className='underline text-blue-600' onPress={openPolicySheet}> Privacy Policy </Text>
                                </Text>
                            }

                            text='I have read, understood and accepted the Terms of Use'
                        />
                    </View>
                    <TouchableOpacity onPress={handleNext} disabled={isLoading} className='flex-row px-6 py-4 bg-blue-600  rounded-xl w-full shadow-lg justify-center items-center mt-6'>
                        {isLoading ?
                            <ActivityIndicator color='#fff' />
                            :
                            <Text className='text-white font-bold text-lg'>Next</Text>
                        }
                    </TouchableOpacity>
                </View>

                {/* Terms Sheet */}
                <BottomSheet ref={termsSheetRef} snapPoints={snapPoints} enablePanDownToClose={true} index={-1}>
                    <BottomSheetView>
                        <TermsCondition />
                    </BottomSheetView>
                </BottomSheet>

                {/* Privacy Policy Sheet */}
                <BottomSheet ref={policySheetRef} snapPoints={snapPoints} enablePanDownToClose={true} index={-1}>
                    <BottomSheetView>
                        <PrivacyPolicy />
                    </BottomSheetView>
                </BottomSheet>
            </>
        )
    }
