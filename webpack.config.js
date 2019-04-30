const path = require("path");
var PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
var {IgnorePlugin} = require('webpack');
var webpackMerge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');

const distFolder = path.join(__dirname, "/dist");

module.exports = (env, options) => {
  return {
    entry: {
      pluginV7: "./src/pluginV7/index.ts",
      pluginV2: "./src/pluginV2/index.ts",
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      symlinks: false
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
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
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]shared[\\/]/,
            name: 'shared',
            chunks: 'all'
          }
        }
      }
    }
  };
};
