import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import { wp, hp } from "@/helpers/common";
import { Alert } from "react-native";

const CommentItem = ({
  item,
  canDelete = false,
  onDelete = () => {},
  highlight = false,
}) => {
  const createdAt = moment(item?.created_at).format("DD MMM YY");
  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        onPress: () => onDelete(item),
        text: "Delete",
      },
    ]);
  };

  const shadowStyle = {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  };
  return (
    <View>
      {highlight ? (
        <View
          className="bg-white p-5 rounded-3xl items-center m-2"
          style={shadowStyle}
        >
          <View style={{ width: wp(85) }} className="flex-row gap-5">
            <Avatar uri={item?.user?.image} />
            <View>
              <View className="flex flex-row justify-between">
                <View className="flex-row">
                  <Text className="text-1xl font-rubik-bold">
                    {item?.user?.name}
                  </Text>
                  <Text className="text-1xl font-rubik-extrabold"> • </Text>
                  <Text className="text-1xl font-rubik-medium">
                    {createdAt}
                  </Text>
                </View>
                <View>
                  {canDelete && (
                    <TouchableOpacity onPress={handleDelete} className="ml-5">
                      <Icon name="delete" color="red" size={20} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <View className="pr-14 mt-2">
                <Text className="text-1xl font-rubik-medium">{item?.text}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          className="bg-primary-50 p-5 rounded-3xl flex-row gap-5 items-center m-2"
          style={{ width: wp(90) }}
        >
          <Avatar uri={item?.user?.image} />
          <View>
            <View className="flex flex-row justify-between">
              <View className="flex-row">
                <Text className="text-1xl font-rubik-bold">
                  {item?.user?.name}
                </Text>
                <Text className="text-1xl font-rubik-extrabold"> • </Text>
                <Text className="text-1xl font-rubik-medium">{createdAt}</Text>
              </View>
              <View>
                {canDelete && (
                  <TouchableOpacity onPress={handleDelete} className="ml-5">
                    <Icon name="delete" color="red" size={20} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View className="pr-14 mt-2">
              <Text className="text-1xl font-rubik-medium">{item?.text}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "white",
    borderColor: "black",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});
