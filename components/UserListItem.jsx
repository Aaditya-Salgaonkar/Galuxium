import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Animated,
} from "react-native";

import { hp } from "@/helpers/common";
import { Image } from "expo-image";
import { getUserImageSource } from "../services/imageService";
const UserListItem = ({ user }) => {
  const item = user;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  console.log(item);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      className="flex-row items-center bg-white rounded-lg shadow-lg mx-5 my-2 p-4"
      style={{
        opacity: fadeAnim,
        transform: [
          {
            scale: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
      }}
    >
      <View className="flex-1 ml-4 flex-row items-center gap-5">
        <View className="">
        <Image
          source={getUserImageSource(item.image)}
          style={{ 
            height: hp(4), 
            width: hp(4), 
            borderRadius: hp(2), 
          }}
          contentFit="contain"
          transition={100}
        />
        </View>
        <View>
        <Text className="text-lg font-bold">{item?.name}</Text>
        {item?.is_verified && (
          <Text className="text-purple-700 text-xs font-semibold">
            Verified
          </Text>
        )}
        <Text className="text-sm text-gray-600">
          {item?.bio || "No bio available"}
        </Text>
 
        </View>
      </View>
    </Animated.View>
  );
};

export default UserListItem;
