const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

const libraryName = 'ui';
const { createExternals } = require('../../utils/webpack-utils');

module.exports = (env, options) => {
  return {
    entry: {
      [`playkit-js-contrib-${libraryName}`]: './src/index.ts',
    },
    externals: createExternals(),
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
                modules: {
                  localIdentName: 'contrib[name]__[local]___[hash:base64:5]'
                },

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
    plugins: [
      new CopyPlugin([
        {
          from: './src/assets/normalize.scss',
          to: path.resolve(__dirname, 'lib')
        },
      ]),
    ],
  };
};
