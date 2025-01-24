import { View, Text ,TouchableOpacity} from 'react-native'
import React from 'react'
import ScreenWrapper from '../../../components/ScreenWrapper'
import BackButton from '../../../components/BackButton'
import { useRouter } from 'expo-router'
import Icon from '../../../assets/icons'
import { hp } from '../../../helpers/common'
import MenuOption from '../../../components/MenuOption'
const Menu = () => {
    const router =useRouter();
  return (
    <ScreenWrapper>
        <View className="flex -ml-3 flex-row justify-between items-center px-5"> 
                          <View className="flex">
                            <BackButton router={router} />
                          </View>
                          <View className="flex-1 flex-row justify-between">
                          <View className="flex-row">
                          <Text className="font-rubik-bold text-3xl">Settings</Text>
                          </View>
                          </View>
                          <View className="flex flex-row gap-4">
                            
                            
                          </View>
                          </View>
        <View className='gap-3'>
            <TouchableOpacity>
                <MenuOption name="arrowright" icon="lock" title="Account privacy" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MenuOption name="arrowright" icon="user" title="Account status" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MenuOption name="arrowright" icon="favourites" title="Favourites" />
            </TouchableOpacity>
            <TouchableOpacity>
                <MenuOption name="arrowright" icon="about" title="About" />
            </TouchableOpacity>
        </View>
    </ScreenWrapper>
  )
}

export default Menu