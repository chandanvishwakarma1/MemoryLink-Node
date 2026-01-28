import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Search, UserRoundPlus } from 'lucide-react-native'
import { useAuthStore } from '@/store/authStore';
import debounce from 'lodash/debounce'
import { Image } from 'expo-image';

export default function search() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  interface User {
    profileImage: string;
    username: string,
    fullName: string,

    // Add other properties of the user object if needed
  }

  const [user, setUser] = useState<User | null>(null);

  const { token } = useAuthStore();

  const userSearch = async (username: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    setUser(null)
    try {
      setLoading(true);
      console.log("user before search", user);

      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (e) {
        // setUser({message: "Not Found"})
        throw new Error('Invalid response from server');
      }

      if (!response.ok) throw new Error(data.message || "Something went wrong");
      setUser(data.user);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log("Request timed out");
      } else {
        console.log("Error searching user: ", error);
      }
    } finally {
      setLoading(false);
    }
  }
  const debounceSearch = useCallback(
    debounce((search: string) => {
      if (search) {
        userSearch(search)
      }
    }, 500), []
  );
  useEffect(() => { //Cancel on Unmount
    return () => debounceSearch.cancel();
  }, [debounceSearch]);
  const handleSearch = async (text: string) => {
    // console.log("user before search", user);
    setSearch(text);
    // console.log(text);
    const username = text.toLowerCase().trim();
    debounceSearch(username);
  }
  console.log(JSON.stringify(user))
  // console.log(user)
  return (
    <View className='flex items-center justify-start px-6 bg-white h-screen'>
      <View className='flex flex-row items-center border w-full rounded-xl py-1 px-3 mt-6'>
        <TextInput
          className='flex-1'
          placeholder='Search friends'
          value={search}
          onChangeText={handleSearch}

        />
        <Search size={24} />
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : user ? (
        <View className='flex flex-row bg-white rounded-xl w-full my-6'>
          <View className='flex flex-row justify-between bg-white rounded-xl w-full  px-3 py-1 items-center'>
            <View className='flex flex-row  gap-6'>
              <Image source={{ uri: user?.profileImage }} style={{ width: 44, height: 44 }} className='w-40 h-40' contentFit='cover' />
              <View className=''>
                <Text className='font-bold '>{user.username}</Text>
                <Text className='text-neutral-600'>{user.fullName}</Text>
              </View>
            </View>
            <View>
              <UserRoundPlus />
            </View>
          </View>
        </View>
      ) : (
        <Text>Not Found</Text>
      )}
    </View>
  )
}
