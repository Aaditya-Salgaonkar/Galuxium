import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { supabase } from "../../../lib/supabase";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import Icon from "@/assets/icons"; // Replace with your icons
import Loading from "../../../components/Loading";

const ChatRoomScreen = ({ route }) => {
  const { groupId, recipientId } = route.params; // Determines chat type
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
console.log("GroupId: ",groupId)
console.log("RecipientId: ",recipientId)
  // Fetch messages for the chat room
  const fetchMessages = async () => {
    try {
      const query = supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (groupId) query.eq("group_id", groupId);
      if (recipientId) query.eq("recipient_id", recipientId);

      const { data, error } = await query;
      if (error) throw error;

      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content: newMessage,
        sender_id: supabase.auth.user().id,
        group_id: groupId || null,
        recipient_id: recipientId || null,
      });

      if (error) throw error;

      setNewMessage(""); // Clear input
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .from("messages")
      .on("INSERT", (payload) => {
        const newMessage = payload.new;
        // Add new message to the state
        setMessages((prev) => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <Loading />;

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`my-2 p-3 rounded-lg ${
                item.sender_id === supabase.auth.user().id
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <Text>{item.content}</Text>
            </View>
          )}
          className="flex-1"
        />

        {/* Message Input */}
        <View className="flex-row items-center mt-2">
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <TouchableOpacity onPress={sendMessage} className="ml-2 bg-blue-500 p-3 rounded-lg">
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChatRoomScreen;
