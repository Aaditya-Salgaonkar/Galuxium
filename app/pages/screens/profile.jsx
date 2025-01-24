import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import Avatar from "../../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import BackButton from "@/components/BackButton";
import { router, useRouter } from "expo-router";
import { fetchPosts } from "../../../services/postService";
import { Image } from "expo-image";
import { Video } from "expo-av";
import Loading from "../../../components/Loading";
import PostCard from "../../../components/PostCard";

var limit = 0;
const Profile = () => {
  const { user, setUser } = useAuth();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  console.log("user : ", user);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error", error.message);
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out!");
    }
  };
  const getPosts = async () => {
    if (!hasMore) return null;
    limit += 10;

    // console.log("Fetching posts : ", limit);
    let res = await fetchPosts(limit, user.id);

    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };
  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancelled Successfully"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => onLogout(),
        style: "destructive",
      },
    ]);
  };

  

  

  return (
    <ScreenWrapper>
      <StatusBar />
      <FlatList
          data={posts}
          ListHeaderComponent={<ProfileHeader user={user} router={router} handleLogout={handleLogout} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            <View className="absolute">
              
              </View>
            getPosts();
          }}
          refreshing={refreshing}
          onRefresh={() => {
            setPosts([]);
            getPosts();
          }}
          style={{height:hp(50),backgroundColor:'#F5F3FF'}}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            hasMore ? (
              <View
                style={{ marginVertical: posts.length == 0 ? 280 : 30}}
                className="bg-primary-50"
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
      
    </ScreenWrapper>
  );
};

