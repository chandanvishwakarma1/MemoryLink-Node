import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Details = () => {
    const { title, usernames, memLen, roles } = useLocalSearchParams();
    const username = typeof usernames === 'string' ? usernames.split(',') : Array.isArray(usernames) ? usernames : [];

    const role = typeof roles === 'string' ? roles.split(',') : Array.isArray(roles) ? roles : [];
    // console.log("roles", roles)


    return (
        <View className='flex-1 mx-6'>
            <View className='flex items-center justify-center'>
                <View className='h-24 w-24 rounded-full bg-gray-400'></View>
                <Text className="text-xl font-bold mt-4">{title}</Text>
            </View>
            <View className='flex-row gap-1 mt-6'>
                <View className=' flex-1 w-0 bg-gray-50 rounded-2xl p-6 items-center border-2 border-blue-100'>
                    <Text>{memLen ? memLen : '0'}</Text>
                    <Text>{memLen.length === 1 ? 'Memory' : 'Memories'}</Text>
                </View>
                <View className=' flex-1 w-0 bg-gray-50 rounded-2xl p-6 items-center border-2 border-blue-100'>
                    <Text>{username.length}</Text>
                    <Text>Members</Text>
                </View>
            </View>

            <View>
                <Text className='text-xl font-bold mt-3'>Members</Text>
                <View className='my-1'>
                    {
                        username.map((item,index) => {
                            const currrole = role[index].trim().toLowerCase()
                            return (
                                <View key={index} className='flex-row justify-between'>
                                    <Text className=''>{item}</Text>
                                    <Text>{currrole === 'owner' ? 'owner' : ''}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}

export default Details