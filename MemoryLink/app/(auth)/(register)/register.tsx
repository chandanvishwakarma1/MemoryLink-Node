import { Alert, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function Register() {
  const { register, isLoading } = useAuthStore();
  const router = useRouter()
  const params = useLocalSearchParams()

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const inputs = useRef<TextInput[]>([])

  const email = params.email as string;
  const password = params.password as string;
  const fullName = params.fullName as string;
  const username = params.username as string;
  const birthdate = params.birthdate as string;
  const gender = params.gender as string;
  const hasAcceptedTermsAndPrivacy = params.hasAcceptedTermsAndPrivacy as string;
  // const isVerified = String(isVerified);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  interface KeyPressEvent {
    nativeEvent: {
      key: string;
    };
  }

  const handleKeyPress = (e: KeyPressEvent, index: number): void => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };
  // const handleSignup = async () => {
  //   if (!hasAcceptedTermsAndPrivacy) {
  //     Alert.alert("Hold on!", "You must accept the Terms & Privacy Policy to continue.");
  //     return;
  //   }

  //   const result = await register(username, email, password, fullName, birthdate, gender, hasAcceptedTermsAndPrivacy);
  //   if (!result.success) {
  //     Alert.alert("Error", result.error);
  //     return;
  //   }
  //   router.replace('/(tabs)');
  // }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete code')
      return
    }

    const userOtp = code;
    const result = await register(username, email, password, fullName, birthdate, gender, hasAcceptedTermsAndPrivacy, userOtp);
    if (!result.success) {
      Alert.alert("Error", result.error);
      return;
    }
    router.push({
      pathname: '/(tabs)',
    })
  }

  return (
    <KeyboardAvoidingView
      className="mx-6 items-center justify-center"
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Icon */}
      <Ionicons name="mail-unread-outline" size={96} />

      {/* Title */}
      <Text className="text-2xl font-bold mt-6">
        Verify your email
      </Text>
      <Text className="text-neutral-600 mt-1">
        Enter the 6-digit code sent to your email
      </Text>

      {/* OTP Inputs */}
      <View className="flex-row gap-3 mt-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputs.current[index] = ref! }}
            value={digit}
            onChangeText={(v) => handleChange(v, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            className="border border-neutral-300 w-12 h-12 text-center text-xl rounded-lg"
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity onPress={handleVerify} disabled={isLoading} className='flex-row px-6 py-4 bg-blue-600  rounded-xl w-full shadow-lg justify-center items-center mt-6'>
        {isLoading ?
          <ActivityIndicator color='#fff' />
          :
          <Text className='text-white font-bold text-lg'>Verify & Sign up</Text>
        }
      </TouchableOpacity>
    </KeyboardAvoidingView>
  )
}
