import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function editEmail() {
  const { user, token, updateUser } = useAuthStore();
  const [email, setEmail] = useState(user?.email);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);

  const router = useRouter();

  const changeEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/changeEmail/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
        })
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
        const updatedUser = { ...user, email }
        updateUser({ data: { user: updatedUser } });
        Alert.alert("Success", `${data.message}`);
        router.back();
      }

    } catch (error) {
      setLoading(false)
      console.log("Error validating username: ", error);
      if (error instanceof Error) {
        Alert.alert("Error", `${error.message}`);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  }

  const handleBack = () => {
    router.navigate('/(profile)/editProfile');
  }
  return (
    <View className='flex-1 mx-6 items-center'>
      <View className='flex-row gap-3 items-center mt-3 w-full'>
        <Pressable onPress={handleBack}><Ionicons name='arrow-back-outline' size={26} /></Pressable>
        <Text className='text-2xl font-semibold'>Edit Email</Text>
      </View>
      <View className='gap-1 mt-6'>
        <View><Text className='text-gray-600 font-semibold'>Email Address</Text></View>
        <View className={selected ? 'flex-row items-center justify-between px-4 py-3 border  border-black-300 rounded-lg bg-white' : 'flex-row items-center justify-between px-4 py-3 border border-neutral-300 rounded-lg bg-white'}>
          <Text className='w-full'>
            <TextInput
              className=''
              value={email}
              onChangeText={(text) => {
                setEmail(text);
              }}
              autoCapitalize='none'
              onFocus={() => setSelected(true)}
              onBlur={() => setSelected(false)}
              keyboardType='email-address'
              editable={!loading}
            />
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={changeEmail} disabled={loading} className='px-3 py-4 border rounded-lg mt-3 w-full items-center'>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className=' font-semibold'>Verify mail</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}