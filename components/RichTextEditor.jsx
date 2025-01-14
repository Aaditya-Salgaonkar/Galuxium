import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Text } from "react-native";

const RichTextEditor = ({ editorRef, onChange }) => {
  const [editorContent, setEditorContent] = useState("");
  
  // Update the content whenever editor content changes
  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
    if (onChange) {
      onChange(newContent);  // Pass content to parent via onChange handler
    }
  };

  useEffect(() => {
    if (editorRef && editorRef.current) {
      // Set initial editor content if required
      editorRef.current.setContent(editorContent);
    }
  }, [editorContent, editorRef]);

  return (
    <View className="p-2 mt-10">
      <TextInput
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
      />
    </View>
  );
};

export default RichTextEditor;
