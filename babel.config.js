module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],

      //make sure its the last one in the list
      plugins:['react-native-reanimated/plugin']
    };
  };