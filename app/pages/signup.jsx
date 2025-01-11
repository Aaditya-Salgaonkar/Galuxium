import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { wp } from "../../helpers/common";
import Button from "../../components/Button";
import { useRouter } from "expo-router";
import Input from "../../components/Input";
import { Alert } from "react-native";
import { useRef } from "react";
import { useState } from "react";
import Icon from "../../assets/icons";
import Backbtn from "../../components/BackButton";
import { StatusBar } from "expo-status-bar";

import {supabase} from '../../lib/supabase'

const SignUp = () => {
  const router = useRouter();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Sign Up", "Please fill all the fields");
      return;
    }

    //Supabase client for signup functionality
    //To remove blank spaces if any
    let name=nameRef.current.trim();
    let email=emailRef.current.trim();
    let password=passwordRef.current.trim();

    setLoading(true);

    //get data and error object
    const {data:{session},error} = await supabase.auth.signUp({ //client created in supabase.js
      //Receiving email and password as object
      email,  
      password,
      options:{
        data:{
          name
        }
      }
    })

    //can perform email verification as well by toggling the verification under providers at supabase auth & implementing the necessary logic

    setLoading(false);

    // console.log('session : ',session);
    // console.log('error : ',error);

    if(error) {
      Alert.alert('Sign Up',error.message);
    }




  };
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />

      <View className="bg-primary-50 flex-1">
        <Backbtn router={router} />
        <View className="flex text-left">
          <Text className="font-rubik-bold text-4xl pl-7">Let's</Text>
          <Text className="font-rubik-bold text-4xl pl-7">Get Started</Text>
        </View>
        <View className="flex items-center -mt-10">
          <Image
            source={require("../../assets/images/signup.png")}
            resizeMode="contain"
            className="size-80"
          />
        </View>

        <View className="flex mt-5">
          <Text className="font-rubik-medium pl-7 text-secondary-200">
            Please fill in the details to create an account
          </Text>
          <View className='-mt-2'>
          <View className="flex items-center absolute p-10">
            <Input
              title="Name"
              icon={<Icon name="user" size={26} strokeWidth={1.6} />}
              placeholder="Enter your name"
              onChangeText={(value) => (nameRef.current = value)}
            />
          </View>
          <View className="flex items-center absolute p-10 top-20">
            <Input
              title="Email"
              icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
              placeholder="Enter your email"
              onChangeText={(value) => (emailRef.current = value)}
            />
          </View>
          <View className="flex items-center absolute p-10 top-40">
            <Input
              title="Password"
              icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
            />
          </View>
          </View>

          
        </View>
        <View
            style={styles.container}
            className="flex items-center top-64 mt-7"
          >
            <Button
              title={"Sign Up"}
              loading={loading}
              buttonStyle={{ marginHorizontal: wp(5) }}
              onPress={onSubmit}
            />
           
          </View>
          <View className="flex top-44 flex-row gap-2 items-center p-24 mt-3">
          <Text className="font-rubik-medium">Already have an account!</Text>
          <TouchableOpacity onPress={() => router.push("/pages/login")}>
            <Text className="font-rubik-bold text-primary-100">Log In</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    justifyContent: "space-around",
  },
});
