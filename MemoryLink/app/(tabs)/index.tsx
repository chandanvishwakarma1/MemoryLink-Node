import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Plus } from 'lucide-react-native'
import { useRouter } from 'expo-router'

export default function index() {
  const router = useRouter();
  const handleAdd = () => {
    router.navigate('/(index)/NewTimeline')
  }
  return (
    <View className='flex-1 px-6 bg-white'>
      <View className='flex flex-row items-center justify-between'>
        <Text className='font-bold text-xl '>MemoryLink</Text>
        <View>
          <TouchableOpacity onPress={handleAdd} className='rounded-full p-1' underlayColor={'#a1a1a1'}>
            <Plus />
          </TouchableOpacity>
        </View>
      </View>

      <View>

      </View>
    </View>
  )
}
