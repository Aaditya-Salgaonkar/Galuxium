import { View, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
const Loading = ({size="large",color={className:'font-primary-100'}}) => {
  return (
    <View className='justify-center items-center bg-primary-50'>
      <ActivityIndicator size={size} color='#4B2C7F' />
    </View>
  )
}

export default Loading