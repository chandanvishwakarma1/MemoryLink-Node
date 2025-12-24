import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { SvgUri } from 'react-native-svg'

export default function editprofile() {
  const {user, token} = useAuthStore();
  const [userName, setUserName] = useState(user?.username);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    router.push('/(tabs)/profile');
  }

  const validateUsername = async ({ username }: { username: string }) => {
    try {
      setLoading(true);
      setUserName(username);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/users/profile/${user.id}`, {
        method: "PATCH",
        headers:{
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
        })
      })

      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: `Server error: ${response.status} ${response.statusText}`};
      }

      if(!response.ok) throw new Error(data.message || "Something went wrong");
      setLoading(false);
      console.log("success:", data.success);
      if(data.success) setTick(true);
    } catch (error) {
      setLoading(false)
      console.log("Error validating username: ", error);
      setTick(false);
    }
  }

  // const validateUsername = ({ username }: { username: string }) => {
  //   setUserName(username);
  // }
  console.log("Tick", tick);
  return (
    <View className='flex-1 justify-center items-center mx-6'>
      <View className='flex-row gap-3 items-center absolute top-0 left-0 mt-3'>
        <Pressable onPress={handleBack}><Ionicons name='arrow-back-outline' size={26} /></Pressable>
        <Text className='text-2xl font-semibold'>Edit Profile</Text>
      </View>

      {/* profileImage */}
       <Pressable style={{ width: 128, height: 128 }} className=''>
        {user?.profileImage? (
          <SvgUri 
          uri={user.profileImage}
          width="100%"
          height="100%"
          />
        ) : (
          <View className='justify-center items-center w-32 h-32 rounded-full bg-neutral-300'><Text className='text-4xl text-neutral-600'>{user?.username?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
        )}
        <Ionicons name='camera-outline' size={22} color="#fff" className='absolute bottom-0 right-0 bg-blue-400 p-1 rounded-full' />
       </Pressable>

       <View>
        <View className='flex-row justify-between'>
        <TextInput 
        className=''
        // placeholder={user?.username? (user.username) : ('username')}
        value={userName}
        onChangeText={setUserName}
        autoCapitalize='none'
        />
        
        <Ionicons name={tick ? 'checkmark-circle-outline': 'close-circle-outline'} size={24} />
        </View>
        <TextInput value={userName} />
        <TextInput />
       </View>


    </View>
  )
}
