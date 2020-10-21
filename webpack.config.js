const path = require('path');
const babelPolyfill = require('@babel/polyfill');
const HtmlWebpackPlugin = require('html-webpack-plugin');       //to include html-webpack-plugin after install 

module.exports = {
    entry: ['@babel/polyfill', './src/js/index.js'],           //it is where webpack will start the bunding a dot ./ is a current folder
    output: {                                              //it is specify where to save our bundle file. Then we pass an object and in this object we put the path tothe folder and then the file name
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },

    //WEBPACK-DEV-SERVER CONFING
    devServer: {
        contentBase: './dist'                       //specify the folder from which webpack should server our file
    },

    //PLUGIN SYNTAX
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'               //template is our starting index.html from the src folder (for development)
        }),       
    ],

    //BABEL LOADER SYNTAX
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_module/,                
                use: {                    
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },   
};











/*
Development mode:
simple builds our bundle without minifying our code in order to be as fast as possible

Production mode:
this mode automatically enable all kind of optimization, like minification and tree shaking in
order to reduce the final bundle size. (this compress or cut our code)

//mode: 'development'   //it could be "production" or "development" mode.

NOTE: THE "webpack.config.js" FILE HAS TO BE AT THE SAME LEVEL OF THE "dist" folder toget the
bundle.js in this path  ===>  path: path.resolve(__dirname, 'dist/js'),

dist folder is where we have the code we going to ship to the client
src folder is for development purposes where our source code is which then will be compiled or
bundle into our distribution folder (dist) in the bundle.js

Plug-ins: allows to do complex processing of our input files, and in this case of our 
index.html file. So we want to use plug-in called html webpack plug-in  
*/

