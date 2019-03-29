var webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: {
        Editor: './src/Editor.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        path: path.resolve('static'),
        filename: '[name].bundle.js'
    }
};
