const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge')

require('babel-polyfill');

const TARGET = process.env.npm_lifecycle_event;
const production = (TARGET === 'build');

const PATHS = {
  app: path.join(__dirname, '../src'),
  build: production ? path.resolve('../server/build') : '/',
  publicPath: production ? '/build/' : '/',
};

process.env.BABEL_ENV = production ? 'build' : TARGET;

// plugins used in webpack config.
const plugins = [
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: () => [
        autoprefixer({ browsers: ['Chrome >= 27'] }),
      ],
    }}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: `templates/index.${production ? 'prod' : 'dev'}.html`,
      chunks: ['app'],
      inject: false,
    }),
    new MiniCssExtractPlugin({ filename: 'bundle.css', allChunks: true }),  // For putting all extracted css together,
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: production ? '"production"' : '"development"' ,
        },
        __DEVELOPMENT__: production ? false : true,
    }),
];

const common = {
    entry: {
      app: [
        "babel-polyfill",
        'react-hot-loader/patch',
          path.resolve(__dirname, './src/index.js'),
      ],
    },
    devServer: {
      historyApiFallback: true,
      port: 8081
    },
    output: {
        path: PATHS.build,
        publicPath: PATHS.publicPath,
        filename: 'app.js',
    },
    module: {
        rules: [
          {
            use: 'babel-loader',
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            !production ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }
      ],
    },
    plugins
};

if (TARGET === 'start' || !TARGET) {
  module.exports = common;
}

if (TARGET === 'build' || !TARGET) {
  module.exports = merge({
      devtool: 'source-map',
      plugins: [
          new UglifyJsPlugin({
            uglifyOptions: {
                output: {
                    comments: false
                },
                minify: {},
                compress: {
                    booleans: true,
                    //...
                }
            }
          }),
      ],
  }, common);
}
