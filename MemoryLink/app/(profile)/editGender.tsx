import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import GenderBubble from '@/components/GenderBubble';
import { useAuthStore } from '@/store/authStore';

export default function editGender() {
  const { user, token, updateUser } = useAuthStore();
  const [selectedGender, setSelectedGender] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    // router.push('/(tabs)/profile');
    router.back();
  }

  const changeGender = async ({ gender }: { gender: string }) => {
    if (!gender) {
      Alert.alert("Error", "Please select a gender.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/users/profile/changeGender/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gender,
        })
      });
      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: `Server error: ${response.status} ${response.statusText}` };
      }
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      setLoading(false);
      if (data.success) {
        const updatedUser = { ...user, gender: gender }
        updateUser({ data: { user: updatedUser } });
        Alert.alert("Success", `${data.message}`);
        router.back();
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", (error as Error).message || "Something went wrong while updating gender.");
      console.log("Error updating gender: ", error);
    }
  }

  return (
    <View className='flex-1 mx-6'>
      <View className='flex-row gap-3 items-center mb-9 mt-3 w-full'>
        <Pressable onPress={handleBack}><Ionicons name='arrow-back-outline' size={26} /></Pressable>
        <Text className='text-2xl font-semibold'>Edit Gender</Text>
      </View>

      <View className='flex-row flex-wrap rounded-lg mt-3 gap-3'>
        <GenderBubble title='Female' handleNext={() => setSelectedGender('Female')} isSelected={selectedGender === 'Female'} />
        <GenderBubble title='Male' handleNext={() => setSelectedGender('Male')} isSelected={selectedGender === 'Male'} />
        <GenderBubble title='Other' handleNext={() => setSelectedGender('Other')} isSelected={selectedGender === 'Other'} />
        <GenderBubble title='Prefer not to say' handleNext={() => setSelectedGender('Prefer not to say')} isSelected={selectedGender === 'Prefer not to say'} />
      </View>

      <TouchableOpacity onPress={() => changeGender({ gender: selectedGender })} disabled={loading} className='px-3 py-4 border rounded-lg mt-3 w-full items-center'>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text className=' font-semibold'>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
