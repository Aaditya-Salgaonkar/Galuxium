import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "@/assets/icons"; 

const ChatItem = ({ chat, onPress }) => {
  const isGroupChat = !!chat.name; 
console.log("CHat",chat);
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-3 bg-white rounded-3xl mt-3">

      <View className="flex-1">
        {
          console.log("Name: ",chat)
        }
        <Text className="text-lg font-medium text-gray-900">
          {isGroupChat ? chat.name : chat.email} 
        </Text>
        {isGroupChat && (
          <Text className="text-sm text-gray-500">
            Created by: {chat.name || "Unknown"} 
          </Text>
        )}
      </View>

    </TouchableOpacity>
  );
};

export default ChatItem;
