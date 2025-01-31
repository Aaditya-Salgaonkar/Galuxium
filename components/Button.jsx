import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'

import Loading from './Loading'
const Button = ({
    buttonStyle,
    textStyle,
    title='',
    onPress=()=>{},
    loading=false,
    hasShadow=true,
}) => {
    const shadowStyle={
        shadowColor:'black',
        shadowOffset:{width:0,height:10},
        shadowOpacity:0.2,
        shadowRadius:8,
        elevation:7,
    };

    const combinedStyles = hasShadow ? { ...shadowStyle, ...buttonStyle } : buttonStyle;
  
    if(loading) {
        return(
            <View style={{buttonStyle}} className='bg-white'>
                <Loading />
            </View>
        )
    }
    return (
    <TouchableOpacity 
    onPress={onPress} 
    className='bg-primary-100 p-3 rounded-3xl justify-center items-center'
    style={combinedStyles}
    >
      <Text className='text-white font-rubik-medium text-2xl text-center px-10 py-1' style={{textStyle}}>{title}</Text>
    </TouchableOpacity>
    
  )
}

export default Button