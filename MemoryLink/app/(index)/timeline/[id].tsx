import React from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Plus, UserPlus, Image, ArrowLeft } from 'lucide-react-native'
import { useAuthStore } from '@/store/authStore'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTimelineDetail } from '@/hooks/useTimelineDetails'
import MemoryItem from '@/components/MemoryItem'


const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <View className="flex-1 justify-center items-center px-8">
    <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-6">
      <Image size={48} color="#2563EB" />
    </View>
    <Text className="text-xl font-bold text-gray-800 mb-2">No Memories Yet</Text>
    <Text className="text-gray-500 text-center mb-8">
      Be the first to add a memory to this timeline!
    </Text>
    <TouchableOpacity
      onPress={onAdd}
      className="bg-blue-600 px-8 py-4 rounded-xl flex-row items-center"
    >
      <Plus size={20} color="#FFF" />
      <Text className="text-white font-bold ml-2">Add Memory</Text>
    </TouchableOpacity>
  </View>
)

const Timeline = () => {
  const { token } = useAuthStore()
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const timelineId = id as string

  const {
    data: infiniteData,
    // totalItem,
    isPending,
    refetch,
    isRefetching,
    isError,
    error
  } = useTimelineDetail(token, timelineId);

  const firstPage = infiniteData?.pages?.[0];
  const allMemories = infiniteData?.pages?.flatMap(page => page.memories ?? []) ?? [];

  const handleAdd = () => {
    router.navigate({
      pathname: '/(index)/timeline/AddMemory',
      params: { id },
    })
  }

  const handleRefresh = () => {
    // console.log("first: ", firstPage.members.user.username)
    // console.log("first: ", firstPage.pagination.totalItem)
    refetch()
  }

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-white">
        <Text className="text-red-500 mb-4 text-center">Error: {error?.message}</Text>
        <TouchableOpacity
          onPress={() => refetch()}
          className="bg-blue-600 p-3 rounded-lg mb-2"
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-200 p-3 rounded-lg"
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const usernames = firstPage.members.map(member => member.user.username);
  const roles = firstPage.members.map(role => role.role);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">

        <Pressable className=" flex-row items-center justify-between" onPress={() => {
          router.navigate({
            pathname: '/(index)/timeline/Details',
            params: {
              title: firstPage?.name,
              usernames,
              memLen: firstPage.pagination.totalItem,
              roles
            }
          })
        }}>
          <View className="flex-1 flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} className="py-2">
              <ArrowLeft size={28} color="#1F2937" />
            </Pressable>
            <Text className="text-2xl font-bold text-gray-800">{firstPage?.name || 'Timeline'}</Text>
          </View>
          <TouchableOpacity
            onPress={handleAdd}
            className="rounded-full py-2"
          >
            <UserPlus size={24} color="#2563EB" />
          </TouchableOpacity>
        </Pressable>

        {/* Stats */}
        <View className="flex-row mt-4 gap-6">
          <View>
            <Text className="text-2xl font-bold text-blue-600">
              {allMemories.length}
            </Text>
            <Text className="text-xs text-gray-500">Memories</Text>
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              {firstPage?.members?.length || 1}
            </Text>
            <Text className="text-xs text-gray-500">Members</Text>
          </View>
        </View>
      </View>

      {/* Memories List */}
      {allMemories.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <FlatList
          data={allMemories}
          renderItem={({ item }) => <MemoryItem item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#2563EB"
            />
          }
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={handleAdd}
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  )
}

export default Timeline