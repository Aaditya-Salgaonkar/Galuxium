import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/Button";
import { wp } from "../../../helpers/common";
import { StatusBar } from "expo-status-bar";
import Icon from "@/assets/icons";
import { hp } from "../../../helpers/common";
import { useRouter } from "expo-router";
import Avatar from "../../../components/Avatar";
import { Alert } from "react-native";
const Home = () => {
  

  const { user, setUser } = useAuth();
  

  const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="bg-primary-50 flex-1 flex-row px-5">
        <View className="flex-1 mt-4 ml-3 flex-row justify-between">
          <View className="flex-row">
          <Text className="font-rubik-bold text-3xl">Galuxium</Text>
                        </View>
          
          <View className="flex flex-row gap-5">
            
            <TouchableOpacity
              onPress={() => router.push("/pages/screens/postScreen")}
            >
              <Icon name="plus" size={hp(4)}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/pages/screens/profile")}
            >
              <Avatar
                uri={user?.image}
                size={hp(4)}
                style={{ borderWidth: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        
      </View>
    </ScreenWrapper>
  );
};

export default Home;
