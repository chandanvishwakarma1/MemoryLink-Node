import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function profile() {
  const {logOut} = useAuthStore();

  return (
    <View>
      <Text>profile</Text>
      <Pressable onPress={logOut} className='py-6 px-4 bg-blue-600'>
        <Text>Log out</Text>
      </Pressable>
    </View>
  )
}