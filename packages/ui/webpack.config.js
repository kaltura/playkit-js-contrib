const path = require("path");
var nodeExternals = require('webpack-node-externals');

const distFolder = path.join(__dirname, "/dist");

module.exports = (env, options) => {
  return {
    entry: './src/index.ts',
    externals: [nodeExternals(
      {
        importType: 'umd'
      }
    )],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      symlinks: false
    },
    output: {
      filename: 'index.js',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'lib')
    },
    devtool: options.mode === "development" ? "eval-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
  };
};
