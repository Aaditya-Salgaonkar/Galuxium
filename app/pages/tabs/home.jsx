import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "../../../lib/supabase";
import Button from "../../../components/Button";
import { wp } from "../../../helpers/common";
import { StatusBar } from "expo-status-bar";
import Icon from "@/assets/icons";
import { hp } from "../../../helpers/common";
import { useRouter } from "expo-router";
import Avatar from "../../../components/Avatar";
import { Alert } from "react-native";
import { useState } from "react";
import { fetchPosts } from "../../../services/postService";
import PostCard from "../../../components/PostCard";
import Loading from "../../../components/Loading";
import { getUserData } from "@/services/userService";
import { TouchableOpacityBase } from "react-native";


var limit = 5;

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const handlePostEvent = async (payload) => {
    if (payload.eventType == "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
    if (payload.eventType == "DELETE" && payload.old.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter(
          (post) => post.id != payload.old.id
        );
        return updatedPosts;
      });
    }
    if (payload.eventType == "UPDATE" && payload?.new?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.map((post) => {
          if (post.id == payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.file;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };
  const handleNewNotification = async (payload) => {
    console.log(payload);
    if (payload.eventType == "INSERT" && payload.new.id) {
      setNotificationCount((prev) => prev + 1);
    }
  };
  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    let notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 10;

    // console.log("Fetching posts : ", limit);
    let res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  const router = useRouter();
  //put payload inside () if reqd

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="bg-primary-50 flex-1 px-5">
        {/* Header */}
        <View className="flex-row justify-between mt-4">
          <Text className="font-rubik-bold text-3xl">Galuxium</Text>
          <View className="flex-row gap-5">
            <TouchableOpacity onPress={()=>{
              setNotificationCount(0);
              router.push('pages/screens/notifications')}}>
              <Icon name="notification" size={hp(4)} />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                
                router.push("/pages/screens/postScreen");
              }}
            >
              <Icon name="plus" size={hp(4)} />
              
            </TouchableOpacity> */}
            { notificationCount>0 &&
         (<View className="absolute bottom-6 bg-red-700 px-2  rounded-full items-center justify-center flex-1">
          <Text className="text-1xl font-rubik-bold text-white">{notificationCount}</Text>
         </View>)
      }
            <TouchableOpacity
              onPress={() => router.push("/pages/screens/profile")}
            >
              <Avatar
                uri={user?.image}
                size={hp(4)}
                style={{ borderWidth: 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts Section */}
        <View style={{ flex: 1, marginTop: 20 }}>
          {
            //   <FlatList
            //   data={posts}
            //   showsVerticalScrollIndicator={false}
            //   keyExtractor={(item) => item.id.toString()}

            //   renderItem={({ item }) => (
            //     <PostCard
            //       item={item}
            //       currentUser={user}
            //       router={router}
            //     />
            //   )}
            //   refreshing={refreshing}
            //   onRefresh={() => {
            //     setPosts([]);
            //     setHasMorePosts(true);
            //     limit=0
            //     getPosts();
            //   }}
            //   onEndReached={() => {
            //     if (hasMorePosts) {
            //       getPosts(); // Fetch more posts when the end is reached
            //     }
            //   }}
            //   contentContainerStyle={{ paddingBottom: 20 }} // Add padding to avoid cutting off the last item
            //   ListFooterComponent={ hasMorePosts ? (
            //     <View style={{ marginVertical: posts.length === 0 ? 280 : 30 }}>
            //       <Loading />
            //     </View>
            //   ) : (
            //     <Text style={{ textAlign: "center", marginVertical: 20 }}>No more posts</Text>
            //   )}

            // />
            <FlatList
              data={posts}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : index.toString()
              }
              renderItem={({ item }) => (
                <PostCard item={item} currentUser={user} router={router} />
              )}
              onEndReached={() => {
                getPosts();
              }}
              refreshing={refreshing}
              onRefresh={() => {
                setPosts([]);
                getPosts();
              }}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListFooterComponent={
                hasMore ? (
                  <View
                    style={{ marginVertical: posts.length == 0 ? 280 : 30 }}
                  >
                    <Loading />
                  </View>
                ) : (
                  <View className="flex-1 px-5 mt-5">
                    <Text className="font-rubik-semibold text-center">
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
                    />
                  </View>
                )
              }
            />
          }
        </View>
        
      </View>
      
    </ScreenWrapper>
  );
};



export default Home;

