import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Email() {
  const [email, setEmail] = useState('');
  const [loading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [errors, setErrors] = useState<{ error?: string }>({});

  const params = useLocalSearchParams();
  const router = useRouter();


  const validateEmailLocal = (text: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!text) return 'Email is required.';
    if (!emailRegex.test(text))
      return 'Please enter a valid email format.';

    return null;
  };


  const handleEmailChange = (text: string) => {
    setEmail(text);

    const error = validateEmailLocal(text);
    if (error) {
      setErrors({ error });
      return;
    }

    setErrors({});
  };


  const handleNext = () => {
    if (errors.error) {
      Alert.alert('Error', errors.error);
      return;
    }

    router.push({
      pathname: '/(auth)/(register)/password',
      params: { ...params, email },
    });
  };


  const canProceed = !errors.error && email.length > 0 && !loading;


  return (
    <View className="flex-1 mx-6">
      <View className="flex-row items-center gap-3 mt-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Create account</Text>
      </View>

      <View className="mt-16">
        <Text className="text-3xl font-bold">What's your email?</Text>
        <Text className="text-neutral-600">
          You'll need to confirm this email later.
        </Text>
      </View>

      <View
        className={`mt-3 px-4 py-3 rounded-lg border ${
          focused ? 'border-black' : 'border-neutral-300'
        }`}
      >
        <TextInput
          placeholder="johndoe@mail.com"
          value={email}
          onChangeText={handleEmailChange}
          editable={!loading}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="min-h-[20px] mt-1">
        {errors.error && (
          <Text className="text-red-600 text-sm">{errors.error}</Text>
        )}
      </View>

      <View className="mt-1">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed}
          className={
            canProceed
              ? 'flex-row px-6 py-4 bg-blue-600 rounded-xl w-full justify-center items-center'
              : 'px-6 py-4 h-16 rounded-lg bg-gray-300 items-center'
          }
        >
          <Text className="text-white text-xl font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
