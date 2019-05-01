const path = require("path");
var PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
var {IgnorePlugin} = require('webpack');
var webpackMerge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');

const distFolder = path.join(__dirname, "/dist");

module.exports = (env, options) => {
  return {
    entry: {
      'plugin-v7': "./src/plugin-v7/index.ts",
      'plugin-v2': "./src/plugin-v2/index.ts",
    },
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
      filename: '[name].js',
      libraryTarget: 'umd',
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
            test: function(module, name) {
              return /src\/shared$/.test(module.context);
            },
            name: 'shared',
            chunks: 'all'
          }
        }
      }
    }
  };
};
