import { View, Text, TouchableOpacity, FlatList } from "react-native";
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
var limit=0;


const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [refresing,setRefresing] = useState(false);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    
    // setRefresing(true);
    
    limit = limit + 10;
    console.log("Fetching posts with limit:", limit);
    let res = await fetchPosts(limit);
    if (res.success) {
      
      setPosts(res.data);
      
      console.log("Post Data : ",res);
      console.log("Posts fetched successfully");
      
    } else {
      console.warn("Failed to fetch posts");
      setRefreshing(false);
    }
    
  };

  const router = useRouter();

  return (
    <ScreenWrapper>
      <StatusBar />
      <View className="bg-primary-50 flex-1 px-5">
        {/* Header */}
        <View className="flex-row justify-between mt-4">
          <Text className="font-rubik-bold text-3xl">Galuxium</Text>
          <View className="flex-row gap-5">
            <TouchableOpacity onPress={() => router.push("/pages/screens/postScreen")}>
              <Icon name="plus" size={hp(4)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/pages/screens/profile")}>
              <Avatar uri={user?.image} size={hp(4)} style={{ borderWidth: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts Section */}
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text className="font-rubik-bold text-xl mb-3">Posts</Text>
          {(
            <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            
            renderItem={({ item }) => (
              <PostCard
                item={item}
                currentUser={user}
                router={router}
              />
            )}
            refreshing={refresing}
            onRefresh={getPosts}
            contentContainerStyle={{ paddingBottom: 20 }} // Add padding to avoid cutting off the last item
            ListFooterComponent={(
              <View style={{marginVertical:posts.length==0?200:30}}>
                <Loading />
                </View>
            )}
            
          />
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;
