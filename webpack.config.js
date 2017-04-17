/**
 * Created by lei on 2017/3/5.
 */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = (env) => {
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.isDev ? 'development' : 'production'),
      },
    }),
    new ExtractTextPlugin({
      filename: env.isDev ? 'style.css?[hash]' : 'style-[hash].css',
      disable: false,
      allChunks: true,
    }),
    new AssetsPlugin({
      prettyPrint: true,
    }),
  ];

  if (!env.isDev) {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
    ]);
  }

  if (env.isDev) {
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
    ]);
  }

  return {
    entry: './assets/index.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      publicPath: env.isDev ? 'http://192.168.1.103:7879/' : '/',
      filename: env.isDev ? 'bundle.js?[hash]' : 'bundle-[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              'less-loader',
            ],
          }),
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10240, // 10k
            name: '[name]-[hash:8].[ext]',
          },
        },
        {
          test: /\.(eot|ttf|wav|mp3)$/,
          loader: 'file-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
          },
        },
      ],
    },

    plugins,

    devServer: {
      port: 7879,
      host: '0.0.0.0',
    },
  };
};
