import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

import { useAuthStore } from '@/store/authStore';
import { useDeleteTimeline } from '@/hooks/useDeleteTimeline';

type ItemProps = { 
  id: string;
  title: string; 
  onPress: () => void 
};

export const TimelineItem = ({ id, title, onPress }: ItemProps) => {
  const { token } = useAuthStore();
  const { mutate: deleteTimeline, isPending } = useDeleteTimeline(token);

//   console.log('TimelineItem render - isPending:', isPending, 'id:', id);
  const confirmDelete = () => {
    Alert.alert(
      "Delete Timeline",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteTimeline(id) 
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      className='flex flex-row gap-3 items-center my-3' 
      onPress={onPress}
      onLongPress={confirmDelete}
      disabled={isPending}
      activeOpacity={0.7}
    >
      <View className='bg-gray-100 rounded-full h-14 w-14 items-center justify-center overflow-hidden'>
        {isPending ? (
          <ActivityIndicator size="small" />
        ) : (
          <View className="h-full w-full bg-blue-50" />
        )}
      </View>
      <View className="flex-1" style={{ opacity: isPending ? 0.5 : 1 }}>
        <Text className="font-medium text-lg text-gray-800">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};