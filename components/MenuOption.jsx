import { View, Text } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { size } from '@floating-ui/react-native'
const MenuOption = ({name,icon,title}) => {
  return (
    <View className='px-10 pt-5'>
      
      <View className='flex flex-row justify-between'>
        <View className='flex-row gap-5'>
        <Icon name={icon} size={size} />
        <Text className='font-rubik-medium'>{title}</Text>
        </View>
        <View>
        <Icon name={name} className="text-primary-100"/>
        </View>
      </View>
    </View>
  )
}

export default MenuOption