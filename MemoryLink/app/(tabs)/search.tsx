import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, UserRoundPlus } from 'lucide-react-native'
import { useAuthStore } from '@/store/authStore';
import debounce from 'lodash/debounce'
import { Image } from 'expo-image';
import UserList from '@/components/UserList';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import CustomBottomSheet from '@/components/CustomBottomSheet';

export default function SearchUser() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  // const handleClosePress = () => { bottomSheetRef.current?.close(); console.log("close pressed") };
  const handleOpenPress = () => { bottomSheetRef.current?.snapToIndex(0) };


  interface Users {
    profileImage: string;
    username: string,
    fullName: string,
    id: string,
  }

  const [users, setUsers] = useState<Users[] | null>(null);
  const [error, setError] = useState('');

  const { token } = useAuthStore();

  const userSearch = useCallback(async (username: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    setUsers(null);
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/search`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      const tranformed = data.users.map(user => ({
        id: user._id,
        profileImage: user.profileImage,
        fullName: user.fullName,
        username: user.username
      }))
      setUsers(tranformed);
    } catch (error) {
      console.log("Error searching user:", error);
      setError(String(error));
    } finally {
      setLoading(false);
    }
  }, [token]);

  const debounceSearch = useMemo(
    () =>
      debounce((text: string) => {
        if (text.length > 0) {
          userSearch(text);
        }
      }, 500),
    [userSearch]
  );


  useEffect(() => { //Cancel on Unmount
    return () => debounceSearch.cancel();
  }, [debounceSearch]);

  const handleSearch = (text: string) => {
    setSearch(text);
    debounceSearch(text.toLowerCase().trim());
  };

  // console.log(JSON.stringify(users))
  // console.log(user)
  return (
    <View className='flex-1 items-center justify-start px-6 bg-white'>
      <View className='flex flex-row items-center border w-full rounded-xl py-1 px-3 mt-6'>
        <TextInput
          className='flex-1'
          placeholder='Search friends'
          value={search}
          onChangeText={handleSearch}

        />
        <Search size={24} />
      </View>
      <View className='mt-6 items-center justify-center'>
        {loading ? (
          <ActivityIndicator />
        ) : users ? (
          <UserList users={users} handleOpenPress={handleOpenPress} />
        ) : (
          <Text>{error.split('Error:')}</Text>
        )}
      </View>

      <CustomBottomSheet ref={bottomSheetRef} />
    </View>
  )
}
