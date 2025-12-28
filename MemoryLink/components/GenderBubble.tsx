import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
interface GenderBubbleProps {
  title: string,
  handleNext: () => void,
  isSelected: boolean,
}
export default function GenderBubble({ title, handleNext, isSelected }: GenderBubbleProps) {
  return (
    <TouchableOpacity onPress={handleNext} className={isSelected ? 'border border-neutral-300 p-3 rounded-full bg-blue-600' : 'border border-neutral-300 p-3 rounded-full'}>
      <Text className={isSelected ? 'font-semibold text-white' : 'font-semibold'}>{title}</Text>
    </TouchableOpacity>
  )
}
