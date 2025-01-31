import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import Avatar from "../../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { fetchPosts } from "../../../services/postService";
import { Image } from "expo-image";
import Loading from "../../../components/Loading";
import PostCard from "../../../components/PostCard";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import BackButton from "../../../components/BackButton";
let limit = 0;

const Profile = () => {
  const { user } = useAuth();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadePostAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadePostAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start();

    fetchFollowersAndFollowing();
    fetchMorePosts();
  }, []);

  const fetchMorePosts = useCallback(
    debounce(async () => {
      if (!hasMore || loading) return;
      setLoading(true);

      limit += 10;
      const res = await fetchPosts(limit, user.id);

      if (res.success) {
        setPosts((prev) =>
          [...prev, ...res.data].filter(
            (value, index, self) =>
              index === self.findIndex((v) => v.id === value.id) // Ensure no duplicate posts
          )
        );
        setHasMore(res.data.length >= limit);
      }
      setLoading(false);
    }, 500),
    [hasMore, loading, user.id]
  );

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => await supabase.auth.signOut(),
      },
    ]);
  };

  const refreshPosts = async () => {
    setRefreshing(true);
    limit = 10;
    const res = await fetchPosts(limit, user.id);

    if (res.success) {
      setPosts(
        res.data.filter(
          (value, index, self) =>
            index === self.findIndex((v) => v.id === value.id)
        )
      );
      setHasMore(true);
    }
    setRefreshing(false);
  };

  const fetchFollowersAndFollowing = async () => {
    const { data: followers, error: followersError } = await supabase
      .from("followers")
      .select("id")
      .eq("followed_id", user.id);

    const { data: following, error: followingError } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", user.id);

    if (followersError || followingError) {
      console.error(
        "Error fetching followers/following count:",
        followersError || followingError
      );
    } else {
      setFollowersCount(followers.length);
      setFollowingCount(following.length);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <FlatList
        data={posts}
        ListHeaderComponent={
          <ProfileHeader
            user={user}
            router={router}
            handleLogout={handleLogout}
            fadeAnim={fadeAnim}
            followersCount={followersCount}
            followingCount={followingCount}
          />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
        renderItem={({ item }) => (
          <Animated.View
            style={{
              opacity: fadePostAnim,
              transform: [
                {
                  translateY: fadePostAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            }}
          >
            <PostCard item={item} currentUser={user} router={router} />
          </Animated.View>
        )}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refreshPosts}
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: "#F5F3FF",
        }}
        ListFooterComponent={
          loading ? (
            <View className="mt-5">
              <Loading />
            </View>
          ) : (
            !hasMore && (
              <View className="flex-1 px-5 mt-5">
                {/* <Text className="font-rubik-semibold text-center">
                  No more posts available...
                </Text>
                <Image
                  source={require("@/assets/images/nomoreposts.png")}
                  transition={100}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: hp(40),
                    borderRadius: 20,
                    marginTop: -40,
                  }}
                /> */}
              </View>
            )
          )
        }
      />
    </ScreenWrapper>
  );
};

const ProfileHeader = ({
  user,
  router,
  handleLogout,
  fadeAnim,
  followersCount,
  followingCount,
}) => {
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
          <View className="flex flex-row -m-2">
            <View className="items-center justify-center">
              <BackButton router={router} style={{ color: "white" }} />
            </View>
            <View className="flex-row items-center justify-center">
              <Text className="font-rubik-bold text-3xl text-white">Prof</Text>
              <Text className="font-rubik-bold text-3xl text-white">ile</Text>
            </View>
          </View>
        </View>
      </ImageBackground>

      <View className="flex-row items-center mt-5 px-5">
        <Avatar
          uri={user?.image}
          size={hp(15)}
          style={{
            borderWidth: 4,
            borderColor: "#4B2C7F",
            borderRadius: hp(7.5),
          }}
        />
        <View className="flex-1 ml-4">
          <Text className="font-rubik-bold text-xl">{user?.name}</Text>
          <Text className="font-rubik-medium text-sm text-gray-600">
            {user?.email}
          </Text>
          <Text className="font-rubik-regular text-sm text-gray-600 mt-2">
            {user?.bio || "Bio not available"}
          </Text>
          <Text className="font-rubik-regular text-sm text-gray-600 mt-1">
            {user?.address || "Address not provided"}
          </Text>
          <View className="flex-row mt-2 items-center justify-center gap-10">
            <TouchableOpacity
              onPress={() => router.push("pages/screens/followers")}
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
              onPress={() => router.push("pages/screens/following")}
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
          <TouchableOpacity
            className="bg-purple-700 p-3 rounded-2xl mt-4"
            onPress={() => router.push("/pages/screens/editProfile")}
          >
            <Text className="text-white text-center text-sm font-rubik-medium">
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 p-3 rounded-2xl mt-3"
            onPress={handleLogout}
          >
            <Text className="text-white text-center text-sm font-rubik-medium">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default Profile;
