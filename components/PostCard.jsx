import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { hp, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "../services/imageService";
import { Image } from "expo-image";
import { Video } from "expo-av";
const textStyle = {
  color: "#494949",
  fontSize: hp(5),
  fontFamily: 'rubik-bold'
};

const tagsStyle = {
  div: textStyle,
  p: {
    ...textStyle,
    fontWeight: 'bold', 
  },
  ol: {
    ...textStyle,
    fontWeight: 'bold',
  },
  ul: {
    ...textStyle,
    fontWeight: 'bold', 
  },
  li: {
    ...textStyle,
    fontWeight: 'bold', 
  },
  h1: {
    color: "#494949",
    fontSize: hp(7), 
    fontWeight: 'bold',
  },
  h2: {
    color: "#494949",
    fontSize: hp(6), 
    fontWeight: 'bold', 
  },
  h3: {
    color: "#494949",
    fontSize: hp(5.5), 
    fontWeight: 'bold',
  },
  h4: {
    color: "#494949",
    fontSize: hp(5), 
    fontWeight: 'bold', 
  },
  h5: {
    color: "#494949",
    fontSize: hp(5), 
    fontWeight: 'bold', 
  },
  h6: {
    color: "#494949",
    fontSize: hp(5), 
    fontWeight: 'bold', 
  },
  blockquote: {
    fontStyle: 'italic', 
    color: "#494949",
    fontWeight: 'bold', 
  },
  strong: {
    fontWeight: 'bold', 
  },
  em: {
    fontStyle: 'italic', 
    fontWeight: 'bold', 
  },
};

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 7,
  };

  const openPostDetails = async () => {};

  //formatting date and time for better look
  const createdAt = moment(item?.created_at).format("DD MMM YYYY   |   HH:MM");
  const likes =[];
  const liked =false;
  return (
    <View className="flex-1 items-center p-5">
      {/* Post Card Content */}
      <View
        className="bg-secondary-100 border-2 border-primary-500 rounded-3xl"
        style={{
          width: wp(90),
          height: 'fit',
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
          <TouchableOpacity
            className="flex-1 items-end"
            onPress={openPostDetails}
          >
            <Icon name="threeDotsCircle" size={24} />
          </TouchableOpacity>
        </View>

        {/* Post body & media*/}
        <View>
          <View className="px-5 mb-5">
            <Text className="font-rubik-regular">
            {item?.body}
            </Text>

            {/* && (
              <RenderHtml
                contentWidth={wp(100)}
                source={{ html: item?.body }}
                tagsStyles={tagsStyle}
              />
            ) */}
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
            source={ getSupabaseFileUrl(item?.file) }
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
          <TouchableOpacity>
          <Icon name="heart" size={24} fill={liked?'#F75555':'transparent'} color={liked?'#F75555':'#3E3E3E'} />
          </TouchableOpacity>
          <Text>
            {
              likes?.length
            }
          </Text>
          
        </View>
        <View className="flex flex-row gap-2 items-center">
          <TouchableOpacity>
          <Icon name="comment" size={24} color={'#3E3E3E'} />
          </TouchableOpacity>
          <Text>
            {
              0
            }
          </Text>
          
        </View>
        <View className="flex flex-row gap-2">
          <TouchableOpacity>
          <Icon name="share" size={24} color={'#3E3E3E'} />
          </TouchableOpacity>
          
        </View>
      </View>
      </View>

      
    </View>
  );
};

export default PostCard;
