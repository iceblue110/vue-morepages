'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

var fs=require('fs')
const https = require('https');
var pagesConfig = require('../pagesConfig.json')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

var entry = utils.getMultiEntry('./src/pages/**/index.js');

const devWebpackConfig = merge(baseWebpackConfig, {
  entry,
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    /* DevTools 的控制台(console)将显示消息 */
    clientLogLevel: 'warning',
    /* 任意的 404 响应可以提供为 index.html 页面 */
    historyApiFallback: {
      rewrites: [
        // { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'indexa/index.html') },
        // { from:  /^\/advert\/.*$/, to:function(context){
        { from:  /.*/, to:function(context){
          
          var pathname=context.parsedUrl.pathname.split('/');
          console.log(pagesConfig.projects,pathname[1])
          if(pagesConfig.projects.indexOf(pathname[1])>=0){
            return  path.posix.join(config.dev.assetsPublicPath, pathname[1]+'/index.html')
          }
          else{
            return  path.posix.join(config.dev.assetsPublicPath, 'indexa/index.html')
          }
          
        }},
        // { from:  /^\/indexa\/.*$/, to:function(context){
        //   console.log(context)
         
        //   return  path.posix.join(config.dev.assetsPublicPath, 'indexa/index.html')
        // }},
     
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true, //gzip是否启用
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    https: true,
    // {
    //   key: fs.readFileSync(path.join(__dirname,'../pem/privatekey.pem'), 'utf8'),
    //   cert:fs.readFileSync(path.join(__dirname,'../pem/ver.crt'), 'utf8'),
    //   // ca: fs.readFileSync("pem/csr.pem"),
    // },
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
var pages =  utils.getMultiEntry('./src/pages/**/index.js');
var chunks = Object.keys(pages);


// var tmp = pages.split('/').splice(-4)[4];
// console.log(tmp)c
console.log("webpack.dev.conf.js=================")
// console.log(pages);
for (var pathname in pages) {
  // console.log(pages[pathname])
  var name=pages[pathname].split('/')
  // console.log(name[3])
  // 配置生成的html文件，定义路径等
  var conf = {
    filename:pathname+'.html',
    // template: pages[pathname], // 模板路径
    // chunks: [chunks],
    template:'index.html',
    chunks: [pathname, 'vendors', 'manifest'], // 每个html引用的js模块
    // inject: true              // js插入位置
  };
  // console.log(conf)
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}



// const options = {
//   key: fs.readFileSync(path.join(__dirname,'../pem/privatekey.pem'), 'utf8'),
//   cert: fs.readFileSync(path.join(__dirname,'../pem/ver.crt'), 'utf8')
// };

// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }).listen(8000);

module.exports = new Promise((resolve, reject) => {
  console.log(process.env.PORT,config.dev.port)
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    // console.log(port)
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // process.env.PORT = port
      // add port to devServer config
      // devWebpackConfig.devServer.port = port
    
    //   devWebpackConfig.devServer.listen(443, 'console-greencat.qschou.com', function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log('Listening at https://console-greencat.qschou.com');
    // });
      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: https://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
