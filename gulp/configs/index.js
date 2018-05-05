const Dotenv = require('dotenv-webpack');

var taskName = "index";
var fileName = taskName + ".js"

var dest = "./build"; // 出力先ディレクトリ
var src = "./src";  // ソースディレクトリ

var webpack = require("webpack");

module.exports = {

    // タスク名
    taskName : taskName,

    // リソース
    src : src + "/**/*.js",

    // jsのビルド設定
    js: {
        dest: dest,
        uglify: false
    },

    // webpackの設定
    webpack: {
        entry: ['babel-polyfill', src + "/" + fileName],
        output: {
            filename: fileName
        },
        resolve: {
            extensions: ["", ".js"],
            modulesDirectories: ["node_modules", "bower_components"],
            alias: {
            }
        },
        plugins: [
            new webpack.optimize.AggressiveMergingPlugin(),
            new Dotenv({
                path: './../../.env', // Path to .env file (this is the default)
                safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
            }),
        ],
        module: {
            // babel Loaderを指定してWebpackがBabelのコンパイルをできるように
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'es2016', 'es2017'],
                        cacheDirectory: true,
                    }
                }
            ]
        }
    }
}
