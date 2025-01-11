import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Icon from "@/assets/icons/index";
import { hp } from "../../../helpers/common";

const TabIcon = ({ focused, name }) => (
  <View className="mt-2">
    <Icon
      name={name}
      size={hp(3.7)}
      color={focused ? "#6A48A2" : "#bfb0c7"}
      resizeMode="contain"
    />
  </View>
);
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FBFBFD",
          minHeight: hp(5),
          borderTopWidth: 1,
          borderColor: "#F8D7A4",
          justifyContent: "space-between",
          display: "flex",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="chat" focused={focused} />
          ),
        }}
      />

<Tabs.Screen
        name="notification"
        options={{
          title: "notification",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="notification" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
