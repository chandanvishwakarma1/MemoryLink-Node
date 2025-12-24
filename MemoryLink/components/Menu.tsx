import COLORS from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface MenuProps {
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    isLast?: boolean,
    isFirst?: boolean,
    link:string
}

export default function Menu({ icon, title, isLast, isFirst, link }: MenuProps) {
    const router = useRouter();

    const handleMenu = () => {
        router.push(`${link}` as any)
    }

    return (
        <Pressable onPress={handleMenu} className={isFirst ? 'w-full flex-row items-center justify-between px-4 border-b border-neutral-300 pb-4 ' : isLast ? 'w-full flex-row items-center justify-between px-4':'w-full flex-row items-center justify-between border-b border-neutral-300 px-4 pb-4'}>
            <View className='flex-row gap-3 items-center'>
                <Ionicons name={icon} size={24} color={COLORS.light.danger.base} />
                <Text>{title}</Text>
            </View>
                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.light.danger.base} />  
        </Pressable>
    )
}
