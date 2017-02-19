
const ENV = process.env.WEBPACK_ENV || 'dev';

console.log("\r\n\r\n ============================\r\n\r\n");
console.log(" Environment: " + ENV);
console.log("\r\n\r\n ============================\r\n\r\n");

const path = require("path");
const webpack = require("webpack");

const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const htmlLoader = require('html-loader');

const plugins =  []
    
    
if ( ENV === 'build' || ENV === 'prod' ) {

    plugins.push(

        new ProgressBarPlugin({
            format: '🐢  build [:bar] [:percent] [:elapsed seconds] :msg',
            clear: false, 
        }),

        new webpack.optimize.UglifyJsPlugin({

            // exclude: /\.release\.css/i,

            beautify: false,
            comments: false,
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                unused: true,
                warnings: false,
                drop_console: false,
                unsafe: true
            }
        }),

        new ExtractTextPlugin('bundles/[name]/[name].css?[hash]', {
            allChunks: false,
        })

    );

}

if ( ENV === 'prod' || ENV === 'dev' ) {

    plugins.push(

        new WebpackErrorNotificationPlugin()

    )

}

if ( ENV === 'dev' ) {


}


var config = {

        devtool: ( ENV === 'dev' ) ? 'source-map' : 'cheap-module-source-map',
        entry: {
            'statics': "./frontend/app.statics.js",
            'app': "./frontend/app.config.js",
        },

        output:  {
            path: '../htdocs/',
            publicPath:  ( ENV === 'dev') ? "http://localhost:8888/" : "/" ,
            filename:
                ( ENV === 'build' || ENV === 'prod' )
                ? "bundles/[name]/[name].min.js?[hash]"
                : "bundles/[name]/[name].js?[hash]",

            chunkFilename:
                ( ENV === 'build' || ENV === 'prod' )
                ? "chunks/[name]/[name].min.js?[hash]"
                : "chunks/[name]/[name].js?[hash]",
        },

        plugins: plugins.concat(

            [

                new webpack.optimize.CommonsChunkPlugin({
                    name: 'core',
                    chunks: ["statics", "app"]
                }),

                new HtmlWebpackPlugin({
                    inject: 'head',
                    template: './frontend/index.html',
                    filename: './index.html',
                }),


            ]

        ),

        module: {


            loaders: [

                {
            test: /\.js$/,
            exclude: [
                path.resolve(__dirname, './node_modules/'),
            ],
            loader:  'babel-loader',
            query: {
                presets: ['es2015']
              }
          },

                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                
                {
                    test: /\.pug$/,
                    loader:
                        ( ENV === 'build' || ENV === 'prod' )
                        ? 'pug-loader'
                        : 'pug-loader?pretty',
                },


                {
            test:   /\.scss$/,
            loader:
                        ( ENV === 'build' || ENV === 'prod' )
                        ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&-autoprefixer!postcss-loader!sass-loader?indentedSyntax=sass')
                : 'style-loader!css-loader?sourceMap!postcss-loader!sass-loader?indentedSyntax=sass',
        },
                {
                    test: /\.css$/,
                    loader:
                        ( ENV === 'build' || ENV === 'prod' )
                        ? ExtractTextPlugin.extract('style-loader', 'css-loader?minimize&-autoprefixer!postcss-loader')
                        : 'style-loader!css-loader?sourceMap!postcss-loader'
                },

                {
                    test: /\.(jpe?g|png|gif|ico|cur)$/i,
                    exclude: [
                        path.resolve(__dirname, './node_modules/'),
                    ],
                    
                    loaders: 
                        ( ENV === 'build' || ENV === 'prod' )
                        ?   
                            [                               
                                'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
                                'file-loader?hash=sha512context=images&name=[path][name].[ext]?[hash]'
                            ]
                        :
                            [
                                'file-loader?hash=sha512&name=[path][name].[ext]?[hash]'
                            ]
                    
                },

                
                {
                    test: /\.(otf|ttf|eot|woff|woff2|svg)$/,
                    exclude: [
                        path.resolve(__dirname, './node_modules/'),
                    ],
                    loader: 'file-loader?hash=sha512?name=[path][name].[ext]?[hash]',
                },

            ],

        },

      htmlLoader: {
                    root: path.resolve(__dirname, 'sources'),
                    attrs: ['img:src', 'link:href']
              },
        postcss: function () {
            
            return [
                autoprefixer({
                    browsers: [
                        'last 3 version',
                    ]
                }),
            ];

        },


        resolve: {

            alias: {

                node_modules: path.resolve(__dirname, './node_modules'),
               

            }

        },


        devServer: {

            port: 8888,
        },



}


module.exports = config;