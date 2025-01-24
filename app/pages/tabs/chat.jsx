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
import { router, useRouter } from "expo-router";
import ChatItem from '@/components/ChatItem';
import { useNavigation } from '@react-navigation/native';
const ChatScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, name");
      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  // Fetch all chat rooms
  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase.from("groups").select("*");
      if (error) throw error;
      setGroups(data);
    } catch (err) {
      console.error("Error fetching groups:", err.message);
    }
  };

  // Create a new group
  const createGroup = async () => {
    if (!newGroupName.trim())
      return Alert.alert("Error", "Group name cannot be empty.");
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error } = await supabase
        .from("groups")
        .insert({ name: newGroupName, created_by: user.id });
      if (error) throw error;

      setNewGroupName(""); // Clear input
      fetchGroups(); // Refresh groups
    } catch (err) {
      console.error("Error creating group:", err.message);
    }
  };

  // Delete a group
  const deleteGroup = async (groupId) => {
    try {
      const { error } = await supabase
        .from("groups")
        .delete()
        .eq("id", groupId);
      if (error) throw error;
      fetchGroups(); // Refresh groups
    } catch (err) {
      console.error("Error deleting group:", err.message);
    }
  };

  // Start a one-on-one chat
  const startChat = async (recipientId) => {
    console.log("Starting chat with recipient:", recipientId);
    router.push({
      pathname: "/pages/chat/chatRoom",
      params: { recipientId },  // Pass the recipientId for one-on-one chats
    });
  };

  // Start a group chat
  const startGroupChat = async (groupId) => {
    console.log("Starting group chat with group:", groupId);
    router.push({
      pathname: "/pages/chat/chatRoom",
      params: { groupId },  // Pass the groupId for group chats
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchGroups()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
        {/* Header */}
        <View className="flex mt-4 ml-3 flex-row justify-between">
          <Text className="font-rubik-bold text-3xl">Chats</Text>
          <TouchableOpacity onPress={() => router.push("pages/screens/menu")}>
            <Icon name="threeDotsHorizontal" size={24} />
          </TouchableOpacity>
        </View>

        {/* Group Chat Section */}
        <View className="mt-4">
          <Text className="font-medium text-lg">Group Chats</Text>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center mt-3 bg-white p-3 rounded-lg">
                <Text className="text-gray-800">{item.name}</Text>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => {
                      if (!item.id) {
                        console.error("Item ID is missing!", item);
                        return; // Don't navigate if ID is invalid
                      }
                      console.log("Navigating with groupId:", item.id);
                      // router.push({
                      //   pathname: "chatRoom",
                      //   params: { groupId: item.id },
                      // });
                      navigation.navigate('ChatRoom')
                    }}
                    className="mr-3"
                  >
                    <Icon name="chat" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteGroup(item.id)}>
                    <Icon name="delete" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* Create Group */}
        <View className="mt-4">
          <TextInput
            placeholder="New group name..."
            value={newGroupName}
            onChangeText={setNewGroupName}
            className="border rounded-lg px-4 py-2"
          />
          <TouchableOpacity
            onPress={createGroup}
            className="bg-primary-500 rounded-lg p-3 mt-2"
          >
            <Text className="text-white text-center">Create Group</Text>
          </TouchableOpacity>
        </View>

        {/* Users Section */}
        <View className="mt-4">
          <Text className="font-medium text-lg">All Users</Text>
          <FlatList
            data={[...groups, ...users]} // Combine group chats and users
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatItem
                chat={item}
                onPress={() => {
                  console.log("Navigating with item ID:", item.id);
                  item.name
                    ?
                    //  router.push({
                    //     pathname: "/pages/chat/chatRoom",
                    //     params: { groupId: item.id },
                    //   })
                    navigation.navigate('ChatRoom', { groupId:item.id })
                    : 
                    // router.push({
                    //     pathname: "/pages/chat/chatRoom",
                    //     params: { recipientId: item.id },
                    //   });
                    navigation.navigate('ChatRoom', { recipientId:item.id })
                }}
              />
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChatScreen;