const ProfileHeader = ({user,router,handleLogout}) =>{
  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  };
  const handleLocation = async () => {
    if (!user?.address) {
      Alert.alert("Hey there!", "Want to edit your location?", [
        {
          text: "No",
        },
        {
          onPress: () => router.push("/pages/screens/editProfile"),
          text: "Yes",
        },
      ]);
    } else {
      return;
    }
  };

  const handleBio = async () => {
    if (!user?.bio) {
      Alert.alert("Hey there!", "Want to edit your bio?", [
        {
          text: "No",
        },
        {
          onPress: () => router.push("/pages/screens/editProfile"),
          text: "Yes",
        },
      ]);
    } else {
      return;
    }
  };
  return (
    <View className="flex-1 bg-primary-50 px-5">
        <View className="flex -ml-3 flex-row justify-between items-center">
          <View className="flex">
            <BackButton router={router} />
          </View>
          <View className="flex-1 flex-row justify-between">
            <View className="flex-row">
              <Text className="font-rubik-bold text-3xl">Prof</Text>
              <Text className="font-rubik-bold text-3xl">ile</Text>
            </View>
          </View>
          <View className="flex flex-row gap-4">
            <TouchableOpacity onPress={()=>router.push('/screens/menu')}>
              <Icon name="threeDotsHorizontal" size={hp(4)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Icon name="logout" size={hp(4)} color="#F75555" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-row gap-2 items-center justify-center">
          <Icon name="mail" size={hp(3)} />
          <Text className="font-rubik-medium text-1xl">{user?.email}</Text>
        </View>

        <View>
          <View className="flex justify-center items-center pt-5">
            <View className="flex flex-row">
              <Text className="font-rubik-medium text-2xl text-center">
                What's up{" "}
              </Text>
              <Text className="font-rubik-medium text-2xl text-center text-primary-100">
                {user?.name}?
              </Text>
            </View>
            <Text className="font-rubik-medium text-2xl text-center">
              Let's roll!
            </Text>
          </View>

          <View className="flex flex-row items-center h-fit">
            {/* Avatar */}
            <View className="items-center flex-1">
              <TouchableOpacity>
                <Avatar
                  uri={user?.image}
                  size={hp(15)}
                  style={{ borderWidth: 5, borderColor: "#4B2C7F" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-white rounded-full p-2 bottom-16 left-16 mr-2 mt-2"
                style={shadowStyle}
                onPress={() => router.push("/pages/screens/editProfile")}
              >
                <Icon name="edit" size={hp(2.5)} color="#B73E6D" />
              </TouchableOpacity>
            </View>

            {/* User Essential details */}
            <View className="flex-1 items-center bottom-7">
              <View className="gap-3">
                {user && user.phoneNumber && (
                  <TouchableOpacity
                    className="flex flex-row gap-2"
                    onPress={handleBio}
                  >
                    <Icon name="call" size={hp(3)} />
                    <Text className="font-rubik-medium text-1xl">
                      {user?.phoneNumber || "Add your Contact Number"}
                    </Text>
                  </TouchableOpacity>
                )}
                {user && user.address && (
                  <TouchableOpacity
                    className="flex flex-row gap-2"
                    onPress={handleLocation}
                  >
                    <Icon name="location" size={hp(3)} />
                    <Text className="font-rubik-medium text-1xl">
                      {user?.address || "Add Location"}
                    </Text>
                  </TouchableOpacity>
                )}
                {user && user.bio && (
                  <TouchableOpacity
                    className="flex flex-row gap-2"
                    onPress={handleBio}
                  >
                    <Icon name="bio" size={hp(3)} />
                    <Text className="font-rubik-medium text-1xl">
                      {user?.bio ||
                        "Want people to know more about you? ...\nAdd a bio"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          
          
        </View>
      </View>
  )
}

const UserHeader = () => {
  return (
    <ScrollView className="flex-1 bg-primary-50 px-5">

<View className="items-center">
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
            <View className="absolute">
              
              </View>
            getPosts();
          }}
          refreshing={refreshing}
          onRefresh={() => {
            setPosts([]);
            getPosts();
          }}
          style={{height:hp(50)}}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListFooterComponent={
            hasMore ? (
              <View
                style={{ marginVertical: posts.length == 0 ? 280 : 30}}
                className="bg-primary-50"
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
      </View>
      {/* Header */}
      <View className="flex -ml-3 flex-row justify-between items-center">
        <View className="flex">
          <BackButton router={router} />
        </View>
        <View className="flex-1 flex-row justify-between">
          <View className="flex-row">
            <Text className="font-rubik-bold text-3xl">Prof</Text>
            <Text className="font-rubik-bold text-3xl">ile</Text>
          </View>
        </View>
        <View className="flex flex-row gap-4">
          <TouchableOpacity onPress={()=>router.push('screens/menu')}>
            <Icon name="threeDotsHorizontal" size={hp(4)} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={handleLogout}>
              <Icon name="logout" size={hp(4)} color="#F75555" />
            </TouchableOpacity> */}
        </View>
      </View>

      {/* User Name */}
      <View className="flex-1 justify-center items-center top-20">
        <View className="flex flex-row">
          <Text className="font-rubik-medium text-2xl text-center">
            What's up{" "}
          </Text>
          <Text className="font-rubik-medium text-2xl text-center text-primary-100">
            {user?.name}?
          </Text>
        </View>
        <Text className="font-rubik-medium text-2xl text-center">
          Let's roll!
        </Text>
      </View>

      <View className="flex-1 flex-row items-center absolute top-44">
        {/* Avatar */}
        <View className="items-center flex-1">
          <TouchableOpacity>
            <Avatar
              uri={user?.image}
              size={hp(15)}
              style={{ borderWidth: 5, borderColor: "#4B2C7F" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-full p-2 bottom-16 left-16 ml-2 mt-2"
            style={shadowStyle}
            onPress={() => router.push("/pages/screens/editProfile")}
          >
            <Icon name="edit" size={hp(3)} color="#B73E6D" />
          </TouchableOpacity>
        </View>

        {/* User Essential details */}
        <View className="flex-1 items-center bottom-7">
          <View className="gap-3">
            {user && user.phoneNumber && (
              <TouchableOpacity
                className="flex flex-row gap-2"
                onPress={handleBio}
              >
                <Icon name="call" size={hp(3)} />
                <Text className="font-rubik-medium text-1xl">
                  {user?.phoneNumber || "Add your Contact Number"}
                </Text>
              </TouchableOpacity>
            )}
            {user && user.address && (
              <TouchableOpacity
                className="flex flex-row gap-2"
                onPress={handleLocation}
              >
                <Icon name="location" size={hp(3)} />
                <Text className="font-rubik-medium text-1xl">
                  {user?.address || "Add Location"}
                </Text>
              </TouchableOpacity>
            )}
            {user && user.bio && (
              <TouchableOpacity
                className="flex flex-row gap-2"
                onPress={handleBio}
              >
                <Icon name="bio" size={hp(3)} />
                <Text className="font-rubik-medium text-1xl">
                  {user?.bio ||
                    "Want people to know more about you? ...\nAdd a bio"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View className="top-96 items-center">
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
                className="bg-primary-50"
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
      </View>
    </ScrollView>
  );
};

export default Profile;
