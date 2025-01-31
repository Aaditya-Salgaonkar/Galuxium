import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Text } from "react-native";
import { actions, RichToolbar,RichEditor } from "react-native-pell-rich-editor";
import {hp,wp} from '@/helpers/common'
const RichTextEditor = ({ editorRef, onChange }) => {

  return (
    <View className="p-5 mt-10 bg-white border-2 border-primary-500 rounded-3xl h-80">
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.heading1,
          actions.heading4
        ]}
        iconMap={{
          [actions.heading1]:({tintColor})=><Text>H1</Text>,
          [actions.heading4]:({tintColor})=><Text>H4</Text>
        }}
        editor={editorRef}
        selectedIconTint={'purple'}
        disabled={false}
      />

      <View className="pt-5">
        <RichEditor
      ref={editorRef}
      placeholder={"What's on your mind?"}
      onChange={onChange}
      style={{height:hp(50)}}
      />
      </View>
      {/* <TextInput
        multiline
        value={editorContent}
        onChangeText={handleContentChange}
        placeholder="Start typing..."
        style={{
          borderWidth: 2,
          padding: 10,
          borderRadius: 10,
          height: 100,
          textAlignVertical: "top",
          borderColor:'#3E3E3E'
        }}
      /> */}
    </View>
  );
};

export default RichTextEditor;
