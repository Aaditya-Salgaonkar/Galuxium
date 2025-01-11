import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import Avatar from "../../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import BackButton from '@/components/BackButton'
import { router } from "expo-router";
const chat = () => {
  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 flex-row px-5">
      
            
            
        <View className="flex-1 mt-4 ml-3 flex-row justify-between">
            
          <Text className="font-rubik-bold text-3xl">Chat</Text>
          <View className="flex">
            <TouchableOpacity>
              <Icon name="threeDotsHorizontal" size={hp(4)} />
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default chat