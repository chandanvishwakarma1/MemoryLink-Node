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
  const {register, isLoading} = useAuthStore();

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
    if(!username || !email || !password){
      Alert.alert("Error", "All fields are required");
      return;
    }
    const result = await register(username,email,password);
    if(!result.success){
       Alert.alert("Error", result.error);
       return;
    }
    router.replace('/(tabs)');
  }
  
  return (
    <KeyboardAvoidingView
    className='flex-1 mx-6 justify-center'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View>
        <Text className='text-4xl font-bold'>Create Account</Text>
        <Text className='text-gray-400 mt-1'>Sign up and discover memories and capsules.</Text>
      </View>

      <View className='gap-1 mt-6'>
        <View><Text className='text-gray-600 font-semibold'>Username</Text></View>
        <View className='flex-row justify-between mb-4 items-center border border-neutral-300 rounded-lg bg-white py-3 px-4'>
        <TextInput 
        className='pr-64'
        placeholder='johndoe'
        value={username}
        onChangeText={setUsername}
        autoCapitalize='none'
        />
        </View>
      </View>
      <View className='gap-1'>
        <View><Text className='text-gray-600 font-semibold'>Email</Text></View>
        <View className='flex-row mb-4 justify-between items-center border border-neutral-300 rounded-lg bg-white py-3 px-4'>
        <TextInput
        className='pr-44' 
        placeholder='johndoe@email.com'
        value={email}
        onChangeText={validateEmail}
        autoCapitalize='none'
        keyboardType='email-address'
        />
        </View>
      </View>
      <View className='gap-1'>
        <View><Text className='text-gray-600 font-semibold'>Password</Text></View>
        <View className='flex-row justify-between items-center border border-neutral-300 rounded-lg bg-white py-3 px-4'>
          <TextInput 
          className='pr-56'
          placeholder='********'
          value={password}
          onChangeText={validatePassword}
          autoCapitalize='none'
          secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={()=> setShowPassword(!showPassword)} className='p-3'><Ionicons
          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
          size={22}
          color="#6B7280"
          /></TouchableOpacity>
        </View>
      </View>

      <View>
        <TouchableOpacity onPress={handleSignup} disabled={isLoading} className='items-center px-4 py-6 mt-6 bg-blue-600 rounded-lg'>
          {isLoading ? 
          <ActivityIndicator color="#fff" />
          :
          <Text className='font-bold text-white text-lg'>Sign Up</Text>
        }
        </TouchableOpacity>
      </View>

      <View className='flex mt-3 items-center'><Text>Already have an account? <Link href="/(auth)"><Text className='text-blue-600 font-semibold'>Login</Text></Link></Text></View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({})
