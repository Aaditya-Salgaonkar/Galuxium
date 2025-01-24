const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

// Set up alias for '@'
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(__dirname),  // Adjust if you want to map to a subfolder like 'src'
  },
};

module.exports = withNativeWind(config, { input: "./app/styles/globals.css" });
