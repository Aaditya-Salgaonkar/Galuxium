import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { getFollowers, unfollowUser } from "../../../services/followersService";
import { Avatar } from "@/components/Avatar";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import ScreenWrapper from "../../../components/ScreenWrapper";
import BackButton from "../../../components/BackButton";

const FollowersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "mutual", "new"
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    setLoading(true);
    const res = await getFollowers(user.id);

    if (res.success) {
      setFollowers(res.data || []);
      setFilteredFollowers(res.data || []);
    } else {
      console.error("Error fetching followers:", res.msg);
    }
    setLoading(false);
  };

  const applyFilters = useCallback(
    debounce(() => {
      let filtered = [...followers];

      if (search) {
        filtered = filtered.filter((f) =>
          f.users.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (filter === "mutual") {
        filtered = filtered.filter((f) => f.users.is_verified); // Replace with actual mutual logic
      }

      if (filter === "new") {
        filtered = filtered.slice(0, 10); // New followers logic
      }

      setFilteredFollowers(filtered);
    }, 300),
    [search, filter, followers]
  );

  useEffect(() => {
    applyFilters();
  }, [search, filter, followers]);

  const handleUnfollow = async (followerId) => {
    Alert.alert("Remove Follower", "Are you sure you want to remove this follower?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const res = await unfollowUser(followerId, user.id);
          if (res.success) {
            setFollowers((prev) => prev.filter((item) => item.follower_id !== followerId));
            setFilteredFollowers((prev) =>
              prev.filter((item) => item.follower_id !== followerId)
            );
          } else {
            Alert.alert("Error", res.msg);
          }
        },
      },
    ]);
  };

  const renderRightActions = (followerId) => (
    <TouchableOpacity
      className="bg-red-500 justify-center items-center w-24 rounded-lg"
      onPress={() => handleUnfollow(followerId)}
    >
      <Text className="text-white font-bold">Remove</Text>
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
          <StatusBar style="dark" />
          <View className="p-10 bg-gradient-to-r from-purple-700 to-purple-500">
            <View className="flex-row items-center -m-5">
              <BackButton router={router} />
              <Text className="text-3xl text-primary-300 font-rubik-semibold">
                Followers
              </Text>
            </View>
            <TextInput
              className="bg-white p-3 rounded-xl mt-7"
              placeholder="Search followers..."
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
                  filter === "new" ? "bg-purple-700" : "bg-gray-300"
                } p-2 rounded-xl px-5`}
                onPress={() => setFilter("new")}
              >
                <Text className="text-white font-bold">New</Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <Text className="text-center text-gray-500 mt-5">Loading...</Text>
          ) : (
            <FlatList
              data={filteredFollowers}
              keyExtractor={(item) => item.follower_id.toString()}
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={() => renderRightActions(item.follower_id)}
                  renderLeftActions={() => renderLeftActions(item.users)}
                >
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
                    <Avatar
                      uri={item.users.image}
                      size={50}
                      style={{
                        borderWidth: 2,
                        borderColor: item.users.is_verified ? "#6B21A8" : "#ccc",
                        borderRadius: 25,
                      }}
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-lg font-bold">{item.users.name}</Text>
                      {item.users.is_verified && (
                        <Text className="text-purple-700 text-xs font-semibold">
                          Verified
                        </Text>
                      )}
                      <Text className="text-sm text-gray-600">
                        {item.users.bio || "No bio available"}
                      </Text>
                      <Text className="text-xs text-gray-400 mt-1">
                        Followed Since:{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </Animated.View>
                </Swipeable>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 mt-10">
                  No followers found.
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

export default FollowersPage;
