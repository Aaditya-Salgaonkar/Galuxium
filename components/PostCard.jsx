import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { hp, wp, stripHtmlTags } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";
import { Image } from "expo-image";
import { Video } from "expo-av";
import { Share } from "react-native";
import { createPostLike, removePostLike } from "../services/postService";
import Loading from "./Loading";
const textStyle = {
  color: "#494949",
  fontSize: hp(2),
  fontFamily: "rubik-regular",
};
const tagsStyle={
  div:textStyle,
  p:textStyle,
  ol:textStyle,
  h1:{
    color:'black'
  },
  h4:{
    color:'black'
  }
}





const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 7,
  };

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);
  const openPostDetails = async () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "pages/screens/postDetails",
      params: { postId: item?.id },
    });
  };

  const onLike = async () => {
    try {
      if (liked) {
        let updatedLikes = likes.filter(
          (like) => like.userId !== currentUser?.id
        );
        setLikes([...updatedLikes]);
        let res = await removePostLike(item?.id, currentUser?.id);
        if (!res.success) {
          Alert.alert("Error", "Could not remove like. Please try again!");
        }
      } else {
        let data = {
          userId: currentUser?.id,
          postId: item?.id,
        };
        setLikes([...likes, data]);
        let res = await createPostLike(data);
        if (!res.success) {
          Alert.alert("Error", "Could not add like. Please try again!");
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  const onShare = async () => {
    try {
      let content = { message: stripHtmlTags(item?.body) };
  
      // Check if the post has a file (image or media)
      if (item?.file) {
        setLoading(true);
        
        // Get the URL of the media file from Supabase
        const fileUrl = getSupabaseFileUrl(item?.file).uri; // Access the uri property
  
        // Add the media file URL to the message content
        content.url = fileUrl; // Directly add the media URI for sharing
        setLoading(false);
      }
  
      // Add the post URL to the message if required (optional)
      const postUrlObject = getSupabaseFileUrl(item?.file);  // This returns an object, not just a URL
      const postUrl = postUrlObject?.uri; // Access the uri property of the object
      
      if (postUrl) {
        content.message += `\n\nCheck out this post: ${postUrl}`;  // Add the link to the post correctly
      }
  
      // Share the content (message and optional file URL)
      Share.share(content);
    } catch (error) {
      console.error("Error sharing content:", error);
      Alert.alert("Error", "Could not share the post. Please try again.");
    }
  };
  
  
  
  //formatting date and time for better look
  const createdAt = moment(item?.created_at).format("DD MMM YYYY   |   HH:mm");
  
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  // const liked = Array.isArray(likes) && likes.some(like => like.userId === currentUser?.id) || false;
const handlePostDelete=()=>{
  Alert.alert("Confirm", "Are you sure?", [
                  {
                    text: "Cancel",
                  },
                  {
                    onPress: () => onDelete(item),
                    text: "Delete",
                  },
                ]);
}
  return (
    <View className="flex-1 items-center p-5">
      {/* Post Card Content */}
      <View
        className="bg-secondary-100 border-2 border-primary-500 rounded-3xl"
        style={{
          width: wp(90),
          height: "fit",
          ...shadowStyle,
        }}
      >
        <View className="p-5 flex flex-row items-center gap-5">
          <Avatar
            size={hp(5)}
            uri={item?.user?.image} // Use a fallback image
            style={{}}
          />
          <View>
            <Text className="font-rubik-semibold">{item?.user?.name}</Text>
            <Text className="font-rubik-semibold text-text-secondary">
              {createdAt}
            </Text>
          </View>
          {showMoreIcon && (
            <TouchableOpacity
              className="flex-1 items-end"
              onPress={openPostDetails}
            >
              <Icon name="threeDotsCircle" size={24} />
            </TouchableOpacity>
          )}

          {
            showDelete && currentUser.id == item?.userId &&(
              <View className="flex-1 flex-row gap-7 pl-5">
                <TouchableOpacity
              className=""
              onPress={()=>onEdit(item)}
            >
              <Icon name="edit" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              className=""
              onPress={handlePostDelete}
            >
              <Icon name="delete" size={24} color='red'/>
            </TouchableOpacity>
              </View>
            )
          }
        </View>

        {/* Post body & media*/}
        <View>
          <View className="px-5 mb-5">
            <Text className="font-rubik-regular">{item?.body && (
              <RenderHtml
                contentWidth={wp(100)}
                source={{ html: item?.body }}
                tagsStyles={tagsStyle}
              />
            )}</Text>

           
          </View>
        </View>

        {/* post Image */}
        {/* {item?.file && item?.file?.includes("postImage") && ( */}
        {/* always ensure that you use appropriate styling to avoid rendering issues */}
        {item?.file && /\.(jpg|jpeg|png|gif)$/i.test(item.file) && (
          <View className="px-5">
            <Image
              source={getSupabaseFileUrl(item?.file)}
              transition={100}
              contentFit="cover"
              style={{
                width: "100%",
                height: hp(40),
                borderRadius: 20,
                marginVertical: hp(2),
              }}
            />
          </View>
        )}

        {/* post Video */}
        {/* {
                  item?.file && item?.file?.includes('postVideos') &&(
                    <View className="absolute top-52">
                        <View className="p-5 overflow-hidden" style={{height: hp(100)}}>
                <Video
                source={getSupabaseFileUrl(item?.file)}
                useNativeControls
                resizeMode="cover"
                isLooping
                style={{ width: "100%",
                  height: hp(40),
                  borderRadius: 20,
                  marginVertical: hp(2),}}
              />
              </View>
        
                    <Text>Entered the post body</Text>
                    
                    </View>
                  )
                } */}

        {item?.file && /\.(mp4|mp3)$/i.test(item.file) ? (
          <View className="px-5 pb-5">
            <View>
              {getSupabaseFileUrl(item?.file) ? (
                <Video
                  source={getSupabaseFileUrl(item?.file)}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                  style={{
                    width: "100%",
                    height: hp(50),
                    borderRadius: 10,
                  }}
                />
              ) : (
                <Text>Loading video...</Text>
              )}
            </View>
          </View>
        ) : null}

        {/* Like comment share */}
        <View className="p-5 flex flex-row gap-9">
          <View className="flex flex-row gap-2 items-center">
            <TouchableOpacity onPress={onLike}>
              <Icon
                name="heart"
                size={24}
                fill={liked ? "#F75555" : "transparent"}
                color={liked ? "#F75555" : "#3E3E3E"}
              />
            </TouchableOpacity>
            <Text>{likes?.length}</Text>
          </View>
          <View className="flex flex-row gap-2 items-center">
            <TouchableOpacity onPress={openPostDetails}>
              <Icon name="comment" size={24} color={"#3E3E3E"} />
            </TouchableOpacity>
            <Text>{item?.comments?.[0]?.count || 0}</Text>
          </View>
          <View className="flex flex-row gap-2">
            {loading ? (
              <View className="rounded-full">
                <Loading size={24} />
              </View>
            ) : (
              <TouchableOpacity onPress={onShare}>
                <Icon name="share" size={24} color={"#3E3E3E"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
