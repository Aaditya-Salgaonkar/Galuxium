import { View, Text, TextInput } from 'react-native'
import React from 'react'


const Input = (props) => {
  return (
    
        <View style={props.containerStyles && props.containerStyles} className='flex w-full flex-row bg-white justify-between items-start p-7 gap-3 h-4/6 rounded-full'>
          <View className='-mt-4'>
          {
            props.icon && props.icon
          }
          </View>
        <TextInput
        placeholder={props.placeholder} 
        style={{flex:1}}
        placeholderTextColor={className='text-primary-100'}
        ref={props.inputRef && props.inputRef}
        {...props}
        className='text-1xl font-rubik-medium -mt-5 -mb-6 '
        />
        </View>
        
    
  )
}

export default Input