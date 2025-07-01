const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;
// config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];


module.exports = withNativeWind(config, { input: "./global.css" });