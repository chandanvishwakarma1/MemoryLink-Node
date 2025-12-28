import {  Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'expo-router';


export default function Index() {

  const router = useRouter();

  const handleLogin = async () => {
    router.push('/(auth)/login');
  }
  const handleSignup = async () => {
    router.push('/(auth)/(register)/choice');
  }

  return (
    <View className='flex-1 mx-6 items-center justify-center'>

      <View className="items-center mb-24 mt-24 w-full">
        <View className="w-32 h-32 bg-neutral-300 rounded-full" />
        <Text className="text-4xl font-bold text-center mt-9">
          Relive your memories with timeline
        </Text>
      </View>

      <View className='mt-3 w-full'>
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 px-6 py-4 rounded-xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-lg font-semibold text-white">Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignup}
          className="bg-blue-50 border-2 border-blue-200 px-6 py-4 rounded-xl items-center mt-3"
          activeOpacity={0.8}
        >
          <Text className="text-lg font-semibold text-blue-600">
            Sign up free
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
