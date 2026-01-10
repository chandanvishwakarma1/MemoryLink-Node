import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';


type UsernameStatus =
  | 'idle'
  | 'invalid'
  | 'checking'
  | 'available'
  | 'taken';


export default function EditUsername() {
  const { user, token, updateUser } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState<string>(user?.username ?? '');
  const [errors, setErrors] = useState<{ error?: string }>({});
  const [status, setStatus] = useState<UsernameStatus>('idle');
  const [loading, setLoading] = useState(false);
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


  const debouncedValidate = useCallback(
    (text: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          setStatus('checking');

          const response = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/usernameValidate/`,
            {
              method: 'PATCH',
              headers: {
                Authorization: `Bearer ${token}`,
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
      }, 500);
    },
    [token]
  );


  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (!hasEdited) setHasEdited(true);

    const error = validateLocalUsername(text);

    if (error) {
      setErrors({ error });
      setStatus('invalid');
      return;
    }

    setErrors({});
    debouncedValidate(text);
  };


  const changeUsername = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/changeUsername/${user?.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update username.');
      }

      updateUser({
        data: { user: { ...user, username } },
      });

      Alert.alert('Success', data.message);
      router.back();
    } catch (err) {
      setErrors({
        error: (err as Error).message || 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };


  const canSave =
    status === 'available' &&
    username !== user?.username &&
    !loading;


  return (
    <View className="flex-1 mx-6">
      <View className="flex-row gap-3 items-center mt-3">
        <Pressable onPress={() => router.navigate('/(profile)/editProfile')}>
          <Ionicons name="arrow-back-outline" size={26} />
        </Pressable>
        <Text className="text-2xl font-semibold">Edit Username</Text>
      </View>

      <View className="mt-6 gap-1">
        <Text className="text-gray-600 font-semibold">Username</Text>

        <View
          className={`flex-row items-center justify-between px-4 py-3 rounded-lg bg-white border ${
            focused ? 'border-black' : 'border-neutral-300'
          }`}
        >
          <TextInput
            className="flex-1"
            value={username}
            onChangeText={handleUsernameChange}
            autoCapitalize="none"
            editable={!loading}
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

        <View className="min-h-[20px] mt-1">
          {errors.error && (
            <Text className="text-red-600 text-sm">{errors.error}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={changeUsername}
          disabled={!canSave}
          className={`px-6 py-4 h-16 rounded-lg items-center justify-center mt-3 ${
            canSave ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
