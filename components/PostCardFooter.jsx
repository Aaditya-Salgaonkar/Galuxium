import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createPostComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "@/services/postService";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/Input";
import CommentItem from "@/components/CommentItem";
import { supabase } from "@/lib/supabase";
import { createNotification } from "@/services/NotificationService";
import { getUserData } from "@/services/userService";
import { Image } from "expo-image";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  PanResponder,
  Platform
} from "react-native";
import { KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { hp, wp, stripHtmlTags } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "../services/imageService";

import { Share } from "react-native";
import { createPostLike, removePostLike } from "../services/postService";
import Loading from "./Loading";
import { deleteNotification } from "../services/NotificationService";

const Details = ({ item, currentUser, postId }) => {
  const { commentId } = useLocalSearchParams();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(false);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [userAvatar, setUserAvatar] = useState(currentUser.image);
  const [post, setPost] = useState({
    id: postId,
    comments: [],
  });
  const [likes, setLikes] = useState([]);
  const liked = likes.filter((like) => like.userId == currentUser?.id)[0]
    ? true
    : false;

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  const handleNewComment = async (payload) => {
  
    if (payload.new) {
      try {
        let newComment = { ...payload.new };
  
        if (newComment.userId) {
          const res = await getUserData(newComment.userId);
          if (res.success && res.data) {
            
            newComment.user = res.data; 
          } else {
            console.error("Failed to fetch user data:", res.msg);
            newComment.user = { name: "Unknown User", avatar: "/default-avatar.png" }; // Default values
          }
        } else {
          console.warn("Comment has no userId, assigning default user.");
          newComment.user = { name: "Anonymous", avatar: "/default-avatar.png" };
        }
  
        setPost((prevPost) => {
          const updatedPost = {
            ...prevPost,
            comments: [newComment, ...(prevPost.comments || [])],
          };
          return updatedPost;
        });
      } catch (error) {
        console.error("Error handling new comment:", error);
      }
    } else {
      console.warn("Payload does not contain `new` property:", payload);
    }
  };
  

  useEffect(() => {
    const commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId);
    if (res.success) {
      setPost(res.data);
    } else {
      console.error("Error fetching post details:", res.msg);
    }
    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commentRef.current) return;
 
    let newComment = {
      id: Date.now(), // Temporary ID for UI update
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
      created_at: new Date().toISOString(),
      user: {
        id: user?.id,
        name: user?.name ,
        image: userAvatar
      },
    };
  
    // Update UI instantly
    setPost((prevPost) => ({
      ...prevPost,
      comments: [newComment, ...prevPost.comments],
    }));
  
    setLoading(true);
    let res = await createPostComment({
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    });
    setLoading(false);
  
    if (res.success) {
      if (user.id !== post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "Post Comment",
          data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
        };
        createNotification(notify);
      }
  
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };
  
  
//   const onNewComment = async () => {
//   if (!commentRef.current) return;

//   let data = {
//     userId: user?.id,
//     postId: post?.id,
//     text: commentRef.current,
//   };

//   setLoading(true);
//   let res = await createPostComment(data);
//   setLoading(false);

//   if (res.success) {
//     if (user.id !== post.userId) {
//       let notify = {
//         senderId: user.id,
//         receiverId: post.userId,
//         title: "Post Comment",
//         data: JSON.stringify({ postId: post.id, commentId: res?.data?.id }),
//       };
//       createNotification(notify);
//     }

//     inputRef?.current?.clear();
//     commentRef.current = "";
//   } else {
//     Alert.alert("Comment", res.msg);
//   }
// };

  const onDeleteComment = async (comment) => {
    let res = await removeComment(comment?.id); 

    if (res.success) {
      // Update the post state after removing the comment
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });

      // Call deleteNotification after removing the comment
      const notificationRes = await deleteNotification(comment.id);
      if (notificationRes.success) {
        console.log("Notification related to comment deleted successfully");
      } else {
        console.log("Error deleting notification:", notificationRes.msg);
      }
    } else {
      Alert.alert("Comment", res.msg); // Show error message if comment deletion fails
    }
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
        setLoading(false);
        if (res.success) {
          if (user.id != post.userId) {
            let notify = {
              senderId: user.id,
              receiverId: post.userId,
              title: "Post Like",
              data: JSON.stringify({ postId: post.id }),
            };
            createNotification(notify);
          }
          inputRef?.current?.clear();
          commentRef.current = "";
        } else {
          Alert.alert("Like", res.msg);
        }
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

  const onDeletePost = async (item) => {
    let res = await removePost(post.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Post", res.msg);
    }
  };
  const onEditPost = async (item) => {
    router.back();
    router.push({ pathname: "pages/screens/postScreen", params: { ...item } });
  };

  if (startLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary-50">
        <Loading />
      </View>
    );
  }

  if (!post) {
    return (
      <View>
        <Text>Post not found</Text>
      </View>
    );
  }
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
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 bg-primary-50">
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
          <TouchableOpacity onPress={() => setModalVisible(true)}>
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
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          
        >
          <View
            className="bg-primary-50 p-5 rounded-t-3xl flex-1"
            style={{ maxHeight: hp(70) }}
          >
            <View {...panResponder.panHandlers}>
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
            <Text className=" font-rubik-medium" style={{ fontSize: 20 }}>
                Comments
              </Text>
            </View>
            <View className="flex-1 pb-10">
              
              <ScrollView showsVerticalScrollIndicator={false} >
                <View className="items-center">
                  {post?.comments?.map((comment) => (
                    <CommentItem
                      item={comment}
                      key={comment?.id?.toString()}
                      canDelete={
                        user.id == comment.userId || user.id == comment.postId
                      }
                      onDelete={onDeleteComment}
                      highlight={comment.id == commentId}
                    />
                  ))}
                  {post?.comments?.length == 0 && (
                    <Text className=" text-primary-500 font-rubik-semibold text-1xl pt-2">
                      Be the first one to comment!
                    </Text>
                  )}
                </View>
                
              </ScrollView>
              
            </View>
            {post ? (
                  <View className="flex">
                    {loading ? (
                      <View className="bg-primary-50 rounded-full items-center justify-center flex-1 py-3">
                        <Loading />
                      </View>
                    ) : (
                      <View className="mt-5 items-center justify-end"  style={{height:hp(10)}}>
                        <Input
                            inputRef={inputRef}
                            onChangeText={(value) =>
                              (commentRef.current = value)
                            }
                            placeholder="Type a comment..."
                            placeHolderTextColor="#F2F2F2"
                           
                          />
                          <TouchableOpacity className="bg-white rounded-2xl border-2 border-primary-1300 justify-center gap-3 flex-row mt-5 p-3 w-5/6" onPress={onNewComment}>
                      <Text className="font-rubik-medium " style={{fontSize:18}}>Post</Text>
                        <Icon name="send" size={24} color="#4B2C7F" />
                        </TouchableOpacity>
                      
                        
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <Loading />
                  </View>
                )}
          </View>
          
        </View>

     
      </Modal>
    </View>
      </KeyboardAvoidingView>
    
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
    borderRadius: 30,
  },
});

export default Details;
