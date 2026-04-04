import { ActivityIndicator, Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import COLORS from '@/constants/colors'
import { useTimelines } from '@/hooks/useTimelines'
import { TimelineItem } from '@/components/TimelineItem'

export default function Index() {
  const { token } = useAuthStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching
  } = useTimelines(token);

  // Flatten the pages array from TanStack into a single list for FlatList
  const allTimelines = data?.pages.flatMap(page => page.data) ?? [];

  type ItemProps = { title: string, onPress: () => void };

  const router = useRouter();

  const Item = ({ title, onPress }: ItemProps) => (
    <TouchableOpacity className='flex flex-row gap-3 items-center my-3' onPress={onPress}>
      <View className='bg-gray-100 rounded-full h-14 w-14'></View>
      <Text>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 px-6 bg-white">
      <View className='flex flex-row items-center justify-between'>
        <Text className='font-bold text-xl '>MemoryLink</Text>
        <View>
          <TouchableOpacity onPress={()=>router.navigate('/(index)/NewTimeline')} className='rounded-full p-1' activeOpacity={0.7}>
            <Plus />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={allTimelines}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TimelineItem
            id={item._id}
            title={item.name} 
            onPress={() => router.push(`/(index)/timeline/${item._id}`)} 
          />
        )}

        // Refresh Logic
        refreshing={isRefetching}
        onRefresh={refetch}

        // Infinite Scroll Logic
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}

        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator className="py-4" /> : null
        }

        ListEmptyComponent={
          !isLoading ? <Text>No Timelines Found</Text> : null
        }
      />
    </View>
  );
}