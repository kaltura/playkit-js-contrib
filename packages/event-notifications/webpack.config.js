const path = require("path");
var PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');
var {IgnorePlugin} = require('webpack');
var webpackMerge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');

const distFolder = path.join(__dirname, "/dist");

module.exports = (env, options) => {
  return {
    entry: './src/index.ts',
    externals: [
        function(context, request, callback) {
          if (request.indexOf('@playkit-js') === 0) {
            return callback(null, 'umd ' + request);
          }

          callback();
        }
    ],
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
