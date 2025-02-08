import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Avatar from './Avatar';

const NotificationItem = ({ item, router }) => {
  const navigateToProfile = () => {
    router.push({
      pathname: "/pages/profileinfo",
      params: { userId: item.sender.id },
    }); // Navigate to the sender's profile
  };

  const getNotificationText = () => {
    // Customize how notifications are displayed based on their titles or other properties
    switch (item.title) {
      case "New Follow Request":
        return `Requested to follow you.`;
      case "Follow Accepted":
        return `Accepted your follow request.`;
      case "Post Like":
        return `Liked your post`;
      case "Post Comment":
        return `Commented on your post`;
      
    }
  };

  return (
    <View className="flex p-5 border-b border-gray-300">
      <View className='justify-between flex-row items-center'>
      <View className="flex-row items-center gap-3">
      <Avatar
          uri={item?.sender?.image}
          style={{
            borderWidth: 4,
            borderColor: "#4B2C7F",
          }}
        />
        <Text className="text-lg font-semibold">{item?.sender?.name}</Text>
        
      </View>
      <View>
      <TouchableOpacity onPress={navigateToProfile} className="ml-3">
        <Text className="text-primary-500 font-rubik-semibold">View Profile</Text>
      </TouchableOpacity>
      </View>
      </View>
      
      

      <View className='mt-1'>
      <Text className="text-lg font-semibold">{getNotificationText()}</Text>
      </View>
    </View>

  );
};

export default NotificationItem;
