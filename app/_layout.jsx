import { View, Text,LogBox,Dimensions,StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import './styles/globals.css'
import { useFonts } from "expo-font";
import {AuthProvider,useAuth} from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {getUserData} from '../services/userService'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer','Warning: MemoizedTNodeRenderer','Warning: TRenderEngineProvider'])

const _layout=()=>{
  return (
    <GestureHandlerRootView className='flex-1'>
      <AuthProvider>
        <MainLayout />
    </AuthProvider>
    </GestureHandlerRootView>
  )
}


const MainLayout = () => {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require('../assets/fonts/Rubik-Bold.ttf'),
    "Rubik-ExtraBold": require('../assets/fonts/Rubik-ExtraBold.ttf'),
    "Rubik-Light": require('../assets/fonts/Rubik-Light.ttf'),
    "Rubik-Medium": require('../assets/fonts/Rubik-Medium.ttf'),
    "Rubik-Regular": require('../assets/fonts/Rubik-Regular.ttf'),
    "Rubik-SemiBold": require('../assets/fonts/Rubik-SemiBold.ttf'),
    "SpaceMono-Regular": require('../assets/fonts/SpaceMono-Regular.ttf'),
  })
  const {setAuth,setUserData} =useAuth();
  const router = useRouter();

  useEffect(()=>{
    supabase.auth.onAuthStateChange((_event,session)=>{
      console.log('Session user : ',session?.user?.id);
      
      if(session) {
        //setAUth
        setAuth(session?.user);
        //fetch the updated user
        updateUserData(session?.user, session?.user?.email);
        router.replace('/pages/tabs/home');
        //move to home Screen
      }
      else {
        //set auth null
        setAuth(null);
        router.replace('/pages/welcome');
        //move to welcome screen
      }

    })
  },[]);//add empty array for dependencies otherwise it goes in a loop

  const updateUserData = async (user,email) =>{
    let res= await getUserData(user?.id);
    if(res.success) setUserData({...res.data, email});
  }

  return (
    <Stack 
    screenOptions={{
      headerShown:false,
    }}/>
  )
}

export default _layout