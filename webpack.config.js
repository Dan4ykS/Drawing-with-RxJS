const path = require('path');
const htmlWebpackPlagin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env = {}) => {
  const isProd = env.mode === 'production';

  const getStyleLoaders = () => {
    return [isProd ? miniCssExtractPlugin.loader : 'style-loader', 'css-loader'];
  };

  const optimization = () => {
    const config = {
      splitChunks: {
        chunks: 'all',
      },
    };
    if (isProd) {
      config.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()];
    }
    return config;
  };

  const getPlugins = () => {
    const plugins = [
      new htmlWebpackPlagin({
        template: path.join(__dirname, 'src/index.html'),
        favicon: path.join(__dirname, 'src/assets/favicon.png'),
        minify: {
          removeComments: isProd,
          collapseWhitespace: isProd,
        },
      }),
      new CleanWebpackPlugin(),
    ];
    if (isProd) {
      plugins.push(
        new miniCssExtractPlugin({
          filename: 'css/style-[hash:5].min.css',
        })
      );
    }
    return plugins;
  };

  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      main: path.join(__dirname, 'src/index.ts'),
    },
    output: {
      filename: 'js/bundle-[hash:5].min.js',
      path: path.join(__dirname, 'build'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
    },
    module: {
      rules: [
        // Загрузка js
        {
          test: /\.(js|ts|tsx|jsx)$/,
          exclude: /node_modules/,
          use: [{ loader: 'babel-loader' }],
        },
        // Загрузка изображений
        {
          test: /\.(png|jpeg|gif|ico|jpg|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'img',
                name: 'name-[hash:5].[ext]',
              },
            },
          ],
        },
        // Загрузка css
        {
          test: /\.(css)$/,
          use: getStyleLoaders(),
        },
        // Загрузка sass/scss
        {
          test: /\.(sass|scss)$/,
          use: [...getStyleLoaders(), 'sass-loader'],
        },
      ],
    },
    plugins: getPlugins(),
    optimization: optimization(),
    devtool: isProd ? '' : 'source-map',
    devServer: {
      open: true,
      port: 1337,
    },
  };
};
