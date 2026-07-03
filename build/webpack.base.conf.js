'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
<<<<<<< HEAD
const vueLoaderConfig = require('./vue-loader.conf')
=======
>>>>>>> origin/master
const { VueLoaderPlugin } = require('vue-loader')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

<<<<<<< HEAD
=======
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  // eslint-loader 4.x only supports eslint ^6||^7; replace with eslint-webpack-plugin if linting is re-enabled
  loader: 'eslint-webpack-plugin',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

>>>>>>> origin/master
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    },
    fallback: {
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
<<<<<<< HEAD
        use: [
          {
            loader: 'vue-loader',
            options: vueLoaderConfig
          },
          {
            loader: 'iview-loader',
            options: {
              prefix: false
            }
=======
        loader: 'vue-loader',
        options: {
          loaders: utils.cssLoaders({
            sourceMap: process.env.NODE_ENV !== 'production'
              ? config.dev.cssSourceMap
              : config.build.productionSourceMap,
            extract: process.env.NODE_ENV === 'production'
          }),
          cssSourceMap: process.env.NODE_ENV !== 'production'
            ? config.dev.cssSourceMap
            : config.build.productionSourceMap,
          cacheBusting: config.dev.cacheBusting,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
>>>>>>> origin/master
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
