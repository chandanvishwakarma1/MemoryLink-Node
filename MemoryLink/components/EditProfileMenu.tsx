import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import COLORS from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'expo-router'

interface EditProfileMenuProps {
    title: string,
    value: string,
    isLast?: boolean,
    isFirst?: boolean,
    link: string,
}

export default function EditProfileMenu({ title, value, isLast, isFirst, link }: EditProfileMenuProps) {
    const { user } = useAuthStore();
    const router = useRouter();
    const handlePress = () => {
        router.navigate(`${link}` as any)
    }
    return (
                <Pressable onPress={handlePress} className={isFirst ? 'flex-row justify-between w-full items-center py-4 pr-3 pl-4' : isLast? 'flex-row justify-between w-full items-center py-4 pr-3 pl-4' : 'flex-row justify-between w-full items-center py-4 border-b border-neutral-300 pr-3 pl-4'}>
                    <Text style={{ color: COLORS.light.text.secondary }}>{title}</Text>
                    <View className='flex-row items-center gap-1'>
                        <Text>{value}</Text>
                        <Ionicons name='chevron-forward-outline' size={24} />
                    </View>
                </Pressable>
    )
}