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
import UserListItem from "../../../components/UserListItem";
import { Image } from "expo-image";
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
    const fetchFollowing = async () => {
      setLoading(true);
      try {
        const data = await getFollowing(user.id);
        if (data && Array.isArray(data)) {
          setFollowing(data);
          console.log("Fetched Following:", data); 
        } else {
          console.warn("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching following:", error);
      }
      setLoading(false);
    };

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    fetchFollowing();
  }, [user.id, fadeAnim]);


  
  



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

        
          
          </View>

          {loading ? (
            <Text className="text-center text-gray-500 mt-5">Loading...</Text>
          ) : (
            <FlatList
              data={following}
              keyExtractor={(item) => item?.followed_id || item?.id}
              renderItem={({ item }) => (
                item.users ? (
                  <UserListItem user={item.users} />
                ) : (
                  <Text className="text-center text-red-500">
                    Invalid user data
                  </Text>
                )
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
