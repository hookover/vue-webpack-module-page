var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

var glob = require('glob');
var entries = utils.getMultiEntry('./src/module/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

var publicPath = false

if(process.env.NODE_ENV === 'web') {
    publicPath = config.web.assetsPublicPath
}
if(process.env.NODE_ENV === 'production') {
    publicPath = config.build.assetsPublicPath
}
if(!publicPath) {
    publicPath = config.dev.assetsPublicPath
}

module.exports = {
    entry: entries,
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: publicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
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
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
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
        /*
         // 提取公共模块
         new webpack.optimize.CommonsChunkPlugin({
         name: 'vendors', // 公共模块的名称
         chunks: chunks,  // chunks是需要提取的模块
         minChunks: 4 || chunks.length //公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
         }),*/
    ]
}
