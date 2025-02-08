import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "@/components/BackButton";
import { hp, wp } from "../../../helpers/common";
import { useRouter } from "expo-router";
import Icon from "../../../assets/icons";
import { useAuth } from "@/context/AuthContext";
import { getUserImageSource, uploadFile } from "../../../services/imageService";
import { updateUser } from "../../../services/userService";
import Input from "@/components/Input";
import Button from "../../../components/Button";
import * as ImagePicker from "expo-image-picker";
const Edit = () => {
  const router = useRouter();
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    image: null,
    bio: "",
    address: "",
  });

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    let userData = { ...user };
    let { name, address, image, bio } = userData;
    setLoading(true);

    if (typeof image === "object") {
      let imageRes = await uploadFile("profiles", image.uri, true);
      if (imageRes.success) {
        userData.image = imageRes.data;
      } else {
        userData.image = null;
      }
    }

    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    } else {
      console.log("Error updating user data", res.error);
    }
  };
  let imageSource =
    user.image && typeof user.image === "object"
      ? { uri: user.image.uri }
      : getUserImageSource(user.image);

  return (
    <ScreenWrapper>
      <StatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: wp(5),
          }}
          keyboardShouldPersistTaps="handled"
          className="bg-primary-50"
        >
          {/* Header */}
          <View className="flex -ml-3 flex-row justify-between items-center">
            <View className="flex">
              <BackButton router={router} />
            </View>
            <View className="flex-1 flex-row justify-between">
              <View className="flex-row">
                <Text className="font-rubik-bold text-3xl">Edit Prof</Text>
                <Text className="font-rubik-bold text-3xl">ile</Text>
              </View>
            </View>
          </View>

          <View className="items-center mt-8">
            <TouchableOpacity>
              <Image
                source={imageSource}
                className="w-40 h-40 rounded-full border-4 border-primary-500"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white rounded-full p-2 bottom-14 left-14"
              style={shadowStyle}
              onPress={pickImage}
            >
              <Icon name="camera" size={hp(3)} color="#B73E6D" />
            </TouchableOpacity>
          </View>

          <View className="flex">
            <Text className="font-rubik-medium pl-7 text-secondary-200">
              Please update your profile details
            </Text>
            <View>
              <View className="flex-1 items-center p-10">
                <Input
                  icon={<Icon name="user" />}
                  placeholder="Enter your name"
                  value={user.name}
                  onChangeText={(value) => setUser({ ...user, name: value })}
                  containerStyles={{
                    borderWidth: 1,
                    borderColor: "#F8D7A4",
                    paddingTop: hp(3.5),
                  }}
                />
              </View>
              <View className="flex items-center absolute p-10 top-20">
                <Input
                  icon={<Icon name="bio" />}
                  placeholder="Enter your bio"
                  value={user.bio}
                  onChangeText={(value) => setUser({ ...user, bio: value })}
                  containerStyles={{
                    borderWidth: 1,
                    borderColor: "#F8D7A4",
                    paddingTop: hp(3.5),
                  }}
                />
              </View>
              <View className="flex items-center absolute p-10 top-40">
                <Input
                  icon={<Icon name="location" />}
                  placeholder="Enter your location"
                  value={user.address}
                  onChangeText={(value) => setUser({ ...user, address: value })}
                  containerStyles={{
                    borderWidth: 1,
                    borderColor: "#F8D7A4",
                    paddingTop: hp(3.5),
                  }}
                />
              </View>

              <View className="mt-60 items-center">
                <Button
                  title={"Update"}
                  loading={loading}
                  onPress={onSubmit}
                  buttonStyle={{
                    width: wp(70),
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Edit;
