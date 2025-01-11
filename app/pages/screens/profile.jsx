import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
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
const Profile = () => {
  const { user, setUser } = useAuth();

  const router = useRouter();

  console.log("user : ", user);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    console.log('error',error.message);
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out!");
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
    <ScreenWrapper>
      <StatusBar />
      <View className="flex-1 bg-primary-50 px-5">
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
                  <TouchableOpacity>
                    <Icon name="threeDotsHorizontal" size={hp(4)} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleLogout}>
                <Icon name="logout" size={hp(4)} color="#F75555" />
              </TouchableOpacity>
                </View>
                </View>


          {/* old header not responsive enough  /below one     */}
        {/* <View className="">
          <View>
            <BackButton router={router} />
          </View>

          <View className="flex flex-row absolute mt-4 ml-16">
            <Text className="font-rubik-bold text-3xl">Prof</Text>
            <Text className="font-rubik-bold text-3xl">ile</Text>
            <View className="flex gap-5 flex-row ml-40">
              <TouchableOpacity>
                <Icon name="threeDotsHorizontal" size={hp(4)} />
              </TouchableOpacity>
              
            </View>
          </View>
        </View> */}

        {/* User Name */}
        <View className="flex-1 justify-center items-center bottom-32">
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

        {/* Avatar */}
        <View className="flex-1 items-center -mt-64">
          <TouchableOpacity>
            <Avatar
              uri={user?.image}
              size={hp(20)}
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
        <View className="flex-1 items-center bottom-40 gap-5">
          <View className="flex flex-row gap-2">
            <Icon name="mail" size={hp(3)} />
            <Text className="font-rubik-medium text-1xl">{user?.email}</Text>
          </View>
          {user && user.phoneNumber && (
            <TouchableOpacity
              className="flex flex-row gap-2"
              onPress={handleBio}
            >
              <Icon name="bio" size={hp(3)} />
              <Text className="font-rubik-medium text-1xl">
                {user?.phoneNumber || "Add your Contact Number"}
              </Text>
            </TouchableOpacity>
          )}
          {user && user.address &&(<TouchableOpacity
            className="flex flex-row gap-2"
            onPress={handleLocation}
          >
            <Icon name="location" size={hp(3)} />
            <Text className="font-rubik-medium text-1xl">
              {user?.address || "Add Location"}
            </Text>
          </TouchableOpacity>)}
          {user && user.bio &&(<TouchableOpacity
            className="flex flex-row gap-2 border-2 rounded-2xl p-3"
            onPress={handleBio}
          >
            <Icon name="bio" size={hp(3)} />
            <Text className="font-rubik-medium text-1xl">
              {user?.bio ||
                "Want people to know more about you? ...\nAdd a bio"}
            </Text>
          </TouchableOpacity>)}

          
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;
