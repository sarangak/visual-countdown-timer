var HtmlWebpackPlugin = require("html-webpack-plugin");
var InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");

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
      {
        test: /\.wav$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html", // Default root is the "dist" directory
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.(js|css)$/]),
  ],
};
