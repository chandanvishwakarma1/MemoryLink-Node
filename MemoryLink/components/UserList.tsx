import { View, Text, TouchableOpacity, Button } from 'react-native'
import React, { useCallback, useRef } from 'react'
import { Check, UserRoundPlus } from 'lucide-react-native'
import { Image } from 'expo-image'
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CustomBottomSheet from './CustomBottomSheet';
import { useAuthStore } from '@/store/authStore';
interface Users {
    profileImage: string;
    username: string,
    fullName: string,
    id: string
}
interface usersListProps {
    users: Users[],
    handleOpenPress?: (member: Users) => void,
    selectedMembers?: Users[],
}
const usersList = ({ users, handleOpenPress, selectedMembers }: usersListProps) => {
    const  { user: admin } = useAuthStore();

    const handleAdd = () => {

    }
    return (
        <View>
            {users.map((user, index) => (
                <View key={String(user.id ?? index)} className='flex flex-row bg-white rounded-xl w-full mb-1'>
                    <View className='flex flex-row justify-between bg-white rounded-xl w-full  px-3 py-1 items-center'>
                        <View className='flex flex-row  gap-3'>
                            <Image source={{ uri: user?.profileImage }} style={{ width: 44, height: 44 }} className='w-40 h-40' contentFit='cover' />
                            <View className=''>
                                <Text className='font-bold '>{user.username}</Text>
                                <Text className='text-neutral-600'>{user.fullName}</Text>
                            </View>
                        </View>
                        <View>
                            <TouchableOpacity className='' onPress={()=>{handleOpenPress && handleOpenPress(user)}}>
                                {
                                   admin.id !== user.id && (
                                    selectedMembers?.some(member => member.id === user.id)
                                    ? <Check color="#4CAF50" />
                                    :  <UserRoundPlus/>
                                   )
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

export default usersList