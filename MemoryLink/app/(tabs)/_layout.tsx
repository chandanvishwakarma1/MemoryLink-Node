import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '@/constants/colors'

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#007bff',
      headerTitleStyle: {
        color: COLORS.light.text.primary,
        fontWeight: "600",
      },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: COLORS.light.background.main,
        borderTopWidth: 1,
        borderTopColor: COLORS.light.border.subtle,
        paddingTop: 6,
        paddingBottom: insets.bottom,
        height: 60 + insets.bottom,
      }
    }}>
      <Tabs.Screen name='index'
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen name='search'
      options={{
        title: 'Search',
        tabBarIcon: ({ color,size }) => (
          <Ionicons name='search-outline' color={color} size={size} />
        )
      }}
      />
      <Tabs.Screen name='capsules'
      options={{
        title: 'Capsules',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='hourglass-outline' color={color} size={size} />
        )
      }}
      />
      <Tabs.Screen name='profile'
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          )
        }}
      />
    </Tabs>
  )
}
