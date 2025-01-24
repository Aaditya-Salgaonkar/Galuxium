import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  ScrollView
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { wp } from "../../helpers/common";
import Button from "../../components/Button";
import { useRouter } from "expo-router";
import Input from "../../components/Input";
import { StatusBar } from "expo-status-bar";
import Icon from "../../assets/icons";
import Backbtn from "../../components/BackButton";
import { Alert } from "react-native";
import {supabase} from '../../lib/supabase'
import { KeyboardAvoidingView } from "react-native";
const Login = () => {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }

    //Supabase client for signup functionality
        //To remove blank spaces if any
        let email=emailRef.current.trim();
        let password=passwordRef.current.trim();
    
        setLoading(true);
    
        //get data and error object
        const {error} = await supabase.auth.signInWithPassword({ //client created in supabase.js
          //Receiving email and password as object
          email,  
          password
        })
    
        //can perform email verification as well by toggling the verification under providers at supabase auth & implementing the necessary logic
    
        setLoading(false);
    
        // console.log('session : ',session);
        console.log('error : ',error);
    
        if(error) {
          Alert.alert('Log In',error.message);
        }


  };
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
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
                showsVerticalScrollIndicator={false}
                className="bg-primary-50"
              >
                <View className="bg-primary-50 flex-1">
        <Backbtn router={router} />
        <View className="flex text-left">
          <Text className="font-rubik-bold text-4xl pl-7">Hey</Text>
          <Text className="font-rubik-bold text-4xl pl-7">Welcome!</Text>
        </View>
        <View className="flex items-center -mt-5">
          <Image
            source={require("../../assets/images/login.png")}
            resizeMode="contain"
            className="size-96"
          />
        </View>

        <View className="flex">
          <View className="-mt-5">
            <Text className="font-rubik-medium pl-7 text-secondary-200">
              Please login to continue
            </Text>
            <View className="flex items-center absolute p-10 top-5">
              <Input
                title="Email"
                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                placeholder="Enter your email"
                onChangeText={(value) => (emailRef.current = value)}
              />
            </View>
            <View className="flex items-center absolute p-10 top-28">
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
        <View style={styles.container} className="flex items-center top-60">
          <Button
            title={"Log In"}
            loading={loading}
            buttonStyle={{ marginHorizontal: wp(5) }}
            onPress={onSubmit}
          />
        </View>
        <View className="flex-1 justify-center top-32 flex-row gap-2 items-center p-32 -mt-5">
          <Text className="font-rubik-medium">New to Galuxium!</Text>
          <TouchableOpacity onPress={() => router.push("/pages/signup")}>
            <Text className="font-rubik-bold text-primary-100">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
              </ScrollView>
            </KeyboardAvoidingView>

      
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    justifyContent: "space-around",
  },
});
