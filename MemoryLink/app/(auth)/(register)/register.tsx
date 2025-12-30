import { Alert, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function Register() {
  const { register, isLoading, requestResendOtp } = useAuthStore();
  const router = useRouter()
  const params = useLocalSearchParams()

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const inputs = useRef<TextInput[]>([])
  const isOtpComplete = otp.every(digit => digit !== '')

  const email = params.email as string;
  const password = params.password as string;
  const fullName = params.fullName as string;
  const username = params.username as string;
  const birthdate = params.birthdate as string;
  const gender = params.gender as string;
  const hasAcceptedTermsAndPrivacy = params.hasAcceptedTermsAndPrivacy as string;

  const RESEND_COOLDOWN = 60;
  const MAX_RESEND_ATTEMPTS = 3;
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [isResending, setIsResending] = useState(false);
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResendOtp = async () => {
    if (secondsLeft > 0) return;

    if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
      Alert.alert(
        "Limit reached",
        "You have reached the maximum resend attempts. Please try again later."
      );
      return;
    }

    try {
      setIsResending(true);

      const result = await requestResendOtp({ email });

      if (!result || !result.success) {
        throw new Error(result?.error || result?.message || "Failed to resend OTP. Please try again later.");
      }

      // Reset OTP input
      setOtp(Array(6).fill(''));
      inputs.current[0]?.focus();

      // Reset timer
      setSecondsLeft(RESEND_COOLDOWN);
      setResendAttempts(prev => prev + 1);

    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsResending(false);
    }
  };


  const handleChange = (value: string, index: number) => {
    // Handle paste of full code
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)

      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, 5)
      inputs.current[nextIndex]?.focus()
      return
    }

    // Single digit input
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

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete code')
      return
    }

    const userOtp = code;
    const result = await register(username, email, password, fullName, birthdate, gender, hasAcceptedTermsAndPrivacy, userOtp);
    if (!result.success) {
      Alert.alert("Error", typeof result.error === 'string' ? result.error : JSON.stringify(result.error));
      return;
    }
    router.push({
      pathname: '/(tabs)',
    })
  }

  return (
    <KeyboardAvoidingView
      className="mx-6"
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className='flex-row items-center gap-3 w-full mt-3'>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name='close-outline' size={24} /></TouchableOpacity>
        <Text className='text-2xl font-semibold'>Create account</Text>
      </View>
      {/* Icon */}
      <Ionicons name="mail-unread-outline" size={96} className='mt-16' />

      {/* Title */}
      <Text className="text-3xl font-bold mt-6">
        Verify your email
      </Text>
      <Text className="text-neutral-600 mt-1">
        Enter the 6-digit code sent to your email. The code is valid for 10 minutes.
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
            textContentType="oneTimeCode"
            autoComplete="sms-otp"
            className={`border w-12 h-12 text-center text-xl rounded-lg ${digit ? 'border-blue-500 bg-blue-50' : isOtpComplete ? 'border-green-500 bg-green-50' : 'border-neutral-300'}`}
          />
        ))}
      </View>

      {/* Verify Button */}
      <TouchableOpacity onPress={handleVerify} disabled={isLoading || !isOtpComplete} className={`flex-row px-6 h-16 rounded-xl w-full shadow-lg justify-center items-center mt-6 ${isOtpComplete ? 'bg-blue-600' : 'bg-gray-400'}`}>
        {isLoading ?
          <ActivityIndicator color='#fff' />
          :
          <Text className='text-white font-bold text-lg'>Verify & Sign up</Text>
        }
      </TouchableOpacity>

      <View className="flex items-center justify-center mt-4">
        <Text className="text-neutral-600 text-center">
          Didn’t receive code?{" "}
          <Text
            onPress={handleResendOtp}
            className={`font-semibold ${secondsLeft > 0 || isResending || resendAttempts >= MAX_RESEND_ATTEMPTS
              ? 'text-neutral-400'
              : 'text-blue-600'
              }`}
          >
            {isResending
              ? 'Sending...'
              : secondsLeft > 0
                ? `Resend in ${secondsLeft}s`
                : resendAttempts >= MAX_RESEND_ATTEMPTS
                  ? 'Resend limit reached'
                  : 'Resend'}
          </Text>
        </Text>
        {resendAttempts > 0 && resendAttempts < MAX_RESEND_ATTEMPTS && (
          <Text className="text-neutral-500 text-sm mt-1">
            {MAX_RESEND_ATTEMPTS - resendAttempts} resend attempt remaining
          </Text>
        )}
      </View>


    </KeyboardAvoidingView>
  )
}
