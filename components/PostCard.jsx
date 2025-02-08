import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  PanResponder,
} from "react-native";
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
import BackButton from "./BackButton";
import MenuOption from "./MenuOption";
import BottomSheetModalProvider from "@gorhom/bottom-sheet";
import PostCardFooter from "@/components/PostCardFooter";
import {
  createPostComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "@/services/postService";
import { useRouter } from "expo-router";
const textStyle = {
  color: "#494949",
  fontSize: hp(2),
  fontFamily: "rubik-regular",
};
const tagsStyle = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: "black",
  },
  h4: {
    color: "black",
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = true,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 7,
  };
  const onDeletePost = async (item) => {
    let res = await removePost(item.id);
    if (res.success) {
      setModalVisible(false)
    } else {
      Alert.alert("Post", res.msg);
    }
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
      const postUrlObject = getSupabaseFileUrl(item?.file); // This returns an object, not just a URL
      const postUrl = postUrlObject?.uri; // Access the uri property of the object

      if (postUrl) {
        content.message += `\n\nCheck out this post: ${postUrl}`; // Add the link to the post correctly
      }

      // Share the content (message and optional file URL)
      Share.share(content);
    } catch (error) {
      console.error("Error sharing content:", error);
      Alert.alert("Error", "Could not share the post. Please try again.");
    }
  };

  //formatting date and time for better look
  const createdAt = moment(item?.created_at).format("DD MMM YYYY");

  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  // const liked = Array.isArray(likes) && likes.some(like => like.userId === currentUser?.id) || false;
  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        onPress: () => onDeletePost(item),
        text: "Delete",
      },
    ]);
  };

  const onEditPost = () => {
    router.push({
      pathname: "pages/screens/postScreen",
      params: { ...item }, // Pass the post data to the edit screen
    });
  };
  // PanResponder for swipe down gesture
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      // Detect the swipe down gesture
      if (gestureState.dy > 50) {
        // swipe down threshold
        setModalVisible(false);
      }
    },
    onPanResponderRelease: () => {},
  });

  return (
    <View className="flex-1 items-center border-2 border-primary-1300  -mx-5">
      <View className="">
        <View className="px-5 mt-5 flex flex-row items-center gap-5 ">
          <Avatar
            size={hp(5)}
            uri={item?.user?.image}
            style={{ borderWidth: 1, borderColor: "#5D3FD3" }}
          />
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/pages/profileinfo",
                  params: { userId: item.user.id },
                });
              }}
            >
              <Text className="font-rubik-semibold">{item?.user?.name}</Text>
            </TouchableOpacity>

            <Text className="font-rubik-medium text-text-secondary">
              {createdAt}
            </Text>
          </View>
          
          {showMoreIcon && (
            <TouchableOpacity
              className="flex-1 items-end"
              // onPress={openPostDetails}
              onPress={() => setModalVisible(true)}
            >
              <Icon name="threeDotsCircle" size={24} />
            </TouchableOpacity>
          )}

        
        </View>

        <View className="px-5 my-5">
          <Text className="font-rubik-regular">
            {item?.body && (
              <RenderHtml
                contentWidth={wp(100)}
                
                source={{ html: item?.body }}
                tagsStyles={tagsStyle}
              />
            )}
          </Text>
        </View>

        {item?.file && /\.(jpg|jpeg|png|gif)$/i.test(item.file) && (
          <View className="flex-1 rounded-lg">
            <Image
              source={getSupabaseFileUrl(item?.file)}
              transition={100}
              contentFit="fill"
              style={{
                width: wp(100),
                height: hp(50),
              }}
            />
          </View>
        )}

        {item?.file && /\.(mp4|mp3)$/i.test(item.file) ? (
          <View className="">
            <View>
              {getSupabaseFileUrl(item?.file) ? (
                <Video
                  source={getSupabaseFileUrl(item?.file)}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                  style={{
                    width: wp(100),
                    height: hp(50),
                  }}
                />
              ) : (
                <Text>Loading video...</Text>
              )}
            </View>
          </View>
        ) : null}

        <PostCardFooter
          item={item}
          currentUser={currentUser}
          postId={item?.id}
        />
        {/* Like comment share */}
        {/* <View className="p-5 flex flex-row gap-9">
          <View className="flex flex-row gap-2 items-center">
            <Text>Modal on different page </Text>
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
        </View> */}

        <View>
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              className="flex-1 justify-end"
              style={styles.modalWrapper}
              {...panResponder.panHandlers}
            >
              <View style={styles.modalContent}>
                <View className=" rounded-full items-center mb-5">
                                <Image
                                  source={require("@/assets/images/bar.png")}
                                  transition={100}
                                  contentFit="cover"
                                  style={{
                                    width: "10%",
                                    height: hp(0.5),
                                  }}
                                />
                              </View>
                <TouchableOpacity onPress={onShare}>
                  <MenuOption name="share" icon="share" title="Share" />
                </TouchableOpacity>
                {showDelete && currentUser.id == item?.userId && (
                  <View>
                    <TouchableOpacity onPress={onEditPost}>
                      <MenuOption name="edit" icon="edit" title="Edit" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePostDelete}>
                      <MenuOption name="delete" icon="delete" title="Delete" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
  },
  modalContent: {
    backgroundColor: "#fff",
    width: wp(100),
    padding: 20,
    borderRadius: 10,
  },
});

export default PostCard;
