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
import BackButton from "@/components/BackButton";
import { router, useRouter } from "expo-router";
const NewPost = () => {
  const { user, setUser } = useAuth();

  const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar />
      {/* Header */}
      <View className="flex-1 bg-primary-50 px-5">
        
        



        <View className="flex -ml-3 flex-row justify-between items-center"> 
        <View className="flex">
          <BackButton router={router} />
        </View>
        <View className="flex-1">
          <Text className="font-rubik-bold text-3xl">Create Post</Text>
        </View>
        <View className="flex">
          <TouchableOpacity>
            <Icon name="threeDotsHorizontal" size={hp(4)} />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;
