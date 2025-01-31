import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { fetchPosts } from "../../services/postService";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import BackButton from "@/components/BackButton";

const ProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params?.userId;
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const limit = 10; // Number of posts to fetch per request

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const getPosts = async (isRefresh = false) => {
    if (!hasMore && !isRefresh) return;

    try {
      const response = await fetchPosts(posts.length + limit, userId);

      if (response.success) {
        const newPosts = response.data;

        if (isRefresh) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }

        if (newPosts.length < limit) setHasMore(false);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    await getPosts(true);
    setRefreshing(false);
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchUserData();
      getPosts();
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 bg-primary-50 justify-center">
        <Loading 
        size={50}
        />
      </View>
    );
  }

  if (!userData) {
    return (
      <ScreenWrapper>
        <Text className="text-center mt-10 font-rubik-medium text-lg">
          User not found.
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View className="bg-primary-50">
      <StatusBar />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard item={item} router={router} />}
        onEndReached={getPosts}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View className="flex-1 bg-primary-50 px-5 pb-5">
            {/* Header */}
            <View className="flex-row justify-between items-center -ml-3">
              <BackButton router={router} />
            </View>

            {/* User Info */}
            <View className="flex justify-center items-center mt-5">
              <Avatar
                uri={userData?.image}
                size={hp(15)}
                style={{ borderWidth: 5, borderColor: "#4B2C7F" }}
              />
              <Text className="font-rubik-medium text-2xl text-center mt-4">
                <Text className="text-primary-100">{userData?.name}</Text>
              </Text>
            </View>

            {/* Contact Information */}
            <View className="flex items-center mt-5">
              {user?.email && (
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon name="mail" size={hp(3)} />
                  <Text className="font-rubik-medium text-1xl">{user?.email}</Text>
                </View>
              )}
              {userData?.phoneNumber && (
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon name="call" size={hp(3)} />
                  <Text className="font-rubik-medium text-1xl">
                    {userData?.phoneNumber}
                  </Text>
                </View>
              )}
              {userData?.address && (
                <View className="flex-row items-center gap-2">
                  <Icon name="location" size={hp(3)} />
                  <Text className="font-rubik-medium text-1xl">
                    {userData?.address}
                  </Text>
                </View>
              )}
            </View>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <Loading />
          ) : (
            <Text className="text-center font-rubik-medium mt-5">
              
            </Text>
          )
        }
      />
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
