import { View, Text, TouchableOpacity,Animated, FlatList, Image } from "react-native";
import React, { useEffect,useRef } from "react";
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
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadePostAnim = useRef(new Animated.Value(0)).current;
  
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
    // console.log(payload);
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
const [loading, setLoading] = useState(true);
const [userData, setUserData] = useState(null);
  const router = useRouter();
  //put payload inside () if reqd
  const handleRefresh = async () => {
    setRefreshing(true);
    await getPosts(true);
    setRefreshing(false);
  };
     useEffect(() => {
       if (user.id) {
         getPosts();
         Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }).start();
         Animated.timing(fadePostAnim, { toValue: 1, duration: 1000, delay: 300, useNativeDriver: true }).start();
       }
     }, [user.id]);
   
     const fetchUserData = async () => {
       try {
         const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();
         if (error) throw error;
         setUserData(data);
         setLoading(false);
       } catch (error) {
         console.error("Error fetching user data:", error.message);
       }
     };
   
    //  const getPosts = async (isRefresh = false) => {
    //    if (!hasMore && !isRefresh) return;
   
    //    try {
    //      const { data: userData, error: userError } = await supabase
    //        .from("users")
    //        .select("account_visibility")
    //        .eq("id", user.id)
    //        .single();
   
    //      if (userError) throw userError;
   
    //      if (userData.account_visibility === "private" && !isFollowing) {
    //        return;
    //      }
   
    //      const response = await fetchPosts(posts.length + 10, user.id);
   
    //      if (response.success) {
    //        const newPosts = response.data;
    //        if (isRefresh) {
    //          setPosts(newPosts);
    //        } else {
    //          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    //        }
   
    //        if (newPosts.length < 10) setHasMore(false);
    //      } else {
    //        console.error("Failed to fetch posts");
    //      }
    //    } catch (error) {
    //      console.error("Error fetching posts:", error.message);
    //    }
    //  };
    // const getPosts = async (isRefresh = false) => {
    //   if (!hasMore && !isRefresh) return;
    
    //   try {
    //     // Step 1: Get the current user's followers (assuming `followers` table exists)
    //     const { data: followersData, error: followersError } = await supabase
    //       .from('followers')
    //       .select('followed_id,follower_id')
    //       .eq('follower_id', user.id);
    //     if (followersError) throw followersError;
    
    
    //     const followingUserIds = followersData.map((follower) => follower.followed_id);
    
    //     // Step 2: Fetch posts from the 'posts' table
    //     const { data: userData, error: userError } = await supabase
    //       .from('users')
    //       .select('account_visibility')
    //       .eq('id', user.id)
    //       .single();
    
    //     if (userError) throw userError;
    
    //     const response = await fetchPosts(posts.length + 10, user.id);
    
    //     if (response.success) {
    //       const newPosts = response.data.filter((post) => {
    //         console.log('Checking post:', post); // Debugging step
    
    //         // Step 3: Check if the user follows the post author, the account is public, or it's the user's own post
    //         const isVisibleToUser = post.user.account_visibility === 'public' || 
    //                                 followingUserIds.includes(post.user.id) || 
    //                                 post.user.id === user.id;
    
    //         console.log(`Is post visible to user? ${isVisibleToUser}`); // Debugging step
    //         return isVisibleToUser;
    //       });
    
    //       if (isRefresh) {
    //         setPosts(newPosts);
    //       } else {
    //         setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    //       }
    
    //       if (newPosts.length < 10) setHasMore(false);
    //     } else {
    //       console.error('Failed to fetch posts');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching posts:', error.message);
    //   }
    // };
    
    
 
    return (
    <ScreenWrapper>
      <StatusBar />
      <View className="bg-primary-50 flex-1">
        {/* Header */}
        
        <View className="flex-row justify-between mb-3 mt-5 px-5">
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
         (<View className="absolute bottom-6 bg-red-700 rounded-full items-center justify-center flex-1">
          <Text style={{fontSize:10, paddingHorizontal:5}} className="font-rubik-bold text-white">{notificationCount}</Text>
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
        <View style={{ flex: 1}}>
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
            // <FlatList
            //   data={posts}
            //   showsVerticalScrollIndicator={false}
            //   keyExtractor={(item, index) =>
            //     item.id ? item.id.toString() : index.toString()
            //   }
            //   renderItem={({ item }) => (
            //     <PostCard item={item} currentUser={user} router={router} />
            //   )}
            //   onEndReached={() => {
            //     getPosts();
            //   }}
            //   contentContainerStyle={{ paddingBottom: 10 }}
            //   ListFooterComponent={
            //     hasMore ? (
            //       <View
            //         style={{ marginVertical: posts.length == 0 ? 280 : 30 }}
            //       >
            //         <Loading />
            //       </View>
            //     ) : (
            //       <View className="flex-1 px-5 mt-5">
            //         <Text className="font-rubik-semibold text-center">
            //           No more posts available...
            //         </Text>
            //         <Image
            //           source={require("@/assets/images/nomoreposts.png")}
            //           transition={100}
            //           contentFit="cover"
            //           style={{
            //             width: "100%",
            //             height: hp(40),
            //             borderRadius: 20,
            //             marginTop: -40,
            //           }}
            //         />
            //       </View>
            //     )
            //   }
            // />
          }
          <FlatList
        data={posts}
        
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
        </View>
        
      </View>
      
    </ScreenWrapper>
  );
};



export default Home;

