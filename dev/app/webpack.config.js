const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/assets", to: "assets"},
      { from: "./src/vendor", to: "vendor"},
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/addProduct.html", to: "addProduct.html" },
      { from: "./src/buy.html", to: "buy.html" },
      { from: "./src/sell.html", to: "sell.html" },
      { from: "./src/product-detail.html", to: "product-detail.html"}
  ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true, port: 8081},
};
