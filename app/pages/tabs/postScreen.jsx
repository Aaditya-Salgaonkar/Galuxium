import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Icon from "@/assets/icons";
import { hp,wp } from "../../../helpers/common";
import { supabase } from "../../../lib/supabase";
import Avatar from "../../../components/Avatar";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/context/AuthContext";
import { Alert } from "react-native";
import BackButton from "@/components/BackButton";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import RichTextEditor from "../../../components/RichTextEditor";
import { useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Button from "../../../components/Button";
import { getSupabaseFileUrl } from "../../../services/imageService";
import { Video } from "expo-av";
import { createOrUpdatePost } from "../../../services/postService";
const NewPost = () => {
  const post = useLocalSearchParams();

console.log('Post',post)
  const { user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(()=>{
    if(post && post.id){
      bodyRef.current=post.body;
      setFile(post.file||null);
      setTimeout(() => {
        
          editorRef?.current?.setContentHTML(post.body);
        
      }, 300);

    }
  },[])

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ["images"], //can add video also
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    if (!isImage) {
      mediaConfig = {
        mediaTypes: ["videos"], //can add video also
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    // console.log('file',result.assets[0]);
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file) => {
    if (!file) return null;
    if (typeof file == "object") return true;
    return false;
  };

  const getFileType = (file) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;

      //check image or video for remote file
    }
    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file) => {
    if (!file) return null;
    return isLocalFile(file) ? file.uri : getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if(!bodyRef.current){
      Alert.alert('Add text')
      return;
    }
    let data={
      file,
      body:bodyRef.current,
      userId:user?.id,
    }
    if(post &&post.id) data.id=post.id;
   //create post
   setLoading(true);
   let res= await createOrUpdatePost(data);
   setLoading(false);
   if(res.success){
    setFile(null);
    bodyRef.current=''
    editorRef.current?.setContentHTML('');
    router.back();
   }
   else{
    Alert.alert('Post',res.msg);
   }
    
  };
  return (
    <ScreenWrapper>
      <StatusBar />
      {/* Header */}
      <View className="flex-1 bg-primary-50 px-5">
        <View className="flex mt-4 flex-row justify-between items-center">
          <View className="flex">
            {/* <BackButton router={router} /> */}
          </View>
          <View className="flex-1">
            <Text className="font-rubik-bold text-3xl">{post && post.id?"Update Post":"Create Post"}</Text>
          </View>
          <View className="flex">
            
          </View>
        </View>
        <ScrollView className="gap-20 flex-1 mt-5" showsVerticalScrollIndicator={false}>
          <View className="flex flex-row items-center gap-5 mt-5">
            <Avatar uri={user?.image} size={hp(6.5)} />
            <View className="">
              <Text className="font-rubik-bold text-1xl">
                {user && user.name}
              </Text>
              <Text className="font-rubik-medium text-1xl text-secondary-200">
                Public
              </Text>
            </View>
          </View>
          <View>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body) => (bodyRef.current = body)}
            />
          </View>
          {file && (
            <View>
              {getFileType(file) == "video" ? (
                <View className="p-5 overflow-hidden" style={{height: hp(100)}}>
                <Video
                source={{ uri: getFileUri(file) }}
                useNativeControls
                resizeMode="cover"
                isLooping
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
              </View>
              ) : (
                <View className="px-5 pt-5 mb-96 items-center">
                  <Image
                  source={{ uri: getFileUri(file) }}
                  resizeMode="cover"
                  style={{ width: "90%", height: "90%", borderRadius: 10 }}
                />
                </View>
              )}
              <View className="flex-1 absolute mt-10 right-20 ">
              <TouchableOpacity className="flex-1" onPress={()=>setFile(null)}>
                <Icon name="delete" size={30} color="red" />
              </TouchableOpacity>
              </View>
            </View>
          )}

          
        </ScrollView>
        <View className="pt-2">
            <Text className="font-rubik-bold text-1xl">Posting unethical or sensitive content is liable to strict action and suspension from the platform!</Text>
        </View>
        <View className="flex justify-between flex-row p-5 m-2 mb-16 items-center border-2 rounded-3xl border-secondary-200">
            <Text className="font-rubik-semibold text-1xl">
              Add to your post
            </Text>
            <View className="flex-row gap-5">
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color="#4B2C7F" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={30} color="#4B2C7F" />
              </TouchableOpacity>
            </View>
          </View>
        <View className="bottom-10">
          <Button
            buttonStyle={{ height: hp(7) }}
            title={post && post.id?"Update":"Post"}
            loading={loading}
            hasShadow={false}
            onPress={onSubmit}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;
