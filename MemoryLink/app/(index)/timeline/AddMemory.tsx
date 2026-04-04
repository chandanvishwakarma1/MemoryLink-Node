import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { ArrowLeft, Image as ImageIcon, Video, Music, X, Upload, Camera } from 'lucide-react-native'
import { Image as ExpoImage } from 'expo-image'
import { TextInput } from 'react-native-gesture-handler'
import { useAuthStore } from '@/store/authStore'
import { useQueryClient } from '@tanstack/react-query'
import COLORS from '@/constants/colors'

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

type MediaType = 'image' | 'video' | 'audio' | null

interface SelectedMedia {
  type: MediaType
  uri: string
  name: string | null
  size: number | null
}

const AddMemory = () => {
  const router = useRouter()
  const { id: timelineId } = useLocalSearchParams()
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Request permissions for media access
  const requestMediaPermission = async (mediaType: 'camera' | 'library') => {
    if (mediaType === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.')
        return false
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required.')
        return false
      }
    }
    return true
  }

  // Pick image from library
  const pickImage = async () => {
    const hasPermission = await requestMediaPermission('library')
    if (!hasPermission) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    })

    if (!result.canceled && result.assets.length > 0) {

      console.log("result is here: ", result);
      setSelectedMedia({
        type: 'image',
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? null,
        size: result.assets[0].fileSize ?? null,
      })
      setImageBase64(result.assets[0].base64 ?? null)
    }
  }

  // Pick video from library
  const pickVideo = async () => {
    const hasPermission = await requestMediaPermission('library')
    if (!hasPermission) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      base64: true
    })

    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia({
        type: 'video',
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? null,
        size: result.assets[0].fileSize ?? null,
      })
      
    }
  }

  // Pick audio from library
  const pickAudio = async () => {
    const hasPermission = await requestMediaPermission('library')
    if (!hasPermission) return

    // For audio, we use the document picker approach
    // Since expo-image-picker doesn't support audio, we'll use a workaround
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    })

    if (!result.canceled && result.assets.length > 0) {
      // Note: This is a workaround. For proper audio picking, 
      // you might want to add expo-document-picker
      setSelectedMedia({
        type: 'audio',
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? null,
        size: result.assets[0].fileSize ?? null,
      })
    }
  }

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestMediaPermission('camera')
    if (!hasPermission) return

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true
    })

    if (!result.canceled && result.assets.length > 0) {
      setSelectedMedia({
        type: 'image',
        uri: result.assets[0].uri,
        name: result.assets[0].fileName ?? null,
        size: result.assets[0].fileSize ?? null,
      })
      setImageBase64(result.assets[0].base64 ?? null)
    }
  }

  // Clear selected media
  const clearMedia = () => {
    setSelectedMedia(null)
    setTitle('')
    setDescription('')
  }

  // Upload memory to backend
  const uploadMemory = async () => {
    if (!selectedMedia) {
      Alert.alert('Error', 'Please select a media file')
      return
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your memory')
      return
    }

    if (!timelineId) {
      Alert.alert('Error', 'Timeline ID is missing')
      return
    }

    try {
      setUploading(true)

      // Create form data
      const formData = new FormData()

      // Append the file
      const fileExtension = selectedMedia.uri.split('.').pop()
      const fileName = `${Date.now()}.${fileExtension}`

      // // @ts-ignore - FormData append with file
      // formData.append('memory', {
      //   uri: selectedMedia.uri,
      //   name: fileName,
      //   type: selectedMedia.type === 'image' ? 'image/jpeg' :
      //     selectedMedia.type === 'video' ? 'video/mp4' : 'audio/mpeg',
      // })

      // // Append metadata
      // formData.append('title', title.trim())
      // formData.append('description', description.trim())
      // formData.append('type', selectedMedia.type!)
      const resourceType = selectedMedia.type === 'image' ? 'image' : 'video'
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

      // Set the correct MIME type for the data URL
      const mimeType = selectedMedia.type === 'image'
        ? 'image/jpeg'
        : selectedMedia.type === 'video'
          ? 'video/mp4'
          : 'video/mp4'; // Audio also uses video/mp4 for Cloudinary

      // console.log("mediaUrl:", imageDataUrl)

      if (selectedMedia.type === 'image' && imageBase64) {
        const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;
        formData.append('file', imageDataUrl);
      } else {
        // Direct file upload for videos/audio or when base64 is not available
        // @ts-ignore - FormData append with file object
        formData.append('file', {
          uri: selectedMedia.uri,
          name: fileName,
          type: mimeType,
        });
      }

      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'memorylink');

      console.log("mediaUrl:", CLOUDINARY_CLOUD_NAME)
      console.log("mediaUrl:", CLOUDINARY_UPLOAD_PRESET)
      const cloudinaryResponse = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });

      if (!cloudinaryResponse.ok) {
        const errorData = await cloudinaryResponse.json();
        console.error("Cloudinary Error Data: ", errorData);
        throw new Error(errorData.error.message || "Failed to upload image to Cloudinary");
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const mediaUrl = cloudinaryData.secure_url; // Get the secure URL of the hosted image
      console.log("mediaUrl:", mediaUrl)

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/timelines/${timelineId}/memories`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timelineId,
            title: title.trim(),
            description: description.trim(),
            mediaUrl,
            mediaType: selectedMedia.type === 'image' ? 'image/jpeg' :
              selectedMedia.type === 'video' ? 'video/mp4' : 'audio/mpeg',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload memory')
      }

      // Invalidate queries to refresh timeline data
      queryClient.invalidateQueries({ queryKey: ['timelines', timelineId] })

      Alert.alert('Success', 'Memory added successfully!')
      router.back()
    } catch (error) {
      console.error('Error uploading memory:', error)
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Something went wrong while uploading'
      )
    } finally {
      setUploading(false)
    }
  }

  const isSubmitDisabled = !selectedMedia || !title.trim() || uploading

  // Render media type selection buttons (shown when no media is selected)
  const renderMediaSelection = () => (
    <View className="mt-6">
      <Text className="text-lg font-semibold text-gray-700 mb-4">Select Media Type</Text>

      <View className="flex-row justify-between gap-4">
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 bg-gray-50 rounded-2xl p-6 items-center border-2 border-blue-100"
          activeOpacity={0.7}
        >
          <View className="w-16 h-16 rounded-full  items-center justify-center mb-3">
            <ImageIcon size={32} />
          </View>
          <Text className="font-semibold text-gray-700">Image</Text>
          <Text className="text-xs text-gray-500 mt-1">From gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickVideo}
          className="flex-1 bg-gray-50 rounded-2xl p-6 items-center border-2 border-blue-100"
          activeOpacity={0.7}
        >
          <View className="w-16 h-16 rounded-full  items-center justify-center mb-3">
            <Video size={32} />
          </View>
          <Text className="font-semibold text-gray-700">Video</Text>
          <Text className="text-xs text-gray-500 mt-1">From gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickAudio}
          className="flex-1 bg-gray-50 rounded-2xl p-6 items-center border-2 border-blue-100"
          activeOpacity={0.7}
        >
          <View className="w-16 h-16 rounded-full  items-center justify-center mb-3">
            <Music size={32} />
          </View>
          <Text className="font-semibold text-gray-700">Audio</Text>
          <Text className="text-xs text-gray-500 mt-1">From files</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={takePhoto}
        className="mt-4 bg-gray-50 rounded-2xl p-4 flex-row items-center justify-center gap-3 border-2 border-blue-100"
        activeOpacity={0.7}
      >
        <View className="w-10 h-10 rounded-full  items-center justify-center">
          <Camera size={24} />
        </View>
        <Text className="font-semibold text-gray-700">Take a Photo</Text>
      </TouchableOpacity>
    </View>
  )

  const renderMediaPreview = () => {
    if (!selectedMedia) return null

    return (
      <View className="mt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-700">Selected Media</Text>
          <TouchableOpacity onPress={clearMedia} className="p-2">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-100 rounded-2xl items-center overflow-hidden">
          {selectedMedia.type === 'image' && (
            <ExpoImage
              source={{ uri: selectedMedia.uri }}
              style={{ width: '100%', height: 250 }}
              contentFit="cover"
              className="rounded-xl"
            />
          )}

          {selectedMedia.type === 'video' && (
            <View className="w-full h-64 bg-black rounded-xl items-center justify-center">
              <Video size={48} color="#FFF" />
              <Text className="text-white mt-2">Video Preview</Text>
              <Text className="text-gray-400 text-sm">Video will be playable after upload</Text>
            </View>
          )}

          {selectedMedia.type === 'audio' && (
            <View className="w-full h-40 bg-gradient-to-r from-green-100 to-green-200 rounded-xl items-center justify-center">
              <Music size={48} color="#16A34A" />
              <Text className="text-green-800 mt-2 font-semibold">Audio File</Text>
              <Text className="text-green-600 text-sm">Ready to upload</Text>
            </View>
          )}

          <Text className="text-gray-500 text-sm mt-3">
            {selectedMedia.name || 'Selected file'}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-4">
      <View className="flex-row items-center gap-4 mb-3">
        <Pressable onPress={() => router.back()} className="p-2">
          <ArrowLeft size={28} color="#1F2937" />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-800">Add Memory</Text>
      </View>

      {selectedMedia ? renderMediaPreview() : renderMediaSelection()}

      <View className="mt-6">
        <Text className="font-semibold text-gray-700 mb-2">Title *</Text>
        <TextInput
          className="bg-gray-100 p-4 rounded-xl text-base"
          placeholder="Give your memory a title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <Text className="text-xs text-gray-400 mt-1 text-right">
          {title.length}/100
        </Text>
      </View>

      <View className="mt-4">
        <Text className="font-semibold text-gray-700 mb-2">Description</Text>
        <TextInput
          className="bg-gray-100 p-4 rounded-xl text-base h-32 text-vertical-align-top"
          placeholder="Add a description (optional)"
          value={description}
          onChangeText={setDescription}
          maxLength={500}
          multiline
          textAlignVertical='top'
        />
        <Text className="text-xs text-gray-400 mt-1 text-right">
          {description.length}/500
        </Text>
      </View>

      <TouchableOpacity
        onPress={uploadMemory}
        disabled={isSubmitDisabled}
        className={`mt-8 mb-12 flex-row items-center justify-center gap-3 py-4 rounded-xl ${isSubmitDisabled ? 'bg-gray-300' : 'bg-blue-600'
          }`}
        activeOpacity={0.8}
      >
        {uploading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <Upload size={20} color="#FFF" />
            <Text className="text-white font-bold text-lg">Upload Memory</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddMemory