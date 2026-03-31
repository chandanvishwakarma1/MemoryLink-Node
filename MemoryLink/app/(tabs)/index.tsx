import { ActivityIndicator, Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'

export default function index() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [timelines, setTimelines] = useState([]);
  const router = useRouter();
  const handleAdd = () => {
    router.navigate('/(index)/NewTimeline')
  }

  const handleGetTimelines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: `Server error: ${response.status} ${response.statusText}` };
      }

      if (!response.ok) throw new Error(data.message || "Something went wrong");
      setLoading(false);
      if (data.success) {
        setTimelines(data);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error updating email: ", error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    }
  }
  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  const simplifiedData = timelines.map(({ _id, name }) => ({
    id: _id,
    name,
  }));
  useEffect(() => {
    handleGetTimelines()
  }, []);
  return (
    <View className='flex-1 px-6 bg-white'>
      <View className='flex flex-row items-center justify-between'>
        <Text className='font-bold text-xl '>MemoryLink</Text>
        <View>
          <TouchableOpacity onPress={handleAdd} className='rounded-full p-1' activeOpacity={0.7}>
            <Plus />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {loading ?
          <ActivityIndicator />
          :
          <FlatList
            data={simplifiedData}
            renderItem={({ item }) => <Item title={item.name} />}
            keyExtractor={item => item.id} />
        }
      </View>
    </View>
  )
}
