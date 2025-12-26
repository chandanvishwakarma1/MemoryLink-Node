import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
interface GenderBubbleProps {
  title: string
}
export default function GenderBubble({ title }: GenderBubbleProps) {
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const handleGender = () => {
    setSelected(true);
    console.log("Params: ", params);
    router.push({
      pathname: '/(auth)/(register)/gender',
      params: { ...params, }
    })
  }

  return (
    <TouchableOpacity onPress={handleGender} className={selected ? 'border border-neutral-300 p-3 rounded-full bg-blue-600' : 'border border-neutral-300 p-3 rounded-full'}>
      <Text className={selected ? 'font-semibold text-white' : 'font-semibold'}>{title}</Text>
    </TouchableOpacity>
  )
}
