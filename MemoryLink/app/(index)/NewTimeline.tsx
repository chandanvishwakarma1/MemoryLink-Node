import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { ArrowLeft, Search, X } from 'lucide-react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import debounce from 'lodash/debounce';
import UserList from '@/components/UserList';
import COLORS from '@/constants/colors';
import { useQueryClient } from '@tanstack/react-query';

const NewTimeline = () => {
  const router = useRouter();
  interface Users {
    profileImage: string;
    username: string,
    fullName: string,
    id: string,
  }
  interface SelectedMember {
    userId: string;
    role: 'member'; // Default role for added members
  }

  const { user, token } = useAuthStore();
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Users[]>([])
  const [description, setDescription] = useState('');

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [users, setUsers] = useState<Users[] | null>(null);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
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

  // useEffect(() => {
  //   console.log("Selected users:", selectedMembers);
  // }, [selectedMembers]);

  const handleAdd = (member: Users) => {
    console.log("loggedin", user.id)
    if (member.id === user.id) {
      console.log("You are already a member");
      return;
    }

    // Check if user is already in selectedMembers
    const isAlreadyMember = selectedMembers.some(
      (m) => m.id === member.id
    );

    if (isAlreadyMember) {
      console.log('User already in members list');
      return;
    }

    // Add the full user object
    setSelectedMembers((prev) => [...prev, member]);

    console.log("now added", member.id)

    // optional UX cleanup
    setSearch('');
    setUsers(null);
    setError('');
  };

  // Updated removeMember function
  const removeMember = (removeMem: Users) => {
    setSelectedMembers(prevMembers =>
      prevMembers.filter(member => member.id !== removeMem.id)
    );
  };
  const createTimeline = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a timeline name');
      return;
    }
    try {
      setCreateLoading(true);
      console.log("members: ", selectedMembers)
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          members: selectedMembers.map(member => ({
            userId: member.id,
            role: 'member'
          }))
        })
      })
      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: `Server error: ${response.status} ${response.statusText}` };
      }
      if (!response.ok) throw new Error(data.message || "Something went wrong");
      setCreateLoading(false);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['timelines']})
        Alert.alert("Success", "Timeline Created!");
        router.back();
      }
    } catch (error) {
      setCreateLoading(false);
      console.log("Error creating timeline: ", error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    }
  }

  const isDisabled = name.trim().length === 0 || selectedMembers.length === 0 || createLoading;

  return (
    <View className='flex-1 mx-6'>
      <View className='flex-row gap-3 items-center mb-9 mt-3 w-full'>
        <Pressable onPress={() => router.back()}><ArrowLeft /></Pressable>
        <Text className='text-2xl font-semibold'>Create Timeline</Text>
      </View>

      <View>
        <Text className='font-semibold'>Name</Text>
        <TextInput
          className='bg-neutral-100 p-3 mt-1 rounded-xl'
          placeholder='Enter'
          value={name}
          onChangeText={(txt) => setName(txt)}
        />
      </View>
      <View>
        <Text className='font-semibold mt-3'>Description</Text>
        <TextInput
          className='bg-neutral-100 p-3 mt-1 rounded-xl'
          placeholder='Enter'
          value={description}
          onChangeText={(txt) => setDescription(txt)}
        />
      </View>

      <View className='mt-3'>
        <Text className='font-semibold'>Members</Text>
        <View className='flex flex-row justify-between'>
          <View className='flex flex-row gap-3 mt-3'>
            <Image source={{ uri: user?.profileImage }} style={{ width: 44, height: 44 }} />
            <View>
              <Text className='font-semibold'>{user?.username}</Text>
              <Text>{user?.fullName}</Text>
            </View>
          </View>
          <View className='border justify-center m-3 px-1 rounded-xl' style={{ borderColor: COLORS.light.primary.blue }}>
            <Text style={{ color: COLORS.light.primary.blue }}>Owner</Text>
          </View>
        </View>
        {/* <Text>{selectedMembers[0]?.username || ''}</Text> */}
        <View>
          {
            selectedMembers && selectedMembers.map((member) => (
              <View key={member.id} className='flex flex-row gap-3 mt-4 justify-between items-center'>
                <View className='flex flex-row gap-3'>
                  <Image source={{ uri: member.profileImage }} style={{ width: 44, height: 44 }} />
                  <View>
                    <Text className='font-semibold'>{member.username}</Text>
                    <Text>{member.fullName}</Text>
                  </View>
                </View>
                <Pressable onPress={() => removeMember(member)}><X /></Pressable>
              </View>
            ))
          }
        </View>
      </View>

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
          <UserList users={users} handleOpenPress={handleAdd} selectedMembers={selectedMembers} />
        ) : (
          <Text>{error.split('Error:')}</Text>
        )}
      </View>

      <TouchableOpacity onPress={createTimeline} disabled={isDisabled} className={`flex-row px-6 py-4 h-16 rounded-xl w-full justify-center items-center mt-6 shadow-lg 
    ${isDisabled ? 'bg-gray-400' : 'bg-blue-600'}`}>
        {createLoading ?
          <ActivityIndicator color='#fff' />
          :
          <Text className='text-white font-bold text-lg'>Create</Text>
        }
      </TouchableOpacity>
    </View>
  )
}

export default NewTimeline

const styles = StyleSheet.create({})