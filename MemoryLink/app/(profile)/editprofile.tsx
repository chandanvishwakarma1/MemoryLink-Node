import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useAuthStore } from '@/store/authStore'
import { SvgUri } from 'react-native-svg'
import COLORS from '@/constants/colors'
import EditProfileMenu from '@/components/EditProfileMenu'

export default function editprofile() {
  const { user } = useAuthStore();
  const [userName, setUserName] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);

  const router = useRouter();

  const handleBack = () => {
    // router.push('/(tabs)/profile');
    router.back();
  }
  return (
    <View className='flex-1 justify-start items-center mx-6'>
      <View className='flex-row gap-3 items-center mb-9 mt-3 w-full'>
        <Pressable onPress={handleBack}><Ionicons name='arrow-back-outline' size={26} /></Pressable>
        <Text className='text-2xl font-semibold'>Edit Profile</Text>
      </View>

      {/* profileImage */}
      <Pressable style={{ width: 128, height: 128 }} className=''>
        {user?.profileImage ? (
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

      <View className='mt-9 rounded-lg' style={{ backgroundColor: COLORS.light.background.elevated }}>
        <EditProfileMenu title='Username' value={user?.username} isFirst={true} link='/editUsername'/>
      </View>



      <View className='mt-6'>
        <Text className='text-xl font-semibold'>Personel Information</Text>

        <View className='mt-3 rounded-lg ' style={{ backgroundColor: COLORS.light.background.elevated }}>
          <EditProfileMenu title='Email Address' value={user?.email} link='/editEmail'/>
          <EditProfileMenu title='Birthdate' value={user?.birthdate || '00-jan-2000'} link='/editBirthdate'/>
          <EditProfileMenu title='Gender' value={user?.gender || 'Male'} isLast={true} link='/editGender'/>
        </View>
      </View>


    </View>
  )
}
