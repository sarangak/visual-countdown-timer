const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./index.html",
  filename: "./index.html", // Default root is the "dist" directory
  inlineSource: ".(js|css)$",
});
const htmlWebpackInlineSourcePlugin = new HtmlWebpackInlineSourcePlugin(
  HtmlWebPackPlugin
);
const cleanWebpackPlugin = new CleanWebpackPlugin({
  protectWebpackAssets: false,
  cleanAfterEveryBuildPatterns: ["*.js"],
});

module.exports = {
  entry: "./script.js",
  plugins: [
    htmlWebpackPlugin,
    htmlWebpackInlineSourcePlugin,
    cleanWebpackPlugin,
  ],
};
