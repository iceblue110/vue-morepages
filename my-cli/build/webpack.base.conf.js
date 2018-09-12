'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
var fs = require('fs')
// = JSON.parse(fs.readFileSync('./pagesConfig.json', 'utf8')).project;
var project 


var TARGET = JSON.parse(process.env.npm_config_argv).remain.toString();
if(TARGET){
  // console.log(TARGET)
  project=TARGET
}
else{
  project=JSON.parse(fs.readFileSync('./pagesConfig.json', 'utf8')).project;
}
// console.log(process.env)
// console.log(TARGET,TARGET.toString(),project)


function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var entries = utils.getMultiEntry('./src/pages/**/index.js');
console.log(entries);
// entries.forEach(item => {
//   console.log(item)
//   // var tem=item.split('/')
//   // // console.log(tem[1])
//   // chunksPro.push(tem[1])
// });

// var chunks = Object.keys(entries);
// var chunksPro=[]
// // console.log(chunks)
// chunks.forEach(item => {
//   var tem=item.split('/')
//   // console.log(tem[1])
//   chunksPro.push(tem[1])
// });
// console.log(chunksPro)
var chunks = Object.keys(entries);
// console.log(chunks)
module.exports = {
  context: path.resolve(__dirname, '../'),
  // entry: {
  //   app: './src/main.js'
  // },
  // entry: path.join(__dirname, '../src/pages/'+project+'/main.js'),
  entry:entries,
  output: {
    path: config.build.assetsRoot,
    
    // path: path.join(__dirname, 'dist/'+entries+'/'),
    filename: '[name].[hash].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
     
      {
        test: /\.less$/,
        use: [
                'vue-style-loader'
             ]
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
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
