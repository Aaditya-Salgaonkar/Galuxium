import { View, Text } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
const MenuOption = ({name,icon,title}) => {
  return (
    <View className='px-10 pt-5'>
      
      <View className='flex flex-row justify-between'>
        <View className='flex-row gap-5'>
        <Icon name={icon} />
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