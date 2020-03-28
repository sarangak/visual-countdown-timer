const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
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
  mode: "production",
  entry: "./src/script.js",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    htmlWebpackPlugin,
    htmlWebpackInlineSourcePlugin,
    cleanWebpackPlugin,
  ],
};
