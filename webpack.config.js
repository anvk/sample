const config = require('./package.json');
const vendorPackages = Object.keys(config.dependencies);

const path = require('path');
const webpack = require('webpack');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production' || nodeEnv === 'staging';

const sourcePath = path.join(__dirname, './src/scripts');
const stylesPath = path.join(__dirname, './src/styles');
const staticsPath = path.join(__dirname, './dist/scripts');
const distPath = path.join(__dirname, './dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: 'vendor.bundle.js'
  }),
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: './templates/index.html',
    inject: true,
    alwaysWriteToDisk: true,
  }),
  new HtmlWebpackHarddiskPlugin({
    outputPath: distPath
  }),
];

module.exports = {
  devtool: isProd ? 'nosources-source-map' : 'cheap-module-eval-source-map',
  context: sourcePath,
  entry: {
    app: './app.js',
    vendor: vendorPackages
  },
  output: {
    path: staticsPath,
    filename: '[name].bundle.js',
    publicPath: 'scripts/'
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'react-hot',
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!autoprefixer-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      sourcePath,
      stylesPath,
      'node_modules'
    ],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
    alias: {
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    port: 8080,
    compress: isProd,
    inline: !isProd,
    hot: !isProd,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    },
  }
};
