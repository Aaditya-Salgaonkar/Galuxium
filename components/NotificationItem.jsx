import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
const NotificationItem = ({ item, router }) => {
  const handleClick = () => {
    let {postId,commentId}=JSON.parse(item?.data);
    router.push({pathname:'pages/screens/postDetails',params:{postId,commentId}})
  };
  const createdAt=moment(item?.created_at).format('DD MMM YY');
  return (
    <TouchableOpacity onPress={handleClick} className="bg-white rounded-3xl m-5 p-5">
      
      <View className="flex flex-row items-center gap-5">
        <View><Avatar uri={item?.sender?.image} /></View>
        <View className="flex">
          <View className="flex-row">
            <Text className="text-1xl font-rubik-bold">{item?.sender?.name}</Text>
            <Text className="text-1xl font-rubik-extrabold"> • </Text>
            <Text className="text-1xl font-rubik-medium">{createdAt}</Text>
            
            
          </View>
          <Text className="text-1xl font-rubik-medium">{item?.title}</Text>
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
