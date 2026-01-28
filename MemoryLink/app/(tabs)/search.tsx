import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Search } from 'lucide-react-native'

export default function search() {
  const [search, setSearch] = useState('');

  const handleSearch = (text: string) => {
    setSearch(text);
    console.log(text);
  }
  return (
    <View className='flex items-center justify-center mx-6'>
      <View className='flex flex-row items-center border w-full rounded-xl py-1 px-3 mt-6'>
        <TextInput
          className='flex-1'
          placeholder='Search friends'
          value={search}
          onChangeText={handleSearch}

        />
        <Search size={24} />
      </View>
    </View>
  )
}
