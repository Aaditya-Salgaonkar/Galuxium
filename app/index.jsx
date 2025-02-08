import { View, Text,Button, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'
import Loading from '../components/Loading'

const index = () => {
  const router = useRouter();


  return (
    // <ScreenWrapper>
    //   <Text>index</Text>
    //   <TouchableOpacity 
    //   className='bg-white p-3 flex justify-center items-center w-2/6 rounded-full'
    //   onPress={()=>router.push('/pages/welcome')}>
    //   <Text className='font-semibold'>Welcome Screen</Text>
    //   </TouchableOpacity>
      
    // </ScreenWrapper>
    <ScreenWrapper>

      <View className='flex-1 justify-center items-center bg-primary-50'>
      <Loading 
      size={96}
      color='#4B2C7F'
      />
      </View>
      
    </ScreenWrapper>
  )
}

export default index