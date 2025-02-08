import {
  View,
  Text,
  FlatList,
  Alert,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Modal,
  PanResponder,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp,wp } from "../../helpers/common";
import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { fetchPosts } from "../../services/postService";
import Loading from "../../components/Loading";
import PostCard from "../../components/PostCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackButton from "../../components/BackButton";
import Icon from "../../assets/icons";
import { Image } from "expo-image";
import { getFollowers } from "../../services/followersService";
const PROFILE_SCREEN_LIMIT = 10; // Limit for pagination
const ProfileScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params?.userId;
  const { user } = useAuth();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadePostAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchFollowersAndFollowing();
      getPosts();
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
      Animated.timing(fadePostAnim, { toValue: 1, duration: 1000, delay: 300, useNativeDriver: true }).start();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
      if (error) throw error;
      setUserData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const getPosts = async (isRefresh = false) => {
    if (!hasMore && !isRefresh) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("account_visibility")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      if (userData.account_visibility === "private" && !isFollowing) {
        return;
      }

      const response = await fetchPosts(posts.length + PROFILE_SCREEN_LIMIT, userId);

      if (response.success) {
        const newPosts = response.data;
        if (isRefresh) {
          setPosts(newPosts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        }

        if (newPosts.length < PROFILE_SCREEN_LIMIT) setHasMore(false);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const fetchFollowersAndFollowing = async () => {
    try {
      const { data: followers } = await supabase.from("followers").select("id").eq("followed_id", userId);
      const { data: following } = await supabase.from("followers").select("id").eq("follower_id", userId);
      
      setFollowersCount(followers.length);
      setFollowingCount(following.length);      
      
      const { data: userFollowed } = await supabase.from("followers").select("id").eq("follower_id", user.id).eq("followed_id", userId);
      setIsFollowing(userFollowed.length > 0);
    } catch (error) {
      console.error("Error fetching followers/following:", error.message);
    }
  };

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await supabase.from("followers").delete().eq("follower_id", user.id).eq("followed_id", userId);
      } else {
        await supabase.from("followers").insert([{ follower_id: user.id, followed_id: userId }]);
      }
      setIsFollowing(!isFollowing);
      fetchFollowersAndFollowing();
      getFollowers(user.id)
    } catch (error) {
      console.error("Error toggling follow status:", error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getPosts(true);
    setRefreshing(false);
  };

  

  useEffect(() => {
    const followRequestSubscription = supabase
    .channel("follow_requests")
    .on("INSERT", (payload) => {
      if (payload.new.requested_id === user.id) {
        Alert.alert("New Follow Request!", "Check your requests.");
        fetchFollowersAndFollowing(); // Update followers/following count
      }
    })
    .subscribe();
    return () => {
      followRequestSubscription.unsubscribe()
    };
  }, []);

  if (loading || !userData) {
    return <Loading />;
  }

  if (!userData) {
    return <Text>User not found</Text>;
  }

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <FlatList
        data={posts}
        ListHeaderComponent={
          <ProfileHeader
            user={user}
            router={router}
            followersCount={followersCount}
            followingCount={followingCount}
            isFollowing={isFollowing}
            toggleFollow={toggleFollow}
            fadeAnim={fadeAnim}
            userData={userData}
            userId={userId}
          />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Animated.View
            style={{
              opacity: fadePostAnim,
              transform: [{ translateY: fadePostAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            }}
          >
            <PostCard item={item} currentUser={user} router={router} />
          </Animated.View>
        )}
        onEndReached={getPosts}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 20, backgroundColor: "#F5F3FF" }}
      />
    </ScreenWrapper>
  );
};

const ProfileHeader = ({
  user, router, followersCount, followingCount, isFollowing, toggleFollow, fadeAnim, userData, userId 
}) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  

  // Ensure that userData is available before rendering
  if (!userData) {
    return (
      <View className="flex-1 bg-primary-50 items-center justify-center">
        
      </View>
    )
  }

  return (
    <Animated.View
      className="bg-primary-50 pb-5 pt-3"
      style={{ opacity: fadeAnim }}
    >
      <ImageBackground
        source={require("@/assets/images/bg.png")}
        style={{
          height: hp(30),
          justifyContent: "flex-end",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View
          className="bg-opacity-50 px-5 py-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View className=" -m-2 flex-row items-center justify-between">
            <View className="flex flex-row">
              <View className="items-center justify-center">
                <BackButton router={router} style={{ color: "white" }} />
              </View>
              <View className="flex-row items-center justify-center">
                <Text className="font-rubik-bold text-3xl text-white">
                  Prof
                </Text>
                <Text className="font-rubik-bold text-3xl text-white">ile</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View className="flex-row items-center mt-5 px-5">
        <Avatar
          uri={userData?.image}
          size={hp(15)}
          style={{
            borderWidth: 4,
            borderColor: "#4B2C7F",
            borderRadius: hp(7.5),
          }}
        />
        <View className="flex-1 ml-4">
          <Text className="font-rubik-bold text-xl">{userData?.name}</Text>
          <Text className="font-rubik-medium text-sm text-gray-600">
            {userData?.email}
          </Text>
          <Text className="font-rubik-regular text-sm text-gray-600 mt-2">
            {userData?.bio || "Bio not available"}
          </Text>
          <Text className="font-rubik-regular text-sm text-gray-600 mt-1">
            {userData?.address || "Address not provided"}
          </Text>
          <View className="flex-row mt-2 items-center justify-center gap-10">
            <TouchableOpacity
            >
              <View className="flex-col items-center">
                <Text className="font-rubik-medium text-3xl text-gray-600">
                  {followersCount}
                </Text>
                <Text className="font-rubik-medium text-sm text-gray-600">
                  Followers
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-4"
            >
              <View className="flex-col items-center">
                <Text className="font-rubik-medium text-3xl text-gray-600">
                  {followingCount}
                </Text>
                <Text className="font-rubik-medium text-sm text-gray-600">
                  Following
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {userId !== user.id && (
            <TouchableOpacity
              onPress={toggleFollow}
              className="p-3 rounded-2xl mt-4 border-2 border-purple-700"
              style={{
                backgroundColor: isFollowing ? "#fff" : "#7e22ce",
              }}
            >
              <Text className="text-center text-md font-rubik-medium" style={{ color: isFollowing ? "#7e22ce" : "#fff" }}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </Animated.View>
  );
};


export default ProfileScreen;
