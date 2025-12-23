import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image'
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SvgUri } from 'react-native-svg'

export default function profile() {
  const {user, logOut } = useAuthStore();

  console.log(user?.profileImage);
  return (
    <View className='flex-1 items-center justify-center mx-6'>
      <View className='relative'>
        {user?.profileImage ? (
          <View style={{ width: 128, height: 128 }}>
            <SvgUri
              uri={user.profileImage}
              width="100%"
              height="100%"
            />
          </View>
        ) : (
          <View className='w-32 h-32 bg-neutral-300 rounded-full justify-center items-center'>
            <Text className='text-4xl text-neutral-600'>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
        )}
        <Pressable className='absolute bottom-0 right-0 p-2 bg-blue-400 rounded-full'>
          <Ionicons name='create-outline' size={20} color="#fff" />
        </Pressable>
      </View>

      <View className='flex mt-9 rounded-lg py-6 px-auto' style={{backgroundColor: COLORS.light.background.main}}>
        {user? (
          <View className='flex-row gap-14'>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>{user.id.charAt(0)}</Text>
              <Text>timeline</Text>
            </View>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>{user.id.charAt(0)}</Text>
              <Text>capsules</Text>
            </View>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>{user.id.charAt(0)}</Text>
              <Text>streak</Text>
            </View>
          </View>
        ) : (
          <View className='flex-row gap-14'>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>0</Text>
              <Text>timeline</Text>
            </View>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>0</Text>
              <Text>capsules</Text>
            </View>
            <View className='items-center'>
              <Text className='text-4xl font-semibold'>0</Text>
              <Text>streak</Text>
            </View>
          </View>
        )}
      </View>

      
    </View>
  );
}
