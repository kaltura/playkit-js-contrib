const path = require("path");
var nodeExternals = require('webpack-node-externals');

const libraryName = 'plugin';

module.exports = (env, options) => {
  return {
    entry: {
      [`playkit-ovp-${libraryName}`]: './src/index.ts'
    },
    externals: [nodeExternals(
      {
        importType: 'umd'
      }
    )],
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: [path.resolve(__dirname, "node_modules")],
      symlinks: false
    },
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'index.js',
      library: ['playkit', 'ovp', libraryName],
      libraryTarget: 'umd',
      umdNamedDefine: true
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
