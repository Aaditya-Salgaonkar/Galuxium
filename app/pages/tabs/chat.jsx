import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons"; // Replace with your icons
import { StatusBar } from "expo-status-bar";
import Loading from "../../../components/Loading";
import { useRouter } from "expo-router";
import ChatItem from "@/components/ChatItem";

const ChatScreen = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, name");
      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <View className="flex-1 items-center justify-center">
    <Loading />
  </View>;

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
        {/* Header */}
        <View className="flex mt-4 flex-row justify-between">
          <Text className="font-rubik-bold text-3xl">Chats</Text>
          <TouchableOpacity onPress={()=>router.push('pages/screens/menu')} className="absolute">
            <Text>111</Text>
          </TouchableOpacity>
        </View>


        {/* Users Section */}
        <View className="mt-4">
          <Text className="font-medium text-lg">Followers</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ChatItem
                chat={item}
                onPress={() =>
                  router.push({
                    pathname: "/pages/chat/chatRoom",
                    params: { recipientId: item.id },
                  })
                }
              />
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChatScreen;
