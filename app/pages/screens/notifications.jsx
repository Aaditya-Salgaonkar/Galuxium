import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp,wp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import Avatar from "../../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import BackButton from "@/components/BackButton";
import { router, useRouter } from "expo-router";
import { fetchNotifications } from "../../../services/postService";
import NotificationItem from "../../../components/NotificationItem";
const notification = () => {
  const [notification, setNotification] = useState([]);
  const { user } = useAuth();
  const router= useRouter();
  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    let res = await fetchNotifications(user.id);
    if (res.success) setNotification(res.data);
  };
  return (
    <ScreenWrapper>
      <StatusBar />
      
      <View className="bg-primary-50 flex-1 px-5">
      <View className="flex -ml-3 flex-row justify-between items-center"> 
                          <View className="flex">
                            <BackButton router={router} />
                          </View>
                          <View className="flex-1 flex-row justify-between">
                          <View className="flex-row">
                          <Text className="font-rubik-bold text-3xl">Notifications</Text>
                          
                          </View>
                          </View>
                          
                          </View>
      {/* <View className="flex  flex-row px-5">
        <View className="flex-1 mt-4 ml-3 flex-row justify-between">
        <View className="">
        
      </View>
          <View className="flex-row">
            <View className="flex-1 items-start">
            <BackButton />
            </View>
            <Text className="font-rubik-bold text-3xl">Notif</Text>
            <Text className="font-rubik-bold text-3xl">ication</Text>
          </View>
          <View className="flex">
            <TouchableOpacity>
              <Icon name="threeDotsHorizontal" size={hp(4)} />
            </TouchableOpacity>
          </View>
        </View>


        
      </View> */}
      <View className="">
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              notification.map(item=>{
                return (
                  <NotificationItem
                    item={item}
                    key={item?.id}
                    router={router}
                  />
                )
              })
            }
            <View className=
            "flex items-center mt-10">
            {
              notification.length ==0 &&(
                <Text className="font-rubik-semibold">No notifications yet!</Text>
              )
            }
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default notification;
