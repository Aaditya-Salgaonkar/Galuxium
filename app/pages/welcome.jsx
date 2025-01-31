import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useReducer } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { wp } from "../../helpers/common";
import Button from "../../components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />

      <View className="bg-primary-50 flex-1 items-center" style={styles.container}>
        {/* Welcome Image */}
        <View className="flex absolute top-16">
          <Image 
          source={require('../../assets/images/Welcome.png')}
          resizeMode="contain"
          className="size-96"
          />
        </View>

        {/* title */}
        <View className="flex pt-28 absolute top-96">
          <Text className="text-center font-rubik-extrabold text-6xl">
            Galuxium
          </Text>
          <Text className="text-center font-rubik-medium pt-5">
          Redefining Networking for the New Generation
          </Text>
        </View>

        {/* Footer */}
        <View className="flex absolute bottom-36 items-center">

          {/* Button */}
          <View>
          <Button
            title="Get Started"
            buttonStyle={{ width: wp(90) }}
            textStyle={{fontSize:1}}
            onPress={() => router.push("/pages/signup")}
          />
          </View>

          {/* Go to */}
          <View className="flex absolute flex-row gap-2 top-28">
            <Text className="font-rubik-semibold text-1xl">
              Already have an account!
            </Text>
            <TouchableOpacity onPress={() => router.push("/pages/login")}>
              <Text className="font-rubik-bold text-1xl text-primary-100">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    justifyContent: "space-around",
  },
});
