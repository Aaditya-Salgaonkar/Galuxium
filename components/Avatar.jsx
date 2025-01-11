import { View, Text ,Image} from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'
import { getUserImageSource } from '../services/imageService'
const Avatar = ({
    uri,
    size=hp(4),
    style={}
    
}) => {
  return (
    <Image 
    source={getUserImageSource(uri)}
    transition={100} //in milliseconds
    style={[{height:size,width:size},style]}
    className='rounded-full'
    />
  )
}

export default Avatar