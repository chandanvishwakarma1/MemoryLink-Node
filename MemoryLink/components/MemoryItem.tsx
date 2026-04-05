import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import { UserPlus, Image, Video, Music, Clock } from 'lucide-react-native'
import { Image as ExpoImage } from 'expo-image'
import { useVideoPlayer, VideoView } from 'expo-video'
const MemoryItem = ({ item }: { item: any }) => {
  const player = useVideoPlayer(item.mediaUrl, (player) => {
    player.loop = true;
  });

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image/jpeg':
        return <Image size={16} color="#6B7280" />
      case 'video/mp4':
        return <Video size={16} color="#6B7280" />
      case 'audio/mp3':
        return <Music size={16} color="#6B7280" />
      default:
        return <Image size={16} color="#6B7280" />
    }
  }

  const getMediaPreview = () => {
    switch (item.mediaType) {
      case 'image/jpeg':
        return (
          <ExpoImage
            source={{ uri: item.mediaUrl }}
            style={{ width: '100%', height: 200 }}
            contentFit="cover"
            className="rounded-lg"
          />
        )
      case 'video/mp4':
        return (
          <View className="w-full h-48 bg-gray-900 rounded-lg overflow-hidden">
            <VideoView
              player={player}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
        )
      case 'audio/mp3':
        return (
          <View className="w-full h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg items-center justify-center">
            <Music size={40} color="#2563EB" />
            <Text className="text-blue-800 mt-2 text-sm font-semibold">Audio</Text>
          </View>
        )
      default:
        return (
          <ExpoImage
            source={{ uri: item.mediaUrl }}
            style={{ width: '100%', height: 200 }}
            contentFit="cover"
            className="rounded-lg"
          />
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      {/* Media Preview */}
      {getMediaPreview()}

      {/* Memory Content */}
      <View className="p-4">
        {/* User Info */}
        <View className="flex-row items-center mb-3">
          {item.userId?.profileImage ? (
            <ExpoImage
              source={{ uri: item.userId.profileImage }}
              style={{ width: 36, height: 36 }}
              contentFit="cover"
              className="rounded-full"
            />
          ) : (
            <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center">
              <UserPlus size={18} color="#2563EB" />
            </View>
          )}
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-gray-800">
              {item.userId?.username || 'Anonymous'}
            </Text>
            <View className="flex-row items-center">
              <Clock size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500 ml-1">
                {formatDate(item.createdAt)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-full">
            {getMediaTypeIcon(item.mediaType)}
            <Text className="text-xs text-gray-600 ml-1 capitalize">
              {item.mediaType.split('/')[1]}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-lg font-bold text-gray-800 mb-2">{item.title}</Text>

        {/* Description */}
        {item.description ? (
          <Text className="text-gray-600 text-sm leading-relaxed">
            {item.description}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

export default MemoryItem