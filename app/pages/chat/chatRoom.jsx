import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Input from "../../../components/Input";
import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";

const ChatRoomScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const recipientId = params?.recipientId;

  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);

  // Fetch recipient details
  useEffect(() => {
    const fetchRecipientDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, image")
          .eq("id", recipientId)
          .single();

        if (error) throw error;
        setRecipient(data);
      } catch (err) {
        console.error("Error fetching recipient details:", err.message);
      }
    };

    if (recipientId) fetchRecipientDetails();
  }, [recipientId]);

  // Fetch messages and set up real-time updates
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `recipient_id.eq.${recipientId},sender_id.eq.${recipientId}`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${recipientId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${recipientId} OR sender_id=eq.${recipientId}`,
        },
        (payload) => {
          console.log("New message received:", payload.new);
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const newMessageData = {
      content: newMessage,
      sender_id: user.id,
      recipient_id: recipientId,
      created_at: new Date().toISOString(),
    };

    // Optimistically update UI
    setMessages((prevMessages) => [...prevMessages, newMessageData]);
    setNewMessage("");

    try {
      const { error } = await supabase.from("messages").insert(newMessageData);
      if (error) throw error;
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  const MessageBubble = ({ message, isSender }) => (
    <View>
      {isSender ? (
        <View className="items-end">
          <View className="items-end bg-primary-1000 px-5 py-3 rounded-3xl m-2">
            <Text className="font-rubik-medium text-primary-50">
              {message.content}
            </Text>
            <Text style={styles.timestamp}>
              {new Date(message.created_at).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      ) : (
        <View className="items-start">
          <View className="items-start bg-primary-1100 px-5 py-3 rounded-3xl m-2">
            <Text className="font-rubik-medium">{message.content}</Text>
            <Text style={styles.timestamp}>
              {new Date(message.created_at).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 p-5 pb-24 mt-5 bg-primary-50">
      {/* Header */}
      <TouchableOpacity
        className="flex flex-row items-center gap-4 justify-center py-2"
        onPress={() => router.push("/pages/profileinfo")}
      >
        <Avatar uri={recipient?.image} />
        <Text className="font-rubik-semibold">{recipient?.name}</Text>
      </TouchableOpacity>

      {/* Messages */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <MessageBubble
            key={
              message.id ||
              `${message.sender_id}-${message.recipient_id}-${message.created_at}`
            }
            message={message}
            isSender={message.sender_id === user.id}
          />
        ))}
        {typing && (
          <Text style={styles.typingIndicator}>Recipient is typing...</Text>
        )}
      </ScrollView>

      {/* Input */}
      <View className="left-5 right-20 absolute flex-row bottom-4 gap-4">
        <Input
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="flex-1 justify-center mb-1"
        >
          <Icon name="send" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
});

export default ChatRoomScreen;
