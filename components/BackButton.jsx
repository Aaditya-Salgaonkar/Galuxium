import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
const BackButton = ({size=26,router}) => {
  return (
    <TouchableOpacity onPress={()=>router.back()} className='flex p-5'>
        <Icon name="arrowLeft" strokWidth={2.5} size={size} className="text-primary-100"/>
    </TouchableOpacity>
  )
} 

export default BackButton