import Menu from '@/components/Menu';
import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image'
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg'

export default function profile() {
  const {user, logOut } = useAuthStore();

  const handleLogOut = () => {
    logOut();
  }

  console.log(user?.profileImage);
  return (
    <View className='flex-1 items-center justify-center mx-6'>
      {/* profileImage */}
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
      {/* username */}
      <View className='mt-3'>
          {user?.username? (
            <Text>@{user.username}</Text>
          ): (
            <Text>@username</Text>
          )}
      </View>

      {/* stats */}
      <View className='flex mt-9 rounded-lg py-6 px-9' style={{backgroundColor: COLORS.light.background.main}}>
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
      {/* menu */}
      <View className='bg-white  py-4 rounded-lg mt-6 gap-3'>
        <Menu icon='pencil-outline' title='Edit Profile' isFirst={true} link='/(profile)/editProfile' />
        <Menu icon='settings-outline' title='Settings' link='/(profile)/settings' />
        <Menu icon='gift-outline' title='Refer' link='/(profile)/refer' isLast={true} />
        {/* <Menu icon='log-out-outline' title='Logout' isLast={true} /> */}
      </View>
      <View>
        <TouchableOpacity className='px-14 mt-3 py-6 bg-blue-600 rounded-lg' onPress={handleLogOut}><Text className='text-white font-semibold'>Log Out</Text></TouchableOpacity>
      </View>
    </View>
  );
}
