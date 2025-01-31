import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "../../../components/ScreenWrapper";
import {
  createPostComment,
  fetchPostDetails,
  removeComment,
  removePost,
} from "../../../services/postService";
import { useAuth } from "../../../context/AuthContext";
import { wp, hp } from "@/helpers/common";
import Loading from "../../../components/Loading";
import PostCard from "../../../components/PostCard";
import BackButton from "@/components/BackButton";
import Input from "@/components/Input";
import Icon from "../../../assets/icons";
import CommentItem from "../../../components/CommentItem";
import { supabase } from "../../../lib/supabase";
import { createNotification } from "../../../services/NotificationService";
import { getUserData } from "@/services/userService";
const Details = () => {
  const { postId, commentId } = useLocalSearchParams();
  const { user } = useAuth();

  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    id: postId,
    comments: [],
  });

  // const handleNewComment = async (payload) => {
  //   console.log("Got new comment", payload.new);
  //   console.log("New comment payload:", payload);

  //   if (payload.new) {
  //     let newComment = { ...payload.new };
  //     let res = await getUserData(newComment.userId);
  //     if (res.success) {
  //       newComment.user = res.data;
  //     } else {
  //       console.error("Failed to fetch user data:", res.msg);
  //       newComment.user = {};
  //     }

  //     setPost((prevPost) => {
  //       const updatedPost = {
  //         ...prevPost,
  //         comments: [newComment, ...(prevPost.comments || [])],
  //       };
  //       console.log("Updated post state:", updatedPost);
  //       return updatedPost;
  //     });
  //   }
  // };
  const handleNewComment = async (payload) => {
    console.log("Received new comment payload:", payload);

    if (payload.new) {
      try {
        let newComment = { ...payload.new };
        console.log("Processing new comment:", newComment);

        const res = await getUserData(newComment.userId);
        if (res.success) {
          console.log("Fetched user data:", res.data);
          newComment.user = res.data; // Attach user data
        } else {
          console.error("Failed to fetch user data:", res.msg);
          newComment.user = {}; // Default to empty user
        }

        setPost((prevPost) => {
          console.log("Previous post state:", prevPost);
          const updatedPost = {
            ...prevPost,
            comments: [newComment, ...(prevPost.comments || [])],
          };
          console.log("Updated post state:", updatedPost);
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
      console.log("Fetched post data:", res.data); // Ensure data is correct here
      setPost(res.data);
    } else {
      console.error("Error fetching post details:", res.msg);
    }
    setStartLoading(false);
  };

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    setLoading(true);
    let res = await createPostComment(data);
    setLoading(false);
    if (res.success) {
      if (user.id != post.userId) {
        let notify = {
          senderId: user.id,
          receiverId: post.userId,
          title: "Commented on your post",
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

  const onDeleteComment = async (comment) => {
    let res = await removeComment(comment?.id);
    console.log("Comment res:", res);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id != comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("Comment", res.msg);
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
  // const onEditPost = async (item) => {
  //   router.back();
  //   router.push({pathname:'pages/screens/postScreen',params:{...item}});
    
  // };

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

  return (
    <View className="flex-1 bg-accent-100">
      <View className=" flex flex-row items-center top-safe-offset-1">
        <BackButton router={router} />
        <Text className="font-rubik-semibold">Go Back</Text>
      </View>
      <View className="top-safe-offset-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "transparent",
          }}
        >
          {post ? (
            <View className="flex-1 items-center justify-center ">
              <PostCard
                item={{
                  ...post,
                  comments: [{ count: post?.comments?.length }],
                }}
                currentUser={user}
                router={router}
                hasShadow={false}
                showMoreIcon={false}
                showDelete={false}
                onDelete={onDeletePost}
                onEdit={onEditPost}
                style={{
                  left: 0,
                  right: 0,
                }}
              />

              <View className="flex-1 flex-row p-10">
                {loading ? (
                  <View className="bg-primary-50 rounded-full items-center justify-center flex-1 py-3">
                    <Loading />
                  </View>
                ) : (
                  <View className="flex-1 flex-row gap-5 items-center justify-center">
                    <View className="w-5/6">
                    <Input
                      inputRef={inputRef}
                      onChangeText={(value) => (commentRef.current = value)}
                      placeholder="Type a comment..."
                      placeHolderTextColor="#F2F2F2"
                      
                    />
                    </View>
                    <View className="flex-1">
                    <TouchableOpacity
                      onPress={onNewComment}
                      className="bg-white rounded-2xl border-2 items-center justify-center p-4"
                      style={{borderColor:'#4B2C7F'}}
                    >
                      <Icon name="send" size={24} color="green" />
                    </TouchableOpacity>
                      </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center bg-primary-50">
              <Loading />
            </View>
          )}

          {/* comment list */}
          <View className="flex-1 items-center mb-safe-offset-40">
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
              <Text className=" text-primary-500 font-rubik-semibold text-1xl">
                Be the first one to comment!
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Details;
