import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuthStore } from '@/store/authStore';
import { Link, useRouter } from 'expo-router';

export default function register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();

  const router = useRouter();

  const validateEmail = (text: string) => {
    setEmail(text);
    let errorMsg = '';

    const emailRegex = /\S+@\S+\.\S+/;

    if (!text) errorMsg = 'Email is required.';
    else if (!emailRegex.test(text)) errorMsg = 'Please enter a valid email.';

    setErrors((prevErr) => ({ ...prevErr, email: errorMsg }));
  }

  const validatePassword = (text: string) => {
    setPassword(text);
    let errorMsg = '';

    if (!text) errorMsg = 'Password is required';

    setErrors((prevErr) => ({ ...prevErr, password: errorMsg }));
  }

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    const result = await register(username, email, password);
    if (!result.success) {
      Alert.alert("Error", result.error);
      return;
    }
    router.replace('/(tabs)');
  }

  const handleEmail = () => {
    router.push('/(auth)/(register)/email')
  }

  return (
    <View className='flex-1 justify-center items-center mx-6'>
      <View className='flex justify-center items-center mb-24 w-3/3'>
        <View className='w-32 h-32 bg-neutral-300 rounded-full'>
        </View>
        <Text className='text-4xl font-bold text-center mt-9'>Sign up to make timeline</Text>
      </View>

      <TouchableOpacity onPress={handleEmail} className='flex-row p-3 border rounded-full w-full justify-center items-center mb-3'>
        <Ionicons name='mail-outline' size={24} className='absolute left-6' />
        <Text className='text-lg'>Continue with email</Text>
      </TouchableOpacity>
      <View className='flex-row p-3 border rounded-full w-full justify-center items-center mb-3'>
        <Ionicons name='logo-google' size={24} className='absolute left-6' />
        <Text className='text-lg'>Continue with Google</Text>
      </View>
      <View className='flex-row p-3 border rounded-full w-full justify-center items-center mb-3'>
        <Ionicons name='logo-apple' size={24} className='absolute left-6' />
        <Text className='text-lg'>Continue with Apple</Text>
      </View>
    </View>
  )
}

