import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { getFollowing, unfollowUser } from "../../../services/followersService";
import { Avatar } from "@/components/Avatar";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import ScreenWrapper from "../../../components/ScreenWrapper";
import BackButton from "../../../components/BackButton";

const FollowingPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [following, setFollowing] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "mutual", "recent"
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    setLoading(true);
    const res = await getFollowing(user.id);

    if (res.success) {
      setFollowing(res.data || []);
      setFilteredFollowing(res.data || []);
    } else {
      console.error("Error fetching following list:", res.msg);
    }
    setLoading(false);
  };

  const applyFilters = debounce(() => {
    let filtered = [...following];
    if (search) {
      filtered = filtered.filter((f) =>
        f.users.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filter === "mutual") {
      filtered = filtered.filter((f) => f.users.is_verified); // Example mutual logic
    }
    if (filter === "recent") {
      filtered = filtered.slice(0, 10); // Show recent follows
    }
    setFilteredFollowing(filtered);
  }, 300);

  useEffect(() => {
    applyFilters();
  }, [search, filter, following]);

  const handleUnfollow = async (followedId) => {
    Alert.alert("Unfollow", "Are you sure you want to unfollow this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Unfollow",
        style: "destructive",
        onPress: async () => {
          const res = await unfollowUser(user.id, followedId);
          if (res.success) {
            setFollowing((prev) =>
              prev.filter((item) => item.followed_id !== followedId)
            );
            setFilteredFollowing((prev) =>
              prev.filter((item) => item.followed_id !== followedId)
            );
          } else {
            Alert.alert("Error", res.msg);
          }
        },
      },
    ]);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity
      className="bg-red-500 justify-center items-center w-24 rounded-lg"
      onPress={() => handleUnfollow(id)}
    >
      <Text className="text-white font-bold">Unfollow</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = (user) => (
    <TouchableOpacity
      className="bg-purple-700 justify-center items-center w-24 rounded-lg"
      onPress={() => router.push(`/messages/${user.id}`)}
    >
      <Text className="text-white font-bold">Message</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-primary-50">
        <GestureHandlerRootView className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800">
          <StatusBar style="light" />
          <View className="p-10 bg-gradient-to-r from-purple-700 to-purple-500">
            <View className="flex-row items-center -m-5">
              <BackButton router={router} />
              <Text className="text-3xl text-primary-300 font-rubik-semibold">
                Following
              </Text>
            </View>

            <TextInput
              className="bg-white p-3 rounded-3xl shadow-md mt-7"
              placeholder="Search following..."
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
            <View className="flex-row justify-around mt-7">
              <TouchableOpacity
                className={`${
                  filter === "all" ? "bg-purple-700" : "bg-gray-300"
                } p-2 rounded-xl px-5`}
                onPress={() => setFilter("all")}
              >
                <Text className="text-white font-bold">All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${
                  filter === "mutual" ? "bg-purple-700" : "bg-gray-300"
                } p-2 rounded-xl px-5`}
                onPress={() => setFilter("mutual")}
              >
                <Text className="text-white font-bold">Mutual</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`${
                  filter === "recent" ? "bg-purple-700" : "bg-gray-300"
                } p-2 rounded-xl px-5`}
                onPress={() => setFilter("recent")}
              >
                <Text className="text-white font-bold">Recent</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <Text className="text-center text-gray-500 mt-5">Loading...</Text>
          ) : (
            <FlatList
              data={filteredFollowing}
              keyExtractor={(item) => item.followed_id.toString()}
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={() => renderRightActions(item.followed_id)}
                  renderLeftActions={() => renderLeftActions(item.users)}
                >
                  <Animated.View
                    className="flex-row items-center bg-white rounded-xl shadow-xl mx-5 my-3 p-5"
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
                    <Avatar
                      uri={item.users.image}
                      size={60}
                      style={{
                        borderWidth: 2,
                        borderColor: item.users.is_verified ? "#6B21A8" : "#ccc",
                        borderRadius: 30,
                      }}
                    />
                    <View className="flex-1 ml-5">
                      <Text className="text-xl font-semibold">
                        {item.users.name}
                      </Text>
                      {item.users.is_verified && (
                        <Text className="text-purple-700 text-xs font-semibold">
                          Verified
                        </Text>
                      )}
                      <Text className="text-sm text-gray-600 mt-2">
                        {item.users.bio || "No bio available"}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-2">
                        Following Since:{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </Animated.View>
                </Swipeable>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 mt-10">
                  You are not following anyone.
                </Text>
              }
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </GestureHandlerRootView>
      </View>
    </ScreenWrapper>
  );
};

export default FollowingPage;
