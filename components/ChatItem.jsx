import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "@/assets/icons"; // Replace with your icons

const ChatItem = ({ chat, onPress }) => {
  const isGroupChat = !!chat.name; // If `name` exists, it's a group chat.

  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-3 bg-white rounded-lg mt-2">
      {/* Chat Name */}
      <View className="flex-1">
        {
          console.log("Name: ",chat)
        }
        <Text className="text-lg font-medium text-gray-900">
          {isGroupChat ? chat.name : chat.email} {/* Group name or user email */}
        </Text>
        {isGroupChat && (
          <Text className="text-sm text-gray-500">
            Created by: {chat.created_by_email || "Unknown"} {/* Optional creator info */}
          </Text>
        )}
      </View>

      {/* Icon */}
      {/* <Icon name="arrowRight" size={20} color="#3b82f6" /> */}
    </TouchableOpacity>
  );
};

export default ChatItem;
