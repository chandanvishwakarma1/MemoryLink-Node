import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';


type UsernameStatus =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'taken';


export default function Username() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<UsernameStatus>('idle');
  const [errors, setErrors] = useState<{ error?: string }>({});
  const [hasEdited, setHasEdited] = useState(false);
  const [focused, setFocused] = useState(false);

  const debounceTimeoutRef = useRef<number | null>(null);


  const usernameRegex = /^[a-z0-9_.]+$/;


  const validateLocalUsername = (text: string): string | null => {
    if (!text) return 'Username is required.';
    if (text.length < 3) return 'Username must be at least 3 characters long.';
    if (text.length > 20)
      return 'Username must be no more than 20 characters long.';
    if (!usernameRegex.test(text))
      return 'Only lowercase letters, numbers, underscores, and periods allowed.';
    if (/(__|\.\.|_\.|\._)/.test(text))
      return 'Username cannot contain consecutive special characters.';
    if (/^[_\.]|[_\.]$/.test(text))
      return 'Username cannot start or end with special characters.';
    return null;
  };


  const debouncedValidate = useCallback((text: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        setStatus('checking');

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/usernameValidate`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: text }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('available');
        } else {
          setStatus('taken');
        }
      } catch {
        setStatus('taken');
      }
    }, 300);
  }, []);


  const handleUsernameChange = (text: string) => {
    const lower = text.toLowerCase();
    setUsername(lower);
    if (!hasEdited) setHasEdited(true);

    const error = validateLocalUsername(lower);

    if (error) {
      setErrors({ error });
      setStatus('invalid');
      return;
    }

    setErrors({});
    debouncedValidate(lower);
  };


  const handleNext = () => {
    if (status !== 'available') {
      Alert.alert('Error', 'Please choose a valid username.');
      return;
    }

    router.push({
      pathname: '/(auth)/(register)/birthdate',
      params: { ...params, username },
    });
  };


  const canProceed = status === 'available';


  return (
    <View className="flex-1 mx-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 mt-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">Create account</Text>
      </View>

      {/* Title */}
      <View className="mt-16">
        <Text className="text-3xl font-bold">Create a username</Text>
        <Text className="text-neutral-600">
          You can change this at any time.
        </Text>
      </View>

      {/* Input */}
      <View
        className={`flex-row items-center justify-between px-4 py-3 mt-3 rounded-lg bg-white border ${
          focused ? 'border-black' : 'border-neutral-300'
        }`}
      >
        <TextInput
          className="flex-1"
          placeholder="johndoe"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          maxLength={20}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {hasEdited && (
          status === 'checking' ? (
            <ActivityIndicator />
          ) : status === 'available' ? (
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="green"
            />
          ) : (
            <Ionicons
              name="close-circle-outline"
              size={24}
              color="red"
            />
          )
        )}
      </View>

      {/* Error */}
      <View className="min-h-[20px] mt-1">
        {errors.error && (
          <Text className="text-red-600 text-sm">{errors.error}</Text>
        )}
      </View>

      {/* Next Button */}
      <View className="mt-1">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed}
          className={`px-6 py-4 h-16 rounded-lg items-center justify-center ${
            canProceed ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <Text className="text-white text-xl font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
