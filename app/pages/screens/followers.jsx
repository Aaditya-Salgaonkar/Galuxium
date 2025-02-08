import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { getFollowers } from "../../../services/followersService";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../../components/ScreenWrapper";
import BackButton from "../../../components/BackButton";
import Loading from "../../../components/Loading";
import UserListItem from "../../../components/UserListItem";

const FollowersPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  
  const [followers, setFollowers] = useState([]);

  const [loading, setLoading] = useState(false);

  // Fetch Followers
  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const data = await getFollowers(user.id);
        if (data && Array.isArray(data)) {
          setFollowers(data);
          console.log("Fetched Followers:", data); 
        } else {
          console.warn("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
      setLoading(false);
    };

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    fetchFollowers();
  }, [user.id, fadeAnim]);


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

            
          </View>

          {/* Loading & Followers List */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Loading />
            </View>
          ) : (
            <FlatList
              data={followers}
              keyExtractor={(item) => item?.follower_id || item?.id}
              renderItem={({ item }) =>
                item.users ? (
                  <UserListItem user={item.users} />
                ) : (
                  <Text className="text-center text-red-500">
                    Invalid user data
                  </Text>
                )
              }
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
