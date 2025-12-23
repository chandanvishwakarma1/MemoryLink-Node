import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SafeScreen({children}:{children: React.ReactNode}) {
    // const insets = useSafeAreaInsets();
  return (
    <View className='flex-1 pt-safe'>
      {children}
    </View>
  )
}