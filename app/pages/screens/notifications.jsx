import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { hp, wp } from "../../../helpers/common";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import NotificationItem from "../../../components/NotificationItem";
import { fetchNotifications } from "../../../services/postService";
import BackButton from "@/components/BackButton";
import { StatusBar } from "expo-status-bar";

// Notifications Page Component
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    getNotifications();
  }, []);

  // Fetch notifications from the backend
  const getNotifications = async () => {
    const res = await fetchNotifications(user.id);
    if (res.success) setNotifications(res.data);
  };

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="bg-primary-50 flex-1">
        <View className="flex flex-row items-center">
          <BackButton router={router} />
          <Text className="font-rubik-bold text-3xl">Notifications</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                router={router}
              />
            ))
          }
          {
            notifications.length === 0 && (
              <View className="flex items-center mt-10">
                <Text className="font-rubik-semibold">No notifications yet!</Text>
              </View>
            )
          }
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationPage;
