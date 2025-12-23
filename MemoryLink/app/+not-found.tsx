import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function NotFoundScreen() {
    const router = useRouter();

    const handleHome = () => {
        router.replace('/(auth)');
    }

  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-9xl font-bold'>404</Text>
      <Text className='text-4xl font-semibold'>Oops - Wrong Screen</Text>
      <TouchableOpacity onPress={handleHome} className='mt-6 border p-6 rounded-lg'><Text>Return Home</Text></TouchableOpacity>
    </View>
  )
}