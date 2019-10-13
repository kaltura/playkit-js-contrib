const path = require("path");
var nodeExternals = require('webpack-node-externals');

const libraryName = 'linkify';

module.exports = (env, options) => {
  return {
    entry: {
      [`playkit-js-contrib-${libraryName}`]: './src/index.ts'
    },
    externals: [function(context, request, callback) {
      if (request.indexOf('@playkit-js') === 0 || request.indexOf('preact') === 0) {
        return callback(null, 'umd ' + request);
      }

      callback();
    }],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".svg"],
      modules: [path.resolve(__dirname, "../../node_modules"), path.resolve(__dirname, "node_modules")],
      symlinks: false
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'index.js',
      library: ['playkit', 'contrib', libraryName],
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    devtool: options.mode === "development" ? "eval-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.build.json"
          },
          exclude: /node_modules/
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                modules: true,
                localIdentName: 'contrib[name]__[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader',
            options: {}
          }
        }
      ]
    },
  };
};