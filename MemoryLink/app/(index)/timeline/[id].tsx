import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Plus, UserPlus } from 'lucide-react-native'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useLocalSearchParams, useRouter } from 'expo-router'


const Timeline = () => {
  const {token} = useAuthStore();
  const {id} = useLocalSearchParams();
  const router = useRouter();

  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["timelines", id],
    queryFn: async() => {
      const response  = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines/${id}`,{
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch timeline');
      return result.data;
    },
    enabled: !!id && !!token
  })

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-red-500 mb-4">{error.message}</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-200 p-3 rounded-lg">
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const owner = data?.members?.find((m: any) => m.role === 'owner')?.user;
  const handleAdd = () => {
    router.navigate({
      pathname:'/(index)/timeline/AddMemory',
      params:{ id}
    })
  }
  return (
    <View className='flex-1 px-6 bg-white'>
      <View className='flex flex-row items-center justify-between'>
        <Text className='font-bold text-xl '>MemoryLink</Text>
        <View>
          <TouchableOpacity onPress={handleAdd} className='rounded-full p-1' activeOpacity={0.7}>
            <UserPlus />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <Text>owner - {owner.username}</Text>
        <Text>{data?.name}</Text>
      </View>
      <View className='mt-3 bg-yellow-100'>
        <Text>No Time</Text>
        
      </View>

      <TouchableOpacity onPress={handleAdd} className='h-16 w-16 rounded-full bg-gray-100 absolute bottom-6 right-6 items-center justify-center '><Plus/></TouchableOpacity>
      </View>
  )
}

export default Timeline