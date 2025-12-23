import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useAuthStore} from '../../store/authStore'
import { Link, useRouter } from 'expo-router';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const {login, isLoading} = useAuthStore();

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

  const handleLogin = async () => {
      if(!email || !password){
        Alert.alert("Error", "All fields are required");
        return;
      }
      const result = await login(email, password);
      if(!result.success){
         Alert.alert("Error", result.error);
         return;
      }
      router.replace('/(tabs)');

  }

  return (
    <KeyboardAvoidingView
      className='flex-1 mx-6 justify-center'
      behavior={Platform.OS === 'ios' ? 'padding': 'height'}
    >
      <View className='flex items-center'>
        <Text className='text-4xl font-bold'>Welcome Back</Text>
        <Text className='text-gray-400 mt-1'>Sign in to your account to continue</Text>
      </View>
      <View className='gap-1 mt-6'>
        <View><Text className='text-gray-600 font-semibold'>Email Address</Text></View>
        <View className='flex-row items-center gap-3 px-4 py-3 mb-4 rounded-lg border border-neutral-300 bg-white'>
          <Ionicons
            className=''
            name='mail-outline'
            size={22}
            color="#6B7280"
          />
          <TextInput
          className='pr-36'
            placeholder='john@email.com'
            value={email}
            onChangeText={validateEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
        </View>
      </View>

      <View className='gap-1'>
        <View><Text className='text-gray-600 font-semibold'>Password</Text></View>
        <View className='flex-row items-center justify-between px-4 py-3 border border-neutral-300 rounded-lg bg-white'>
          <View className='flex-row items-center gap-3'>
            <Ionicons
            name='lock-closed-outline'
            size={22}
            color="#6B7280"
          />
          <TextInput
          className='pr-44'
            placeholder='********'
            value={password}
            onChangeText={validatePassword}
            secureTextEntry={!showPassword}
          />
          </View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}  className=' p-3'>
            <Ionicons 
          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
          size={22}
          color="#6B7280"
          />
          </TouchableOpacity>
          
        </View>
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={isLoading} className='flex mt-6 px-4 py-6 items-center rounded-lg bg-blue-600 justify-center'>
        {isLoading ?
          <ActivityIndicator color='#fff' />
          :
          <Text className='text-white font-bold text-lg'>Sign In</Text>
        }
      </TouchableOpacity>

      <View className='flex mt-3 items-center'><Text>Don't have an account yet? <Link href="/(auth)/register"><Text className='text-blue-600 font-semibold'>Sign Up</Text></Link></Text></View>
    </KeyboardAvoidingView>
  )
}
