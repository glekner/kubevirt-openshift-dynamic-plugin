/* eslint-env node */

import * as webpack from 'webpack';
import * as path from 'path';
import { ConsoleRemotePlugin } from '@openshift-console/dynamic-plugin-sdk/lib/webpack/ConsoleRemotePlugin';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config: webpack.Configuration = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
    chunkFilename: '[name]-chunk.js',
  },
  watchOptions: {
    ignored: ['node_modules', 'dist'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9001,
    writeToDisk: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: ['node_modules', path.resolve(__dirname, 'console/frontend/node_modules')],
    alias: {
      stream: 'stream-browserify',
      http: 'stream-http',
      path: 'path-browserify',
      os: 'os-browserify/browser',
      crypto: 'crypto-browserify',
      timers: 'timers-browserify',
      tty: 'tty-browserify',
      vm: 'vm-browserify',
      net: 'net-browserify',
      fs: 'browserify-fs',
      prettier: false,
      '@console/active-plugins': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'console/frontend/tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /node_modules[\\\\|/](yaml-language-server)/,
        loader: 'umd-compat-loader',
      },
      {
        test: /node_modules[\\\\|/](vscode-json-languageservice)/,
        loader: 'umd-compat-loader',
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules\/(?!(@patternfly)\/)/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'console/frontend/node_modules/monaco-editor'),
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new ConsoleRemotePlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(__dirname, 'console/frontend/tsconfig.json'),
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
  ],
  devtool: 'source-map',
  optimization: {
    chunkIds: 'named',
    minimize: false,
  },
  externals: {
    '@openshift-console/dynamic-plugin-sdk/api': 'api',
  },
};

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  config.output.filename = '[name]-bundle-[hash].min.js';
  config.output.chunkFilename = '[name]-chunk-[chunkhash].min.js';
  config.optimization.chunkIds = 'deterministic';
  config.optimization.minimize = true;
}

export default config;
